'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimerangePicker2
 * @description
 * # niceDatetimerangePicker2
 */
angular.module('niceElements')
  .directive('niceDatetimerangePicker2', function() {
    return {
      scope: {
        startDate: '=', // binding model
        endDate: '=', // binding model
        formatString: '@', // default: 'D.M.YYYY • H:mm', format for input label string
        modelFormat: '@',
        time: '@', // default: false, is time picker enabled?
        minDate: '@', // default: undefined
        maxDate: '@', // default: undefined
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
        isDisabled: '=',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },
      templateUrl: 'src/components/nice-datetimerange-picker-2/nice-datetimerange-picker-2.html',
      controller: function ($rootScope, $scope) {
        $scope.isOpen = false;


        // Set defaults
        if(!$scope.time) $scope.time = false;
        else $scope.time = $scope.time == "true";


        // Set format string
        if(!$scope.formatString) {
          if($scope.time) $scope.formatString = 'D.M.YYYY • H:mm';
          else $scope.formatString = 'D.M.YYYY';
        }

        // Set start date
        if(!$scope.startDate) {
          $scope.startDate = moment();
        } else {
          $scope.innerStartDate = angular.copy($scope.startDate);
        }

        // Set end date
        if(!$scope.endDate) {
          $scope.endDate = moment();
        } else {
          $scope.innerEndDate = angular.copy($scope.endDate);
        }


        $scope.format = function(){
          $scope.modelFormat = $scope.startDate.format($scope.formatString) + " - " + $scope.endDate.format($scope.formatString);
        };


        $scope.open = function() {
          if (!$scope.isDisabled) {
            $scope.isOpen = true;
          }
        };


        $scope.close = function() {
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
          $scope.isOpen = false;
        };


        $scope.confirm = function() {
          $scope.startDate = angular.copy($scope.innerStartDate);
          $scope.endDate = angular.copy($scope.innerEndDate);
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
          $scope.close();
        };


        $scope.selectToday = function(){
          $scope.innerStartDate = moment().startOf('day');
          $scope.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastNDays = function(days){
          $scope.innerStartDate = moment().subtract(days, 'days').startOf('day');
          $scope.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastMonth = function(){
          $scope.innerStartDate = moment().subtract(1, 'months').startOf('month').startOf('date');
          $scope.innerEndDate = moment().subtract(1, 'months').endOf('month').endOf('date');
        };


        $scope.selectThisMonth = function(){
          $scope.innerStartDate = moment().startOf('month').startOf('date');
          $scope.innerEndDate = moment().endOf('month').endOf('date');
        };


        // ------------------ Remove time from date ------------------
        $scope._removeTime = function(date) {
          return date.hour(0).minute(0).second(0).millisecond(0);
        };


        $scope.$watchGroup(["innerStartDate", "innerEndDate"], function(newValues){
          if (newValues[0] && newValues[1]) {
            // Check if start date is after end date
            if ($scope.innerStartDate.isAfter($scope.innerEndDate)) {
              var temp = angular.copy($scope.innerStartDate);
              $scope.innerStartDate = angular.copy($scope.innerEndDate); 
              $scope.innerEndDate = temp; 
            }

            // Check if end date is before start date
            if ($scope.innerEndDate.isBefore($scope.innerStartDate)) {
              var temp = angular.copy($scope.innerStartDate);
              $scope.innerStartDate = angular.copy($scope.innerEndDate); 
              $scope.innerEndDate = temp; 
            }
          }
        });


        $scope.$watchGroup(["startDate", "endDate"], function(){
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
          $scope.format();
        });
      }
    }
  });