'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceHelp
 * @description
 * # niceHelp
 */
angular.module('niceElements')
  .directive('niceHelp', function () {
    return {
      templateUrl: 'src/components/nice-help/nice-help.html',
      restrict: 'E',
      replace: true,
      scope: {
        text: '@'
      },
      controller: function ($scope, $element, $timeout) {
        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('nice-help-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-help-popup')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            placement: 'top',
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              },
              {
                name: 'arrow',
                options: {
                  padding: 2,
                },
              }
            ],
          });
        };

        // $timeout(function () {
        //   $scope.setupPopper();
        // });

        $scope.onHover = function () {
          $scope.setupPopper();
        }
      }
    };
  });
