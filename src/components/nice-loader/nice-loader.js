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
      replace: true,
      scope: {
        visibleWhen: '=',
        message: '@',
        fullscreen: '@',
        fulldiv: '@',
        addClass: '@'
      },
      controller: function ($scope, $transclude) {
        $scope.showSlot = $transclude().length > 0;
        if ($scope.visibleWhen != undefined) console.warn("[NICE ELEMENTS] Nice loader: visible-when attribute is deprecated")
        if ($scope.addClass != undefined) console.warn("[NICE ELEMENTS] Nice loader: add-class attribute is deprecated")
      }
    };
  });