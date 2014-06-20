Media Example
===

This is a simple example of using the [Media plugin](https://github.com/apache/cordova-plugin-media/blob/master/doc/index.md) to play an MP3 file located in the application. This application requires the Media and Device plugin to work properly.

	cordova plugin add org.apache.cordova.media
	cordova plugin add org.apache.cordova.device
  
When the application launches, it presents one button. Clicking the button simply plays the MP3. Make note of how Android requires a slightly different path in order to play local files. The helper function, getMediaURL, uses the Device plugin to sniff for and detect Android.
