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
      templateUrl: 'views/nice-dropdown.html',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',               // Title of the field
        model: '=',               // Aka model
        list: '=',                // List of options
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        addButtonEnable: '=',
        addButtonFunction: '&',
        objValue: '@',            // Optional - default is 'value'
        objKey: '@?',             // Optional - default is 'id'. Used only when returnOnlyKey=true
        listIsObj: '@',           // True - list has objects, False - list has strings
        selectedIsObj: '@',       // Optional parameter.
        nullable: '@',            // No selection is possible
        required: '@',            // Model cannot be NULL
        showTax: '@',             // Shows tax rate
        noMargin: '@',            // margin-bottom: 0px
        multiple: '@',            // Can select multiple items
        help: '@'
      },

      link: function (scope, element, attr) {
        scope.valid = scope.formDropdown;
      },

      controller: function($rootScope, $scope) {
        $scope.internalSelected = null;
        if($scope.multiple) $scope.internalSelected = [];

        if (!$scope.objKey) $scope.objKey = 'id';
        if(!angular.isDefined($scope.objValue)) $scope.objValue = 'value';
        if(!angular.isDefined($scope.multiple)) $scope.multiple = false;
        if(!$scope.addButtonFunction) $scope.addButtonFunction = null;

        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };

        var setSelected = function(selected){
          if(selected && _.find($scope.internalList, getFilter(selected)))
            $scope.internalSelected = selected;
          else
            $scope.internalSelected = $scope.internalList[0];
        };

        var setMultipleSelected = function(item){
          if(!$scope.internalSelected) $scope.internalSelected = [];

          if(!_.find($scope.internalSelected, getFilter(item))){
            $scope.internalSelected.push(item);
          } else {
            $scope.internalSelected = _.reject($scope.internalSelected, {'id':item.id});
          }
        };

        $scope.isItemSelected = function(item){
          if (!$scope.internalSelected)
            return false;
          // Which item is selected
          if ($scope.multiple) {
              return _.where($scope.internalSelected, {'id':item.id}).length > 0;
          }else{
              return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };

        var bootstrap = function(list) {
          // Set internalList
          if ($scope.listIsObj) {
            $scope.internalList = angular.copy(list);
          } else {
            $scope.internalList = _.map(list, function (val) {
              var obj = {};
              obj[$scope.objKey] = val;
              obj[$scope.objValue] = val;
              return obj;
            });
          }


          if(!$scope.multiple) {
            // Add null object if nullable
            if ($scope.nullable) {
              var nullObj = {};
              nullObj[$scope.objKey] = null;
              nullObj[$scope.objValue] = '-';
              $scope.internalList = [nullObj].concat($scope.internalList);
            }
          }


          // Set internalSelected
          if(angular.isDefined($scope.internalList) && $scope.internalList.length>0){
            $scope.emptyList = false;

            if(!$scope.multiple) {
              if($scope.model){
                // Initial select if internal list is defined
                var obj = {};
                if ($scope.selectedIsObj){
                  obj[$scope.objKey] = $scope.model[$scope.objKey];
                }else{
                  obj[$scope.objKey] = $scope.model;
                }
                setSelected(_.findWhere($scope.internalList, obj));
              } else {
                // Select first element from internal list
                setSelected($scope.internalList[0]);
              }

              if($scope.formDropdown && $scope.required){
                $scope.formDropdown.$setValidity('required', true);
              }
            } else {
              $scope.internalSelected = angular.copy($scope.list);
            }
          } else {
            // Disable dropdown button if list of items is empty
            $scope.emptyList = true;
            var sel = {};
            sel[$scope.objKey] = null;
            sel[$scope.objValue] = "No options";
            $scope.internalList = [sel];

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', false); // Form is not valid because dropdown is empty and required
            }
            setSelected(sel);
          }
        };

        bootstrap($scope.list);

        $scope.clicked = function(item){
          $scope.formDropdown.$setDirty();

          if($scope.multiple){
            setMultipleSelected(item);
          } else {
            setSelected(item);
          }

        };

        $scope.getLabel = function(item){
          if (item)
            return item[$scope.objValue];
          else
            return '-';
        };

        $scope.getAfterLabel = function(item){
          return item[$scope.afterLabel];
        };

        $scope.$watch('internalSelected', function (value_new, value_old) {
          // Update $scope.selected based on settings
          if(!$scope.multiple){

            if (value_new[$scope.objKey]==null){
              $scope.model = null;
            } else {
              if ($scope.selectedIsObj){
                $scope.model = value_new;
              } else {
                $scope.model = value_new[$scope.objKey];
              }
            }

          } else {
            if ($scope.selectedIsObj){
              $scope.model = value_new;
            } else {
              $scope.model = value_new[$scope.objKey];
            }
          }
        });

        $scope.$watch('list', function (value_new, value_old) {
          bootstrap(value_new);
        }, true);

        $scope.$watch('model', function (value_new, value_old) {
          if(!$scope.multiple) {
            // Update internalSelected if changed from parent scope
            if (value_new) {
              // Initial select if internal list is defined
              var obj = {};
              if ($scope.selectedIsObj) {
                obj[$scope.objKey] = value_new[$scope.objKey];
              } else {
                obj[$scope.objKey] = value_new;
              }
              setSelected(_.findWhere($scope.internalList, obj));
            } else {
              // Select first element from internal list
              setSelected($scope.internalList[0]);
            }
          } else {
            //setMultipleSelected(value_new);
          }
        });


      }
    };
  });
