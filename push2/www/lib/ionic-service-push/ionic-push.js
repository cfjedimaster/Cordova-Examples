angular.module('ionic.service.push', ['ngCordova', 'ionic.service.core'])

/**
 * The Ionic Push service client wrapper.
 *
 * Example:
 *
 * angular.controller(['$scope', '$ionicPush', function($scope, $ionicPush) {
 * }])
 *
 */
.factory('$ionicPush', ['$http', '$cordovaPush','$cordovaLocalNotification', '$ionicApp', '$ionicPushActions', '$ionicUser', '$rootScope', '$log', '$q',

function($http, $cordovaPush, $cordovaLocalNotification, $ionicApp, $ionicPushActions, $ionicUser, $rootScope, $log, $q) {

  // Grab the current app
  var app = $ionicApp.getApp();

  //Check for required credentials
  if(!app || !app.app_id) {
    console.error('PUSH: Unable to initialize, you must call $ionicAppProvider.identify() first');
  }

  function generateDevGuid() {
    // Some crazy bit-twiddling to generate a random guid
    return 'DEV-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function init(options) {
    var defer = $q.defer();

    // TODO: This should be part of a config not a direct method
    var gcmKey = $ionicApp.getGcmId();
    var api = $ionicApp.getValue('push_api_server');

    //Default configuration
    var config = {
      "senderID": gcmKey,
      "badge": true,
      "sound": true,
      "alert": true
    };

    /**
     * For testing push notifications, set the dev_push flag in your config to true.
     **/
    if (app.dev_push) {
      var localNotifications = false;
      // If they have the local notification plugin, let them receive notifications with it, otherwise just do alerts
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification && window.cordova.plugins.notification.local) {
        localNotifications = true;
      }

      var devToken = generateDevGuid();
      var devHost = api + '/dev/push';

      var req = {
        method: 'POST',
        url: devHost,
        data: {
          "dev_token": devToken
        }
      };

      $http(req).success(function(resp){
          console.log('$ionicPush:REGISTERED_DEV_MODE', devToken);
          $rootScope.$emit('$cordovaPush:tokenReceived', {
            token: devToken,
            platform: 'none'
          });
          defer.resolve(devToken);
        }).error(function(error){
          console.log("$ionicPush: Error connecting dev_push service ", error);
        });

      var checkReq = {
        method: 'GET',
        url: devHost + '/check',
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Dev-Token': devToken
        }
      };

      // Check for new dev pushes every 5 seconds
      var checkPushes = setInterval(function(){
        $http(checkReq).success(function(resp){
          if (resp.messages.length > 0) {
            var notification = {};
            notification.alert = resp.messages[0];
            console.warn("Calling onNotification() for a development push.  Payload will NOT be available");
            var callbackRet = options.onNotification && options.onNotification(notification);
            // If the custom handler returns false, don't handle this at all in our code
            if(callbackRet === false) {
              return;
            }

            if (localNotifications) {
              console.log('$ionicPush: Attempting to send local notification.');
              window.cordova.plugins.notification.local.registerPermission(function (granted) {
                if (granted) {
                  window.cordova.plugins.notification.local.schedule({
                    title: 'DEVELOPMENT PUSH',
                    text: resp.messages[0]
                  });
                }
              });
            } else {
              console.log('$ionicPush: No device, sending alert instead.');
              alert(resp.messages[0]);
            }
          }
        }).error(function(error){
          console.log("$ionicPush: Error checking for dev pushes ", error);
        });
      }, 5000);

    /**
     * It's a notmal push, do normal push things
     */
    } else {
      $cordovaPush.register(config).then(function(token) {
        console.log('$ionicPush:REGISTERED', token);

        defer.resolve(token);

        if(token !== 'OK') {

          $rootScope.$emit('$cordovaPush:tokenReceived', {
            token: token,
            platform: 'ios'
          });

          // Push the token into the user data
          try {
            $ionicUser.push('_push.ios_tokens', token, true);
          } catch(e) {
            console.warn('Received push token before user was identified and will not be synced with ionic.io. Make sure to call $ionicUser.identify() before calling $ionicPush.register.');
          }
        }
      }, function(err) {
        console.error('$ionicPush:REGISTER_ERROR', err);
      });
    }

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      console.log('$ionicPush:RECEIVED', JSON.stringify(notification));

      var callbackRet = options.onNotification && options.onNotification(notification);

      if (ionic.Platform.isAndroid() && notification.event == "registered") {
        /**
         * Android handles push notification registration in a callback from the GCM service (whereas
         * iOS can be handled in a single call), so we need to check for a special notification type
         * here.
         */
        console.log('$ionicPush:REGISTERED', notification.regid);
        $rootScope.$emit('$cordovaPush:tokenReceived', {
          token: notification.regid,
          platform: 'android'
        });
        androidInit(notification.regid);
      }

      // If the custom handler returns false, don't handle this at all in
      // our code
      if(callbackRet === false) {
        return;
      }

      // If we have the notification plugin, show this
      if(options.canShowAlert && notification.alert) {
        if (navigator.notification) {
          navigator.notification.alert(notification.alert);
        } else {
          // Browser version
          alert(notification.alert);
        }
      }

      if(options.canPlaySound) {
        if (notification.sound && window.Media) {
          var snd = new Media(notification.sound);
          snd.play();
        }
      }

      if(options.canSetBadge) {
        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
            // Success!
          }, function(err) {
            console.log('Could not set badge!', err);
            // An error occurred. Show a message to the user
          });
        }
      }

      // Run any custom notification actions
      if(options.canRunActionsOnWake) {
        if(notification.foreground == "0" || notification.foreground === false) {
          $ionicPushActions.run(notification);
        }
      }
    });


    return defer.promise;
  }

  function androidInit(token) {
    // Push the token into the user data
    try {
      $ionicUser.push('_push.android_tokens', token, true);
    } catch(e) {
      console.warn('Received push token before user was identified and will not be synced with ionic.io. Make sure to call $ionicUser.identify() before calling $ionicPush.register.');
    }
  }

  return {
    /**
     * Register for push notifications.
     *
     * Configure the default notification behavior by using the options param:
     *
     * {
     *   // Whether to allow notifications to pop up an alert while in the app.
     *   // Setting this to false lets you control the push behavior more closely.
     *   allowAlert: true/false (default: true)
     *
     *   // Whether to allow notifications to update the badge
     *   allowBadge: true/false (default: true)
     *
     *   // Whether to allow notifications to play a sound
     *   allowSound: true/false (default: true)
     *
     *   // Whether to run auto actions, like navigating to a state, when a push
     *   // is opened outside of the app (foreground is false)
     *   canRunActionsOnWake: true/false (default: true)
     *
     *   // A callback to do some custom task on notification
     *   onNotification: true/false (default: true)
     * }
     */
    register: function(options, userdata){
      return $q(function(resolve) {
        if (!app) {
          return;
        }

        options = angular.extend({
          canShowAlert: true,
          canSetBadge: true,
          canPlaySound: true,
          canRunActionsOnWake: true,
          onNotification: function () {
            return true;
          },
          onTokenRecieved: function (token) { }
        }, options);

        var user = {};

        if (userdata) {
          if (!userdata.user_id) {
            // Set your user_id here, or generate a random one
            console.warn("No user ID specified in userdata or existing model, generating generic user ID.");
            user.user_id = $ionicUser.generateGUID();
          };

          angular.extend(user, userdata);

          console.log('$ionicPush: Identifying user', user.user_id);
          $ionicUser.identify(user).then(function () {
            resolve(init(options));
          });
        } else {
          user = $ionicUser.get();
          if (!user.user_id){
            console.log('$ionicPush: Registering anonymous user.');
            $ionicUser.identifyAnonymous().then(function() {
              resolve(init(options));
            });
          } else {
            resolve(init(options));
          }
        }
      });
    },
    unregister: function(options) {
      return $cordovaPush.unregister(options);
    }
  }
}])

.factory('$ionicPushActions', [
    '$rootElement',
    '$injector',
function($rootElement, $injector) {
  return {
    run: function(notification) {
      var state = false;
      var stateParams = {};
      if (ionic.Platform.isAndroid()) {
        if (notification.payload.payload.$state) {
          state = notification.payload.payload.$state;
        }
        if (notification.payload.payload.$stateParams) {
          try {
            stateParams = JSON.parse(notification.payload.payload.$stateParams);
          } catch(e) {}
        }
      } else if (ionic.Platform.isIOS()) {
        if (notification.$state) {
          state = notification.$state;
        }
        if (notification.$stateParams) {
          try {
            stateParams = JSON.parse(notification.$stateParams);
          } catch(e) {}
        }
      }

      if (state) {
        // Auto navigate to state
        var injector = $rootElement.injector();
        $state = injector.get('$state');
        $state.go(state, stateParams);
      }
    }
  }
}])
