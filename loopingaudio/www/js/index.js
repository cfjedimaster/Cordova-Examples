document.addEventListener('deviceready', init, false);
var media;

function init() {
	console.log('init');
	media = new Media('arcade1.mp3', mediaSuccess, mediaError, mediaStatus);
	media.play();
}

function mediaError(e) {
	console.log('mediaError', e);
}

function mediaStatus(status) {
	if(status === 4) {
		media.seekTo(0);
		media.play();
	}
	console.log('status', JSON.stringify(arguments));
}