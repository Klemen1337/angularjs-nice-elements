'use strict';

/**
 * @ngdoc directive
 * @name backofficeApp.directive:loader
 * @description
 * # loader
 */
angular.module('niceElements')
  .directive('niceLoader', function () {
    return {
      templateUrl: 'src/components/nice-loader/nice-loader.html',
      restrict: 'E',
      transclude: true,
      scope: {
        visibleWhen: '=',
        message: '@',
        fullscreen: '@',
        fulldiv: '@',
        addClass: '@'
      }
    };
  });