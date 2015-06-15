'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceChoice
 * @description
 * # niceChoice
 */
angular.module('niceElements')
  .directive('niceChoice', function () {
    return {
      templateUrl: 'views/nice-choice.html',
      restrict: 'E',
      scope: {
        title: '@',
        model: '=',
        list: '=',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        listIsObj: '@',
        selectedIsObj: '@',
        objValue: '@',
        objKey: '@',
        noMargin: '@',
        multiple: '@'
      },
      link: function (scope, element, attr) {
        scope.firstTime = true;
        scope.checkIfFirstTime = function(){
          if (scope.firstTime){
            scope.firstTime = false;
            return true;
          }else{
            return false;
          }
        };

        // If selected is not yet defined
        if(!angular.isDefined(scope.model)){
          if (scope.multiple) {
            scope.model = [];
          }
        }

        if(!angular.isDefined(scope.objValue))
          scope.objValue = "value";

        if(!angular.isDefined(scope.objKey))
          scope.objKey = "id";

        // Set internalList
        if (scope.listIsObj) {
          scope.internalList = scope.list;
        } else {
          scope.internalList =_.map(scope.list, function(val) {
            var obj = {};
            obj[scope.objKey] = val;
            obj[scope.objValue] = val;
            return obj;
          });
        }

        // Set internalSelected
        if (scope.selectedIsObj) {
          scope.internalSelected = scope.model;
        }else {
          if (scope.multiple) {
            scope.internalSelected =_.map(scope.model, function(val) {
              var obj = {};
              obj[scope.objKey] = val;
              obj[scope.objValue] = val;
              return obj;
            });
          } else {
            if (scope.model) {
              var obj = {};
              obj[scope.objKey] = scope.model;
              obj[scope.objValue] = scope.model;
              scope.internalSelected = obj;
            }else{
              scope.internalSelected = scope.internalList[0];
            }
          }
        }
      },
      controller: function($rootScope, $scope) {
        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };

        $scope.setDefault = function(){
          if(!$scope.multiple){
            $scope.internalSelected = $scope.internalList[0];
          }
        };

        $scope.isItemSelected = function(item){
          if (!$scope.internalSelected)
            return false;
          // Which item is selected
          if ($scope.multiple) {
              return _.where($scope.internalSelected, getFilter(item)).length > 0;
          }else{
              return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };

        $scope.toggle = function(item) {
          if (!$scope.isDisabled) {
            $scope.formChoice.$setDirty();

            if (!$scope.multiple) {
              $scope.internalSelected = item;
            } else {
              if($scope.isItemSelected(item)){
                  $scope.internalSelected = _.without($scope.internalSelected, _.findWhere($scope.internalSelected, getFilter(item)));
              } else {
                $scope.internalSelected.push(item);
              }
            }
          }
        };

        $scope.getLabel = function(item){
          return item[$scope.objValue];
        };

        $scope.$watchCollection('list', function (value_new, value_old) {
          // Set internalList
          if ($scope.listIsObj) {
            $scope.internalList = $scope.list;
          }else{
            $scope.internalList =_.map($scope.list, function(val) {
              var obj = {};
              obj[$scope.objKey] = val;
              obj[$scope.objValue] = val;
              return obj;
            });
          }
        });

        $scope.$watchCollection('internalSelected', function (value_new, value_old) {
          // Update $scope.selected based on settings
          if (!angular.equals(value_new, value_old) || $scope.checkIfFirstTime()){
            if ($scope.selectedIsObj){
              $scope.model = value_new;
            } else {
              if ($scope.multiple){
                $scope.model = _.map(value_new, $scope.objKey);
              } else {
                $scope.model = value_new[$scope.objKey];
              }
            }
          }
        });

        $scope.$watchCollection('model', function (value_new, value_old) {
          if (!angular.equals(value_new, value_old)) {
            if (!value_new){
              if(!$scope.multiple)
                $scope.internalSelected = $scope.internalList[0];
              else
                $scope.internalSelected = [];
            } else {
              // Update $scope.internalSelected based on updated parent scope value $scope.selected and settings
              if ($scope.selectedIsObj) {
                $scope.internalSelected = value_new;

              } else {
                if ($scope.multiple) {
                  $scope.internalSelected = _.map(value_new, function (item) {
                    return _.find($scope.internalList, getFilter(item));
                  })
                } else {
                  $scope.internalSelected = _.find($scope.internalList, getFilter(value_new));
                }
              }
            }
          }

          if(!value_new){
            if (!$scope.multiple) {
              $scope.internalSelected = $scope.internalList[0];
            }
          }
        });

      }
    };
  });
