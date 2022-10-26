'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceToast
 * @description
 * # niceToast
 */
angular.module('niceElements')
  .directive("niceToast", function () {
    return {
      restrict: "E",
      templateUrl: "src/components/nice-toast/nice-toast.html",
      scope: {
        position: '@',
        timeoutTime: '@',
      },
      controller: function ($scope, $timeout) {
        if (!$scope.position) $scope.position = "bottom center";
        if (!$scope.timeoutTime) $scope.timeoutTime = 2000;
        $scope.toasts = [];

        // -------------------------- Watch for events --------------------------
        $scope.$on('toast', function (e, message, type) {
          $scope.createToast(message, type);
        });


        // -------------------------- Create toast --------------------------
        $scope.createToast = function (message, type) {
          // Create new toast
          var toast = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            message: message,
            type: type || "default"
          };

          // Append toast
          $scope.toasts.push(toast);

          // Remove after some time
          $timeout(function () {
            $scope.removeToast(toast);
          }, $scope.timeoutTime);
        };


        // -------------------------- Remove toast --------------------------
        $scope.removeToast = function (toast) {
          var toastIndex = $scope.toasts.findIndex(function (a) { return a.id == toast.id })
          if (toastIndex >= 0) {
            $scope.toasts.splice(toastIndex, 1);
          }
        }
      }
    };
  });