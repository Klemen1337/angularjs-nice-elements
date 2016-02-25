'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceCalendar
 * @description
 * # niceCalendar
 */
angular.module('niceElements')
  .directive("niceCalendar", function() {
    return {
      restrict: "E",
      templateUrl: "views/nice-calendar.html",
      scope: {
        title: '@',
        fieldWidth: '@',
        labelWidth: '@',
        format: '@',
        min: '@',
        max: '@',
        time: '@',
        noMargin: '@',
        color: '@',
        endDate: '=',
        startDate: '='
      },
      link: function(scope) {

        // ------------------ Init default values ------------------
        scope.selectStart = true;

        scope.hours = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
        ];

        scope.minutes = [
          0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
        ];


        // ------------------ Check if attributes are set ------------------
        if(!scope.time) scope.time = true;
        if(!scope.format) scope.format = "d.M.yyyy";
        if(!scope.startDate) scope.startDate = moment().minutes(0).second(0).millisecond(0);
        if(!scope.endDate) scope.endDate = moment().minutes(0).second(0).millisecond(0);


        // ------------------ Look for model changes ------------------
        scope.$watch("startDate", function(value, valueOld){
          bootstrap();
        });

        scope.$watch("endDate", function(value, valueOld){
          bootstrap();
        });


        // ------------------ Bootstrap calendar ------------------
        function bootstrap(){
          //scope.startDate = moment(scope.startDate.second(0).millisecond(0));
          //scope.endDate = moment(scope.endDate.second(0).millisecond(0));

          scope.startDateHour = scope.startDate.hours();
          scope.startDateMinute = scope.startDate.minutes();
          scope.endDateHour = scope.endDate.hours();
          scope.endDateMinute = scope.endDate.minutes();
        }

        scope.month = angular.copy(moment(scope.startDate));
        var start = angular.copy(moment(scope.startDate));
        _removeTimeWithDate(start.date(0));
        _buildMonth(scope, start, scope.month);

        bootstrap();


        // ------------------ Day was selected ------------------
        scope.select = function(day) {
          if(scope.selectStart){
            // Set start date
            scope.startDate = day.date;
            scope.selectStart = false;

            // If start date is after end date
            if(scope.startDate.isAfter(scope.endDate)){
              scope.endDate = angular.copy(scope.startDate);
            }
          } else {
            // Set end date
            scope.endDate = day.date;
            scope.selectStart = true;

            // If end date is before start date
            if(scope.endDate.isBefore(scope.startDate)){
              scope.startDate = angular.copy(scope.endDate);
            }
          }
        };


        // ------------------ Time changes ------------------
        scope.startHourChange = function(value){
          scope.startDateHour = value;
          scope.startDate.hours(scope.startDateHour);
        };


        scope.startMinuteChange = function(value) {
          scope.startDateMinute = value;
          scope.startDate.minutes(scope.startDateMinute);
        };


        scope.endHourChange = function(value){
          scope.endDateHour = value;
          scope.endDate.hours(scope.endDateHour);
        };


        scope.endMinuteChange = function(value) {
          scope.endDateMinute = value;
          scope.endDate.minutes(scope.endDateMinute);
        };


        // ------------------ Go to next month ------------------
        scope.next = function() {
          var next = angular.copy(scope.month);
          _removeTimeWithDate(next.month(next.month()+1).date(0));
          scope.month.month(scope.month.month()+1);
          _buildMonth(scope, next, scope.month);
        };


        // ------------------ Go to previous month ------------------
        scope.previous = function() {
          var previous = angular.copy(scope.month);
          _removeTimeWithDate(previous.month(previous.month()-1).date(0));
          scope.month.month(scope.month.month()-1);
          _buildMonth(scope, previous, scope.month);
        };


        // ------------------ Check if dates are equal without time ------------------
        scope.isSameDay = function(date1, date2){
          var d1 = _removeTime(angular.copy(date1));
          var d2 = _removeTime(angular.copy(date2));
          return d1.isSame(d2);
        };


        // ------------------ Check if date is between start and end date ------------------
        scope.isBetweenRange = function(date){
          return (date.isBefore(moment(scope.endDate)) && date.isAfter(moment(scope.startDate)));
        };


        // ------------------ Lighten color by 20% ------------------
        scope.lighten = function(col){
          var amt = 20;
          var usePound = false;

          if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
          }

          var num = parseInt(col,16);
          var r = (num >> 16) + amt;

          if (r > 255) r = 255;
          else if  (r < 0) r = 0;

          var b = ((num >> 8) & 0x00FF) + amt;
          if (b > 255) b = 255;
          else if  (b < 0) b = 0;

          var g = (num & 0x0000FF) + amt;
          if (g > 255) g = 255;
          else if (g < 0) g = 0;

          return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
        };


        // ------------------ Remove time from date ------------------
        function _removeTime(date) {
          return moment(date).hour(0).minute(0).second(0).millisecond(0);
        }

        function _removeTimeWithDate(date) {
          return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }



        // ------------------ Build month ------------------
        function _buildMonth(scope, start, month) {
          scope.weeks = [];
          var done = false, date = start.clone().startOf('week').isoWeekday(1), monthIndex = date.month(), count = 0;
          date.add(1, "w");
          while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
          }
        }


        // ------------------ Build week ------------------
        function _buildWeek(date, month) {
          var days = [];
          for (var i = 0; i < 7; i++) {
            days.push({
              name: date.format("dd"),
              number: date.date(),
              isCurrentMonth: date.month() === month.month(),
              isToday: date.isSame(new Date(), "day"),
              isWeekday: date.weekday() == 0 || date.weekday() == 6,
              date: date
            });

            date = date.clone();
            date.add(1, "d");
          }

          return days;
        }
      }
    };
});
