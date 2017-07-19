angular.module('chatboardSvc', [])

.service('chatboard', function($http, $httpParamSerializer){    

});

/*.service('dashboard', function($http){

    this.myInfo = function(token){
        return $http({
            method: 'GET',
            url: BASE_URL+'/user/userDetails?token='+token
        }).then(function(response){
            return response;
        })
    }

    this.userSearch = function(userSearch, token){
        return $http({
            method: 'POST',
            url: BASE_URL+'/user/searchUsers?token='+token,
            data: {
                details: userSearch
            }
        }).then(function(response){
            return response;
        })
    }

    this.userStatus = function(userid, token){
        
        return $http({
            method: 'POST',
            url: BASE_URL+'/user/checkContact?token='+token,
            data: {
                id: userid
            }
        }).then(function(response){
            return response;
        })
    }

    this.sendRequest = function(userid, token){        
        return $http({
            method: 'POST',
            url: BASE_URL+'/user/sendRequest?token='+token,
            data: {
                id: userid
            }
        }).then(function(response){
            return response;
        })
    }

    this.acceptRequest = function(userid, token){
        return $http({
            method: 'POST',
            url: BASE_URL+'/user/acceptRequest?token='+token,
            data: {
                id: userid
            }
        })
    }

    this.blockRequest = function(userid, token){
        return $http({
            method: 'POST',
            url: BASE_URL+'/user/blockUser?token='+token,
            data: {
                id: userid
            }
        })
    }

    this.palList = function(token){
        return $http({
            method: 'GET',
            url: BASE_URL+'/user/allContacts?token='+token
        }).then(function(response){
            return response;
        })
    }

})*/