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
        selectedIsObj: '@',       // Optional parameter.
        nullable: '@',            // No selection is possible
        required: '@',            // Model cannot be NULL
        showTax: '@',             // Shows tax rate
        noMargin: '@',            // margin-bottom: 0px
        multiple: '@',            // Can select multiple items
        help: '@',
        listenKeydown: '@',
        noOptionsText: "@"
      },
      controller: function($rootScope, $scope, $document, $element) {
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.list) { $scope.list = []; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = "No options"; }
        if(!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        if(!$scope.listenKeydown) { $scope.listenKeydown = false; }
        $scope.valid = $scope.formDropdown;


        $scope.selectedIsObj = $scope.selectedIsObj === 'true' || $scope.selectedIsObj === true;
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.required = $scope.required === 'true' || $scope.required === true;
        $scope.showTax = $scope.showTax === 'true' || $scope.showTax === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;

        $scope.internalSelected = null;
        $scope.id = Math.random().toString(36).substring(7);

        $scope.isOpen = false;
        $scope.toggle = function(){ $scope.isOpen = !$scope.isOpen; };
        $scope.close = function(){ $scope.isOpen = false; };
        $scope.open = function(){ $scope.isOpen = true; };


        // ----------------------------------- Get filter -----------------------------------
        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };


        // ----------------------------------- Set internal list -----------------------------------
        var _set_internal_list = function(){
          $scope.internalList = angular.copy($scope.list);
        };


        // ----------------------------------- Add null object to internal list -----------------------------------
        var _add_null_object_to_internal = function(){
          if ($scope.nullable && !$scope.multiple) {
            var nullObj = {};
            nullObj[$scope.objKey] = null;
            nullObj[$scope.objValue] = '-';
            $scope.internalList = [nullObj].concat($scope.internalList);
          }
        };


        // ----------------------------------- Get selected object -----------------------------------
        var _get_selected_object = function(selected){
          if (!selected) return null;
          if ($scope.selectedIsObj) {
            return selected;
          } else {
            return _.find($scope.internalList, getFilter(selected));
          }
        };


        // ----------------------------------- Init -----------------------------------
        var _set_internal_selected_one = function(selected){
          var obj = {};

          var selectedObj = _get_selected_object(selected);
          // console.log('_set_internal_selected_one', selected, selectedObj);
          if(selectedObj && _.find($scope.internalList, getFilter(selected))){
            obj = selectedObj;
          } else {
            obj = $scope.internalList[0];
          }
          $scope.internalSelected = obj;
          _set_model(obj);
        };


        // ----------------------------------- Get selected objects -----------------------------------
        var _get_selected_objects = function(selected){
          if (!selected)
            return null;

          if ($scope.selectedIsObj)
            return selected;
          else {
            // from [1,2,3] get list of objects [{}, {}, {}]
            return _.map(selected, function (val) {
              return _.find($scope.internalList, getFilter(val));
            });
          }
        };


        // ----------------------------------- Set internal selected multiple -----------------------------------
        var _set_internal_selected_multiple = function(item){
          var _selected_objects = _get_selected_objects(item);
          if (_selected_objects){
            $scope.internalSelected = _selected_objects;
            _set_model($scope.internalSelected);
          } else {
            $scope.internalSelected = [];
            _set_model($scope.internalSelected);
          }
        };


        // ----------------------------------- Set model -----------------------------------
        var _set_model = function(value){
          var _new = angular.copy($scope.model);

          if(!$scope.multiple){
            if (value[$scope.objKey]==null){
              _new = null;
            } else {
              if ($scope.selectedIsObj){
                _new = value;
              } else {
                _new = value[$scope.objKey];
              }
            }
          } else {
            if ($scope.selectedIsObj){
              _new = value;
            } else {
              _new = _.map(value, function (val) {
                return val[$scope.objKey];
              });
            }
          }

          // update model only if it is changed
          if (!_.isEqual(_new, $scope.model)){
            $scope.model = _new;
          }
        };


        // ----------------------------------- Init -----------------------------------
        var init = function() {
          _set_internal_list();
          _add_null_object_to_internal();

          if($scope.multiple && $scope.model){
            if ($scope.internalSelected) {
              // remove already selected but not in list - this happens when list changes from outside
              _set_internal_selected_multiple(_.filter($scope.internalSelected, function (obj) {
                return _.find($scope.internalList, getFilter(obj));
              }));
            } else {
              $scope.internalSelected = [];
            }
          }

          // Set internalSelected
          if($scope.internalList && $scope.internalList.length>0){
            $scope.emptyList = false;

            if ($scope.multiple) {
              _set_internal_selected_multiple($scope.model);
            } else {
              _set_internal_selected_one($scope.model);
            }

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', true);
            }
          } else {
            // Disable dropdown button if list of items is empty
            $scope.emptyList = true;
            var sel = {};
            sel[$scope.objKey] = null;
            sel[$scope.objValue] = $scope.noOptionsText;
            $scope.internalList = [sel];

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', false); // Form is not valid because dropdown is empty and required
            }

            if ($scope.multiple) {
              _set_internal_selected_multiple(sel);
            } else {
              _set_internal_selected_one([sel]);
            }
          }
        };


        // ----------------------------------- Is Item selected -----------------------------------
        $scope.isItemSelected = function(item){
          if (!$scope.internalSelected) return false;

          // Which item is selected
          if ($scope.multiple) {
            return _.where($scope.internalSelected, {'id':item.id}).length > 0;
          } else {
            return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };


        // ----------------------------------- Item clicked -----------------------------------
        $scope.clicked = function(item){
          $scope.formDropdown.$setDirty();
          if($scope.multiple){
            // This actually toggles selection
            var _current = angular.copy($scope.internalSelected);
            if(!_.find(_current, getFilter(item))){
              _current.push(item);
            } else {
              _current = _.reject(_current, getFilter(item[$scope.objKey]));
            }
            _set_internal_selected_multiple(_current);
          } else {
            _set_internal_selected_one(item);
            $scope.close();
          }

        };


        // ----------------------------------- Get label -----------------------------------
        $scope.getLabel = function(item){
          if (item) {
            return item[$scope.objValue];
          } else {
            return '-';
          }
        };


        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watch('list', function (value_new, value_old) {
          init();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          if ($scope.multiple) {
            var _new_model_object = _get_selected_object(value_new);
          } else {
            var _new_model_object = _get_selected_objects(value_new);
          }

          if (!_.isEqual(_new_model_object, $scope.internalSelected)){
            init();
          }
        });


        // ----------------------------------- Listen keydown -----------------------------------
        $scope.bindKeypress = function(){
          if ($scope.listenKeydown) {
            $element.bind('keyup', function (e) {
              console.log(e);
              // bind to keypress events if dropdown list is opened
              if ($scope.isOpen) {
                var char = String.fromCharCode(e.which).toLowerCase();

                // find first element with value starting on selected char
                var index = _.findIndex($scope.internalList, function (item) {
                  var _name = item[$scope.objValue].toLowerCase();
                  return _name.indexOf(char) === 0;
                });

                if (index >= 0) {
                  // scroll within dropdown list to selected index
                  var _id_name = '#' + $scope.id + '-' + index;
                  var _id_first = '#' + $scope.id + '-0';
                  var _relative_top = Math.abs($(_id_first).offset().top - $(_id_name).offset().top);
                  if (_relative_top >= 0){
                    $("#" + $scope.id).animate({scrollTop: _relative_top}, 100);
                  }
                }
              }
            });
          }
        };

        $scope.unbindKeypress = function(){
          $element.off('keyup', function (e) {});
        }

      }
    };
  });
