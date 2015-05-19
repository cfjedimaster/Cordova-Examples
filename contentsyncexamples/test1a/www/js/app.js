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
	
	var sync = ContentSync.sync({ src: imageZip, id: 'kittenZip', type:"local" });
	
	sync.on('progress', function(data) {
		imageDiv.innerHTML = "<p>Syncing images: "+data.progress + "%</p>";
	});
	
	sync.on('complete', function(data) {
		console.dir(data);
		var s = "<p>";
		for(x=1;x<=7;x++) {
			var imageUrl = "file://" + data.localPath + "/kitten"+x+".jpg";
			s += "<img src='"+imageUrl+"'><br/>";
		}
		imageDiv.innerHTML = s;
		
	});
	
	sync.on('error', function(e) {
		console.log('Error: ', e.message);
	    // e.message
	});
	
	sync.on('cancel', function() {
	    // triggered if event is cancelled
	});	
}