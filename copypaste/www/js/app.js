// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.controller('MainCtrl', function($scope,$ionicPlatform,$cordovaClipboard,$interval) {

	$scope.haURL = false;
	$scope.comments = "";
	
	var theURL = "";
	
	$ionicPlatform.ready(function() {
	
		//Begin looking for stuff in the clipboard
		$interval(checkForURL, 4*1000);

	});

	var isURL = function(s) {
		//Credit: http://stackoverflow.com/a/3809435
		var expr = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
		var regex = new RegExp(expr);
		var result = s.match(regex);
		if(result) return true;
		return false;
	};
	
	var checkForURL = function() {
		console.log('Checking the clipboard...');
		$cordovaClipboard
			.paste()
			.then(function (result) {
				console.log(result);
				if(result && isURL(result)) {
					$scope.hasURL = true;
					theURL = result;
				} else {
					$scope.hasURL = false;
				}
			}, function (e) {
				// error - do nothing cuz we don't care
			});
		
	};
	
	$scope.pasteURL = function() {
		console.log("Paste "+theURL);
		$scope.comments += theURL;		
		//remove from clippboard
		$cordovaClipboard.copy('').then(function () {
			$scope.theURL = '';
		}, function () {
			// error
		});	
		$scope.hasURL = false;
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
