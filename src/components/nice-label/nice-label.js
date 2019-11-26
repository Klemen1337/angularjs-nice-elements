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
      templateUrl: 'src/components/nice-label/nice-label.html',
      restrict: 'E',
      scope: {
        fieldWidth: '@',
        labelWidth: '@',
        value: '@',
        title: '@',
        noMargin: '@',
        isInline: '=',
        help: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.value) { attrs.labelWidth = ''; }
        if (!attrs.title) { attrs.labelWidth = ''; }
      }
    };
  });
