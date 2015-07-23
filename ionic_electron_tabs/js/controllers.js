angular.module('starter.controllers', [])

.controller('TestCtrl', function($scope) {
  
  console.log('test ctrl');
  $scope.$on('$ionicView.afterEnter', function(ev, data) { 
      ev.stopPropagation();
  });

})

.controller('DashCtrl', function($scope) {
  

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
  
  $scope.doDialog = function() {
    console.log("click");  
    var remote = require('remote');
    var dialog = remote.require('dialog');
    dialog.showMessageBox({title:"Title",message:"My message",buttons:["Ok"]});

  }
  
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
