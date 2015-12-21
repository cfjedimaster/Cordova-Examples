angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('starWarsFilms', {
      url: '/page3',
      templateUrl: 'templates/starWarsFilms.html',
      controller: 'starWarsFilmsCtrl'
    })
        
      
    
      
        
    .state('filmTitle', {
      url: '/page4',
      templateUrl: 'templates/filmTitle.html',
      controller: 'filmTitleCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page3');

});