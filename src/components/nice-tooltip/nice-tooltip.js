'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTooltip
 * @description
 * # niceTooltip
 */
angular.module('niceElements')
  .directive('niceTooltip', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var html = element.html();
        element.addClass("nice-tooltip");
        html = html + "<span class='nice-tooltip-window'>" + attrs.niceTooltip + "</span>"
        element.html(html);
    }
    };
  });
