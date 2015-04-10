angular.module('starter', ['ionic'])

.controller('MainCtrl',function($scope,$http) {
	$scope.apiKey = "chageme";
	$scope.hasErrors = false;
	$scope.errors = [];
	
	$scope.validateForm = function() {
		console.log("validation called");
		$scope.errors = [];
		$scope.hasErrors = false;
		
		if(!$scope.fName || $scope.fName == '') $scope.errors.push("First name required.");
		if(!$scope.lName || $scope.lName == '') $scope.errors.push("Last name required.");
		
		if(!$scope.homepage || $scope.homepage == '') $scope.errors.push("Homepage required.");
		
		if($scope.errors.length == 0) {
			
			//now do the API call
			var conf = {};
			conf.headers = {"apikey":$scope.apiKey};
			var body = {"url":$scope.homepage};
			var resp = $http.post('https://dev.metacert.com/v4/check/',body,conf);

			resp.success(function(result) {
				console.log('resp success');
				console.dir(result);
				if(result.data.URLs.length) {
					$scope.errors.push("Your URL has been flagged as potentially offensive.");
					$scope.hasErrors = true;
				}
			});

			resp.error(function(data,status) {
				console.log('resp error');
				console.dir(arguments);
			});
			
		} else {
			$scope.hasErrors = true;
		}
		
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
