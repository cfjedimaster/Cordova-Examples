document.addEventListener("deviceready", init, false);
function init() {
	
	document.querySelector("#camButton").addEventListener("touchend", doCam, false);
}

function doCam() {
	console.dir(device);
	var sourceType = device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY:Camera.PictureSourceType.CAMERA;
	
	navigator.camera.getPicture(picDone, picFail, {
		sourceType: sourceType,
		destinationType:Camera.DestinationType.FILE_URI
	});	
}

function picDone(r) {
	document.querySelector("#img").src = r;
}

function picFail(e) {
	console.log("Failed with "+e);	
}