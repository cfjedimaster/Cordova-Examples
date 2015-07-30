angular.module('mysoundboard', ['ionic', 'mysoundboard.controllers', 'mysoundboard.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: 'templates/home.html'
  })
	.state('new', {
		url:'/new',
		controller: 'RecordCtrl',
		templateUrl: 'templates/new.html'
	});


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
