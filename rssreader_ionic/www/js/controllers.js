(function() {
'use strict';
/* global window,angular,console,cordova,google */

	angular.module('rssappControllers', [])

	.controller('HomeCtrl', ['$ionicPlatform', '$scope', '$rootScope', '$cordovaNetwork', '$ionicLoading', '$location', function($ionicPlatform, $scope, $rootScope, $cordovaNetwork, $ionicLoading, $location) {
		
		$ionicLoading.show({
      		template: 'Loading...'
		});
		
		function initialize() {
			console.log('googles init called');	
			var feed = new google.feeds.Feed($rootScope.RSS);
			
			feed.setNumEntries(10);
			feed.load(function(result) {
				$ionicLoading.hide();
				if(!result.error) {
					$rootScope.entries = result.feed.entries;
					console.log('move');
					$location.path('/entries');
				} else {
					console.log("Error - "+result.error.message);
					//write error
				}
			});

		}
		
		$ionicPlatform.ready(function() {

			console.log("Started up!!");

			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if(window.StatusBar) {
				window.StatusBar.styleDefault();
			}

			if($cordovaNetwork.isOnline()) {
				google.load("feeds", "1",{callback:initialize});
			} else {
				console.log("offline, push to error");
				$ionicLoading.hide();
				$location.path('/offline');

			}

		});

	}])

	.controller('EntriesCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) { 
		console.log('EntriesCtrl called');
		/*
		handle issue with Ionic CLI reloading
		*/
		if(!$rootScope.entries) $location.path('/');
		
		$rootScope.notHome = false;
		
		$scope.entries = $rootScope.entries;
		console.log(JSON.stringify($scope.entries[0]));

	}])
	
	.controller('EntryCtrl', ['$scope', '$rootScope', '$location', '$stateParams', function($scope, $rootScope, $location, $stateParams) { 
		console.log('EntryCtrl called');

		/*
		handle issue with Ionic CLI reloading
		*/
		if(!$rootScope.entries) $location.path('/');

		$rootScope.notHome = true;
		
		$scope.index = $stateParams.index;
		$scope.entry = $rootScope.entries[$scope.index];
		
		$scope.readEntry = function(e) {
			window.open(e.link, "_blank");
		};
		
	}]);

	
}());