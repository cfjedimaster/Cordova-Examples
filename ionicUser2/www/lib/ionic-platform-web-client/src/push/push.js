import { App } from "../core/app";
import { Settings } from "../core/settings";
import { IonicPlatform } from "../core/core";
import { Logger } from "../core/logger";
import { EventEmitter } from "../core/events";
import { APIRequest } from "../core/request";
import { DeferredPromise } from "../core/promise";
import { User } from "../core/user";

import { PushToken } from "./push-token";
import { PushMessage } from "./push-message";
import { PushDevService } from "./push-dev";

var settings = new Settings();

var DEFER_INIT = "DEFER_INIT";

var pushAPIBase = settings.getURL('platform-api') + '/push';
var pushAPIEndpoints = {
  'saveToken': function() {
    return pushAPIBase + '/tokens';
  },
  'invalidateToken': function() {
    return pushAPIBase + '/tokens/invalidate';
  }
};

/**
 * Push Service
 *
 * This is the main entrypoint for interacting with the Ionic Push service.
 * Example Usage:
 *
 *   Ionic.io(); // kick off the io platform
 *   var push = new Ionic.Push({
 *     "debug": true,
 *     "onNotification": function(notification) {
 *       var payload = $ionicPush.getPayload(notification);
 *       console.log(notification, payload);
 *     },
 *     "onRegister": function(data) {
 *       console.log(data);
 *     }
 *   });
 *
 *   // Registers for a device token using the options passed to init()
 *   push.register(callback);
 *
 *   // Unregister the current registered token
 *   push.unregister();
 *
 */
export class Push {

  constructor(config) {
    this.logger = new Logger({
      'prefix': 'Ionic Push:'
    });

    var IonicApp = new App(settings.get('app_id'), settings.get('api_key'));
    IonicApp.devPush = settings.get('dev_push');
    IonicApp.gcmKey = settings.get('gcm_key');

    // Check for the required values to use this service
    if (!IonicApp.id || !IonicApp.apiKey) {
      this.logger.error('no app_id or api_key found. (http://docs.ionic.io/docs/io-install)');
      return false;
    } else if (IonicPlatform.isAndroidDevice() && !IonicApp.devPush && !IonicApp.gcmKey) {
      this.logger.error('GCM project number not found (http://docs.ionic.io/docs/push-android-setup)');
      return false;
    }

    this.app = IonicApp;
    this.registerCallback = false;
    this.notificationCallback = false;
    this.errorCallback = false;
    this._token = false;
    this._notification = false;
    this._debug = false;
    this._isReady = false;
    this._tokenReady = false;
    this._blockRegistration = false;
    this._blockSaveToken = false;
    this._registered = false;
    this._emitter = new EventEmitter();
    this._plugin = null;
    if (config !== DEFER_INIT) {
      var self = this;
      IonicPlatform.getMain().onReady(function() {
        self.init(config);
      });
    }
  }

  set token(val) {
    var storage = IonicPlatform.getStorage();
    if (val instanceof PushToken) {
      storage.storeObject('ionic_io_push_token', { 'token': val.token });
    }
    this._token = val;
  }

  getStorageToken() {
    var storage = IonicPlatform.getStorage();
    var token = storage.retrieveObject('ionic_io_push_token');
    if (token) {
      return new PushToken(token.token);
    }
    return null;
  }

  clearStorageToken() {
    var storage = IonicPlatform.getStorage();
    storage.deleteObject('ionic_io_push_token');
  }

  /**
   * Init method to setup push behavior/options
   *
   * The config supports the following properties:
   *   - debug {Boolean} Enables some extra logging as well as some default callback handlers
   *   - onNotification {Function} Callback function that is passed the notification object
   *   - onRegister {Function} Callback function that is passed the registration object
   *   - onError {Function} Callback function that is passed the error object
   *   - pluginConfig {Object} Plugin configuration: https://github.com/phonegap/phonegap-plugin-push
   *
   * @param {object} config Configuration object
   * @return {Push} returns the called Push instantiation
   */
  init(config) {
    this._getPushPlugin();
    if (typeof config === 'undefined') { config = {}; }
    if (typeof config !== 'object') {
      this.logger.error('init() requires a valid config object.');
      return false;
    }
    var self = this;

    if (!config.pluginConfig) { config.pluginConfig = {}; }

    if (IonicPlatform.isAndroidDevice()) {
      // inject gcm key for PushPlugin
      if (!config.pluginConfig.android) { config.pluginConfig.android = {}; }
      if (!config.pluginConfig.android.senderId) { config.pluginConfig.android.senderID = self.app.gcmKey; }
    }

    // Store Callbacks
    if (config.onRegister) { this.setRegisterCallback(config.onRegister); }
    if (config.onNotification) { this.setNotificationCallback(config.onNotification); }
    if (config.onError) { this.setErrorCallback(config.onError); }

    this._config = config;
    this._isReady = true;

    this._emitter.emit('ionic_push:ready', { "config": this._config });
    return this;
  }

  saveToken(token, options) {
    var deferred = new DeferredPromise();
    var opts = options || {};
    if (token.token) {
      token = token.token;
    }

    var tokenData = {
      'token': token,
      'app_id': settings.get('app_id')
    };

    if (!opts.ignore_user) {
      var user = User.current();
      if (user.isAuthenticated()) {
        tokenData.user_id = user.id; // eslint-disable-line
      }
    }

    if (!self._blockSaveToken) {
      new APIRequest({
        'uri': pushAPIEndpoints.saveToken(),
        'method': 'POST',
        'json': tokenData
      }).then(function(result) {
        self._blockSaveToken = false;
        self.logger.info('saved push token: ' + token);
        if (tokenData.user_id) {
          self.logger.info('added push token to user: ' + tokenData.user_id);
        }
        deferred.resolve(result);
      }, function(error) {
        self._blockSaveToken = false;
        self.logger.error(error);
        deferred.reject(error);
      });
    } else {
      self.logger.info("a token save operation is already in progress.");
      deferred.reject(false);
    }
  }

  /**
   * Registers the device with GCM/APNS to get a device token
   * Fires off the 'onRegister' callback if one has been provided in the init() config
   * @param {function} callback Callback Function
   * @return {void}
   */
  register(callback) {
    this.logger.info('register');
    var self = this;
    if (this._blockRegistration) {
      self.logger.info("another registration is already in progress.");
      return false;
    }
    this._blockRegistration = true;
    this.onReady(function() {
      if (self.app.devPush) {
        var IonicDevPush = new PushDevService();
        self._debugCallbackRegistration();
        self._callbackRegistration();
        IonicDevPush.init(self, callback);
        self._blockRegistration = false;
        self._tokenReady = true;
      } else {
        self._plugin = self._getPushPlugin().init(self._config.pluginConfig);
        self._plugin.on('registration', function(data) {
          self._blockRegistration = false;
          self.token = new PushToken(data.registrationId);
          self._tokenReady = true;
          if ((typeof callback === 'function')) {
            callback(self._token);
          }
        });
        self._debugCallbackRegistration();
        self._callbackRegistration();
      }
      self._registered = true;
    });
  }

  /**
   * Invalidate the current GCM/APNS token
   *
   * @return {Promise} the unregister result
   */
  unregister() {
    var self = this;
    var deferred = new DeferredPromise();
    var platform = null;

    if (IonicPlatform.isAndroidDevice()) {
      platform = 'android';
    } else if (IonicPlatform.isIOSDevice()) {
      platform = 'ios';
    }

    if (!platform) {
      deferred.reject("Could not detect the platform, are you on a device?");
    }

    if (!self._blockUnregister) {
      if (this._plugin) {
        this._plugin.unregister(function() {}, function() {});
      }
      new APIRequest({
        'uri': pushAPIEndpoints.invalidateToken(),
        'method': 'POST',
        'json': {
          'platform': platform,
          'token': self.getStorageToken().token
        }
      }).then(function(result) {
        self._blockUnregister = false;
        self.logger.info('unregistered push token: ' + self.getStorageToken().token);
        self.clearStorageToken();
        deferred.resolve(result);
      }, function(error) {
        self._blockUnregister = false;
        self.logger.error(error);
        deferred.reject(error);
      });
    } else {
      self.logger.info("an unregister operation is already in progress.");
      deferred.reject(false);
    }

    return deferred.promise;
  }

  /**
   * Convenience method to grab the payload object from a notification
   *
   * @param {PushNotification} notification Push Notification object
   * @return {object} Payload object or an empty object
   */
  getPayload(notification) {
    return notification.payload;
  }

  /**
   * Set the registration callback
   *
   * @param {function} callback Registration callback function
   * @return {boolean} true if set correctly, otherwise false
   */
  setRegisterCallback(callback) {
    if (typeof callback !== 'function') {
      this.logger.info('setRegisterCallback() requires a valid callback function');
      return false;
    }
    this.registerCallback = callback;
    return true;
  }

  /**
   * Set the notification callback
   *
   * @param {function} callback Notification callback function
   * @return {boolean} true if set correctly, otherwise false
   */
  setNotificationCallback(callback) {
    if (typeof callback !== 'function') {
      this.logger.info('setNotificationCallback() requires a valid callback function');
      return false;
    }
    this.notificationCallback = callback;
    return true;
  }

  /**
   * Set the error callback
   *
   * @param {function} callback Error callback function
   * @return {boolean} true if set correctly, otherwise false
   */
  setErrorCallback(callback) {
    if (typeof callback !== 'function') {
      this.logger.info('setErrorCallback() requires a valid callback function');
      return false;
    }
    this.errorCallback = callback;
    return true;
  }

  _debugRegistrationCallback() {
    var self = this;
    function callback(data) {
      self.token = new PushToken(data.registrationId);
      self.logger.info('(debug) device token registered: ' + self._token);
    }
    return callback;
  }

  _debugNotificationCallback() {
    var self = this;
    function callback(notification) {
      self._processNotification(notification);
      var message = PushMessage.fromPluginJSON(notification);
      self.logger.info('(debug) notification received: ' + message);
      if (!self.notificationCallback && self.app.devPush) {
        alert(message.text);
      }
    }
    return callback;
  }

  _debugErrorCallback() {
    var self = this;
    function callback(err) {
      self.logger.error('(debug) unexpected error occured.');
      self.logger.error(err);
    }
    return callback;
  }

  _registerCallback() {
    var self = this;
    function callback(data) {
      self.token = new PushToken(data.registrationId);
      if (self.registerCallback) {
        return self.registerCallback(self._token);
      }
    }
    return callback;
  }

  _notificationCallback() {
    var self = this;
    function callback(notification) {
      self._processNotification(notification);
      var message = PushMessage.fromPluginJSON(notification);
      if (self.notificationCallback) {
        return self.notificationCallback(message);
      }
    }
    return callback;
  }

  _errorCallback() {
    var self = this;
    function callback(err) {
      if (self.errorCallback) {
        return self.errorCallback(err);
      }
    }
    return callback;
  }

  /**
   * Registers the default debug callbacks with the PushPlugin when debug is enabled
   * Internal Method
   * @private
   * @return {void}
   */
  _debugCallbackRegistration() {
    if (this._config.debug) {
      if (!this.app.devPush) {
        this._plugin.on('registration', this._debugRegistrationCallback());
        this._plugin.on('notification', this._debugNotificationCallback());
        this._plugin.on('error', this._debugErrorCallback());
      } else {
        if (!this._registered) {
          this._emitter.on('ionic_push:token', this._debugRegistrationCallback());
          this._emitter.on('ionic_push:notification', this._debugNotificationCallback());
          this._emitter.on('ionic_push:error', this._debugErrorCallback());
        }
      }
    }
  }

  /**
   * Registers the user supplied callbacks with the PushPlugin
   * Internal Method
   * @return {void}
   */
  _callbackRegistration() {
    if (!this.app.devPush) {
      this._plugin.on('registration', this._registerCallback());
      this._plugin.on('notification', this._notificationCallback());
      this._plugin.on('error', this._errorCallback());
    } else {
      if (!this._registered) {
        this._emitter.on('ionic_push:token', this._registerCallback());
        this._emitter.on('ionic_push:notification', this._notificationCallback());
        this._emitter.on('ionic_push:error', this._errorCallback());
      }
    }
  }

  /**
   * Performs misc features based on the contents of a push notification
   * Internal Method
   *
   * Currently just does the payload $state redirection
   * @param {PushNotification} notification Push Notification object
   * @return {void}
   */
  _processNotification(notification) {
    this._notification = notification;
    this._emitter.emit('ionic_push:processNotification', notification);
  }

  /* Deprecated in favor of `getPushPlugin` */
  _getPushPlugin() {
    var self = this;
    var PushPlugin = false;
    try {
      PushPlugin = window.PushNotification;
    } catch (e) {
      self.logger.info('something went wrong looking for the PushNotification plugin');
    }

    if (!self.app.devPush && !PushPlugin && (IonicPlatform.isIOSDevice() || IonicPlatform.isAndroidDevice()) ) {
      self.logger.error("PushNotification plugin is required. Have you run `ionic plugin add phonegap-plugin-push` ?");
    }
    return PushPlugin;
  }

  /**
   * Fetch the phonegap-push-plugin interface
   *
   * @return {PushNotification} PushNotification instance
   */
  getPushPlugin() {
    return this._plugin;
  }

  /**
   * Fire a callback when Push is ready. This will fire immediately if
   * the service has already initialized.
   *
   * @param {function} callback Callback function to fire off
   * @return {void}
   */
  onReady(callback) {
    var self = this;
    if (this._isReady) {
      callback(self);
    } else {
      self._emitter.on('ionic_push:ready', function() {
        callback(self);
      });
    }
  }

}
