angular.module('mysoundboard.controllers', [])

.controller('HomeCtrl', function($scope, Sounds, $ionicPlatform) {
  	
	var getSounds = function() {
		console.log('getSounds called');
		Sounds.get().then(function(sounds) {
			console.dir(sounds);
			$scope.sounds = sounds;
		});
	}

	$scope.$on('$ionicView.enter', function(){
		console.log('enter');
		getSounds();
	});
	
	$scope.play = function(x) {
		console.log('play', x);
		Sounds.play(x);	
	}
	
	$scope.delete = function(x) {
		console.log('delete', x);
		Sounds.get().then(function(sounds) {
			var toDie = sounds[x];
			window.resolveLocalFileSystemURL(toDie.file, function(fe) {
				fe.remove(function() {
					Sounds.delete(x).then(function() {
						getSounds();
					});
				}, function(err) {
					console.log("err cleaning up file", err);
				});
			});
		});
	}
	
	$scope.cordova = {loaded:false};
	$ionicPlatform.ready(function() {
		$scope.$apply(function() {
			$scope.cordova.loaded = true;
		});
	});
		 
})
.controller('RecordCtrl', function($scope, Sounds, $state, $ionicHistory) {
  
	$scope.sound = {name:""};
	
	$scope.saveSound = function() {
		console.log('trying to save '+$scope.sound.name);

		//Simple error checking
		if($scope.sound.name === "") {
			navigator.notification.alert("Name this sound first.", null, "Error");
			return;			
		}
		
		if(!$scope.sound.file) {
			navigator.notification.alert("Record a sound first.", null, "Error");
			return;			
		}
		
		/*
		begin the copy to persist location
		
		first, this path below is persistent on both ios and and
		*/
		var loc = cordova.file.dataDirectory;
		/*
		but now we have an issue with file name. so let's use the existing extension, 
		but a unique filename based on seconds since epoch
		*/
		var extension = $scope.sound.file.split(".").pop();
		var filepart = Date.now();
		var filename = filepart + "." + extension;
		console.log("new filename is "+filename);

		window.resolveLocalFileSystemURL(loc, function(d) {
			window.resolveLocalFileSystemURL($scope.sound.file, function(fe) {
				fe.copyTo(d, filename, function(e) {
					console.log('success inc opy');
					console.dir(e);
					$scope.sound.file = e.nativeURL;
					$scope.sound.path = e.fullPath;

					Sounds.save($scope.sound).then(function() {
						$ionicHistory.nextViewOptions({
						    disableBack: true
						});
						$state.go("home");
					});
					
				}, function(e) {
					console.log('error in coipy');console.dir(e);
				});					
			}, function(e) {
				console.log("error in inner bullcrap");
				console.dir(e);
			});
			
			
		}, function(e) {
			console.log('error in fs');console.dir(e);
		});

		
	}

	var captureError = function(e) {
		console.log('captureError' ,e);
	}
	
	var captureSuccess = function(e) {
		console.log('captureSuccess');console.dir(e);
		$scope.sound.file = e[0].localURL;
		$scope.sound.filePath = e[0].fullPath;
	}
	
	$scope.record = function() {
		navigator.device.capture.captureAudio(
    		captureSuccess,captureError,{duration:10});
	}
	
	$scope.play = function() {
		if(!$scope.sound.file) {
			navigator.notification.alert("Record a sound first.", null, "Error");
			return;
		}
		var media = new Media($scope.sound.file, function(e) {
			media.release();
		}, function(err) {
			console.log("media err", err);
		});
		media.play();
	}
});
