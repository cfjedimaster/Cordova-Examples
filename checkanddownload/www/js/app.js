document.addEventListener("deviceready", init, false);

//Will be a directory entry object for our data store
var storeOb;

//Used for status updates
var $status;

//URL of our asset
var assetURL = "https://raw.githubusercontent.com/cfjedimaster/Cordova-Examples/master/readme.md";

//File name of our important data file we didn't ship with the app
var fileName = "data.txt";

function init() {
	
	$status = document.querySelector("#status");

	$status.innerHTML = "Checking for data file.";

	//The directory to store data
	var store = cordova.file.applicationStorageDirectory;

	//The Object version - no error handler because this must work
	window.resolveLocalFileSystemURL(store, function(ob) {

		storeOb = ob;

		//Let's check the directory to see if our file exists
		storeOb.getFile(fileName, {create:false}, function(f) {
			console.log('yes, the file existed');
			appStart();
		}, function(e) {
			console.log('file did not exist');
			$status.innerHTML = "We need to download the file.";
			downloadAsset();
		});


	});

}

function downloadAsset() {
	var fileTransfer = new FileTransfer();
	console.log("About to start transfer");
	console.log("dest: "+storeOb.fullPath + fileName);
	console.log("dest: "+storeOb.toInternalURL() + fileName);
	fileTransfer.download(assetURL, storeOb.toInternalURL() + fileName, 
		function(entry) {
			console.log("Success!");
			appStart();
		}, 
		function(err) {
			console.log("Error");
			console.dir(err);
		});
}

//I'm only called when the file exists or has been downloaded.
function appStart() {
	$status.innerHTML = "App ready!";
}