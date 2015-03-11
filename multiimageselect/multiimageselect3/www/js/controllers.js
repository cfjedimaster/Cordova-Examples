angular.module('appControllers', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$cordovaCapture', function($scope, $rootScope, $cordovaCapture) {

	$scope.ready = false;
	$scope.images = [];
	
	$rootScope.$watch('appReady.status', function() {
		console.log('watch fired '+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
	
	$scope.selImages = function() {
		
		var options = {
			limit: 10
		};

		$cordovaCapture.captureImage(options).then(function(results) {
			for (var i = 0; i < results.length; i++) {
				$scope.images.push(results[i].fullPath);
			}
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}, function(err) {
			console.log('err');
			console.log(err);
		// error
		});

	};
	
}])
