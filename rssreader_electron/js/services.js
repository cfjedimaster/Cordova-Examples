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
					google.load("feeds", "1",{callback:function() {
						console.log('googles init called');
						var feed = new google.feeds.Feed(url);

						feed.setNumEntries(10);
						feed.load(function(result) {
							entries = result.feed.entries;
							deferred.resolve(entries);
						});


					}});

				}
				return deferred.promise;
			}

		};
	});

}());
