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
      templateUrl: 'src/components/nice-quantity/nice-quantity.html',
      restrict: 'E',
      scope: {
        title: '@',
        model: '=',
        max: '=',
        onChange: '&?',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        isDisabled: '=',
        help: '@',
      },
      controller: function ($scope) {
        if (!$scope.model) {
          $scope.model = 0;
        }

        $scope.add = function () {
          if ($scope.max) {
            if ($scope.max >= $scope.model + 1) {
              $scope.model += 1;
              if ($scope.onChange) $scope.onChange({ model: $scope.model });
            }
          } else {
            $scope.model += 1;
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          }
        };

        $scope.sub = function () {
          if ($scope.model - 1 >= 0) {
            $scope.model -= 1;
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
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
