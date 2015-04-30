document.addEventListener("deviceready", init, false);

//A hard coded folder, to keep things simple
var mp3Folder = "Music/Depeche_Mode/101_(1_of_2)/";
var result;

function init() {

	result = document.querySelector("#results");

	result.innerHTML = "Stand by, parsing MP3s...<br/>";

	window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + mp3Folder,
	function(dir) {
			var reader = dir.createReader();
			//read it
			reader.readEntries(function(entries) {
					console.log("readEntries");
					console.dir(entries);
					result.innerHTML += entries.length + " files to process.<br/>";

					var data = [];

					var process = function(index, cb) {
						console.log("doing index "+index);
						var entry = entries[index];
						var name = entry.name;
						entry.file(function(file) {

							ID3.loadTags(entry.name,function() {
								var tags = ID3.getAllTags(name);
								data.push({name:entry.name, tags:tags});
								console.log("got tags for "+entry.name, tags);
								result.innerHTML += "*";
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
						//make a simple str to show stuff
						var s = "";
						for(var i=0; i<data.length; i++) {
							s += "<p>";
							s += "<b>"+data[i].tags.title+"</b><br/>";
							s += "By "+data[i].tags.artist+"<br/>";
							s += "Album: "+data[i].tags.album+"<br/>";
							s += "</p>";
						}
						result.innerHTML = s;
					});

					/*
					entries.forEach(function(entry) {

						var name = entry.name;
						console.log(name);

						entry.file(function(file) {

							ID3.loadTags(name,function() {
								var tags = ID3.getAllTags(name);
								console.log("got tags for "+name, tags);
							},{
								dataReader:FileAPIReader(file)
							});

						});


					});
					*/

			});

	}, function(err) {

	});

}
