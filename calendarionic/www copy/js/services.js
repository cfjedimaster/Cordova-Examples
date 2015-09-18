angular.module('starter.services', [])

.factory('Events', function($q) {

	var incrementDate = function (date, amount) {
			var tmpDate = new Date(date);
			tmpDate.setDate(tmpDate.getDate() + amount)
			return tmpDate;
	};

	//create fake events, but make it dynamic so they are in the next week
	var fakeEvents = [];
	fakeEvents.push(
		{
			"title":"Meetup on Ionic",
			"description":"We'll talk about beer, not Ionic.",
			"date":incrementDate(new Date(), 1)
		}	
	);
	fakeEvents.push(
		{
			"title":"Meetup on Beer",
			"description":"We'll talk about Ionic, not Beer.",
			"date":incrementDate(new Date(), 2)
		}	
	);
	fakeEvents.push(
		{
			"title":"Ray's Birthday Bash",
			"description":"Celebrate the awesomeness of Ray",
			"date":incrementDate(new Date(), 4)
		}	
	);
	fakeEvents.push(
		{
			"title":"Code Review",
			"description":"Let's tear apart Ray's code.",
			"date":incrementDate(new Date(), 5)
		}	
	);
	
	var getEvents = function() {
			var deferred = $q.defer();
			deferred.resolve(fakeEvents);
			return deferred.promise;
	}
	
  return {
		get:getEvents
  };

});
