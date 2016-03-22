document.addEventListener('deviceready', init, false);

function init() {
	console.log('deviceready did fire');
	
	setupBattery();	
	setupCamera();
	setupDevice();
	setupAcc();
	setupOr();
	setupGlob();
	setupIAB();
	setupMedia();
	setupNetwork();
}

function setupBattery() {
		
	window.addEventListener("batterystatus", function(info) {
		console.log("[batterystatus event] Level: " + info.level + " isPlugged: " + info.isPlugged);
	}, false);
	
	window.addEventListener("batterylow", function(info) {
		console.log("[batterylow event] Level: " + info.level);
	}, false);

}

function setupCamera() {
	
	var renderPic = function(data) {
		var image = document.getElementById('myImage');
		image.src = "data:image/jpeg;base64," + data;		
	};
	
	var cameraError = function(err) {
		console.log('[camera error]',err);	
	};
	
	document.querySelector('#testCameraExisting').addEventListener('click', function() {
		
		navigator.camera.getPicture(renderPic, cameraError, {
			sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType:Camera.DestinationType.DATA_URL
		});
		
	});

	document.querySelector('#testCameraNew').addEventListener('click', function() {
		
		navigator.camera.getPicture(renderPic, cameraError, {
			sourceType:Camera.PictureSourceType.CAMERA,
			destinationType:Camera.DestinationType.DATA_URL
		});
		
	});

}

function setupDevice() {

	document.querySelector('#testDevice').addEventListener('click', function() {
		console.log('[device]',device);
	});
	
}

function setupAcc() {
	
	var watchId;
	
	var renderAcc = function(data) {
		console.log('[acceleration]' + JSON.stringify(data));
	};
	
	var accError = function(err) {
		console.log('[acceleration error]',err);	
	};
	
	document.querySelector('#testAcc').addEventListener('click', function() {
		
		navigator.accelerometer.getCurrentAcceleration(renderAcc,accError);
		
	});

	document.querySelector('#testAccWatch').addEventListener('click', function() {
		console.log('[acceleration] begin watch');
		watchId = navigator.accelerometer.watchAcceleration(renderAcc,accError,
		{frequency:1000});
		
	});

	document.querySelector('#testAccStop').addEventListener('click', function() {
		console.log('[acceleration] clear watch');		
		navigator.accelerometer.clearWatch(watchId);
		
	});

}

function setupOr() {
	
	var watchId;
	
	var renderOr = function(data) {
		console.log('[orientation]' + JSON.stringify(data));
	};
	
	var orError = function(err) {
		console.log('[orientation error]',err);	
	};
	
	document.querySelector('#testOr').addEventListener('click', function() {
		
		navigator.compass.getCurrentHeading(renderOr,orError);
		
	});

	document.querySelector('#testOrWatch').addEventListener('click', function() {
		console.log('[orientation] begin watch');
		watchId = navigator.compass.watchHeading(renderOr,orError,
		{frequency:1000});
		
	});

	document.querySelector('#testOrStop').addEventListener('click', function() {
		console.log('[orientation] clear watch');		
		navigator.compass.clearWatch(watchId);
		
	});

}

function setupGlob() {
	
	var globError = function(err) {
		console.log('[globalization error]',err);	
	};
	
	document.querySelector('#testGlob').addEventListener('click', function() {
		
		navigator.globalization.getPreferredLanguage(function(lang) {
			console.log('[globalization] preferredLanguage: '+JSON.stringify(lang));
		});

		navigator.globalization.getLocaleName(function(locale) {
			console.log('[globalization] localeName: '+JSON.stringify(locale));
		});

		navigator.globalization.getDateNames(function(names) {
			console.log('[globalization] getDateNames:months: '+JSON.stringify(names));
		},globError, {type:'wide', item:'months'});

		navigator.globalization.getDateNames(function(names) {
			console.log('[globalization] getDateNames:days: '+JSON.stringify(names));
		},globError, {type:'wide', item:'days'});
		
	});

	document.querySelector('#testGlobInput').addEventListener('click', function() {
		var input = document.querySelector('#numberGlob').value;
		console.log('[globalization] initial input to format: '+input);
		navigator.globalization.numberToString(
			Number(input),
			function (number) {
				console.log('[globalization] formatted number: '+number.value);
			},
			globError,
			{type:'percent'}
		);
	});
	
}


function setupIAB() {

	var iabRef;
	
	document.querySelector('#testIAB').addEventListener('click', function() {
		iabRef = cordova.InAppBrowser.open('http://www.raymondcamden.com','_blank','location=yes');
	});
	
}

function setupMedia() {

	/*
	mp3 source: 
	http://www.gutenberg.org/ebooks/10246
	Sensation Jazz: One-Step by All-Star Trio
	*/
	var mp3 = './10246-m-001.mp3';
	var media;
	
	document.querySelector('#testMedia').addEventListener('click', function() {
		media = new Media(mp3, function() {
			console.log('[media] Success');
		}, function(err) {
			console.log('[media error]', err);	
		}, function(s) {
			/*
			Media.MEDIA_NONE = 0;
			Media.MEDIA_STARTING = 1;
			Media.MEDIA_RUNNING = 2;
			Media.MEDIA_PAUSED = 3;
			Media.MEDIA_STOPPED = 4;
			*/
			console.log('[media status]', s);		
		});
		
		setTimeout(function() {
			console.log('[media] Duration is '+media.getDuration());
		},100);

		media.play();

	});

	document.querySelector('#testMediaStop').addEventListener('click', function() {
		media.stop();
	});
}

function setupNetwork() {

	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.CELL]     = 'Cell generic connection';
	states[Connection.NONE]     = 'No network connection';


	document.querySelector('#testNetwork').addEventListener('click', function() {

		console.log('[networtk] Connection type: ' + states[navigator.connection.type]);
	
	});

}