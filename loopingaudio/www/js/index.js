document.addEventListener('deviceready', init, false);
var media;

function init() {
	console.log('init');
	media = new Media(getMediaURL('arcade1.mp3'), null, mediaError, mediaStatus);
	media.play();
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
	console.log('mediaError', e);
}

function mediaStatus(status) {
	if(status === Media.MEDIA_STOPPED) {
		media.seekTo(0);
		media.play();
	}
	console.log('status', JSON.stringify(arguments));
}