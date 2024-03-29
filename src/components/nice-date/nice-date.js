'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDate
 * @description
 * # niceDate
 */
angular.module('niceElements')
  .directive('niceDate', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'src/components/nice-date/nice-date.html',
      scope: {
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
        model: '=',
        time: '=?',
        date: '=?',
        help: '@',
        inline: '@',
        maxDate: '=',
        minDate: '=',
        nextDate: '=',
        isDisabled: '=',
        isInline: '=',
        onChange: '&?'
      },
      controller: function ($scope, $element, $timeout, gettextCatalog) {
        $scope.isOpen = false;
        if ($scope.date == undefined) $scope.date = true;
        if ($scope.time == undefined) $scope.time = false;
        $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        $scope.minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
        $scope.translations = {
          nextMonth: gettextCatalog.getString("Next month", null, "Nice"),
          prevMonth: gettextCatalog.getString("Previous month", null, "Nice"),
        };
        if (!$scope.model) $scope.model = moment();
        $scope.innerDate = {
          month: 0,
          year: 0,
          minute: 0,
          hour: 0,
          date: moment(),
          value: ""
        };
        $scope.days = [];

        // $scope.weekdays = moment.weekdaysShort(false);
        $scope.weekdays = [
          gettextCatalog.getString("Mon", null, "Nice"),
          gettextCatalog.getString("Tue", null, "Nice"),
          gettextCatalog.getString("Wed", null, "Nice"),
          gettextCatalog.getString("Thu", null, "Nice"),
          gettextCatalog.getString("Fri", null, "Nice"),
          gettextCatalog.getString("Sat", null, "Nice"),
          gettextCatalog.getString("Sun", null, "Nice")
        ];

        $scope.years = [];
        var year = moment().year() - 100;
        for (var i = 0; i < 200; i++) {
          $scope.years.push(year + i);
        }

        $scope.months = [
          { value: 0, name: gettextCatalog.getString("January", null, "Nice") },
          { value: 1, name: gettextCatalog.getString("February", null, "Nice") },
          { value: 2, name: gettextCatalog.getString("March", null, "Nice") },
          { value: 3, name: gettextCatalog.getString("April", null, "Nice") },
          { value: 4, name: gettextCatalog.getString("May", null, "Nice") },
          { value: 5, name: gettextCatalog.getString("June", null, "Nice") },
          { value: 6, name: gettextCatalog.getString("July", null, "Nice") },
          { value: 7, name: gettextCatalog.getString("August", null, "Nice") },
          { value: 8, name: gettextCatalog.getString("September", null, "Nice") },
          { value: 9, name: gettextCatalog.getString("October", null, "Nice") },
          { value: 10, name: gettextCatalog.getString("November", null, "Nice") },
          { value: 11, name: gettextCatalog.getString("December", null, "Nice") }
        ]

        if ($scope.maxDate) $scope.maxDate = moment($scope.maxDate);
        if ($scope.minDate) $scope.minDate = moment($scope.minDate);


        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('nice-date-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-date-dropdown-wrapper')[0];
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
          if (!$scope.inline) $scope.setupPopper();
        });


        // ------------------ Time changes ------------------
        $scope.timeChange = function () {
          var selectedDate = angular.copy($scope.model);
          selectedDate = $scope._removeTime(selectedDate);
          selectedDate.hours($scope.innerDate.hour);
          selectedDate.minutes($scope.innerDate.minute);
          $scope.innerDate.value = $scope.formatDate(selectedDate);

          $scope.model = angular.copy(selectedDate);
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
          $scope.forma.$setDirty();
        };


        // ------------------ Day was selected ------------------
        $scope.select = function (day) {
          if (!day.isDisabled) {
            var selectedDate = angular.copy(day.date);
            selectedDate.hours($scope.innerDate.hour);
            selectedDate.minutes($scope.innerDate.minute);

            $scope.model = angular.copy(selectedDate);
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
            $scope.forma.$setDirty();
          }
        };


        // ------------------ Handle date change ------------------
        $scope.handleDateChange = function () {
          $scope.innerDate.date.year($scope.innerDate.year);
          $scope.innerDate.date.month($scope.innerDate.month);
          $scope._buildMonth();
        };


        // ------------------ Set inner date ------------------
        $scope.setInnerDate = function (date) {
          $scope.innerDate.year = date.year();
          $scope.innerDate.month = date.month();
          $scope.innerDate.date = date;
        };


        // ------------------ Today ------------------
        $scope.today = function () {
          $scope.setInnerDate(moment());
          $scope._buildMonth();
        };


        // ------------------ Go to next month ------------------
        $scope.next = function () {
          $scope.innerDate.date.add(1, "month");
          $scope.setInnerDate($scope.innerDate.date);
          $scope._buildMonth();
        };


        // ------------------ Go to previous month ------------------
        $scope.previous = function () {
          $scope.innerDate.date.subtract(1, "month");
          $scope.setInnerDate($scope.innerDate.date);
          $scope._buildMonth();
        };


        // ------------------ Check if dates are equal without time ------------------
        $scope.isSameDay = function (date1, date2) {
          date1 = moment(date1);
          date2 = moment(date2);
          return (
            date1.date() == date2.date() &&
            date1.month() == date2.month() &&
            date1.year() == date2.year()
          );
        };

        // ------------------ Check month ------------------
        $scope.isSameMonth = function (date1, date2) {
          date1 = moment(date1);
          date2 = moment(date2);
          return (
            date1.month() == date2.month() &&
            date1.year() == date2.year()
          );
        };


        $scope.isBetween = function (date1, date2, date3) {
          if (!$scope.nextDate) {
            return false;
          } else if ($scope.isSameDay(date1, date2) || $scope.isSameDay(date1, date3)) {
            return true;
          } else if (date2.isBefore(date3)) {
            return $scope._removeTime(date1).isBetween(date2, date3);
          } else {
            return $scope._removeTime(date1).isBetween(date3, date2);
          }
        };


        // ------------------ Format date ------------------
        $scope.formatDate = function (date) {
          if ($scope.time) return date.format('D.M.YYYY • H:mm');
          else return date.format('D.M.YYYY');
        };


        // ------------------ Remove time from date ------------------
        $scope._removeTime = function (date) {
          if (!date) return date;
          return date.hour(0).minute(0).second(0).millisecond(0);
        };

        $scope._removeTimeWithDate = function (date) {
          return date.date(0).hour(0).minute(0).second(0).millisecond(0);
        };


        // ------------------ Build month ------------------
        $scope._buildMonth = function () {
          var done = false;
          var date = angular.copy($scope.innerDate.date).date(0).startOf('week').isoWeekday(1);
          var monthIndex = date.month();
          var count = 0;

          date.add(1, "w");

          $scope.weeks = [];
          while (!done) {
            $scope.weeks.push({ days: $scope._buildWeek(date.clone()) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
          }
        };


        // ------------------ Build week ------------------
        $scope._buildWeek = function (date) {
          var days = [];
          for (var i = 0; i < 7; i++) {
            var day = {
              name: date.format("dd"),
              number: date.date(),
              isCurrentMonth: $scope.isSameMonth(date, $scope.innerDate.date),
              isToday: date.isSame(new Date(), "day"),
              isWeekday: date.weekday() == 6 || date.weekday() == 0,
              value: date.format('D.M.YYYY'),
              date: date
            };

            if ($scope.minDate) day.isDisabled = date.isBefore($scope.minDate);
            if ($scope.maxDate) day.isDisabled = date.isAfter($scope.maxDate);
            if ($scope.minDate && $scope.maxDate) day.isDisabled = !date.isBetween($scope.minDate, $scope.maxDate);

            days.push(day);
            date = date.clone();
            date.add(1, "d");
          }

          return days;
        };


        // ------------------ Watch for model change ------------------
        $scope.$watchGroup(["model", 'minDate', 'maxDate', 'nextDate'], function (value) {
          $scope.boostrap();
        });


        // ------------------ Get time ------------------
        $scope.getTime = function () {
          if ($scope.time) {
            $scope.innerDate.hour = moment($scope.model).hours();
            $scope.innerDate.minute = moment($scope.model).minutes();
          } else {
            $scope.innerDate.hour = 0;
            $scope.innerDate.minute = 0;
          }

          $scope.innerDate.value = $scope.formatDate($scope.innerDate.date);
        };


        // ------------------ Bootstrap ------------------
        $scope.boostrap = function () {
          $scope.setInnerDate(moment($scope.model));
          $scope.getTime();

          if (!$scope.time) {
            $scope.model = $scope._removeTime($scope.model);
          }

          $scope.innerDate.value = $scope.formatDate(moment($scope.model));
          $scope._buildMonth();
        };

        $scope.boostrap();


        // ------------------ Toggle open ------------------
        $scope.toggleOpen = function () {
          if (!$scope.isDisabled) {
            $scope.isOpen = !$scope.isOpen;
            $timeout(function () {
              if ($scope.popper) $scope.popper.update();
            })
          }
        };
      }
    };
  });
