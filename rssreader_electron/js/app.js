(function() {
/* global angular,window,cordova,console */

	angular.module('starter', ['ionic','rssappControllers','rssappServices'])

	.constant("settings", {
		title:"Raymond Camden's Blog",
		rss:"http://feeds.feedburner.com/raymondcamdensblog"
	})

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider
		    .state('root', {
			    url: '/root',
			    abstract: true,
			    controller:'RootCtrl',
				template:'<ion-nav-view />'
			  })
			.state('root.Home', {
				url: '/home',
				controller: 'HomeCtrl',
				templateUrl: 'partials/home.html'
			})
			.state('root.Entries', {
				url: '/entries',
				controller: 'EntriesCtrl',
				templateUrl: 'partials/entries.html',
			})
			.state('root.Entry', {
				url: '/entry/:index',
				controller: 'EntryCtrl',
				templateUrl: 'partials/entry.html',
			})
			.state('root.Offline', {
				url: '/offline',
				templateUrl: 'partials/offline.html'
			});

		$urlRouterProvider.otherwise("/root/home");

	}])

	.run(['$ionicPlatform','$rootScope','$state', function($ionicPlatform, $rootScope, $state) {

		$rootScope.goHome = function() {
			$state.go("root.Entries");
		};

	}]);

}());
