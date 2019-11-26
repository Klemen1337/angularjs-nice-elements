'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSlot
 * @description
 * # niceSlot
 */
angular.module('niceElements')
  .directive('niceSlot', function () {
    return {
      templateUrl: 'src/components/nice-slot/nice-slot.html',
      restrict: 'E',
      transclude: true,
      scope: {
        fieldWidth: '@',
        labelWidth: '@',
        title: '@',
        noMargin: '@',
        isInline: '=',
        help: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.title) { attrs.labelWidth = ''; }
      }
    };
  });
