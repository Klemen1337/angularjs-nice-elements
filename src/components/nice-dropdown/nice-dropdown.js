'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nice-dropdown
 * @description
 * # nice-dropdown
 */
angular.module('niceElements')
  .directive('niceDropdown', function () {
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
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        loading: '=?',
        addButtonFunction: '=?',
        objValue: '@', // Optional - default is 'value'
        objKey: '@?', // Optional - default is 'id'. Used only when returnOnlyKey=true.
        nullable: '@', // No selection is possible
        required: '@', // Model cannot be NULL
        noMargin: '@', // margin-bottom: 0px
        multiple: '@', // Can select multiple items
        help: '@',
        noOptionsText: "@",
        noDataText: "@",
        selectText: "@",
        searchText: "@",
        nullableText: "@",
        searchFunction: "=?"
      },
      controller: function ($scope, $element, $timeout) {
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = "No options"; }
        if (!$scope.noDataText) { $scope.noDataText = "No options"; }
        if (!$scope.searchText) { $scope.searchText = "Search..."; }
        if (!$scope.nullableText) { $scope.nullableText = "None"; }
        if (!$scope.selectText) { $scope.selectText = "Select option"; }
        if (!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.required = $scope.required === 'true' || $scope.required === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;
        $scope.valid = $scope.formDropdown;
        $scope.isOpen = false;
        $scope.selected = null;
        $scope.selectedIndex = null;
        $scope.internal = {
          search: ""
        };

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
        };

        $scope.open = function () {
          $scope.focusInput();
          $scope.isOpen = true;
        };


        // ----------------------------------- Focus input -----------------------------------
        $scope.focusInput = function () {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            $timeout(function () {
              input.focus();
            });
          }
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

        // Init search
        if ($scope.searchFunction) {
          $scope.handleSearch();
        }



        // ----------------------------------- Item clicked -----------------------------------
        $scope.handleSelected = function (item, index) {
          $scope.formDropdown.$setDirty();

          if (item) {
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
        $scope.handleMultipleSelect = function(item, index) {
          if (!$scope.selected) $scope.selected = [];
          if(item._selected) {
            $scope.selected = $scope.selected.filter(function(s) {
              return s[$scope.objKey] != item[$scope.objKey] 
            });
          } else {
            $scope.selected.push(item);
          }

          $scope.handleSetModel();
        };


        // ----------------------------------- Handle single slect -----------------------------------
        $scope.handleSingleSelect = function(item, index) {
          $scope.selected = item;
          $scope.close();
          $scope.handleSetModel();
        };


        // ----------------------------------- Handle set model -----------------------------------
        $scope.handleSetModel = function() {
          var obj = angular.copy($scope.selected);

          if ($scope.selected) {
            if ($scope.multiple) {
              angular.forEach(obj, function(o) {
                o._selected = undefined;
              })
            } else {
              obj._selected = undefined;
            }
          }
          
          $scope.model = obj;
        };


        // ----------------------------------- Handle default -----------------------------------
        $scope.handleDefault = function() {
          if (!$scope.nullable && !$scope.selected && $scope.internalList && $scope.internalList.length > 0) {
            $scope.handleSelected($scope.internalList[0], 0);
          }
        };

        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watch('list', function (value_new, value_old) {
          $scope.internalList = angular.copy($scope.list);
          $scope.handleDefault();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          $scope.selected = angular.copy($scope.model);
          angular.forEach($scope.internalList, function(i) {
            i._selected = false;

            if ($scope.multiple) {
              angular.forEach($scope.selected, function(s) {
                if (i[$scope.objKey] == s[$scope.objKey]) {
                  i._selected = true;
                }
              });
            } else {
              if ($scope.selected && i[$scope.objKey] == $scope.selected[$scope.objKey]) {
                i._selected = true;
              }
            }
          });
        });


        $scope.handleDefault();
      }
    };
  });