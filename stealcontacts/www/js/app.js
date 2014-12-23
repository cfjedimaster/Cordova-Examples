document.addEventListener("deviceready", init, false);
function init() {

	navigator.contacts.find(
		[navigator.contacts.fieldType.displayName],
		gotContacts,
		errorHandler);

}

function errorHandler(e) {
	console.log("errorHandler: "+e);
}

function gotContacts(c) {
	console.log("gotContacts, number of results "+c.length);
	picDiv = document.querySelector("#pictures");
	for(var i=0, len=c.length; i<len; i++) {
		console.dir(c[i]);
		if(c[i].photos && c[i].photos.length > 0) {
			picDiv.innerHTML += "<img src='"+c[i].photos[0].value+"'>";
		}
	}
}