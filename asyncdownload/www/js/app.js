var globals = {};
globals.checkedServer = false;
globals.assetServer = "http://192.168.1.67/assets.json";
globals.assetSubDir = "assets";

document.addEventListener("deviceready", init, false);
function init() {
	
	$(document).on("pageshow", "#downloadPage", function(e) {
	
		console.log("page show for downloads");
		
		//get the current list of assets
		var assetReader = getAssets();
		assetReader.done(function(results) {
			console.log("promise done", results);
			if(results.length === 0) {
				$("#assetDiv").html("<p>Sorry, but no assets are currently available.</p>");	
			} else {
				var list = "<ul data-role='listview' data-inset='true' id='assetList'>";
				for(var i=0, len=results.length; i<len; i++) {
					list += "<li data-url='"+results[i].toURL()+"'>"+results[i].name+"</li>";	
				}
				list += "</ul>";
				console.log(list);
				$("#assetDiv").html(list);
				$("#assetList").listview();
				
			}
			
			if(!globals.checkedServer) {
				$.get(globals.assetServer).done(function(res) {
					/*
					Each asset is a URL for an asset. We check the filename
					of each to see if it exists in our current list of assets					
					*/
					console.log("server assets", res);
					for(var i=0, len=res.length; i<len; i++) {
						var file = res[i].split("/").pop();
						var haveIt = false;

						for(var k=0; k<globals.assets.length; k++) {
							if(globals.assets[k].name === file) {
								console.log("we already have file "+file);
								haveIt = true;
								break;
							}
						}
						
						if(!haveIt) fetch(res[i]);
						
					}
				});
			}
		});
		
		//click handler for list items
		$(document).on("touchend", "#assetList li", function() {
			var loc = $(this).data("url");
			console.dir(loc);
			$("#assetImage").attr("src", loc);
			$("#popupImage").popup("open");
		});
		
	});
	
}

function fsError(e) {
	//Something went wrong with the file system. Keep it simple for the end user.
	console.log("FS Error", e);
	navigator.notification.alert("Sorry, an error was thrown.", null,"Error");
}

/*
I will access the device file system to see what assets we have already. I also take care of, 
once per operation, hitting the server to see if we have new assets.
*/
function getAssets() {
	var def = $.Deferred();

	if(globals.assets) {
		console.log("returning cached assets");
		def.resolve(globals.assets);
		return def.promise();
	}
	
	var dirEntry = window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		//now we have the data dir, get our asset dir
		console.log("got main dir",dir);
		dir.getDirectory(globals.assetSubDir+"/", {create:true}, function(aDir) {
			console.log("ok, got assets", aDir);	
			
			var reader = aDir.createReader();
			reader.readEntries(function(results) {
				console.log("in read entries result", results);
				globals.assets = results;
				def.resolve(results);
			});
			
			//we need access to this directory later, so copy it to globals
			globals.assetDirectory = aDir;
			
		}, fsError);
		
	}, fsError);
	
	return def.promise();
}

function fetch(url) {
	console.log("fetch url",url);
	var localFileName = url.split("/").pop();
	var localFileURL = globals.assetDirectory.toURL() + localFileName;
	console.log("fetch to "+localFileURL);
	
	var ft = new FileTransfer();
	ft.download(url, localFileURL, 
		function(entry) {
			console.log("I finished it");
			globals.assets.push(entry);
		},
		fsError); 
				
}