'use strict';

angular.module('myApp').controller('HomeCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
    $scope.listObjs = [{id:1, value:"Apple"}, {id:2, value:"Banana"}, {id:3, value:"Orange"}];
    $scope.listStrings = ["String 1", "String 2", "String 3"];

    $scope.percentage = 0.22000000;




    $scope.getAddresses = function(address) {
        var deferred = $q.defer();

        var params = {address: address, sensor: false};
        $http.get(
            'http://maps.googleapis.com/maps/api/geocode/json',
            {params: params}
        ).then(function(response) {
            $scope.results = response.data.results;
            deferred.resolve(response.data.results);
        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    };



    $scope.scrollTo = function(destination){
        $('html, body').animate({
            scrollTop: $("#"+destination).offset().top - 50
        }, 300);
    };
}]);
