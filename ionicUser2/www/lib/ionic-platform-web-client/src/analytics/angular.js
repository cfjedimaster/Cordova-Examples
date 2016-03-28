// Add Angular integrations if Angular is available
if ((typeof angular === 'object') && angular.module) {

  var IonicAngularAnalytics = null;

  angular.module('ionic.service.analytics', ['ionic'])

  .value('IONIC_ANALYTICS_VERSION', Ionic.Analytics.version)

  .factory('$ionicAnalytics', [function() {
    if (!IonicAngularAnalytics) {
      IonicAngularAnalytics = new Ionic.Analytics("DEFER_REGISTER");
    }
    return IonicAngularAnalytics;
  }])

  .factory('domSerializer', [function() {
    return new Ionic.AnalyticSerializers.DOMSerializer();
  }])

  .run(['$ionicAnalytics', '$state', function($ionicAnalytics, $state) {
    $ionicAnalytics.setGlobalProperties(function(eventCollection, eventData) {
      if (!eventData._ui) {
        eventData._ui = {};
      }
      eventData._ui.active_state = $state.current.name; // eslint-disable-line
    });
  }]);


  angular.module('ionic.service.analytics')

  .provider('$ionicAutoTrack',[function() {

    var trackersDisabled = {},
      allTrackersDisabled = false;

    this.disableTracking = function(tracker) {
      if (tracker) {
        trackersDisabled[tracker] = true;
      } else {
        allTrackersDisabled = true;
      }
    };

    this.$get = [function() {
      return {
        "isEnabled": function(tracker) {
          return !allTrackersDisabled && !trackersDisabled[tracker];
        }
      };
    }];
  }])


  // ================================================================================
  // Auto trackers
  // ================================================================================


  .run(['$ionicAutoTrack', '$ionicAnalytics', function($ionicAutoTrack, $ionicAnalytics) {
    if (!$ionicAutoTrack.isEnabled('Load')) {
      return;
    }
    $ionicAnalytics.track('Load');
  }])

  .run([
    '$ionicAutoTrack',
    '$document',
    '$ionicAnalytics',
    'domSerializer',
    function($ionicAutoTrack, $document, $ionicAnalytics, domSerializer) {
      if (!$ionicAutoTrack.isEnabled('Tap')) {
        return;
      }

      $document.on('click', function(event) {
        // want coordinates as a percentage relative to the target element
        var box = event.target.getBoundingClientRect(),
          width = box.right - box.left,
          height = box.bottom - box.top,
          normX = (event.pageX - box.left) / width,
          normY = (event.pageY - box.top) / height;

        var eventData = {
          "coordinates": {
            "x": event.pageX,
            "y": event.pageY
          },
          "target": domSerializer.elementSelector(event.target),
          "target_identifier": domSerializer.elementName(event.target)
        };

        if (isFinite(normX) && isFinite(normY)) {
          eventData.coordinates.x_norm = normX; // eslint-disable-line
          eventData.coordinates.y_norm = normY; // eslint-disable-line
        }

        $ionicAnalytics.track('Tap', {
          "_ui": eventData
        });

      });
    }
  ])

  .run([
    '$ionicAutoTrack',
    '$ionicAnalytics',
    '$rootScope',
    function($ionicAutoTrack, $ionicAnalytics, $rootScope) {
      if (!$ionicAutoTrack.isEnabled('State Change')) {
        return;
      }

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) { // eslint-disable-line
        $ionicAnalytics.track('State Change', {
          "from": fromState.name,
          "to": toState.name
        });
      });
    }
  ])

  // ================================================================================
  // ion-track-$EVENT
  // ================================================================================

  /**
   * @ngdoc directive
   * @name ionTrackClick
   * @module ionic.service.analytics
   * @restrict A
   * @parent ionic.directive:ionTrackClick
   *
   * @description
   *
   * A convenient directive to automatically track a click/tap on a button
   * or other tappable element.
   *
   * @usage
   * ```html
   * <button class="button button-clear" ion-track-click ion-track-event="cta-tap">Try now!</button>
   * ```
   */

  .directive('ionTrackClick', ionTrackDirective('click'))
  .directive('ionTrackTap', ionTrackDirective('tap'))
  .directive('ionTrackDoubletap', ionTrackDirective('doubletap'))
  .directive('ionTrackHold', ionTrackDirective('hold'))
  .directive('ionTrackRelease', ionTrackDirective('release'))
  .directive('ionTrackDrag', ionTrackDirective('drag'))
  .directive('ionTrackDragLeft', ionTrackDirective('dragleft'))
  .directive('ionTrackDragRight', ionTrackDirective('dragright'))
  .directive('ionTrackDragUp', ionTrackDirective('dragup'))
  .directive('ionTrackDragDown', ionTrackDirective('dragdown'))
  .directive('ionTrackSwipeLeft', ionTrackDirective('swipeleft'))
  .directive('ionTrackSwipeRight', ionTrackDirective('swiperight'))
  .directive('ionTrackSwipeUp', ionTrackDirective('swipeup'))
  .directive('ionTrackSwipeDown', ionTrackDirective('swipedown'))
  .directive('ionTrackTransform', ionTrackDirective('hold'))
  .directive('ionTrackPinch', ionTrackDirective('pinch'))
  .directive('ionTrackPinchIn', ionTrackDirective('pinchin'))
  .directive('ionTrackPinchOut', ionTrackDirective('pinchout'))
  .directive('ionTrackRotate', ionTrackDirective('rotate'));

  /**
   * Generic directive to create auto event handling analytics directives like:
   *
   * <button ion-track-click="eventName">Click Track</button>
   * <button ion-track-hold="eventName">Hold Track</button>
   * <button ion-track-tap="eventName">Tap Track</button>
   * <button ion-track-doubletap="eventName">Double Tap Track</button>
   *
   * @param {string} domEventName The DOM event name
   * @return {array} Angular Directive declaration
   */
  function ionTrackDirective(domEventName) { // eslint-disable-line
    return ['$ionicAnalytics', '$ionicGesture', function($ionicAnalytics, $ionicGesture) {

      var gestureDriven = [
        'drag', 'dragstart', 'dragend', 'dragleft', 'dragright', 'dragup', 'dragdown',
        'swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown',
        'tap', 'doubletap', 'hold',
        'transform', 'pinch', 'pinchin', 'pinchout', 'rotate'
      ];
      // Check if we need to use the gesture subsystem or the DOM system
      var isGestureDriven = false;
      for (var i = 0; i < gestureDriven.length; i++) {
        if (gestureDriven[i] === domEventName.toLowerCase()) {
          isGestureDriven = true;
        }
      }
      return {
        "restrict": 'A',
        "link": function($scope, $element, $attr) {
          var capitalized = domEventName[0].toUpperCase() + domEventName.slice(1);
          // Grab event name we will send
          var eventName = $attr['ionTrack' + capitalized];

          if (isGestureDriven) {
            var gesture = $ionicGesture.on(domEventName, handler, $element);
            $scope.$on('$destroy', function() {
              $ionicGesture.off(gesture, domEventName, handler);
            });
          } else {
            $element.on(domEventName, handler);
            $scope.$on('$destroy', function() {
              $element.off(domEventName, handler);
            });
          }


          function handler(e) {
            var eventData = $scope.$eval($attr.ionTrackData) || {};
            if (eventName) {
              $ionicAnalytics.track(eventName, eventData);
            } else {
              $ionicAnalytics.trackClick(e.pageX, e.pageY, e.target, {
                "data": eventData
              });
            }
          }
        }
      };
    }];
  }

}
