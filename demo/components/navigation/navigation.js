'use strict';

/**
 * @ngdoc directive
 * @name niceElementsDemo.directive:navigation
 * @description
 * # navigation
 */
angular.module('niceElementsDemo')
  .directive('navigation', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'demo/components/navigation/navigation.html',
      controller: function($scope) {}
    }
});
