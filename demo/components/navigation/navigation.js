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
      replace: true,
      templateUrl: 'demo/components/navigation/navigation.html',
      controller: function ($scope, $location) {
        $scope.routes = [
          { title: "Input", href: "nice-input" },
          { title: "Dropdown", href: "nice-dropdown" },
          { title: "Search", href: "nice-search" },
          { title: "Datetime picker", href: "nice-datetime-picker" },
          { title: "Date range", href: "nice-date-range" },
          { title: "Time picker", href: "nice-time-picker" },
          { title: "Choice", href: "nice-choice" },
          { title: "Yesno", href: "nice-yesno" },
          { title: "Percent", href: "nice-percent" },
          { title: "Notifications", href: "nice-notifications" },
          { title: "Number", href: "nice-number" },
          { title: "Checkbox", href: "nice-checkbox" },
          { title: "Button", href: "nice-button" },
          { title: "Calendar", href: "nice-calendar" },
          { title: "Popup", href: "nice-popup" },
          { title: "Icon", href: "nice-icon" },
          { title: "Upload", href: "nice-upload" },
          { title: "Date input", href: "nice-date-input" },
        ];

        $scope.location = $location.path().replace("/", "");
        $scope.$on('$routeChangeStart', function (evt, toState, toParams, fromState, fromParams) {
          $scope.location = $location.path().replace("/", "");
        });
      }
    }
  });
