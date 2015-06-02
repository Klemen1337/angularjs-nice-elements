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
      templateUrl: 'views/nice-loader.html',
      restrict: 'E',
      scope: {
          visibleWhen: '=',
          addClass: '@'
      }
    };
  });