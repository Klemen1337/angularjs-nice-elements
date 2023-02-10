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
        min: '=?',
        max: '=?',
        onChange: '&?',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        isDisabled: '=',
        isInline: '=',
        help: '@',
      },
      controller: function ($scope) {
        $scope.min = Number($scope.min) || 0;
        $scope.max = Number($scope.max) || Infinity;
        if (!$scope.model) $scope.model = Number($scope.min);

        $scope.add = function () {
          $scope.model += 1;
          $scope.handleChange();
        };

        $scope.sub = function () {
          $scope.model -= 1;
          $scope.handleChange();
        };

        $scope.handleChange = function () {
          if ($scope.model != undefined) {
            $scope.model = Number($scope.model);
            if ($scope.model < $scope.min) $scope.model = angular.copy($scope.min);
            if ($scope.model > $scope.max) $scope.model = angular.copy($scope.max);
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          } else {
            $scope.model = angular.copy($scope.min);
            $scope.handleChange();
          }
        };
      }
    };
  });
