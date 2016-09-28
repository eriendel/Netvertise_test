angular.module('app').controller('ntSnapshotTableCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $http.get('/files/snapshot.csv')
        .then(function(response) {
            $scope.snapshotHeader = [];
            $scope.snapshotData = [];

            var rows = response.data.split('\n');

            $scope.snapshotHeader = rows[0].split(',');

            for(var i = 1; i < rows.length; i++) {
                if(rows[i].replace(' ', '').replace(',', '').length > 0)
                $scope.snapshotData.push(rows[i].split(','));
            }
        });

    $scope.columnSize = function () {
        return 2;
////        return Math.floor(12 / $scope.snapshotHeader.length);
    }
}]);

