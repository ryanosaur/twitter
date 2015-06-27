'use strict';

angular.module('whisper', ['firebase'])
.run(function($rootScope, $firebaseAuth, $window){
  $rootScope.fbRef = new $window.Firebase('https://flickering-torch-6914.firebaseio.com/');
  $rootScope.afAuth = $firebaseAuth($rootScope.fbRef);
})

.controller('MainCtrl', function($scope, User, $rootScope, $firebaseObject){
  
  $scope.afAuth.$onAuth(function(data){
    if(data){
      console.log(data);
      $rootScope.activeUser = data;
      $rootScope.fbUser = $rootScope.fbRef.child('users/' + data.uid);
      $rootScope.afUser = $firebaseObject($rootScope.fbUser);
    }else{
      $rootScope.activeUser = null;
      $rootScope.fbUser = null;
      $rootScope.afUser = null;
    }
  });
  
  //oauth
  $scope.oauth = function(){
      User.oauth();
  };
  
  //email
  $scope.submit = function(user){
    User.register(user)
    .then(function(resp){
      console.log('registered');
      //dostuff
    });
  };
  $scope.sub = function(user){
    User.login(user)
    .then(function(resp){
      console.log('logged in');
      //dostuff
    });
  };
  
  //logout for both
  $scope.logout = function(){
    User.logout();
  };
})

.factory('User', function($rootScope){
  function User(){}
  
  //oauth
  User.oauth = function(provider){
  return $rootScope.afAuth.$authWithOAuthPopup('github');
  };
  
  //email
  User.register = function(user){
    return $rootScope.afAuth.$createUser(user);
  };
  User.login = function(user){
    return $rootScope.afAuth.$authWithPassword(user);
  };
  
  //logout for both
  User.logout = function(){
    return $rootScope.afAuth.$unauth();
  };
  
  return User;
});
