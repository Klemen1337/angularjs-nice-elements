'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDropdownDate
 * @description
 * # niceDropdownDate
 */
angular.module('niceElements')
  .directive('niceDropdownDate', function (gettextCatalog) {
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
        { value: 0, name: gettextCatalog.getString('Jan', null, 'Nice') },
        { value: 1, name: gettextCatalog.getString('Feb', null, 'Nice') },
        { value: 2, name: gettextCatalog.getString('Mar', null, 'Nice') },
        { value: 3, name: gettextCatalog.getString('Apr', null, 'Nice') },
        { value: 4, name: gettextCatalog.getString('May', null, 'Nice') },
        { value: 5, name: gettextCatalog.getString('Jun', null, 'Nice') },
        { value: 6, name: gettextCatalog.getString('Jul', null, 'Nice') },
        { value: 7, name: gettextCatalog.getString('Aug', null, 'Nice') },
        { value: 8, name: gettextCatalog.getString('Sep', null, 'Nice') },
        { value: 9, name: gettextCatalog.getString('Oct', null, 'Nice') },
        { value: 10, name: gettextCatalog.getString('Nov', null, 'Nice') },
        { value: 11, name: gettextCatalog.getString('Dec', null, 'Nice') }
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
        var date = moment($scope.dateFields.day + "." + ($scope.dateFields.month + 1) + "." + $scope.dateFields.year, "D.M.YYYY");

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