'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDate
 * @description
 * # niceDate
 */
angular.module('niceElements')

  .directive('niceDate', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'views/nice-date.html',
      scope: {
        model: '=',
        time: '=',
        maxDate: '=',
        minDate: '=',
        nextDate: '='
      },
      controller: function($scope) {
        $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        $scope.minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
        $scope.translations = {
          nextMonth: "Next month",
          prevMonth: "Previous month",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun"
        };
        $scope.timeData = {
          dateMinute: 0,
          dateHours: 0
        };

        if(!$scope.model) $scope.model = moment();

        if(!$scope.time) $scope.time = false;
        else $scope.time = $scope.time == "true";


        // ------------------ Time changes ------------------
        $scope.timeChange = function(newHour, newMinute){
          if(newHour != null) $scope.timeData.dateHour = newHour;
          if(newMinute != null) $scope.timeData.dateMinute = newMinute;

          var selectedDate = angular.copy($scope.model);
          selectedDate = $scope._removeTime(selectedDate);
          selectedDate.hours($scope.timeData.dateHour);
          selectedDate.minutes($scope.timeData.dateMinute);

          $scope.model = selectedDate;
          $scope.forma.$setDirty();
        };


        // ------------------ Day was selected ------------------
        $scope.select = function(day) {
          if(!day.isDisabled){
            var selectedDate = angular.copy(day.date);
            selectedDate.hours($scope.timeData.dateHour);
            selectedDate.minutes($scope.timeData.dateMinute);

            $scope.model = selectedDate;
            $scope.forma.$setDirty();
          }
        };


        // ------------------ Go to next month ------------------
        $scope.next = function() {
          var next = angular.copy($scope.month);
          next = $scope._removeTimeWithDate(next.month(next.month()+1).date(0));
          $scope.month.month($scope.month.month()+1);
          $scope._buildMonth(next, $scope.month);
        };


        // ------------------ Go to previous month ------------------
        $scope.previous = function() {
          var previous = angular.copy($scope.month);
          previous = $scope._removeTimeWithDate(previous.month(previous.month()-1).date(0));
          $scope.month.month($scope.month.month()-1);
          $scope._buildMonth(previous, $scope.month);
        };


        // ------------------ Check if dates are equal without time ------------------
        $scope.isSameDay = function(date1, date2){
          return (
            date1.date() == date2.date() &&
            date1.month() == date2.month() &&
            date1.year() == date2.year()
          )
        };

        $scope.isSameMonth = function(date1, date2){
          return (
            date1.month() == date2.month() &&
            date1.year() == date2.year()
          )
        };


        $scope.isBetween = function(date1, date2, date3){
          if(!$scope.nextDate){
            return false;
          } else if($scope.isSameDay(date1, date2) || $scope.isSameDay(date1, date3)){
            return true;
          } else if(date2.isBefore(date3)){
            return $scope._removeTime(date1).isBetween(date2, date3);
          } else {
            return $scope._removeTime(date1).isBetween(date3, date2);
          }
        };


        // ------------------ Format date ------------------
        $scope.formatDate = function(date){
          if($scope.time) return date.format('D.M.YYYY - HH:mm');
          else return date.format('D.M.YYYY');
        };


        // ------------------ Remove time from date ------------------
        $scope._removeTime = function(date) {
          return date.hour(0).minute(0).second(0).millisecond(0);
        };

        $scope._removeTimeWithDate = function(date) {
          return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        };


        // ------------------ Build month ------------------
        $scope._buildMonth = function(start, month) {
          var done = false;
          var date = start.clone().startOf('week').isoWeekday(1);
          var monthIndex = date.month();
          var count = 0;

          date.add(1, "w");

          $scope.weeks = [];
          while (!done) {
            $scope.weeks.push({ days: $scope._buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
          }
        };


        // ------------------ Build week ------------------
        $scope._buildWeek = function(date, month) {
          var days = [];
          for (var i = 0; i < 7; i++) {
            var day = {
              name: date.format("dd"),
              number: date.date(),
              isCurrentMonth: $scope.isSameMonth(date, month),
              isToday: date.isSame(new Date(), "day"),
              isWeekday: date.weekday() == 0 || date.weekday() == 6,
              date: date
            };

            if($scope.minDate) day.isDisabled = date.isBefore($scope.minDate);
            if($scope.maxDate) day.isDisabled = date.isAfter($scope.maxDate);
            if($scope.minDate && $scope.maxDate) day.isDisabled = !date.isBetween($scope.minDate, $scope.maxDate);

            days.push(day);
            date = date.clone();
            date.add(1, "d");
          }

          return days;
        };


        // ------------------ Watch for model change ------------------
        $scope.$watchGroup(["model", 'minDate', 'maxDate', 'nextDate'], function(){
          $scope.boostrap();
        });


        // ------------------ Bootstrap ------------------
        $scope.getTime = function(){
          if ($scope.time) {
            $scope.timeData.dateHour = $scope.model.hours();
            $scope.timeData.dateMinute = $scope.model.minutes();
          } else {
            $scope.timeData.dateHour = 0;
            $scope.timeData.dateMinute = 0;
          }
        };


        // ------------------ Bootstrap ------------------
        $scope.boostrap = function(){
          $scope.month = angular.copy($scope.model);
          $scope.getTime();
          if(!$scope.time) {
            $scope.model = $scope._removeTime($scope.model);
          }

          var start = angular.copy($scope.model);
          start = $scope._removeTimeWithDate(start.date(0));
          $scope._buildMonth(start, $scope.month);
        };

        $scope.boostrap();

      }
    };
  });
