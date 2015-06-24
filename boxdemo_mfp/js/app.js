// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','ngCordovaOauth'])

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'AppCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);
  
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).directive('appReady', function() {
  return {
    restrict:'A',
    link:function(scope,element,attrs) {
      console.log("Done rendering body");
      WL.App.hideSplashScreen();
    }
  }
  
}).factory('Logger', function() {

	var logger = WL.Logger.create({autoSendLogs:true});

	return {
		log:function(s) {
			logger.log('log', s);
      console.log(s);
		}
	}
})
