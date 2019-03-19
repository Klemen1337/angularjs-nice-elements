'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceQuantity
 * @description
 * # niceQuantity
 */
angular.module('niceElements')
  .directive('niceQuantity', function () {
    return {
      templateUrl: 'components/nice-quantity/nice-quantity.html',
      restrict: 'E',
      scope: {
        title: '@',
        model: '=',
        max: '=',
        onChange: "&",
        noMargin: "@",
        fieldWidth: '@',
        labelWidth: '@'
      },
      controller: function ($scope) {
        if (!$scope.model) {
          $scope.model = 0;
        }

        $scope.add = function () {
          if ($scope.max) {
            if ($scope.max >= $scope.model + 1) {
              $scope.model += 1;
              $scope.onChange($scope.model);
            }
          } else {
            $scope.model += 1;
            $scope.onChange($scope.model);
          }
        };

        $scope.sub = function () {
          if ($scope.model - 1 >= 0) {
            $scope.model -= 1;
            $scope.onChange($scope.model);
          }
        };

        $scope.handleChange = function () {
          if ($scope.model) {
            $scope.model = Number($scope.model);
          }
        }
      }
    };
  });
