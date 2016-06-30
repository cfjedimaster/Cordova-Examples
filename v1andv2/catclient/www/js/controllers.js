angular.module('appControllers', [])

.controller('HomeCtrl', ['$scope', 'CatService', function($scope, catService) {

	catService.getCats().success(function(cats) {
		$scope.cats = cats;
	});

}])

.controller('CatCtrl', ['$scope', '$stateParams', 'CatService', function($scope, $stateParams, catService) {

	catService.getCat($stateParams.catid).success(function(cat) {
		$scope.cat = cat;
	});

}]);
