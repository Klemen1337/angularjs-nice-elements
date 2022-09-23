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
      controller: function ($element, $timeout, $scope) {
        $scope.isOpen = false;
        $scope.model = {
          innerStartDate: null,
          innerEndDate: null,
        }


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
          $scope.model.innerStartDate = angular.copy($scope.startDate);
        }

        // Set end date
        if(!$scope.endDate) {
          $scope.endDate = moment();
        } else {
          $scope.model.innerEndDate = angular.copy($scope.endDate);
        }


        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function() {
          var button = $element[0].getElementsByClassName('nice-daterange-picker-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-daterange-picker-wrapper')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              }
            ],
          });
        };
        
        $timeout(function () {
          $scope.setupPopper();
        });


        $scope.format = function(){
          $scope.modelFormat = $scope.startDate.format($scope.formatString) + " - " + $scope.endDate.format($scope.formatString);
        };


        $scope.open = function() {
          if (!$scope.isDisabled) {
            $scope.isOpen = true;
            $scope.popper.update();
          }
        };


        $scope.close = function() {
          $scope.model.innerStartDate = angular.copy($scope.startDate);
          $scope.model.innerEndDate = angular.copy($scope.endDate);
          $scope.isOpen = false;
        };


        $scope.confirm = function() {
          $scope.startDate = angular.copy($scope.model.innerStartDate);
          $scope.endDate = angular.copy($scope.model.innerEndDate);
          if ($scope.onChange) $scope.onChange({ startDate: $scope.startDate, endDate: $scope.endDate });
          $scope.isOpen = false;
        };


        $scope.selectToday = function(){
          $scope.model.innerStartDate = moment().startOf('day');
          $scope.model.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastNDays = function(days){
          $scope.model.innerStartDate = moment().subtract(days, 'days').startOf('day');
          $scope.model.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastMonth = function(){
          $scope.model.innerStartDate = moment().subtract(1, 'months').startOf('month').startOf('date');
          $scope.model.innerEndDate = moment().subtract(1, 'months').endOf('month').endOf('date');
        };


        $scope.selectThisMonth = function(){
          $scope.model.innerStartDate = moment().startOf('month').startOf('date');
          $scope.model.innerEndDate = moment().endOf('month').endOf('date');
        };


        // ------------------ Remove time from date ------------------
        $scope._removeTime = function(date) {
          return date.hour(0).minute(0).second(0).millisecond(0);
        };


        $scope.dateChanged = function() {
          $timeout(function() {
            if ($scope.model.innerStartDate && $scope.model.innerEndDate) {
              // Check if start date is after end date
              if ($scope.model.innerStartDate.isAfter($scope.model.innerEndDate)) {
                var temp = angular.copy($scope.model.innerStartDate);
                $scope.model.innerStartDate = angular.copy($scope.model.innerEndDate); 
                $scope.model.innerEndDate = temp; 
              }

              // Check if end date is before start date
              if ($scope.model.innerEndDate.isBefore($scope.model.innerStartDate)) {
                var temp = angular.copy($scope.model.innerStartDate);
                $scope.model.innerStartDate = angular.copy($scope.model.innerEndDate); 
                $scope.model.innerEndDate = temp; 
              }
            }
          });
        }


        $scope.$watchGroup(["startDate", "endDate"], function() {
          $scope.model.innerStartDate = angular.copy($scope.startDate);
          $scope.model.innerEndDate = angular.copy($scope.endDate);
          $scope.format();
        });
      }
    }
  });