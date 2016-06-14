(function() {
/* global angular,window,cordova,console */

	angular.module('rssappServices', [])
	.factory('rssService', function($http,$q) {
		
		var entries;

		return {

			getEntries: function(url) {
				var deferred = $q.defer();
				console.log('getEntries for '+url);
				if(entries) {
					console.log('from cache');
					deferred.resolve(entries);
				} else {
					var pipeUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from rss where url="'+url+'"')+ '&format=json';

					$http.get(pipeUrl).then(function(results) {
						entries = results.data.query.results.item;
						console.dir(entries);
						deferred.resolve(entries);
					});
				}
				return deferred.promise;
			}

		};
	});

}());
