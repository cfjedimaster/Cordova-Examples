angular.module('app.services', [])

.factory('FilmService', ['$http','$q',function($http,$q){

	return {
		getFilms:function() {
			var deferred = $q.defer();
			
			$http.get("http://swapi.co/api/films").then(function(res) {
				//console.dir(res.data.results);
				var results = res.data.results.map(function(result) {
					result.id = result.url;
					return result;
				});
				deferred.resolve(results);
			});
			return deferred.promise;
		},
		getFilm:function(url) {
			var deferred = $q.defer();
			
			$http.get(url).then(function(res) {
				//console.dir(res.data);
				deferred.resolve(res.data);
			});

			return deferred.promise;
			
		}	
	};

}]);

