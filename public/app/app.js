angular.module('app',['ngResource', 'ngRoute', 'ngCsvImport']);

angular.module('app').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
        enabled: true
    });
    $routeProvider
        .when('/', {
            templateUrl:'public/app/home/home.html',
            controller:'ntHomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
}]).run(function(){
});


  