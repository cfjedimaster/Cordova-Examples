angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope,Location) {
	
	$scope.img = {url:""};
	$scope.status = {text:""};
	
	$scope.selectPicture = function() {
		navigator.camera.getPicture(gotPic, errHandler, {
			sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType:Camera.DestinationType.NATIVE_URI
		});
	};
	
	var errHandler = function(e) {
		alert('Error with Camera: '+e);	
	};
	
	//utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
	var convertDegToDec = function(arr) {
		return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
	};
	
	var gotPic = function(u) {
		console.log('Got image '+u);
		$scope.img.url = u;
		//scope.apply can KMA
		$scope.$apply();
		
	};

	var img = document.querySelector("#selImage");	

	img.addEventListener("load", function() {
		console.log("load event for image "+(new Date()));
		$scope.status.text = "Loading EXIF data for image.";
		EXIF.getData(document.querySelector("#selImage"), function() {
			console.log("in exif");
			
			//console.dir(EXIF.getAllTags(img));
			var long = EXIF.getTag(img,"GPSLongitude");
			var lat = EXIF.getTag(img,"GPSLatitude");
			if(!long || !lat) {
				$scope.status.text = "Unfortunately, I can't find GPS info for the picture";
				return;	
			}
			long = convertDegToDec(long);
			lat = convertDegToDec(lat);
			//handle W/S
			if(EXIF.getTag(this,"GPSLongitudeRef") === "W") long = -1 * long;
			if(EXIF.getTag(this,"GPSLatitudeRef") === "S") lat = -1 * lat;
			console.log(long,lat);
			locateAddress(long,lat);
		});			
	}, false);
			
	/*
	Given a long lat, first I try to Foursquare it, then geocode, then just print it with a map.
	*/
	var locateAddress = function(long,lat) {

		$scope.status.text = "Trying to locate the photo.";

		Location.getInfo(long, lat).then(function(result) {
			console.log('Result was '+JSON.stringify(result));
			if(result.type === 'foursquare') {
				$scope.status.text = 'Your photo was taken at ' + result.name + ' located at ' + result.address;
			} else if (result.type === 'geocode') {
				$scope.status.text = 'Your photo appears to have been taken at ' + result.address;
			} else {
				var map = 'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+long+'zoom=13&size=300x300&maptype=roadmap&markers=color:blue%7Clabel:X%7C'+lat+','+long;
				$scope.status.text = 'Sorry, I\'ve got nothing. But here is a map!<br><img class="map" src="' + map + '">';	
			}
		});
	};
	
});
