angular.module('appControllers', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$cordovaCamera', function($scope, $rootScope, $cordovaCamera) {

	$scope.ready = false;
	$scope.images = [];
	
	$rootScope.$watch('appReady.status', function() {
		console.log('watch fired '+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
	
	$scope.selImages = function() {
		
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 200,
			targetHeight: 200
		};

		$cordovaCamera.getPicture(options).then(function(imageUri) {
			console.log('img', imageUri);
			$scope.images.push(imageUri);
					
		}, function(err) {
		// error
		});

	};
	
}])
