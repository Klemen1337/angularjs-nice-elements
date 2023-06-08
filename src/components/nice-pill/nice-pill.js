'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePill
 * @description
 * # nicePill
 */
angular.module('niceElements')
  .directive('nicePill', function () {
    return {
      templateUrl: 'src/components/nice-pill/nice-pill.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valueKey: '@',
        canDelete: '@',
        onDelete: '=?',
      },
      controller: function ($scope) {
        if (!$scope.valueKey) $scope.valueKey = "value";

        $scope.handleDelete = function () {
          $scope.onDelete($scope.model)
        }
      }
    };
  });
