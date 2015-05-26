'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceLabel
 * @description
 * # niceLabel
 */
angular.module('niceElements')
  .directive('niceLabel', function () {
    return {
      templateUrl: 'views/nice-label.html',
      restrict: 'E',
      scope: {
        fieldWidth: '@',
        labelWidth: '@',
        value: '@',
        title: '@'
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
