angular.module('app.services', [])

.factory('FilmService', ['$q',function($q){

	return {
		getFilms:function() {
			var deferred = $q.defer();
			
			//temp 
			var films = [
				{
					id:1,
					title:"A New Hope",
					crawl:"ANH crawl"
				},
				{
					id:2,
					title:"The Empire Strikes Back",
					crawl:"ESB crawl"
				},
				{
					id:3,
					title:"Return of the Jedi",
					crawl:"ROTJ crawl"
				}
			];
				
			deferred.resolve(films);
			return deferred.promise;
		},
		getFilm:function(id) {
			var deferred = $q.defer();
			
			//temp
			var film = {
				id:id,
				title:"Film "+id,
				crawl:"Crawl for "+id
			};

			deferred.resolve(film);
			return deferred.promise;
			
			
			
		}	
	};

}]);

