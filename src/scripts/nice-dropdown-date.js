'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDropdownDate
 * @description
 * # niceDropdownDate
 */
angular.module('niceElements')
.factory('rsmdateutils', function () {
  // validate if entered values are a real date
  function validateDate(date){
    // store as a UTC date as we do not want changes with timezones
    var d = new Date(Date.UTC(date.year, date.month, date.day));
    return d && (d.getMonth() === date.month && d.getDate() === Number(date.day));
  }

  // reduce the day count if not a valid date (e.g. 30 february)
  function changeDate(date){
    date.day--;
    if(date.day <= 0) {
      date.day = 31;
      date.month--;
    }
    return date;
  }

  function dateToString(dateObject){
    //var d = new Date(dateObject);
    var d = dateObject;
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    var _date = year + "-" + month + "-" + day;
    return _date;
  }

  var self = this;
  this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  this.months = [
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

  return {
    checkDate: function(date) {
      if(!date.day || (!date.month && date.month!=0) || !date.year){
        return false;
      }
      if(validateDate(date)) {
        // update the model when the date is correct
        return date;
      }
      else {
        // change the date on the scope and try again if invalid
        return this.checkDate(changeDate(date));
      }
    },
    get: function(name) {
      return self[name];
    },
    dateToString: dateToString
  };
})


.directive('niceDropdownDate', function (rsmdateutils){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "views/nice-dropdown-date.html",
    scope: {
      model: '=',
      title: '@',
      fieldWidth: '@',
      labelWidth: '@',
      noMargin: '@',
      disabled: '@'
    },
    link: function(scope, element, attrs, ngModel){
      if(attrs.yearText) {
        scope.yearText = true;
      }

      // set the years drop down from attributes or defaults
      var currentYear = parseInt(attrs.startingYear,10) || new Date().getFullYear();
      var numYears = parseInt(attrs.numYears,10) || 100;
      var oldestYear = currentYear - numYears;
      var newestYear = currentYear - 17;

      scope.years = [];
      for(var i = currentYear; i >= oldestYear; i-- ){
        if (i <= newestYear){
          scope.years.push(i);
        }
      }

      // pass down the ng-disabled property
      scope.$parent.$watch(attrs.ngDisabled, function(newVal){
        scope.disableFields = newVal;
      });
    },
    controller: function ($scope, rsmdateutils) {
      // set up arrays of values
      $scope.days = rsmdateutils.get('days');
      $scope.months = rsmdateutils.get('months');

      // split the current date into sections
      $scope.dateFields = {};


      $scope.$watch('model', function ( newDate, oldDate ) {
        if (Object.keys($scope.dateFields).length === 0 || newDate != oldDate){
          var date = moment(newDate);
          $scope.dateFields.day = date.get('date');
          $scope.dateFields.month = date.get('month');
          $scope.dateFields.year = date.get('year');
          $scope.checkDate();
        }else{
          //console.log('model changed, but internally');
        }
      });

      // validate that the date selected is accurate
      $scope.checkDate = function(){
        // update the date or return false if not all date fields entered.
        var date = rsmdateutils.checkDate($scope.dateFields);
        if(date){
          $scope.dateFields = date;
          $scope.model = rsmdateutils.dateToString(new Date($scope.dateFields.year, $scope.dateFields.month, $scope.dateFields.day))
        }
      };
    }
  };
});