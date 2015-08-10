var images = [];
var $imagesDiv;

document.addEventListener("deviceready", init, false);
function init() {
	
	$("#addPicture").on("touchend", selPic);
	$imagesDiv = $("#images");	
	$("#uploadPictures").on("touchend", uploadPics);
}

function selPic() {
	navigator.camera.getPicture(function(f) {
		var newHtml = "<img src='"+f+"'>";
		$imagesDiv.append(newHtml);
		images.push(f);
		if(images.length === 1) {
			$("#uploadPictures").removeAttr("disabled");
		}
	}, function(e) {
		alert("Error, check console.");
		console.dir(e);
	}, { 
		quality: 50,
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		destinationType: Camera.DestinationType.FILE_URI
	});
	
}

function uploadPics() {
	console.log("Ok, going to upload "+images.length+" images.");
	var defs = [];

	images.forEach(function(i) {
		console.log('processing '+i);
		var def = $.Deferred();

		function win(r) {
			console.log("thing done");
			if($.trim(r.response) === "0") {
				console.log("this one failed");
				def.resolve(0);
			} else {
				console.log("this one passed");
				def.resolve(1);
			}
		}

		function fail(error) {
		    console.log("upload error source " + error.source);
		    console.log("upload error target " + error.target);
			def.resolve(0);
		}

		var uri = encodeURI("http://localhost/testingzone/test.cfm");

		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=i.substr(i.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		var ft = new FileTransfer();
		ft.upload(i, uri, win, fail, options);
		defs.push(def.promise());
		
	});

	$.when.apply($, defs).then(function() {
		console.log("all things done");
		console.dir(arguments);
	});

}