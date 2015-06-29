(function() {
'use strict';
/* global window,angular,console,cordova,google */

	angular.module('rssappControllers', [])

	.controller('HomeCtrl', ['$ionicPlatform', '$scope', '$rootScope', '$cordovaNetwork', '$ionicLoading', '$state', 'rssService', 'settings', function($ionicPlatform, $scope, $rootScope, $cordovaNetwork, $ionicLoading, $state, rssService, settings) {

		$ionicLoading.show({
      		template: 'Loading...'
		});

		$ionicPlatform.ready(function() {

			console.log("Started up!!");

			if($cordovaNetwork.isOnline()) {
				rssService.getEntries(settings.rss).then(function(entries) {
					$ionicLoading.hide();
					$rootScope.entries = entries;
					$state.go("Entries");
				});

			} else {
				console.log("offline, push to error");
				$ionicLoading.hide();
				$state.go("Offline");
			}

		});

	}])

	.controller('EntriesCtrl', ['$scope', '$rootScope', '$location', 'settings', function($scope, $rootScope, $location, settings) {
		console.log('EntriesCtrl called');
		$rootScope.notHome = false;
		$scope.title = settings.title;
		$scope.entries = $rootScope.entries;
	}])

	.controller('EntryCtrl', ['$scope', '$rootScope', '$location', '$stateParams', function($scope, $rootScope, $location, $stateParams) {
		console.log('EntryCtrl called');

		$rootScope.notHome = true;

		$scope.index = $stateParams.index;
		$scope.entry = $rootScope.entries[$scope.index];

		$scope.readEntry = function(e) {
			window.open(e.link, "_blank");
		};

	}]);

}());
