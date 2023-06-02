'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceIcon
 * @description
 * # niceIcon
 */
angular.module('niceElements')
  .directive('niceIcon', function () {
    return {
      templateUrl: 'src/components/nice-icon/nice-icon.html',
      restrict: 'E',
      replace: true,
      scope: {
        icon: '@',
        size: '=',
      },
    };
  });