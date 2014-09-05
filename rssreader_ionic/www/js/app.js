(function() {
/* global angular,window,cordova,console */
	
	angular.module('starter', ['ionic','ngCordova','rssappControllers'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('Home', {
				url: '/',
				controller: 'HomeCtrl', 
				templateUrl: 'partials/home.html'
			})
			.state('Entries', {
				url: '/entries', 
				controller: 'EntriesCtrl', 
				templateUrl: 'partials/entries.html',
			})
			.state('Entry', {
				url: '/entry/:index',
				controller: 'EntryCtrl', 
				templateUrl: 'partials/entry.html',
			})
			.state('Offline', {
				url: '/offline', 
				templateUrl: 'partials/offline.html'
			});

		$urlRouterProvider.otherwise("/");

	}])

	.run(function($ionicPlatform, $rootScope, $location) {

		//EDIT THESE LINES
		//Title of the blog
		$rootScope.TITLE = "Raymond Camden's Blog";
		//RSS url
		$rootScope.RSS = "http://www.raymondcamden.com/rss.cfm";

		$rootScope.goHome = function() {
			$location.path('/entries');
		};
		
	});

}());