angular.module('appServices', [])
.factory('CatService', function($http,$q) {

	return {
		getCat:function(id) {
			return $http.get('http://localhost:3000/api/cats/'+id);
		},
		getCats:function() {
			return $http.get('http://localhost:3000/api/cats?filter[fields][color]=false&filter[fields][age]=false&filter[fields][friendly]=false');
		}
	};

});
