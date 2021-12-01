'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceHelp
 * @description
 * # niceHelp
 */
angular.module('niceElements')
  .directive('niceHelp', function () {
    return {
      templateUrl: 'src/components/nice-help/nice-help.html',
      restrict: 'E',
      scope: {
        text: '@'
      }
    };
  });
