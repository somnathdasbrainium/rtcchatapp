var BASE_URL = 'http://192.168.1.7/webrtc/cake/api/';
var CHATSERVER = 'http://192.168.1.7:9002/'

angular.module('rtcStarter', ['ngMaterial', 'ui.router', 'chatBoardCtrl', 'chatboardSvc'])

//Theme configaration    
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('light-blue', {
        'default': '400',
        'hue-1': 'A200', 
        'hue-2': 'A400',
        'hue-3': 'A700' 
    })
    .accentPalette('light-green', {
        'default': '500',
        'hue-1': '700',
        'hue-2': '900',
        'hue-3': 'A400'
    })
    .warnPalette('deep-orange', {
        'default': 'A400',
        'hue-1': '500',
        'hue-2': '700',
        'hue-3': 'A100'
    })
    .backgroundPalette('grey', {
        'default': '50',
        'hue-1': '100',
        'hue-2': '200',
        'hue-3': '200'
    });
})

//Routing configaration
.config(function($stateProvider, $urlRouterProvider){

    
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/home.html',
        controller: 'chatBoardCtrl'
    })  
    
    .state('app.chatBoard', {
        url: '/chatBoard',
        views: {
            'appContent': {
                templateUrl: 'templates/chatBoard.html'
            }
        }
    })
	$urlRouterProvider.otherwise('app/chatBoard');

})

/*app.run(function($rootScope, $location, $state, $timeout){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams){
        var token = localStorage.getItem("token");
        if(toState.authenticate && token == null ){
            $rootScope.returnToState = toState.url;
            $rootScope.returnToStateParams = toParams.Id;
            $timeout(function(){
                $state.go('home.login');
            },10);
        };
    });
});*/