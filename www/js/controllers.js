angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,$timeout) {
 
  $scope.$on('$ionicView.enter', function(e) {
    console.log("inside play lists ctrl");
    $timeout(function() {
      console.log("inside time out");
      if(window.config) {  
          config.views(["expenseTrackListsNew" , {descending : true}], function(err, expenseTrackListView) {
                console.log("expenseTrackListsNew",expenseTrackListView);
          });
      }
    },2000);  
  });

  
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 },
    { title: 'Cowbell7', id: 7 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  console.log("state params", $stateParams);
})

.controller('SmsCtrl', function($scope, $stateParams) {
  $scope.smsData = {};
  
  
  $scope.doParse = function() {
    console.log('Doing  parsing', $scope.smsData);
      
    var doc = { desc : "test", amount : 1000 };
    doc.type = "expense"
   
    smsReader.parse($scope.smsData, 
      function(tranData) { 
        console.log("after parse",tranData );
        $scope.tranData = tranData;
        tranData.trackType = "expense";
        config.db.post(tranData, function(err, ok) {
            console.log("inserted successfully");
        });
      } , 
      function(e) {
        console.log("error while parse ",e);
        $scope.tranData = {};
        $scope.error = e;
      });
  };
});

