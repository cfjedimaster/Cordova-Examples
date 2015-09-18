angular.module('starter.services', [])

.factory('Events', function($q,$cordovaCalendar) {

	//kind of a hack
	var incrementDate = function (date, amount) {
		var tmpDate = new Date(date);
		tmpDate.setDate(tmpDate.getDate() + amount);
		tmpDate.setHours(13);
		tmpDate.setMinutes(0);
		tmpDate.setSeconds(0);
		tmpDate.setMilliseconds(0);
		return tmpDate;
	};
	
	var incrementHour = function(date, amount) {
		var tmpDate = new Date(date);
		tmpDate.setHours(tmpDate.getHours() + amount);
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
  	
			/*
			Logic is:
			For each, see if it exists an event.
			*/
			var promises = [];
			fakeEvents.forEach(function(ev) {
				//add enddate as 1 hour plus
				ev.enddate = incrementHour(ev.date, 1);
				console.log('try to find '+JSON.stringify(ev));
				promises.push($cordovaCalendar.findEvent({
					title:ev.title,
					startDate:ev.date
				}));
			});
			
			$q.all(promises).then(function(results) {
				console.log("in the all done");	
				//should be the same len as events
				for(var i=0;i<results.length;i++) {
					fakeEvents[i].status = results[i].length === 1;
				}
				deferred.resolve(fakeEvents);
			});
			
			return deferred.promise;
	}
	
	var addEvent = function(event) {
		var deferred = $q.defer();

		$cordovaCalendar.createEvent({
			title: event.title,
			notes: event.description,
			startDate: event.date,
			endDate:event.enddate
		}).then(function (result) {
			console.log('success');console.dir(result);
			deferred.resolve(1);
		}, function (err) {
			console.log('error');console.dir(err);
			deferred.resolve(0);
		});	
		
		return deferred.promise;

	}
	
	return {
		get:getEvents,
		add:addEvent
	};

});
