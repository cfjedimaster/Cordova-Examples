// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope) {

	$scope.loginButton = {hidden:true};
	
	var user = Ionic.User.current();
	console.log('user currently: '+JSON.stringify(user));
	
	if (user.isAuthenticated()) {
		console.log('yes auth');
	} else {
		console.log('no auth');
		$scope.loginButton = {hidden:false};
	}

	var fakeDetails = {
		'email':'raymondcamden+test3@gmail.com',
		'password':'12345'
	};

	$scope.customRegistration= function() {
		//this will work one time
		
		Ionic.Auth.signup(fakeDetails).then(function(newUser) {
			console.log('signup worked ok, here is the new user '+JSON.stringify(newUser));
			//what's the user ob like now?
			user = Ionic.User.current();

			//are they logged on? the docs imply NO
			console.log('newly signed up user logged in?',user.isAuthenticated());	

		}, function(error) {
			console.log('signed failed with '+JSON.stringify(error));
		});
	};
	
	$scope.customLogin = function() {
		Ionic.Auth.login('basic', {remember:true}, fakeDetails).then(function(newUser) {
			//goddamn scope freaking issues
			$scope.$apply(function() {
				$scope.loginButton.hidden = true;
			});
			console.log('back ok from custom login, results are '+JSON.stringify(newUser));
			user = newUser;
			//store a custom prop
			user.set('lastLogin',new Date());
			user.save();
		}, function(err) {
			console.log('error from custom '+JSON.stringify(err));
		});
	};
	
	$scope.login = function(type) {
		console.log('do login',type);
		Ionic.Auth.login(type, {remember:true}).then(function(newUser) {
			//goddamn scope freaking issues
			$scope.$apply(function() {
				$scope.loginButton.hidden = true;
			});
			console.log('back ok from social, results are '+JSON.stringify(newUser));
			user = newUser;
			//store a custom prop
			user.set('lastLogin',new Date());
			user.save();
		}, function(err) {
			console.log('error from social '+JSON.stringify(err));
		});
	};
	
	$scope.logout = function() {
		console.log('do logout');
		Ionic.Auth.logout();
		//the line below doesn't do anything really
		user = Ionic.User.current();
		$scope.loginButton.hidden = false;	
	};
	
	$scope.passwordReset = function() {
		user.resetPassword().then(function(response) {
			console.log('password reset succcess '+JSON.stringify(response));	
		}, function(err) {
			console.log('password reset error '+JSON.stringify(err));				
		});
	};

	$scope.details = function() {
		console.log('Details', user.details);
		console.log('custom detail ',user.get('lastLogin'));
	};
	
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
