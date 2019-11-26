'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDropdownDate
 * @description
 * # niceDropdownDate
 */
angular.module('niceElements')
  .directive('niceDropdownDate', function (){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "src/components/nice-dropdown-date/nice-dropdown-date.html",
    scope: {
      model: '=',
      title: '@',
      fieldWidth: '@',
      labelWidth: '@',
      noMargin: '@',
      isDisabled: '=',
      numYears: '@',
      startingYear: '@',
      mature: '@',
      help: '@',
      isInline: '=',
      onChange: '&?'
    },
    link: function ($scope) {
      $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
      $scope.months = [
        { value: 0, name: 'Jan' },
        { value: 1, name: 'Feb' },
        { value: 2, name: 'Mar' },
        { value: 3, name: 'Apr' },
        { value: 4, name: 'May' },
        { value: 5, name: 'Jun' },
        { value: 6, name: 'Jul' },
        { value: 7, name: 'Aug' },
        { value: 8, name: 'Sep' },
        { value: 9, name: 'Oct' },
        { value: 10, name: 'Nov' },
        { value: 11, name: 'Dec' }
      ];


      // Set the years drop down from attributes or defaults
      var currentYear = parseInt($scope.startingYear, 10) || new Date().getFullYear();
      var numYears = parseInt($scope.numYears, 10) || 100;
      var oldestYear = currentYear - numYears;
      var newestYear = currentYear;


      // If mature
      if($scope.mature) newestYear -= 17;


      // Create years array
      $scope.years = [];
      for(var i = currentYear; i >= oldestYear; i-- ){
        if (i <= newestYear){
          $scope.years.push(i);
        }
      }


      // Split the current date into sections
      $scope.dateFields = {};


      // Watch for model change
      $scope.$watch('model', function ( newDate, oldDate ) {
        if (newDate && newDate != oldDate){
          var date = moment(newDate);
          $scope.dateFields.day = date.get('date');
          $scope.dateFields.month = date.get('month');
          $scope.dateFields.year = date.get('year');
          $scope.checkDate();
        }
      });


      // validate that the date selected is accurate
      $scope.checkDate = function(){
        var date = moment($scope.dateFields.day + "." + ($scope.dateFields.month + 1) + "." + $scope.dateFields.year, "DD.MM.YYYY");

        if(date.isValid()){
          // Format
          $scope.model = date.format();
          if ($scope.onChange) $scope.onChange({ model: $scope.model });

          // Change dates
          $scope.days = [];
          for(i = 1; i <= date.daysInMonth(); i++){
            $scope.days.push(i);
          }

          // Valid
          $scope.dropdownDateForm.$setValidity('validDate', true);
          $scope.dropdownDateForm.$setDirty();
        } else {
          // Invalid
          $scope.dropdownDateForm.$setValidity('validDate', false);
        }
      };


      // Set current date
      if(!$scope.model){
        var date = moment();
        $scope.dateFields.day = date.get('date');
        $scope.dateFields.month = date.get('month');
        $scope.dateFields.year = date.get('year');
        if($scope.mature) $scope.dateFields.year -= 18;
        $scope.checkDate();
      } else {
        var date = moment($scope.model);
        $scope.dateFields.day = date.get('date');
        $scope.dateFields.month = date.get('month');
        $scope.dateFields.year = date.get('year');
        $scope.checkDate();
      }
    }
  };
});