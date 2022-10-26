'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTooltip
 * @description
 * # niceTooltip
 */
angular.module('niceElements')
  .directive('niceTooltip', function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.addClass("nice-tooltip");

        var tooltipWindow = document.createElement('span')
        tooltipWindow.className = 'nice-tooltip-window';
        tooltipWindow.innerHTML = attrs.niceTooltip;

        element.append(tooltipWindow);
      }
    };
  });
