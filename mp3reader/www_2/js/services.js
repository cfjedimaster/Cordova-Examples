angular.module('starter.services', [])

.factory('MP3Service', function($q,$cordovaFile) {
	
	//root of where my stuff is
	console.log('running service');
	var items = [];

	function getAll() {
		var rootFolder = cordova.file.applicationDirectory;
		var mp3Loc = 'music/';
		//where the music is
		var mp3Folder = rootFolder + 'www/' + mp3Loc;
		console.log(mp3Folder);

		var deferred = $q.defer();

		window.resolveLocalFileSystemURL(mp3Folder, function(dir) {
			var reader = dir.createReader();
			//read it
			reader.readEntries(function(entries) {
					console.log("readEntries");
					console.dir(entries);

					var data = [];

					var process = function(index, cb) {
						var entry = entries[index];
						var name = entry.name;
						entry.file(function(file) {

							ID3.loadTags(entry.name,function() {
								var tags = ID3.getAllTags(name);
								//default to filename
								var title = entry.name;
								if(tags.title) title = tags.title;
								//for now - not optimal to include music here, will change later
								data.push({name:title, tags:tags, url:mp3Loc+entry.name});
								if(index+1 < entries.length) {
									process(++index, cb);
								} else {
									cb(data);
								}
							},{
								dataReader:FileAPIReader(file)
							});

						});

					};

					process(0, function(data) {
						console.log("Done processing");
						console.dir(data);
						items = data;
						deferred.resolve(items);
					});


			});

		}, function(err) {
			deferred.reject(err);
		});


		return deferred.promise;
		
	}

	function getOne(id) {
		var deferred = $q.defer();
		deferred.resolve(items[id]);

		return deferred.promise;
	}

	var media;
	function play(l) {
		if(media) { media.stop(); media.release(); }
		media = new Media(l,function() {}, function(err) { console.dir(err);});
		media.play();
	}
	
	return {
		getAll:getAll,
		getOne:getOne,
		play:play
	};
  
});
