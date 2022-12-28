'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTitle
 * @description
 * # niceTitle
 */
angular.module('niceElements')
  .directive('niceTitle', function () {
    return {
      templateUrl: 'src/components/nice-title/nice-title.html',
      replace: true,
      scope: {
        labelWidth: '=',
        title: '=',
        isInline: '=',
        help: '='
      }
    };
  });