angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Events,$ionicPlatform) {
	
	$ionicPlatform.ready(function() {
		Events.get().then(function(events) {
			console.log("events", events);	
			$scope.events = events;
		});
	});
});
