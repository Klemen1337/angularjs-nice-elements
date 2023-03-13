'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nice-dropdown
 * @description
 * # nice-dropdown
 */
angular.module('niceElements')
  .directive('niceDropdown', function ($window) {
    return {
      templateUrl: 'src/components/nice-dropdown/nice-dropdown.html',
      restrict: 'E',
      transclude: {
        'button': '?niceDropdownButton',
        'option': '?niceDropdownOption'
      },
      scope: {
        title: '@', // Title of the field
        model: '=', // Aka model
        list: '=', // List of options
        onChange: '&?',
        onSelect: '&?', // Like onChange but always return objects
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        loading: '=?',
        addButtonFunction: '=?',
        objValue: '@', // Optional - default is 'value'
        objKey: '@?', // Optional - default is 'id'. Used only when returnOnlyKey=true.
        selectedIsKey: '@?',
        nullable: '@', // No selection is possible
        required: '=', // Model cannot be NULL
        noMargin: '@', // margin-bottom: 0px
        multiple: '@', // Can select multiple items
        help: '@',
        noOptionsText: '@',
        noDataText: '@',
        selectText: '@',
        searchText: '@',
        nullableText: '@',
        selectedText: '@',
        dropdownDistance: '@',
        searchFunction: '=?',
        isInline: '=',
        clearOnSelect: '@',
        enableLoadMore: '@' // Enable load more
      },
      controller: function ($scope, $http, $element, $timeout, gettextCatalog, NiceService) {
        if (!$scope.dropdownDistance) { $scope.dropdownDistance = 5; }
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = gettextCatalog.getString("No options", null, "Nice"); }
        if (!$scope.noDataText) { $scope.noDataText = gettextCatalog.getString("No options", null, "Nice"); }
        if (!$scope.searchText) { $scope.searchText = gettextCatalog.getString("Search...", null, "Nice"); }
        if (!$scope.nullableText) { $scope.nullableText = gettextCatalog.getString("None", null, "Nice"); }
        if (!$scope.selectText) { $scope.selectText = gettextCatalog.getString("None", null, "Nice"); }
        if (!$scope.selectedText) { $scope.selectedText = gettextCatalog.getString("selected", null, "Nice"); }
        if (!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;
        $scope.clearOnSelect = $scope.clearOnSelect === 'true' || $scope.clearOnSelect === true;
        $scope.isOpen = false;
        $scope.selected = null;
        $scope.selectedIndex = 0;
        $scope.popper = null;

        $scope.internal = {
          search: ""
        };

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('btn-dropdown')[0];
          var tooltip = $element[0].getElementsByClassName('nice-dropdown-menu-wrapper')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, $scope.dropdownDistance],
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


        // ----------------------------------- Open -----------------------------------
        $scope.toggle = function () {
          if ($scope.isOpen) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.close = function () {
          $scope.isOpen = false;
        };

        $scope.open = function () {
          $scope.popper.update();
          $timeout(function () {
            $scope.isOpen = true;
            $timeout(function () {
              $scope.popper.update();
            });
          });
          $timeout(function () {
            $scope.focusInput();
            $scope.scrollToHover(true);
            if ($scope.enableLoadMore) $scope.handleScrollToBottom();
          }, 100);
        };


        // ----------------------------------- Handle scroll to bottom -----------------------------------
        var lastScrollPosition = Infinity;
        $scope.handleScrollToBottom = function () {
          lastScrollPosition = Infinity;
          var element = angular.element($element[0].getElementsByClassName("nice-dropdown-items")[0]);
          element.bind("scroll mousewheel", function (e) {
            var scrollPosition = element[0].scrollHeight - element[0].scrollTop;
            if (scrollPosition === element[0].clientHeight && lastScrollPosition != scrollPosition) {
              $scope.loadMore();
            }
            if (scrollPosition <= lastScrollPosition) lastScrollPosition = scrollPosition;
          });
        }


        // ----------------------------------- Load more -----------------------------------
        $scope.loadMore = function () {
          if (!$scope.internalList || !$scope.internalList._metadata || !$scope.internalList._metadata.next) return;
          $scope.loading = true;
          $http({
            method: 'GET',
            url: $scope.internalList._metadata.next,
            headers: NiceService.getHeader()
          }).then(function (response) {
            response = response.data;
            var metadata = {
              count: response.count,
              previous: response.previous,
              next: response.next,
            };
            $scope.internalList._metadata = metadata;
            angular.forEach(response.results, function (item) {
              $scope.internalList.push(item);
            });
            lastScrollPosition = Infinity;
            $scope.loading = false;
            return response;
          }, function (error) {
            $scope.loading = false;
            return error;
          });
        }


        // ----------------------------------- Focus input -----------------------------------
        $scope.focusInput = function () {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            $timeout(function () {
              input.focus();
            });
          }
        };


        // ------------------- On blur -------------------
        $scope.onBlur = function () {
          $scope.close();
        };


        // ----------------------------------- Scroll to hover -----------------------------------
        $scope.scrollToHover = function (notSmooth) {
          var dropdownMenu = $element[0].getElementsByClassName("nice-dropdown-menu")[0];
          if (!dropdownMenu) return;
          var dorpdownList = dropdownMenu.getElementsByClassName("nice-dropdown-items")[0];
          var hoverItem = dorpdownList.getElementsByClassName("hover")[0];
          if (!hoverItem) return
          var topPos = hoverItem.offsetTop;
          dorpdownList.scroll({
            top: topPos - 120,
            left: 0,
            behavior: notSmooth ? 'auto' : 'smooth'
          });
        };


        // ----------------------------------- Search -----------------------------------
        $scope.handleSearch = function () {
          $scope.loading = true;
          $scope.searchFunction($scope.internal.search).then(function (response) {
            $scope.internalList = response;
            $scope.loading = false;
            $scope.handleDefault();
          }, function (error) {
            $scope.internalList = null;
            $scope.loading = false;
          });
        };


        // ----------------------------------- Item clicked -----------------------------------
        $scope.handleSelected = function (item, index) {
          $scope.formDropdown.$setDirty();

          if (item != null) {
            if ($scope.multiple) {
              $scope.handleMultipleSelect(item, index);
            } else {
              $scope.handleSingleSelect(item, index);
            }
          } else {
            $scope.handleSingleSelect(undefined, -1);
          }
        };


        // ----------------------------------- Handle multiple select -----------------------------------
        $scope.handleMultipleSelect = function (item, index) {
          if (!$scope.selected) $scope.selected = [];

          if (item._selected) {
            $scope.selected = $scope.selected.filter(function (s) {
              return s[$scope.objKey] != item[$scope.objKey];
            });
          } else {
            $scope.selected.push(item);
          }

          $scope.handleSetModel();
        };


        // ----------------------------------- Handle single slect -----------------------------------
        $scope.handleSingleSelect = function (item, index) {
          $scope.selected = item;
          $scope.close();
          $scope.handleSetModel();
        };


        // ----------------------------------- Handle set model -----------------------------------
        $scope.handleSetModel = function () {
          var obj = angular.copy($scope.selected);

          if ($scope.selected != null) {
            // Remove selected flag
            if ($scope.multiple) {
              angular.forEach(obj, function (o) {
                o._selected = undefined;
              });
            } else {
              obj._selected = undefined;
            }

            // Selected is object
            if ($scope.selectedIsKey) {
              if ($scope.multiple) {
                angular.forEach(obj, function (o) {
                  o = o[$scope.objKey];
                });
              } else {
                obj = obj[$scope.objKey];
              }
            }
          }

          if ($scope.clearOnSelect) {
            // Clear on select
            $scope.model = null;
          } else {
            // Set model
            $scope.model = obj;
          }

          // Trigger on change
          $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: obj });
            if ($scope.onSelect) $scope.onSelect({ model: angular.copy($scope.selected) });
          })
        };


        // ----------------------------------- Handle default -----------------------------------
        $scope.handleDefault = function () {
          if ($scope.model) $scope.handleModelChange();
          if (!$scope.nullable && !$scope.model && !$scope.clearOnSelect && $scope.internalList && $scope.internalList.length > 0) {
            $scope.handleSelected($scope.internalList[0], 0);
          }
        };

        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watchCollection('list', function (value_new, value_old) {
          $scope.internalList = angular.copy($scope.list);
          $scope.handleDefault();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          $scope.handleModelChange();
        });

        $scope.handleModelChange = function () {
          $scope.selected = angular.copy($scope.model);
          angular.forEach($scope.internalList, function (i, index) {
            i._selected = false;

            if ($scope.selectedIsKey) {
              // Not object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function (s) {
                  if (i[$scope.objKey] == s) {
                    i._selected = true;
                    // $scope.selected.push(i);
                    $scope.selectedIndex = index;
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected) {
                  i._selected = true;
                  $scope.selected = i;
                  $scope.selectedIndex = index;
                  $scope.scrollToHover();
                }
              }
            } else {
              // Is object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function (s) {
                  if (i[$scope.objKey] == s[$scope.objKey]) {
                    i._selected = true;
                    // $scope.selected.push(i);
                    $scope.selectedIndex = index;
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected[$scope.objKey]) {
                  i._selected = true;
                  $scope.selected = i;
                  $scope.selectedIndex = index;
                  $scope.scrollToHover();
                }
              }
            }
          });

          // Handle required
          $timeout(function () {
            $scope.formDropdown.$setValidity('required', !(!$scope.selected && $scope.required));
          });
        }

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
              if ($scope.internalList && $scope.selectedIndex < $scope.internalList.length - 1) {
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
              $scope.handleSelected($scope.internalList[$scope.selectedIndex], $scope.selectedIndex);
            });
          }

          // Escape
          if (event.keyCode == 27) {
            $timeout(function () {
              $scope.close();
            });
          }
        });

        $scope.handleDefault();

        // ----------------------------------- Init search -----------------------------------
        if ($scope.searchFunction) {
          $scope.handleSearch();
        }
      }
    };
  });