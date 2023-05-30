'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceCheckbox
 * @description
 * # niceCheckbox
 */
angular.module('niceElements')
  .directive('niceCheckbox', function () {
    return {
      templateUrl: 'src/components/nice-checkbox/nice-checkbox.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@',
        noMargin: '@',
        clickDisabled: '@',
        onChange: '&?',
        isDisabled: '=',
      },
      controller: function ($scope) {
        if ($scope.model === undefined) $scope.model = false;

        $scope.toggle = function () {
          if ($scope.isDisabled || $scope.clickDisabled) return;
          $scope.model = !$scope.model;
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
        };
      }
    };
  });
