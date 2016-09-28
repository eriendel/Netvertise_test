angular.module('app',['ngResource', 'ngRoute', 'ngCsvImport']);

angular.module('app').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
        enabled: true
    });
    $routeProvider
        .when('/', {
            templateUrl:'public/app/home/snapshotTable.html',
            controller:'ntSnapshotTableCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
}]).run(function(){
});


  