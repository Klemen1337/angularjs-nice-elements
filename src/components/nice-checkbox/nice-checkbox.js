'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceCheckbox
 * @description
 * # niceCheckbox
 */
angular.module('niceElements')
  .directive('niceCheckbox', function() {
    return {
      templateUrl: 'src/components/nice-checkbox/nice-checkbox.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@',
        noMargin: '@'
      },
      controller: function($rootScope, $scope) {
        if($scope.model === undefined) $scope.model = false;

        $scope.toggle = function(){
          $scope.model = !$scope.model;
        };
      }
    };
  });
