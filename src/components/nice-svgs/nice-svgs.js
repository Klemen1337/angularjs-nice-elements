'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSvgs
 * @description
 * # niceSvgs
 */
angular.module('niceElements')
  .directive('niceSvgs', function () {
    return {
      templateUrl: 'src/components/nice-svgs/nice-svgs.html',
      restrict: 'E',
      transclude: true
    };
  });
