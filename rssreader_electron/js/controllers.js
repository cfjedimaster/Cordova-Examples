(function() {
'use strict';
/* global window,angular,console,cordova,google */

	angular.module('rssappControllers', [])

	.controller('RootCtrl', function($scope) {
	  
	  console.log('test ctrl');
	  $scope.$on('$ionicView.afterEnter', function(ev, data) { 
	      ev.stopPropagation();
	  });
	
	})

	.controller('HomeCtrl', ['$ionicPlatform', '$scope', '$rootScope', '$ionicLoading', '$state', 'rssService', 'settings', function($ionicPlatform, $scope, $rootScope, $ionicLoading, $state, rssService, settings) {

		$ionicLoading.show({
      		template: 'Loading...'
		});


		if(navigator.onLine) {
			rssService.getEntries(settings.rss).then(function(entries) {
				$ionicLoading.hide();
				$rootScope.entries = entries;
				$state.go("root.Entries");
			});

		} else {
			console.log("offline, push to error");
			$ionicLoading.hide();
			$state.go("root.Offline");
		}

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
			var shell = require('shell');
			shell.openExternal(e.link);
		};

	}]);

}());
