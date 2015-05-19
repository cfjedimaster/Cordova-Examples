//where to put our crap
var $imageDiv;
//zip asset
var imageZip = "http://static.raymondcamden.com/kittens.zip";

document.addEventListener("deviceready", init, false);
function init() {
	//determine the lastmod for the res

	$imageDiv = $("#images");

	$.ajax({
		url:imageZip,
		method:"HEAD"
	}).done(function(res,text,jqXHR) {
		var lastMod = jqXHR.getResponseHeader('Last-Modified');
		console.log(lastMod);
		if(!localStorage.kittenLastMod || localStorage.kittenLastMod != lastMod) {
			console.log('need to sync')
			startSync();
			localStorage.kittenLastMod = lastMod;
		} else {
			console.log('NO need to sync');
			displayImages();
		}
	});
	
}

function displayImages() {
	var s = "<p>";
	for(x=1;x<=7;x++) {
		var imageUrl = "file://" + localStorage.kittenLocalPath + "/kitten"+x+".jpg";
		s += "<img src='"+imageUrl+"'><br/>";
	}
	$imageDiv.html(s);
}

function startSync() {
	
	var sync = ContentSync.sync({ src: imageZip, id: 'kittenZip' });
	
	sync.on('progress', function(data) {
		$imageDiv.html("<p>Syncing images: "+data.progress + "%</p>");
	});
	
	sync.on('complete', function(data) {
		//store localPath 
		localStorage.kittenLocalPath = data.localPath;
		displayImages();
	});
	
	sync.on('error', function(e) {
		console.log('Error: ', e.message);
	    // e.message
	});
	
	sync.on('cancel', function() {
	    // triggered if event is cancelled
	});	
}