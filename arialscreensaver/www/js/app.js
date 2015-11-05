// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope, AppleVideoService) {

	$scope.loadVideo = function() {
		AppleVideoService.getVideo().then(function(vid) {
			console.log(vid.url);
			document.querySelector("#mainVideo source").setAttribute("src", vid.url);
			document.querySelector("#mainVideo").load();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$scope.loadVideo();
		
})
.factory('AppleVideoService', function($http,$q) {

	var jsonURL = "http://a1.phobos.apple.com/us/r1000/000/Features/atv/AutumnResources/videos/entries.json";
	var videoData = "";
	
	//http://stackoverflow.com/a/7228322
	var randomIntFromInterval = function (min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	/*
	first, I determine if night or data
	then, I pick a random video matching that
	*/
	var randomVideo = function() {
		//what time is it?
		var hour = new Date().getHours();
		if(hour > 6 && hour < 18) {
			return videoData.day[randomIntFromInterval(0, videoData.day.length)];	
		} else {
			return videoData.night[randomIntFromInterval(0, videoData.night.length)];				
		}
	};
	
	/*
	I convert Apple's JSON into two array of day and night videos. That makes it easier to pick a random one.
	*/
	var process = function(data) {
		var processed = {night:[], day:[]};
		for(var i=0; i<data.length;i++) {
			for(var video in data[i].assets) {
				if(data[i].assets[video].timeOfDay === "day") {
					processed.day.push(data[i].assets[video]);	
				}	else {
					processed.night.push(data[i].assets[video]);	
				}
			}	
		}
		return processed;
	};
	
	return {
		
			getVideo:function() {
				var deferred = $q.defer();
				if(videoData === "") {
					$http.get(jsonURL).success(function(data) {
						videoData = process(data);
						deferred.resolve(randomVideo());
					});	
				}	else deferred.resolve(randomVideo());
				return deferred.promise;
			}
		
	};
	
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
		
		
  });
})
