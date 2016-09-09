document.addEventListener('deviceready', init, false);
var media;
var isAndroid = false;

function init() {
	console.log('init');
	if(device.platform.toLowerCase() === "android") isAndroid = true;

	media = new Media(getMediaURL('arcade1.mp3'), null, mediaError, mediaStatus);
	media.play({numberOfLoops:9999});
}

function getMediaURL(s) {
    if(isAndroid) return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
	console.log('mediaError', e);
}

function mediaStatus(status) {
	if(isAndroid && status === Media.MEDIA_STOPPED) {
		media.seekTo(0);
		media.play();
	}
}