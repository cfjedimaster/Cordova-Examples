angular.module('starter', ['ngCordova','ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  $stateProvider
  .state('list', {
    url: '/',
    templateUrl: 'templates/list.html',
    controller: 'ListCtrl'
  })
  .state('list-detail', {
      url: '/item/:itemId',
      templateUrl: 'templates/detail.html',
      controller: 'DetailCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  
});
