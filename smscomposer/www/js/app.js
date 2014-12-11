document.addEventListener("deviceready", init, false);
function init() {

	document.querySelector("#sendMessage").addEventListener("touchend", function() {
		console.log("click");
		var number = document.querySelector("#number").value;
		var message = document.querySelector("#message").value;
		console.log("going to send "+message+" to "+number);

		//simple validation for now
		if(number === '' || message === '') return;

		var msg = {
			phoneNumber:number,
			textMessage:message
		};

		sms.sendMessage(msg, function(message) {
			console.log("success: " + message);
			navigator.notification.alert(
			    'Message to ' + number + ' has been sent.',
			    null,
			    'Message Sent',
			    'Done'
			);

		}, function(error) {
			console.log("error: " + error.code + " " + error.message);
			navigator.notification.alert(
				'Sorry, message not sent: ' + error.message,
				null,
				'Error',
				'Done'
			);
		});

	}, false);

}