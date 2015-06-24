angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope,$cordovaOauth,$http,Logger) {

	//By default we aren't logged in
	$scope.noAuth = true;
	$scope.selectedImage = "";
	$scope.status = {message:""};
	
	//temp
	var clientId = "1ihl57j27rj1a5qakzc7ro622q67pcit";
	var clientSecret = "YCgETbxijN8f1j1hUroTKffHjOeN9NKn";
	var state = "temp";
		
	$scope.doAuth = function() {
		Logger.log("Beginning to auth against Box");
		
		$cordovaOauth.box(clientId, clientSecret,state).then(function(result) {
			Logger.log("Successful log to Box");
			token = result.access_token;
			$scope.noAuth = false;
		}, function(error) {
			console.log('Error',error);
		});
	}
	
	$scope.doPicture = function() {
		
		navigator.camera.getPicture(function(uri) {
			$scope.selectedImage = uri;
			$scope.status.message = "Uploading bits to Box...";			
			$scope.$apply();

			Logger.log("Going to send a file to Box");
			
			var win = function (r) {
			    console.log("Code = " + r.responseCode);
			    console.log("Response = " + r.response);
			    console.log("Sent = " + r.bytesSent);
				$scope.status.message = "Sent to box!";
				Logger.log("Sent a file to box!");
				$scope.$apply();
			}
			
			var fail = function (error) {
			    alert("An error has occurred: Code = " + error.code);
			    console.log("upload error source " + error.source);
			    console.log("upload error target " + error.target);
				Logger.log("Failed to send to Box");
				console.dir(error);
			}
			
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = uri.substr(uri.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";

			var headers={'Authorization':'Bearer '+token};
			
			options.headers = headers;
			
			var params = {};
			params.attributes = '{"name":"'+options.fileName+'", "parent":{"id":"0"}}';
			
			options.params = params;
			console.dir(options);
			var ft = new FileTransfer();
			ft.upload(uri, encodeURI("https://upload.box.com/api/2.0/files/content"), win, fail, options);

			
			
		}, function(err) {
			console.log("Camera error", err);
		}, {
			quality:25,
			destinationType:Camera.DestinationType.FILE_URI,
			sourceType:Camera.PictureSourceType.PHOTOLIBRARY
		});
		
	}
})

