'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceProgressBar
 * @description
 * # niceProgressBar
 */
angular.module('niceElements')
  .directive('niceProgressBar', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/components/nice-progress-bar/nice-progress-bar.html',
      scope: {
        title: '@',
        noMargin: '@',
        value: '=',
        max: '=',
        color: '=',
        help: '@'
      },

      controller: function($scope, $element, $timeout) {
        $scope.width = 0;
        $scope.resize = function(){
          $timeout(function() {
            $scope.width = $element[0].getElementsByClassName("progress")[0].offsetWidth;
          },100);
        };
        window.onresize = function() {
          $scope.resize();
        };
        $scope.resize();

        

        $scope.$watch("value", function(valueNew, valueOld){
          $scope.calculate();
        });

        $scope.$watch("max", function(valueNew, valueOld){
          $scope.calculate();
        });

        $scope.calculate = function(){
          $scope.percentage = ($scope.value / $scope.max) * 100;
        };

        $scope.calculate();
      }
    };
  });
