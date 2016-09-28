angular.module('app').controller('ntSnapshotTableCtrl', ['$scope', '$rootScope', '$http', 'FileUploader', function ($scope, $rootScope, $http, FileUploader) {
    var reloadTable  = function (dataString) {
        $scope.snapshotHeader = [];
        $scope.snapshotData = [];

        var rows = dataString.split('\n');

        $scope.snapshotHeader = rows[0].split(',');

        for(var i = 1; i < rows.length; i++) {
            if(rows[i].replace(' ', '').replace(',', '').length > 0)
                $scope.snapshotData.push(rows[i].split(','));
        }
    };

    $http.get('/files/snapshot.csv')
        .then(function(response) {
            reloadTable(response.data);
        });

    $scope.columnSize = function () {
        var columnSize = Math.floor(12 / $scope.snapshotHeader.length);
        return columnSize < 1 ? 1 : columnSize;
    };


    var snapshotUploader = new FileUploader({
        queueLimits: 1
    });

    snapshotUploader.onAfterAddingFile = function (item) {
        var reader = new FileReader();
        reader.readAsText(item._file, "UTF-8");
        reader.onload = function (evt) {
            reloadTable(evt.target.result);
            $scope.$apply();
            item.remove();
        };
    };

    $scope.snapshotUploader = snapshotUploader;
}]);

