'use strict';

angular.module('myApp').controller('HomeCtrl', ['$scope', function($scope) {
    $scope.listObjs = [{id:1, value:"Apple"}, {id:2, value:"Banana"}, {id:3, value:"Orange"}];
    $scope.listStrings = ["String 1", "String 2", "String 3"];

    $scope.rangeDate = {
        startDate: moment().subtract(10, "days"),
        endDate: moment()
    };

    $scope.percentage = 0.22000000;
}]);
