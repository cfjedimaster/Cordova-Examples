import { EventEmitter } from "./events";
import { Storage } from "./storage";
import { Logger } from "./logger";

var eventEmitter = new EventEmitter();
var mainStorage = new Storage();

export class IonicPlatform {

  constructor() {
    var self = this;
    this.logger = new Logger({
      'prefix': 'Ionic Core:'
    });
    this.logger.info('init');
    this._pluginsReady = false;
    this.emitter = IonicPlatform.getEmitter();
    this._bootstrap();

    if (self.cordovaPlatformUnknown) {
      self.logger.info('attempting to mock plugins');
      self._pluginsReady = true;
      self.emitter.emit('ionic_core:plugins_ready');
    } else {
      try {
        document.addEventListener("deviceready",  function() {
          self.logger.info('plugins are ready');
          self._pluginsReady = true;
          self.emitter.emit('ionic_core:plugins_ready');
        }, false);
      } catch (e) {
        self.logger.info('unable to listen for cordova plugins to be ready');
      }
    }
  }

  static get Version() {
    return 'VERSION_STRING';
  }

  static getEmitter() {
    return eventEmitter;
  }

  static getStorage() {
    return mainStorage;
  }

  static getMain() {
    if (typeof Ionic !== 'undefined') {
      if (Ionic.IO && Ionic.IO.main) {
        return Ionic.IO.main;
      }
    }
    return null;
  }

  _isCordovaAvailable() {
    var self = this;
    this.logger.info('searching for cordova.js');

    if (typeof cordova !== 'undefined') {
      this.logger.info('cordova.js has already been loaded');
      return true;
    }

    var scripts = document.getElementsByTagName('script');
    var len = scripts.length;
    for (var i = 0; i < len; i++) {
      var script = scripts[i].getAttribute('src');
      if (script) {
        var parts = script.split('/');
        var partsLength = 0;
        try {
          partsLength = parts.length;
          if (parts[partsLength - 1] === 'cordova.js') {
            self.logger.info('cordova.js has previously been included.');
            return true;
          }
        } catch (e) {
          self.logger.info('encountered error while testing for cordova.js presence, ' + e.toString());
        }
      }
    }

    return false;
  }

  loadCordova() {
    var self = this;
    if (!this._isCordovaAvailable()) {
      var cordovaScript = document.createElement('script');
      var cordovaSrc = 'cordova.js';
      switch (IonicPlatform.getDeviceTypeByNavigator()) {
        case 'android':
          if (window.location.href.substring(0, 4) === "file") {
            cordovaSrc = 'file:///android_asset/www/cordova.js';
          }
          break;

        case 'ipad':
        case 'iphone':
          try {
            var resource = window.location.search.match(/cordova_js_bootstrap_resource=(.*?)(&|#|$)/i);
            if (resource) {
              cordovaSrc = decodeURI(resource[1]);
            }
          } catch (e) {
            self.logger.info('could not find cordova_js_bootstrap_resource query param');
            self.logger.info(e);
          }
          break;

        case 'unknown':
          self.cordovaPlatformUnknown = true;
          return false;

        default:
          break;
      }
      cordovaScript.setAttribute('src', cordovaSrc);
      document.head.appendChild(cordovaScript);
      self.logger.info('injecting cordova.js');
    }
  }

  /**
   * Determine the device type via the user agent string
   * @return {string} name of device platform or "unknown" if unable to identify the device
   */
  static getDeviceTypeByNavigator() {
    var agent = navigator.userAgent;

    var ipad = agent.match(/iPad/i);
    if (ipad && (ipad[0].toLowerCase() === 'ipad')) {
      return 'ipad';
    }

    var iphone = agent.match(/iPhone/i);
    if (iphone && (iphone[0].toLowerCase() === 'iphone')) {
      return 'iphone';
    }

    var android = agent.match(/Android/i);
    if (android && (android[0].toLowerCase() === 'android')) {
      return 'android';
    }

    return "unknown";
  }

  /**
   * Check if the device is an Android device
   * @return {boolean} True if Android, false otherwise
   */
  static isAndroidDevice() {
    var device = IonicPlatform.getDeviceTypeByNavigator();
    if (device === 'android') {
      return true;
    }
    return false;
  }

  /**
   * Check if the device is an iOS device
   * @return {boolean} True if iOS, false otherwise
   */
  static isIOSDevice() {
    var device = IonicPlatform.getDeviceTypeByNavigator();
    if (device === 'iphone' || device === 'ipad') {
      return true;
    }
    return false;
  }

  /**
   * Bootstrap Ionic Core
   *
   * Handles the cordova.js bootstrap
   * @return {void}
   */
  _bootstrap() {
    this.loadCordova();
  }

  static deviceConnectedToNetwork(strictMode) {
    if (typeof strictMode === 'undefined') {
      strictMode = false;
    }

    if (typeof navigator.connection === 'undefined' ||
        typeof navigator.connection.type === 'undefined' ||
        typeof Connection === 'undefined') {
      if (!strictMode) {
        return true;
      }
      return false;
    }

    switch (navigator.connection.type) {
      case Connection.ETHERNET:
      case Connection.WIFI:
      case Connection.CELL_2G:
      case Connection.CELL_3G:
      case Connection.CELL_4G:
      case Connection.CELL:
        return true;

      default:
        return false;
    }
  }

  /**
   * Fire a callback when core + plugins are ready. This will fire immediately if
   * the components have already become available.
   *
   * @param {function} callback function to fire off
   * @return {void}
   */
  onReady(callback) {
    var self = this;
    if (this._pluginsReady) {
      callback(self);
    } else {
      self.emitter.on('ionic_core:plugins_ready', function() {
        callback(self);
      });
    }
  }
}

