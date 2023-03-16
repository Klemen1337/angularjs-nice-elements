
/**
 * @ngdoc directive
 * @name niceElements.directive:niceButton
 * @description
 * # niceButton
 */
angular.module('niceElements')
  .directive('niceButton', function ($q) {
    return {
      templateUrl: 'src/components/nice-button/nice-button.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@',
        icon: '@?',
        noMargin: '=',
        niceClick: '&',
        niceDisabled: '=',
        addClass: '@',
        type: '@?'
      },
      controller: function ($q, $scope, $transclude) {
        if ($scope.addClass != undefined) console.warn("[NICE ELEMENTS] Nice button: add-class attribute is deprecated")
        if (!$scope.type) $scope.type = "button";
        $scope.showSlot = $transclude().length > 0;
        $scope.loading = false;

        $scope.click = function () {
          if ($scope.loading === false && $scope.niceDisabled !== true) {
            $scope.loading = true;

            $q.when($scope.niceClick()).finally(function () {
              $scope.loading = false;
            });
          }
        };
      }
    };
  });
