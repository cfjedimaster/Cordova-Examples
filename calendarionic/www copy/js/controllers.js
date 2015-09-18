angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Events) {
	
	Events.get().then(function(events) {
		console.log("events", events);	
		$scope.events = events;
	});
	
});
