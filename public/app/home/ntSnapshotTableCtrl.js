angular.module('app').controller('ntSnapshotTableCtrl', ['$scope', '$rootScope', '$http', 'FileUploader', function ($scope, $rootScope, $http, FileUploader) {
    var reloadTable  = function (dataString) {
        $scope.snapshotHeader = [];
        $scope.snapshotData = [];

        var rows = dataString.split('\n');

        $scope.snapshotHeader = rows[0].split(',');

        for(var i = 1; i < rows.length; i++) {
            if(rows[i].replace(' ', '').replace(',', '').length > 0) {
                $scope.snapshotData.push(rows[i].split(','));
            }
        }
    };

    var addDeltas = function (dataString) {
        computeDeltas(parseDeltas(dataString));
    };

    var parseDeltas = function (dataString) {
        var rows = dataString.split('\n');
        rows.reverse();

        var deltas = [];

        for(var i = 0; i < rows.length; i++) {
            if(rows[i].replace(' ', '').replace(',', '').length > 0) {
                if (rows[i].indexOf(',') === -1) { //it's a timer row
                    deltas.push({timing: +rows[i].trim(), values: []})
                }else {
                    deltas[deltas.length - 1].values.unshift(rows[i].split(','));
                }
            }
        }
        deltas.reverse();

        return deltas;
    };

    var computeDeltas = function (deltas) {
        if(deltas.length) {
            var delta = deltas[0];
            window.setTimeout(function () {
                for(var i = 0; i < delta.values.length; i++) {
                    for(var j = 0; j < delta.values[i].length; j++) {
                        var deltaColumn = delta.values[i][j];
                        if(deltaColumn && deltaColumn.trim().length) {
                            $scope.snapshotData[i][j] = deltaColumn;
                        }
                    }
                }
                $scope.$apply();

                deltas.shift();
                computeDeltas(deltas);
            }, delta.timing);
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

    $scope.snapshotUploader = new FileUploader({
        queueLimits: 1
    });

    $scope.snapshotUploader.onAfterAddingFile = function (item) {
        var reader = new FileReader();
        reader.readAsText(item._file, "UTF-8");
        reader.onload = function (evt) {
            reloadTable(evt.target.result);
            $scope.$apply();
            item.remove();
        };
    };

    $scope.deltaUploader = new FileUploader({
        queueLimits: 1
    });

    $scope.deltaUploader.onAfterAddingFile = function (item) {
        var reader = new FileReader();
        reader.readAsText(item._file, "UTF-8");
        reader.onload = function (evt) {
            addDeltas(evt.target.result);
            item.remove();
        };
    };
}]);

