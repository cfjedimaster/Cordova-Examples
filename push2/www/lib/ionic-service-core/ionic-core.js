angular.module('ionic.service.core', [])

/**
 * @private
 * Provides a safe interface to store objects in persistent memory
 */
.provider('persistentStorage', function() {
  return {
    $get: ['$q', '$window', function($q, $window) {
      var objectCache = {};
      var memoryLocks = {};

      var persistenceStrategy = {
        get: function(key) {
          return $window.localStorage.getItem(key);
        },
        remove: function(key) {
          return $window.localStorage.removeItem(key);
        },
        set: function(key, value) {
          return $window.localStorage.setItem(key, value);
        }
      };

      return {
        /**
         * Stores an object in local storage under the given key
        */
        storeObject: function(key, object) {

          // Convert object to JSON and store in localStorage
          var json = JSON.stringify(object);
          persistenceStrategy.set(key, json);

          // Then store it in the object cache
          objectCache[key] = object;
        },

        /**
         * Either retrieves the cached copy of an object,
         * or the object itself from localStorage.
         * Returns null if the object couldn't be found.
        */
        retrieveObject: function(key) {

          // First check to see if it's the object cache
          var cached = objectCache[key];
          if (cached) {
            return cached;
          }

          // Deserialize the object from JSON
          var json = persistenceStrategy.get(key);

          // null or undefined --> return null.
          if (json == null) {
            return null;
          }

          try {
            return JSON.parse(json);
          } catch (err) {
            return null;
          }
        },

        /**
         * Locks the async call represented by the given promise and lock key.
         * Only one asyncFunction given by the lockKey can be running at any time.
         *
         * @param lockKey should be a string representing the name of this async call.
         *        This is required for persistence.
         * @param asyncFunction Returns a promise of the async call.
         * @returns A new promise, identical to the one returned by asyncFunction,
         *          but with two new errors: 'in_progress', and 'last_call_interrupted'.
        */
        lockedAsyncCall: function(lockKey, asyncFunction) {

          var deferred = $q.defer();

          // If the memory lock is set, error out.
          if (memoryLocks[lockKey]) {
            deferred.reject('in_progress');
            return deferred.promise;
          }

          // If there is a stored lock but no memory lock, flag a persistence error
          if (persistenceStrategy.get(lockKey) === 'locked') {
            deferred.reject('last_call_interrupted');
            deferred.promise.then(null, function() {
              persistenceStrategy.remove(lockKey);
            });
            return deferred.promise;
          }

          // Set stored and memory locks
          memoryLocks[lockKey] = true;
          persistenceStrategy.set(lockKey, 'locked');

          // Perform the async operation
          asyncFunction().then(function(successData) {
            deferred.resolve(successData);

            // Remove stored and memory locks
            delete memoryLocks[lockKey];
            persistenceStrategy.remove(lockKey);
          }, function(errorData) {
            deferred.reject(errorData);

            // Remove stored and memory locks
            delete memoryLocks[lockKey];
            persistenceStrategy.remove(lockKey);
          }, function(notifyData) {
            deferred.notify(notifyData);
          });

          return deferred.promise;
        }
      };
    }]
  };
})

/**
 * A core Ionic account identity provider.
 *
 * Usage:
 * angular.module('myApp', ['ionic', 'ionic.service.core'])
 * .config(['$ionicAppProvider', function($ionicAccountProvider) {
 *   $ionicAppProvider.identify({
 *     app_id: 'x34dfxjydi23dx'
 *   });
 * }]);
 */
.provider('$ionicApp', ['$httpProvider', function($httpProvider) {
  var app = {};

  var settings = {
    'api_server': 'https://apps.ionic.io',
    'push_api_server': 'https://push.ionic.io',
    'analytics_api_server': 'https://analytics.ionic.io'
  };

  var _is_cordova_available = function() {

    console.log('Ionic Core: searching for cordova.js');

    try {
      if (window.cordova || cordova) {
        console.log('Ionic Core: cordova.js has already been loaded');
        return true;
      }
    } catch(e) {}

    var scripts = document.getElementsByTagName('script');
    var len = scripts.length;
    for(var i = 0; i < len; i++) {
      var script = scripts[i].getAttribute('src');
      if(script) {
        var parts = script.split('/');
        var partsLength = 0;
        try {
          partsLength = parts.length;
          if (parts[partsLength-1] === 'cordova.js') {
            console.log('Ionic Core: cordova.js has previously been included.');
            return true;
          }
        } catch(e) {}
      }
    }

    return false;
  };

  this.identify = function(opts) {
  if (!opts.gcm_id){
    opts.gcm_id = 'None';
  }
    app = opts;
  };

  /**
   * Set a config property.
   */
  this.set = function(k, v) {
    settings[k] = v;
  };

  this.setApiServer = function(server) {
    settings.api_server = server;
  };

  this.$get = [function() {
    return {
      getId: function() {
        return app.app_id;
      },
      getGcmId: function(){
        return app.gcm_id;
      },
      getValue: function(k) {
        return settings[k];
      },
      getApiUrl: function() {
        return this.getValue('api_server');
      },
      getApiKey: function() {
        return app.api_key;
      },
      getApiEndpoint: function(service) {
        var app = this.getApp();
        if(!app) return null;

        return this.getApiUrl() + '/api/v1/' + app.app_id + '/' + service;
      },

      /**
       * Get the registered app for all commands.
       */
      getApp: function() {
        return app;
      },

      getDeviceTypeByNavigator: function() {
        return (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ipad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iphone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "blackberry" : "unknown";
      },

      loadCordova: function() {
        if(!_is_cordova_available()) {
          var cordova_script = document.createElement('script');
          var cordova_src = 'cordova.js';
          switch(this.getDeviceTypeByNavigator()) {
            case 'android':
              if (window.location.href.substring(0, 4) === "file") {
                cordova_src = 'file:///android_asset/www/cordova.js';
              }
              break;

            case 'ipad':
            case 'iphone':
              try {
                var resource = window.location.search.match(/cordova_js_bootstrap_resource=(.*?)(&|#|$)/i);
                if (resource) {
                  cordova_src = decodeURI(resource[1]);
                }
              } catch(e) {
                console.log('Could not find cordova_js_bootstrap_resource query param');
                console.log(e);
              }
              break;

            case 'unknown':
              return false;

            default:
              break;
          }
          cordova_script.setAttribute('src', cordova_src);
          document.head.appendChild(cordova_script);
          console.log('Ionic Core: injecting cordova.js');
        }
      },

      bootstrap: function() {
        this.loadCordova();
      }
    }
  }];
}])

/**
* @ngdoc service
* @name $ionicUser
* @module ionic.service.core
* @description
*
* An interface for storing data to a user object which will be sent with many ionic services
*
* Add tracking data to the user by passing objects in to the identify function.
* The _id property identifies the user on this device and cannot be overwritten.
*
* @usage
* ```javascript
* $ionicUser.get();
*
* // Add info to user object
* $ionicUser.identify({
*   username: "Timmy"
* });
*
* ```
*/
.factory('$ionicUser', [
  '$q',
  '$timeout',
  '$http',
  'persistentStorage',
  '$ionicApp',
function($q, $timeout, $http, persistentStorage, $ionicApp) {
      // User object we'll use to store all our user info


  var storageKeyName = 'ionic_analytics_user_' + $ionicApp.getApp().app_id,
      user = persistentStorage.retrieveObject(storageKeyName) || {},
      deviceCordova = ionic.Platform.device(),
      device = {
          screen_width: window.innerWidth * (window.devicePixelRatio || 1),
          screen_height: window.innerHeight * (window.devicePixelRatio || 1)
      };

  if (deviceCordova.model) device.model = deviceCordova.model;
  if (deviceCordova.platform) device.platform = deviceCordova.platform;
  if (deviceCordova.version) device.version = deviceCordova.version;
  if (deviceCordova.uuid) device.uuid = deviceCordova.uuid;

  // Flag if we've changed anything on our user
  var dirty = false;
  dirty = storeOrDirty('is_on_device', ionic.Platform.isWebView());
  dirty = storeOrDirty('device', device);
  if (!user._id) {
    user._id = generateGuid();
    dirty = true;
  }

  if (dirty) {
      persistentStorage.storeObject(storageKeyName, user);
  }

  function generateGuid() {
    // Some crazy bit-twiddling to generate a random guid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function storeOrDirty(key, value) {
    // Store the key on the user object and return whether something changed
    if (!angular.equals(user[key], value)) {
      user[key] = value;
      return true;
    }
    return false;
  }

  return {
    /**
     * Push a value to the array with the given key.
     * @param key the key
     * @param value the value
     * @param isUnique whether to only push if it doesn't exist in the set
     *
     */

    _op: function(key, value, type) {
      var u = user.user_id;
      if(!u) {
        throw new Error("Please call identify with a user_id before calling push");
      }
      var o = {};
      o['user_id'] = u;
      o[key] = value;

      return $http.post($ionicApp.getApiUrl() + '/api/v1/app/' + $ionicApp.getId() + '/users/' + type, o);
    },
    /**
     * Push the given value into the array field identified by the key.
     * Pass true to isUnique to only push the value if the value does not
     * already exist in the array.
     */
    push: function(key, value, isUnique) {
      if(isUnique) {
        return this._op(key, value, 'pushUnique');
      } else {
        return this._op(key, value, 'push');
      }
    },
    /**
     * Pull a given value out of the array identified by key.
     */
    pull: function(key, value) {
      return this._op(key, value, 'pull');
    },
    /**
     * Set the given value under the key in the user. This overwrites
     * any other data under that field. To append data to list, use push above.
     */
    set: function(key, value) {
      return this._op(key, value, 'set');
    },
    /**
     * Remove the field for the given key.
     */
    unset: function(key) {
      return this._op(key, '', 'unset');
    },
    generateGUID: function() {
      return generateGuid();
    },
    identify: function(userData) {
      if (!userData.user_id) {
        var msg = 'You must supply a unique user_id field.';
        throw new Error(msg)
      }

      // Copy all the data into our user object
      angular.extend(user, userData);

      // Write the user object to our local storage
      persistentStorage.storeObject(storageKeyName, user);

      return $http.post($ionicApp.getApiUrl() + '/api/v1/app/' + $ionicApp.getId() + '/users/identify', userData);
    },
    identifyAnonymous: function() {
      userData = {};
      userData['user_id'] = generateGuid();
      userData['isAnonymous'] = true;

      // Copy all the data into our user object
      angular.extend(user, userData);

      // Write the user object to our local storage
      persistentStorage.storeObject(storageKeyName, user);

      return $http.post($ionicApp.getApiUrl() + '/api/v1/app/' + $ionicApp.getId() + '/users/identify', userData);
    },
    get: function() {
      return user;
    }
  }
}])

.run(['$ionicApp', function($ionicApp) {
  console.log('Ionic Core: init');
  $ionicApp.bootstrap();
}]);