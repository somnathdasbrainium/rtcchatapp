angular.module('chatBoardCtrl', [])

.controller('chatBoardCtrl', function($scope, $mdSidenav){
  
  $scope.openLeftSideMenu = function() {  
    $mdSidenav('left').toggle();
  };

});

/*app.controller('dashboardCtrl', function($scope, $state, $mdSidenav, $http, authorization, dashboard, $mdDialog) {

  var token = localStorage.getItem('token');
  var userId = localStorage.getItem("LstClkUsr");
  $scope.search = '';
  $scope.palList = true;
  $scope.palSearchList = false;
  $scope.showPalRoom = false;
  $scope.showPalStatus = false; 
  $scope.sendRequestLetter = false;
  $scope.sentRequestLetter = false;
  $scope.acceptRequestLetter = false;
    
  

  if(token != undefined){
      
  	dashboard.myInfo(token).then(function(response){
  		$scope.LoggedinUserDetails = response;
        $scope.afterlogin = true;
  	});

   
    	dashboard.palList(token).then(function(response){

    		$scope.palListDetails = response.data.data;
    		$scope.palList = true;   

    	});
   
    
  	dashboard.userStatus(userId, token).then(function(response){
      console.log(response);      
  		if(response.data.success){
        $scope.userResult = response.data.data;
          $scope.showPalRoom = true;
      }else{
        $scope.showPalStatus = true;
        $scope.notFound = response.data.message;
        if(response.data.code === 'SR'){
          $scope.sendRequestLetter = true;
          $scope.userResult = response.data.data;       
        }else if(response.data.code === 'RS'){
          $scope.sentRequestLetter = true;
          $scope.userResult = response.data.data;
        }else if(response.data.code === 'AR'){
          $scope.acceptRequestLetter = true;
          $scope.userResult = response.data.data;
        }
      }
  	});

    
    
  };
  



  

  $scope.searchUser = function(){  	
  	if($scope.search.length>0){
	  	$scope.palList = false;
	  	dashboard.userSearch($scope.search, token).then(function(response){
	  		if(response.data.success){
	  			$scope.searchResult = response.data.data;
	  			$scope.palSearchList = true;
	  		}else{
	  			$scope.notFound = response.data.message;
	  		}
	  	});
  	}else{
  		$scope.palList = true;
  		$scope.palSearchList = false;
  	};
  };

  $scope.userStatus = function(userId){
  	localStorage.setItem("LstClkUsr", userId);
    $scope.openLeftSideMenu();
    $scope.showPalRoom = false;
    $scope.showPalStatus = false; 
    $scope.sendRequestLetter = false;
    $scope.sentRequestLetter = false;
    $scope.acceptRequestLetter = false;
  	dashboard.userStatus(userId, token).then(function(response){
  		console.log(response);
  		if(response.data.success){
  			$scope.userResult = response.data.data;
        	$scope.showPalRoom = true;
  		}else{
        $scope.showPalStatus = true;
        $scope.notFound = response.data.message;
        if(response.data.code === 'SR'){
          $scope.sendRequestLetter = true;
          $scope.userResult = response.data.data;       
        }else if(response.data.code === 'RS'){
          $scope.sentRequestLetter = true;
          $scope.userResult = response.data.data;
        }else if(response.data.code === 'AR'){
          $scope.acceptRequestLetter = true;
          $scope.userResult = response.data.data;
        }
  		}
  	});
  };

  $scope.sendRequest = function(userId){
    $scope.sendRequestLetter = false;
  	dashboard.sendRequest(userId, token).then(function(response){
  		console.log(response);
  		if(response.data.success){
  			$scope.userResult = response.data.data;
  			$scope.showContReqSuccessModal(response);
        $scope.sentRequestLetter = true;
  		}else{
  			$scope.notFound = response.data.message;
  		}
  	});
  };

  $scope.showContReqSuccessModal = function(response){
  	$mdDialog.show({
      controller: contReqSuccessModalCtrl,       
      templateUrl: 'template/modal/contReqSuccessModal.html',
      parent: angular.element(document.querySelector('.showPalStatus')),      
      clickOutsideToClose:false,
      fullscreen: $scope.customFullscreen
    });
     function contReqSuccessModalCtrl($scope, $mdDialog) {    
        $scope.message = response.data.message
        $scope.cancelModal = function(){
          $mdDialog.cancel();
        };
    };
  };

  $scope.acceptRequest = function(userId){

    dashboard.acceptRequest(userId, token).then(function(response){      
      console.log(response);
    });
  };
  
  $scope.blockRequest = function(userId){
    dashboard.blockRequest(userId, token).then(function(response){
      console.log(response);
    });
  }

$scope.logout = function(){
	$state.go("login");
	localStorage.removeItem('token');
	$scope.afterlogin = false;  
};

})*/