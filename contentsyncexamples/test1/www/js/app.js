//where to put our crap
var imageDiv;
//zip asset
var imageZip = "http://static.raymondcamden.com/kittens.zip";

document.addEventListener("deviceready", init, false);
function init() {
	startSync();
}

function startSync() {
	imageDiv = document.querySelector("#images");
	
	var sync = ContentSync.sync({ src: imageZip, id: 'kittenZip' });
	
	sync.on('progress', function(data) {
		imageDiv.innerHTML = "<p>Syncing images: "+data.progress + "%</p>";
	});
	
	sync.on('complete', function(data) {
		console.log(data.localPath);
		var s = "<p>";
		for(x=1;x<=7;x++) {
			var imageUrl = "file://" + data.localPath + "/kitten"+x+".jpg";
			s += "<img src='"+imageUrl+"'><br/>";
		}
		imageDiv.innerHTML = s;

			/*
			window.requestFileSystem(PERSISTENT, 1024 * 1024, function(fs) {
				
				window.resolveLocalFileSystemURL("file://" + data.localPath, function(g) {
					console.log("good");
					console.dir(g);
					//ok so G is a directory ob
					var dirReader = g.createReader();
					dirReader.readEntries (function(results) {
						console.log('readEntries');
						console.dir(results);
					});
					
				}, function(e) {
					console.log("bad");
					console.dir(e);
				})
				
				
			});
			*/
		
	});
	
	sync.on('error', function(e) {
		console.log('Error: ', e.message);
	    // e.message
	});
	
	sync.on('cancel', function() {
	    // triggered if event is cancelled
	});	
}