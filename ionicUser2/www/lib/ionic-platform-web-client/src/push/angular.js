// Add Angular integrations if Angular is available
if ((typeof angular === 'object') && angular.module) {

  var IonicAngularPush = null;

  angular.module('ionic.service.push', [])

  /**
   * IonicPushAction Service
   *
   * A utility service to kick off misc features as part of the Ionic Push service
   */
  .factory('$ionicPushAction', ['$state', function($state) {

    class PushActionService {

      /**
       * State Navigation
       *
       * Attempts to navigate to a new view if a push notification payload contains:
       *
       *   - $state {String} The state name (e.g 'tab.chats')
       *   - $stateParams {Object} Provided state (url) params
       *
       * Find more info about state navigation and params:
       * https://github.com/angular-ui/ui-router/wiki
       *
       * @param {object} notification Notification Object
       * @return {void}
       */
      notificationNavigation(notification) {
        var state = notification.payload.$state || false;
        var stateParams = notification.payload.$stateParams || {};
        if (state) {
          $state.go(state, stateParams);
        }
      }
    }

    return new PushActionService();
  }])

  .factory('$ionicPush', [function() {
    if (!IonicAngularPush) {
      IonicAngularPush = new Ionic.Push("DEFER_INIT");
    }
    return IonicAngularPush;
  }])

  .run(['$ionicPush', '$ionicPushAction', function($ionicPush, $ionicPushAction) {
    // This is what kicks off the state redirection when a push notificaiton has the relevant details
    $ionicPush._emitter.on('ionic_push:processNotification', function(notification) {
      notification = Ionic.PushMessage.fromPluginJSON(notification);
      if (notification && notification.app) {
        if (notification.app.asleep === true || notification.app.closed === true) {
          $ionicPushAction.notificationNavigation(notification);
        }
      }
    });

  }]);
}
