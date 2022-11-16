'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePopup
 * @description
 * # nicePopup
 */
angular.module('niceElements')
  .directive('nicePopup', function () {
    return {
      templateUrl: 'src/components/nice-popup/nice-popup.html',
      restrict: 'E',
      transclude: {
        'target': '?nicePopupTarget',
        'content': '?nicePopupContent'
      },
      scope: {
        offsetDistance: '@', // distance, displaces the popper away from, or toward, the reference element in the direction of its placement
        offsetSkidding: '@', // skidding, displaces the popper along the reference element.
        placement: '@', // Describes the preferred placement of the popper
        strategy: '@',
        showArrow: '@',
        onChange: '&?',
      },
      controller: function ($scope, $element, $timeout) {
        $scope.isOpen = false;
        if (!$scope.showArrow) { $scope.showArrow = false; }
        if (!$scope.offsetDistance && $scope.showArrow) { $scope.offsetDistance = 8; }
        if (!$scope.offsetDistance) { $scope.offsetDistance = 5; }
        if (!$scope.offsetSkidding) { $scope.offsetSkidding = 0; }
        if (!$scope.placement) { $scope.placement = "auto"; }
        if (!$scope.strategy) { $scope.strategy = "fixed"; }

        // Placements
        // [
        //   'auto',
        //   'auto-start',
        //   'auto-end',
        //   'top',
        //   'top-start',
        //   'top-end',
        //   'bottom',
        //   'bottom-start',
        //   'bottom-end',
        //   'right',
        //   'right-start',
        //   'right-end',
        //   'left',
        //   'left-start',
        //   'left-end'
        // ]

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var target = $element[0].getElementsByClassName('nice-popup-target')[0];
          var content = $element[0].getElementsByClassName('nice-popup-content')[0];
          $scope.popper = Popper.createPopper(target, content, {
            placement: $scope.placement,
            strategy: $scope.strategy,
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [$scope.offsetSkidding, $scope.offsetDistance],
                },
              },
              {
                name: 'arrow',
                options: {
                  padding: 5, // 5px from the edges of the popper
                },
              },
              // {
              //   name: "sameWidth",
              //   enabled: true,
              //   phase: "beforeWrite",
              //   requires: ["computeStyles"],
              //   fn: function (e) {
              //     var state = e.state;
              //     state.styles.popper.width = state.rects.reference.width + "px";
              //   },
              //   effect: function (e) {
              //     var state = e.state;
              //     state.elements.popper.style.width = state.elements.reference.offsetWidth + "px";
              //   }
              // }
            ],
          });
        };

        $timeout(function () {
          $scope.setupPopper();
        });

        // -----------------------------------Open -----------------------------------
        $scope.toggle = function () {
          if ($scope.isOpen) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.close = function () {
          $scope.isOpen = false;
          if ($scope.onChange) $scope.onChange($scope.isOpen);
        };

        $scope.open = function () {
          $scope.popper.update();
          $scope.isOpen = true;
          if ($scope.onChange) $scope.onChange($scope.isOpen);
          $timeout(function () {
            $scope.popper.update();
          });
        };
      }
    };
  });