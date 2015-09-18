angular.module('starter.services', [])

.factory('Events', function($q,$cordovaCalendar) {

	var incrementDate = function (date, amount) {
			var tmpDate = new Date(date);
			tmpDate.setDate(tmpDate.getDate() + amount);
			tmpDate.setHours(13);
			tmpDate.setMinutes(0);
			tmpDate.setSeconds(0);
			tmpDate.setMilliseconds(0);
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

$cordovaCalendar.findAllEventsInNamedCalendar("Calendar").then(function (result) {
	  console.log("events??");
	  console.dir(result);
    // success
  }, function (err) {
	  console.log("error",err);
    // error
  });		
  	
			/*
			Logic is:
			For each, see if it exists an event.
			*/
			var promises = [];
			fakeEvents.forEach(function(ev) {
				console.log('try to find '+JSON.stringify(ev));
				promises.push($cordovaCalendar.findEvent({
					title:ev.title,
					startDate:new Date(2015, 8, 18, 18, 0, 0, 0, 0)
				}));
			});
			
			$q.all(promises).then(function(results) {
				console.log("in the all done");	
				//should be the same len as events
				for(var i=0;i<results.length;i++) {
					fakeEvents[i].status = results[0];
				}
				deferred.resolve(fakeEvents);
				console.dir(arguments);			
			});
			
			return deferred.promise;
	}
	
  return {
		get:getEvents
  };

});
