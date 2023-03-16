'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceWrapper
 * @description
 * # niceWrapper
 */
angular.module('niceElements')
  .directive('niceWrapper', function () {
    return {
      templateUrl: 'src/components/nice-wrapper/nice-wrapper.html',
      restrict: 'E',
      replace: true,
      transclude: {
        'title': '?niceWrapperTitle',
        'subtitle': '?niceWrapperSubtitle',
        'footer': '?niceWrapperFooter'
      },
      scope: {
        title: '@',
        subtitle: '@',
        collapsable: '=',
        collapsed: '@',
      },
      controller: function ($scope, $transclude) {
        $scope.isOpen = true;
        if ($scope.collapsed) $scope.isOpen = false;

        $scope.hasTitle = $transclude.isSlotFilled('title');
        $scope.hasSubtitle = $transclude.isSlotFilled('subtitle');
        $scope.hasFooter = $transclude.isSlotFilled('footer');
        $scope.hasHeader = $scope.hasTitle || $scope.hasSubtitle || $scope.title || $scope.subtitle || $scope.collapsable;

        $scope.toggle = function () {
          if (!$scope.collapsable) return;
          $scope.isOpen = !$scope.isOpen;
        }
      }
    };
  });
