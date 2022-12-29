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
      restrict: 'E',
      scope: {
        labelWidth: '=?',
        title: '=?',
        required: '=?',
        help: '=?'
      }
    };
  });
