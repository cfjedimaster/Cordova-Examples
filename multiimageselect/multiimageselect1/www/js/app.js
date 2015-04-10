
angular.module('starter', ['ionic','appControllers','ngCordova'])

.config(['$stateProvider','$urlRouterProvider', '$compileProvider',  
	function($stateProvider, $urlRouterProvider, $compileProvider) {

		$stateProvider
			.state('Home', {
				url: '/',
				controller: 'HomeCtrl', 
				templateUrl: 'partials/home.html'
	});

	$urlRouterProvider.otherwise("/");

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file|assets-library):/);

}])	

.run(function($rootScope,$ionicPlatform) {
	$rootScope.appReady = {status:false};
	
	$ionicPlatform.ready(function() {
		console.log('ionic Ready');
		$rootScope.appReady.status = true;
		$rootScope.$apply();
		console.log('in app.js, appReady is '+$rootScope.appReady.status);
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});
