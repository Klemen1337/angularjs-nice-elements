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
      transclude: {
        'option': '?niceSearchOption'
      },
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
        noMargin: '@',
        tabIndex: '@',
        help: '@'
      },
      controller: function($scope, $timeout, $element) {
        $scope.loading = false;
        $scope.isOpen = false;
        $scope.debounce = null;
        $scope.results = [];
        $scope.noResults = false;
        $scope.selectedIndex = 0;


        
        // ------------------- On focus -------------------
        $scope.onFocus = function() {
          if ($scope.showDropdown) {
            $scope.getData($scope.model);
            $scope.open();
          }

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.focus();
        };


        // ------------------- On focus -------------------
        $scope.open = function() {
          $scope.isOpen = true;
        };


        // ------------------- On blur -------------------
        $scope.close = function() {
          $scope.isOpen = false;

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.blur();
        };


        // ------------------- Update search -------------------
        $scope.updateSearch = function () {
          if ($scope.debounce) {
            $timeout.cancel($scope.debounce);
          }

          $scope.debounce = $timeout(function() {
            $scope.getData($scope.model);
          }, 200);
        };


        // ------------------- Get data -------------------
        $scope.getData = function(keywords) {
          if ($scope.refreshFunction != null) {
            $scope.loading = true;
            $scope.refreshFunction(keywords).then(function(results) {
              $timeout(function() {
                $scope.open();
                $scope.loading = false;

                $scope.noResults = results.length == 0;
                $scope.results = results;

                if (!$scope.noResults) {
                  $scope.selectedIndex = 0;
                }
              });
            }, function(error) {
              $scope.loading = false;
              $scope.close();
            });
          } else {
            $scope.loading = false;
            $scope.close();
          }
        };


        // ------------------------ If search button is clicked set focus or make request ------------------------
        $scope.search = function() {
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
          $scope.close();
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
        $scope.scrollToHover = function(notSmooth) {
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
            $timeout(function() {
              if ( $scope.selectedIndex > 0) {
                $scope.selectedIndex -= 1;
                $timeout(function() {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Arrow Down
          if (event.keyCode == 40) {
            event.preventDefault();
            $timeout(function() {
              if ($scope.results && $scope.selectedIndex < $scope.results.length - 1) {
                $scope.selectedIndex += 1;
                $timeout(function() {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Enter
          if (event.keyCode == 13) {
            event.preventDefault();
            $timeout(function() {
              $scope.selectItem($scope.results[$scope.selectedIndex], $scope.selectedIndex);
            });
          }

          // Escape
          if (event.keyCode == 27) {
            $timeout(function() {
              $scope.close();
            });
          }
        });
      }
    }
  });
