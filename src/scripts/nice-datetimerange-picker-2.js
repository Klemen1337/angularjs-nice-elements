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
        formatString: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
        modelFormat: '@',
        time: '@', // default: false, is time picker enabled?
        minDate: '@', // default: undefined
        maxDate: '@', // default: undefined
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@' // default: 'col-sm-4', bootstrap classes that defines width of label
      },
      templateUrl: 'views/nice-datetimerange-picker-2.html',
      controller: function ($rootScope, $scope) {
        $scope.isOpen = false;


        // Set defaults
        if(!$scope.time) $scope.time = false;
        else $scope.time = $scope.time == "true";


        // Set format string
        if(!$scope.formatString) {
          if($scope.time) $scope.formatString = 'DD.MM.YYYY HH:mm';
          else $scope.formatString = 'DD.MM.YYYY';
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
          $scope.modelFormat = $scope.innerStartDate.format($scope.formatString) + " - " + $scope.innerEndDate.format($scope.formatString);
        };


        $scope.open = function() {
          $scope.isOpen = true;
        };


        $scope.close = function() {
          $scope.isOpen = false;
        };


        $scope.confirm = function() {
          $scope.startDate = angular.copy($scope.innerStartDate);
          $scope.endDate = angular.copy($scope.innerEndDate);
          $scope.close();
        };


        $scope.selectLastNDays = function(days){
          $scope.startDate = moment().subtract(days, 'days');
          $scope.endDate = moment();
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
        };


        $scope.selectLastMonth = function(){
          $scope.startDate = moment().subtract(1, 'months');
          $scope.endDate = moment();
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
        };


        $scope.selectThisMonth = function(){
          $scope.startDate = moment().date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
          $scope.endDate = moment().endOf('month');
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
        };


        $scope.$watchGroup(["innerStartDate", "innerEndDate"], function(newValues){
          if(newValues[0] && newValues[1]){
            $scope.format();
          }
        });


        $scope.$watchGroup(["startDate", "endDate"], function(){
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
        });
      }
    }
  });