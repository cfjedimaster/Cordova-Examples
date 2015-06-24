var wlInitOptions = {
  showIOS7StatusBar : false,
  autoHideSplash: true,
};

if (window.addEventListener) {
	window.addEventListener('load', function() { WL.Client.init(wlInitOptions); }, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() { WL.Client.init(wlInitOptions); });
}

function wlCommonInit(){

		angular.element(document).ready(function() {
			var env = WL.Client.getEnvironment();
			var platform;
			if(env === WL.Environment.PREVIEW){
				//running from preview
				if(window.cordova && navigator.device){
					//running on MBS
					platform = navigator.device.platform.toLowerCase();
				} else {
					//running on Browser
					platform = window.location.href;
				}
				if(platform.indexOf('android')>=0){
					document.body.classList.add('platform-android');
					if(ionic && ionic.Platform){
						ionic.Platform.setPlatform("android");
					}
				}else if (platform.indexOf('iphone')>=0 || platform.indexOf('ipad')>=0){
					document.body.classList.add('platform-ios');
					if(ionic && ionic.Platform){
						ionic.Platform.setPlatform("ios");
					}
				}else if (platform.indexOf('Win32NT')>=0 || platform.indexOf('windowsphone8')>=0){
					document.body.classList.add('windowsphone');
					if(ionic && ionic.Platform){
						ionic.Platform.setPlatform("windowsphone");
					}
				}
			}
			//after setting the classes on the body and setting the platform
			//bootstrap the angular app module which depends on ionic module

			WL.Client.connect({
				onSuccess:function() {
					console.log("Connected to MFP");
				    angular.bootstrap(document.body, ['starter']);
				}, 
				onFailure:function(f) {
					console.log("Failed to connect to MFP, not sure what to do now.", f);	
				}
			});

   });
}