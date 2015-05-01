angular.module('starter.controllers', [])

.controller('ListCtrl', function($scope, MP3Service, $cordovaSpinnerDialog) {
	console.log('ListCtrl loaded');

	document.addEventListener('deviceready', function () {

		console.log('begin to get stuff');
		$cordovaSpinnerDialog.show("Loading...","", true);
	
		MP3Service.getAll().then(function(results) {
			$cordovaSpinnerDialog.hide();
			$scope.content = results;
		});

	});
		
})
.controller('DetailCtrl', function($scope, $stateParams, MP3Service) {
	console.log('DetailCtrl loaded');
	$scope.detail = {};
	
	getMediaURL = function(s) {
	    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
	    return s;
	}

	$scope.play = function() {
		console.log('click for '+$scope.detail.url);
		
		MP3Service.play(getMediaURL($scope.detail.url));
	};

	MP3Service.getOne($stateParams.itemId).then(function(result) {
		console.dir(result);
		result.description = "Artist: " + result.tags.artist + "<br/>" +
		 					 "Album: " + result.tags.album;
		$scope.detail = result;
	});

});
