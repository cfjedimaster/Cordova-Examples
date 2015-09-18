angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Events,$ionicPlatform,$cordovaCalendar,$timeout) {
	
	$ionicPlatform.ready(function() {
		Events.get().then(function(events) {
			console.log("events", JSON.stringify(events));	
			$scope.events = events;
		});
	});
	
	$scope.addEvent = function(event,idx) {
		console.log("add ",event);
		
		Events.add(event).then(function(result) {
			console.log("done adding event, result is "+result);
			if(result === 1) {
				//update the event
				$timeout(function() {
					$scope.events[idx].status = true;
					$scope.$apply();
				});
			} else {
				//For now... maybe just tell the user it didn't work?
			}
		});

		
	};
	
});
