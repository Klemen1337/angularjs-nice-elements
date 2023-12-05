'use strict';

/**
 * @ngdoc directive
 * @name niceElementsDemo.directive:navigation
 * @description
 * # navigation
 */
angular.module('niceElementsDemo')
  .directive('navigation', function () {
    return {
      restrict: 'E',
      templateUrl: 'demo/components/navigation/navigation.html',
      controller: function ($scope, $route, $location, NiceService) {
        $scope.niceService = NiceService;
        $scope.routes = $route.routes;
        $scope.isOpen = true;

        $scope.close = function () {
          $scope.isOpen = false;
        }

        $scope.toggle = function () {
          $scope.isOpen = !$scope.isOpen;
        }

        $scope.location = $location.path();
        $scope.$on('$routeChangeStart', function (evt, toState, toParams, fromState, fromParams) {
          $scope.location = $location.path();
        });
      }
    }
  });
