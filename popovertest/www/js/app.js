document.addEventListener("deviceready", init, false);
function init() {
	document.querySelector("#startCamera").addEventListener("touchend", startCamera, false);
}

var cameraPopoverHandle;

function startCamera() {

	cameraPopoverHandle = navigator.camera.getPicture(onSuccess, onFail,
     { destinationType: Camera.DestinationType.FILE_URI,
       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
       popoverOptions: new CameraPopoverOptions(300, 300, 200, 200, Camera.PopoverArrowDirection.ARROW_ANY)
     });

}

function onSuccess(u) {
	console.log('onSuccess');
	document.querySelector("#canvas").src = u;
}

function onFail(e) {
	console.log('onFail');
	console.dir(e);
}

 // Reposition the popover if the orientation changes.
 window.onorientationchange = function() {
 	console.log('running onorientationchange');
	var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
    cameraPopoverHandle.setPosition(cameraPopoverOptions);
 }