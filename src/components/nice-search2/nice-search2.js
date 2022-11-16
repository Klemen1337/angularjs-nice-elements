'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSearch2
 * @description
 * # niceSearch2
 */
angular.module('niceElements')
  .directive('niceSearch2', function () {
    return {
      transclude: true,
      templateUrl: 'src/components/nice-search2/nice-search2.html',
      restrict: 'E',
      scope: {
        model: '=',
        isDisabled: '=',
        showDropdown: '=',
        title: '@?',
        placeholder: '@',
        fieldWidth: '@',
        labelWidth: '@',
        refreshFunction: '=',
        refreshSelectedCallback: '=',
        onSelect: '=',
        onChange: '&?',
        noMargin: '@',
        tabIndex: '@',
        debounceTime: '@',
        isInline: '=',
        help: '@'
      },
      controller: function ($scope, $timeout, $element) {
        $scope.loading = false;
        $scope.isOpen = false;
        $scope.debounce = null;
        $scope.results = [];
        $scope.noResults = false;
        $scope.selectedIndex = 0;
        $scope.requestNumber = 0;

        if (!$scope.debounceTime) $scope.debounceTime = 500;
        if (!$scope.model) $scope.model = "";

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('nice-search-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-search-dropdown-wrapper')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              },
              {
                name: "sameWidth",
                enabled: true,
                phase: "beforeWrite",
                requires: ["computeStyles"],
                fn: function (e) {
                  var state = e.state;
                  state.styles.popper.width = state.rects.reference.width + "px";
                },
                effect: function (e) {
                  var state = e.state;
                  state.elements.popper.style.width = state.elements.reference.offsetWidth + "px";
                }
              }
            ],
          });
        };

        $timeout(function () {
          $scope.setupPopper();
        });


        // ------------------- On focus -------------------
        $scope.onFocus = function () {
          if ($scope.showDropdown && $scope.results.length == 0) {
            $scope.getData($scope.model);
          }

          $scope.open();

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.focus();
        };


        // ------------------- On blur -------------------
        $scope.onBlur = function () {
          $scope.close();
        };


        // ------------------- On focus -------------------
        $scope.open = function () {
          $scope.isOpen = true;
          $timeout(function () {
            if ($scope.popper) $scope.popper.update();
          });
        };


        // ------------------- On blur -------------------
        $scope.close = function () {
          $scope.isOpen = false;

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.blur();

          $timeout(function () {
            $scope.popper.update();
          })
        };


        // ------------------- Update search -------------------
        $scope.updateSearch = function () {
          if ($scope.debounce) {
            $timeout.cancel($scope.debounce);
          }

          $scope.debounce = $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
            $scope.getData($scope.model);
          }, $scope.debounceTime);
        };


        // ------------------- Get data -------------------
        $scope.getData = function (keywords) {
          if ($scope.refreshFunction != null) {
            $scope.loading = true;
            $scope.requestNumber += 1;
            var requestNumber = angular.copy($scope.requestNumber);
            $scope.refreshFunction(keywords).then(function (results) {
              if ($scope.requestNumber == requestNumber) {
                $timeout(function () {
                  $scope.open();
                  $scope.loading = false;

                  $scope.noResults = results.length == 0;
                  $scope.results = results;

                  if (!$scope.noResults) {
                    $scope.selectedIndex = 0;
                  }
                });
              }
            }, function (error) {
              $scope.loading = false;
              $scope.close();
            });
          } else {
            $scope.loading = false;
            // $scope.close();
          }
        };


        // ------------------------ If search button is clicked set focus or make request ------------------------
        $scope.search = function () {
          if (!$scope.isDisabled) {
            if ($scope.showDropdown) {
              $scope.updateSearch();
            }
            $scope.focus();
          }
        };


        // ------------------------ Clear search ------------------------
        $scope.clear = function () {
          $scope.model = "";
        };


        // ------------------------ Select item ------------------------
        $scope.selectItem = function (item) {
          if ($scope.onSelect) {
            $scope.onSelect(item);
            $scope.clear();
            $scope.close();
          }
        };


        // ----------------------------------- Scroll to hover -----------------------------------
        $scope.scrollToHover = function (notSmooth) {
          var dropdownMenu = $element[0].getElementsByClassName("nice-dropdown")[0];
          var hoverItem = dropdownMenu.getElementsByClassName("active")[0];
          if (hoverItem) {
            var topPos = hoverItem.offsetTop;
            dropdownMenu.scroll({
              top: topPos - 120,
              left: 0,
              behavior: notSmooth ? 'auto' : 'smooth'
            });
          }
        };


        // ----------------------------------- Watch for keydown and keypress -----------------------------------
        $element.bind("keydown keypress", function (event) {
          // Arrow Up
          if (event.keyCode == 38) {
            event.preventDefault();
            $timeout(function () {
              if ($scope.selectedIndex > 0) {
                $scope.selectedIndex -= 1;
                $timeout(function () {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Arrow Down
          if (event.keyCode == 40) {
            event.preventDefault();
            $timeout(function () {
              if ($scope.results && $scope.selectedIndex < $scope.results.length - 1) {
                $scope.selectedIndex += 1;
                $timeout(function () {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Enter
          if (event.keyCode == 13) {
            event.preventDefault();
            $timeout(function () {
              $scope.selectItem($scope.results[$scope.selectedIndex], $scope.selectedIndex);
            });
          }

          // Escape
          if (event.keyCode == 27) {
            $timeout(function () {
              $scope.close();
            });
          }
        });
      }
    }
  });
