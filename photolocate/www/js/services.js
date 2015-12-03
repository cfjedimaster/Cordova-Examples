angular.module('starter.services', [])

.factory('Foursquare', function($http) {

	var CLIENT_ID = 'mahsecretismahsecret';
	var CLIENT_SECRET = 'soylentgreenispeople';
	
	function whatsAt(long,lat) {
		return $http.get('https://api.foursquare.com/v2/venues/search?ll='+lat+','+long+'&intent=browse&radius=30&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20151201');		
	}

	return {
		whatsAt:whatsAt
	};
})
.factory('Geocode', function($http) {
	var KEY = 'google should let me geocode for free';
	
	function lookup(long,lat) {
		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key='+KEY);
	}
	
	return {
		lookup:lookup	
	};

})
.factory('Location', function($q,Foursquare,Geocode) {
	
	function getInfo(long,lat) {
		console.log('ok, in getInfo with '+long+','+lat);
		var deferred = $q.defer();
		Foursquare.whatsAt(long,lat).then(function(result) {
			//console.log('back from fq with '+JSON.stringify(result));
			if(result.status === 200 && result.data.response.venues.length >= 1) {
				var bestMatch = result.data.response.venues[0];
				//convert the result to something the caller can use consistently
				var result = {
					type:"foursquare",
					name:bestMatch.name,
					address:bestMatch.location.formattedAddress.join(", ")
				}
				console.dir(bestMatch);
				deferred.resolve(result);
			} else {
				//ok, time to try google
				Geocode.lookup(long,lat).then(function(result) {
					console.log('back from google with ');
					if(result.data && result.data.results && result.data.results.length >= 1) {
						console.log('did i come in here?');
						var bestMatch = result.data.results[0];
						console.log(JSON.stringify(bestMatch));	
						var result = {
							type:"geocode",
							address:bestMatch.formatted_address	
						}
						deferred.resolve(result);
					}
				});	
			}
		});
		
		return deferred.promise;	
	}
	return {
		getInfo:getInfo	
	};
	
});
