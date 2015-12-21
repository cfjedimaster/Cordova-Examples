angular.module('app.controllers', [])
  
.controller('starWarsFilmsCtrl', function($scope,FilmService) {
	$scope.films = [];
	
	FilmService.getFilms().then(function(res) {
		$scope.films = res;		
	});
	
})
   
.controller('filmTitleCtrl', function($scope,$stateParams,FilmService) {
	$scope.film = {};
	
	FilmService.getFilm($stateParams.id).then(function(res) {
		$scope.film = res;	
	});
	
})
 