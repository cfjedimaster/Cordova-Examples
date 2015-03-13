angular.module('starter', ['ionic'])

.controller('MainCtrl',function($scope) {
	console.log('ran controller');
	
	$scope.validateForm = function() {
		console.log("validation called");
		var errors = [];
		if(!$scope.fName || $scope.fName == '') errors.push("First name required.");
		if(!$scope.lName || $scope.lName == '') errors.push("Last name required.");
		
		console.dir(errors);
	};
	
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
