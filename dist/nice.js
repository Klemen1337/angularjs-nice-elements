'use strict';

angular.module('niceElements', []);

/**
 * @ngdoc directive
 * @name niceElements.directive:niceButtonToggle
 * @description
 * # niceButtonToggle
 */
angular.module('niceElements')
  .directive('niceButtonToggle', function () {
    return {
      templateUrl: 'src/components/nice-button-toggle/nice-button-toggle.html',
      restrict: 'E',
      scope: {
        model: "=?",
        label: "@"
      },
      link: function postLink(scope, element, attrs) {
        if(angular.isDefined(scope.model)){
          scope.model = false;
        }
      }
    };
  });


/**
 * @ngdoc directive
 * @name niceElements.directive:niceButton
 * @description
 * # niceButton
 */
angular.module('niceElements')
  .directive('niceButton', function ($q) {
    return {
      templateUrl: 'src/components/nice-button/nice-button.html',
      restrict: 'E',
      transclude: true,
      scope: {
        niceDisabled: '=',
        title: "@",
        noMargin: "=",
        fieldWidth: '@',
        labelWidth: '@',
        niceClick: '&',
        addClass: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.loading = false;

        scope.click = function(){

          if (scope.loading===false && scope.niceDisabled!==true){
            scope.loading = true;

            $q.when(scope.niceClick()).finally(function(){
              scope.loading = false;
            });
          }
        }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceCalendar
 * @description
 * # niceCalendar
 */
angular.module('niceElements')
  .directive("niceCalendar", function($timeout) {
    return {
      restrict: "E",
      templateUrl: "src/components/nice-calendar/nice-calendar.html",
      scope: {
        title: '@',
        fieldWidth: '@',
        labelWidth: '@',
        minDate: '=',
        maxDate: '=',
        time: '@',
        noMargin: '@',
        color: '@',
        endDate: '=',
        startDate: '=',
        translations: '@'
      },
      link: function(scope) {
        scope.translations = {
          selectStartDate: "Select start date",
          selectStartTime: "Select start time",
          selectEndDate: "Select end date",
          selectEndTime: "Select end time",
          nextMonth: "Next month",
          prevMonth: "Previous month",
          start: "Start",
          end: "End",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun",
          january: "January",
          february: "February",

        };

        // ------------------ Init default values ------------------
        scope.selectStart = true;
        scope.popupText = scope.translations.selectStartDate;

        scope.hours = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
        ];

        scope.minutes = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59
        ];


        // ------------------ Check if attributes are set ------------------
        if(!scope.startDate) scope.startDate = moment().minutes(0).second(0).millisecond(0);
        if(!scope.endDate) scope.endDate = moment().minutes(0).second(0).millisecond(0);


        // ------------------ Look for model changes ------------------
        scope.$watch("startDate", function(value, valueOld){
          bootstrap();
        });

        scope.$watch("endDate", function(value, valueOld){
          bootstrap();
        });

        scope.$watch("minDate", function(value, valueOld){
          bootstrap();
        });

        scope.$watch("maxDate", function(value, valueOld){
          bootstrap();
        });


        // ------------------ Bootstrap calendar ------------------
        function bootstrap() {
          //scope.startDate = moment(scope.startDate.second(0).millisecond(0));
          //scope.endDate = moment(scope.endDate.second(0).millisecond(0));

          scope.startDateHour = moment(scope.startDate).hours();
          scope.startDateMinute = moment(scope.startDate).minutes();
          scope.endDateHour = moment(scope.endDate).hours();
          scope.endDateMinute = moment(scope.endDate).minutes();

          scope.month = angular.copy(moment(scope.startDate));
          var start = angular.copy(moment(scope.startDate));
          _removeTimeWithDate(start.date(0));
          _buildMonth(scope, start, scope.month);
        }

        bootstrap();


        // ------------------ Day was selected ------------------
        scope.select = function(day) {
          if(!day.isDisabled){
            var selectedDate = angular.copy(day.date);

            if(scope.selectStart){
              selectedDate.hours(scope.startDateHour);
              selectedDate.minutes(scope.startDateMinute);

              // Set start date
              scope.startDate = selectedDate;
              scope.selectStart = false;
              scope.popupText = scope.translations.selectEndDate;
              scope.formCalendar.$setDirty();
              scope.displayStartChange();

              // If start date is after end date
              if(scope.startDate.isAfter(scope.endDate)){
                scope.endDate = angular.copy(scope.startDate);
              }
            } else {
              selectedDate.hours(scope.endDateHour);
              selectedDate.minutes(scope.endDateMinute);

              // Set end date
              scope.endDate = selectedDate;
              scope.selectStart = true;
              scope.popupText = scope.translations.selectStartDate;
              scope.formCalendar.$setDirty();
              scope.displayEndChange();

              // If end date is before start date
              if(scope.endDate.isBefore(scope.startDate)){
                scope.startDate = angular.copy(scope.endDate);
              }
            }
          }
        };


        // ------------------ Display date changes ------------------
        scope.displayStartChange = function(){
          scope.startTimeClass = "change";
          $timeout(function(){
            scope.startTimeClass = "";
          }, 1000);
        };

        scope.displayEndChange = function(){
          scope.endTimeClass = "change";
          $timeout(function(){
            scope.endTimeClass = "";
          }, 1000);
        };


        // ------------------ Time changes ------------------
        scope.startHourChange = function(value){
          scope.startDateHour = value;
          scope.startDate = moment(scope.startDate).hours(scope.startDateHour);
          scope.formCalendar.$setDirty();
          scope.displayStartChange();
        };


        scope.startMinuteChange = function(value) {
          scope.startDateMinute = value;
          scope.startDate = moment(scope.startDate).minutes(scope.startDateMinute);
          scope.formCalendar.$setDirty();
          scope.displayStartChange();
        };


        scope.endHourChange = function(value){
          scope.endDateHour = value;
          scope.endDate = moment(scope.endDate).hours(scope.endDateHour);
          scope.formCalendar.$setDirty();
          scope.displayEndChange();
        };


        scope.endMinuteChange = function(value) {
          scope.endDateMinute = value;
          scope.endDate = moment(scope.endDate).minutes(scope.endDateMinute);
          scope.formCalendar.$setDirty();
          scope.displayEndChange();
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


        // ------------------ Format date ------------------
        scope.formatDate = function(date){
          if(scope.time) return moment(date).format('D.M.YYYY - HH:mm');
          else return moment(date).format('D.M.YYYY');
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
            var day = {
              name: date.format("dd"),
              number: date.date(),
              isCurrentMonth: date.month() === month.month(),
              isToday: date.isSame(new Date(), "day"),
              isWeekday: date.weekday() == 0 || date.weekday() == 6,
              date: date
            };

            if(scope.minDate) day.isDisabled = date.isBefore(moment(scope.minDate));
            if(scope.maxDate) day.isDisabled = date.isAfter(moment(scope.maxDate));
            if(scope.minDate && scope.maxDate) day.isDisabled = !date.isBetween(moment(scope.minDate), moment(scope.maxDate));

            days.push(day);
            date = date.clone();
            date.add(1, "d");
          }

          return days;
        }
      }
    };
});

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceCheckbox
 * @description
 * # niceCheckbox
 */
angular.module('niceElements')
  .directive('niceCheckbox', function() {
    return {
      templateUrl: 'src/components/nice-checkbox/nice-checkbox.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@',
        noMargin: '@'
      },
      controller: function($rootScope, $scope) {
        if($scope.model === undefined) $scope.model = false;

        $scope.toggle = function(){
          $scope.model = !$scope.model;
        };
      }
    };
  });

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
      templateUrl: 'src/components/nice-choice/nice-choice.html',
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
        if (!attr.title) { attr.title = ''; }
        if (!attr.fieldWidth) { attr.fieldWidth = 'col-sm-8'; }
        if (!attr.labelWidth) { attr.labelWidth = 'col-sm-4'; }
        attr.listIsObj = angular.isDefined(attr.listIsObj);
        attr.selectedIsObj = angular.isDefined(attr.selectedIsObj);
        if (!attr.objValue) { attr.objValue = 'value'; }
        if (!attr.objKey) { attr.objKey = 'id'; }
        attr.multiple = angular.isDefined(attr.multiple);

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
          if (value_new && (!angular.equals(value_new, value_old) || $scope.checkIfFirstTime())){
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

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:clickOutside
 * @description
 * # clickOutside
 */
angular.module('niceElements')
  .directive('clickOutside', function($document, $parse, $timeout){
    return {
      restrict: 'A',
      link: function ($scope, elem, attr) {
        $scope.isOpen = false;

        // watch for is open
        attr.$observe('isOpen', function(value){
          $scope.isOpen = value == 'true';
        });

        $timeout(function () {
          // postpone linking to next digest to allow for unique id generation
          var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.split(/[ ,]+/) : [];
          var fn;

          function eventHandler(e) {
            if ($scope.isOpen) {
              var i, element, r, id, classNames, l;

              // if there is no click target, no point going on
              if (!e || !e.target) {
                return;
              }

              // loop through the available elements, looking for classes in the class list that might match and so will eat
              for (element = e.target; element; element = element.parentNode) {
                // check if the element is the same element the directive is attached to and exit if so (props @CosticaPuntaru)
                if (element === elem[0]) {
                  return;
                }

                // now we have done the initial checks, start gathering id's and classes
                id = element.id;
                classNames = element.className;
                l = classList.length;

                // Unwrap SVGAnimatedString classes
                if (classNames && classNames.baseVal !== undefined) {
                  classNames = classNames.baseVal;
                }

                // if there are no class names on the element clicked, skip the check
                if (classNames || id) {

                  // loop through the elements id's and classnames looking for exceptions
                  for (i = 0; i < l; i++) {
                    //prepare regex for class word matching
                    r = new RegExp('\\b' + classList[i] + '\\b');

                    // check for exact matches on id's or classes, but only if they exist in the first place
                    if ((id !== undefined && id === classList[i]) || (classNames && r.test(classNames))) {
                      // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                      return;
                    }
                  }
                }
              }

              // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
              $timeout(function () {
                fn = $parse(attr['clickOutside']);
                fn($scope, {event: e});
              });
            }
          }


          // if the devices has a touchscreen, listen for this event
          if (_hasTouch()) {
            $document.on('touchstart', eventHandler);
          }

          // still listen for the click event even if there is touch to cater for touchscreen laptops
          $document.on('click', eventHandler);

          // when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
          $scope.$on('$destroy', function () {
            if (_hasTouch()) {
              $document.off('touchstart', eventHandler);
            }

            $document.off('click', eventHandler);
          });

          /**
           * @description Private function to attempt to figure out if we are on a touch device
           * @private
           **/
          function _hasTouch() {
            // works on most browsers, IE10/11 and Surface
            return 'ontouchstart' in window || navigator.maxTouchPoints;
          }
        });
      }
    };
});
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceComment
 * @description
 * # niceComment
 */
angular.module('niceElements')
  .directive('niceComment', function ($timeout) {
    return {
      templateUrl: 'src/components/nice-comment/nice-comment.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@?',
        placeholder: '@',
        noTextLabel: '@',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        help: '@',
        rows: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (scope.model == null) { scope.model =  ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.noTextLabel) { angular.isDefined(attrs.noTextLabel); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.rows) { attrs.rows = 1; }

        var textareas = element.find('textarea');

        scope.edit = function(){
          scope.editing=true;
          $timeout(function(){
            textareas[0].focus();
          });
        };

        textareas[0].addEventListener('keydown', autosize);
        autosize();

        function autosize() {
          var el = textareas[0];
          $timeout(function () {
            el.style.cssText = 'height:auto; padding:0';

            // for box-sizing other than "content-box" use:
            el.style.cssText = '-moz-box-sizing:content-box';

            // Fix height
            el.style.cssText = 'height:' + (el.scrollHeight + 2) + 'px';
          });
        }
      },
      controller: function($scope){
        $scope.editing = false;

        $scope.save = function(){
          $scope.editing = false;
        };
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDateRange
 * @description
 * # niceDateRange
 */
angular.module('niceElements')

  .directive('niceDateRange', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'src/components/nice-date-range/nice-date-range.html',
      scope: {
        model: '=',
        title: '@',
        fieldWidth: '@',
        format: '@',
        min: '@',
        max: '@',
        noMargin: '@',
        labelWidth: '@',
        startOfTheYear: '@'
      },

      link: function(scope, iElement, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.format) { attrs.format = 'dd.MM.yyyy'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if(!angular.isDefined(scope.model)) {
          if(!angular.isDefined(scope.startOfTheYear)){
            scope.model = {
              startDate: moment().format(),
              endDate: moment().format()
            }
          } else {
            scope.model = {
              startDate: moment([moment().year()]).format(),
              endDate: moment().format()
            }
          }
        }
      },

      controller: function($scope, $filter) { //gettextCatalog
        $scope.opts = {
          //format: 'DD.MM.YYYY',
          locale: {
            applyClass: 'btn-green',
            //applyLabel: gettextCatalog.getString("Apply"),
            //fromLabel: gettextCatalog.getString("From"),
            //toLabel: gettextCatalog.getString("To"),
            //cancelLabel: gettextCatalog.getString("Cancel"),
            //customRangeLabel: gettextCatalog.getString("Custom range"),
            firstDay: 1
            //daysOfWeek: [
            //  gettextCatalog.getString("Sun"),
            //  gettextCatalog.getString("Mon"),
            //  gettextCatalog.getString("Tue"),
            //  gettextCatalog.getString("Wed"),
            //  gettextCatalog.getString("Thu"),
            //  gettextCatalog.getString("Fri"),
            //  gettextCatalog.getString("Sat")
            //],
            //monthNames: [
            //  gettextCatalog.getString("January"),
            //  gettextCatalog.getString("February"),
            //  gettextCatalog.getString("March"),
            //  gettextCatalog.getString("April"),
            //  gettextCatalog.getString("May"),
            //  gettextCatalog.getString("June"),
            //  gettextCatalog.getString("July"),
            //  gettextCatalog.getString("August"),
            //  gettextCatalog.getString("September"),
            //  gettextCatalog.getString("October"),
            //  gettextCatalog.getString("November"),
            //  gettextCatalog.getString("December")
            //]
          },
          ranges: {},
          min: $scope.min,
          max: $scope.max
        };

        //$scope.opts.ranges[gettextCatalog.getString("Today")] = [moment(), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("Last 7 days")] = [moment().subtract(7, 'days'), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("Last 30 days")] = [moment().subtract(30, 'days'), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("This month")] = [moment().startOf('month'), moment().endOf('month')];

        $scope.opts.ranges["Today"] = [moment(), moment()];
        $scope.opts.ranges["Last 7 days"] = [moment().subtract(7, 'days'), moment()];
        $scope.opts.ranges["Last 30 days"] = [moment().subtract(30, 'days'), moment()];
        $scope.opts.ranges["This month"] = [moment().startOf('month'), moment().endOf('month')];

        if(angular.isDefined($scope.format)) $scope.opts.format = format;
      }

    };
  });

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
      templateUrl: 'src/components/nice-date/nice-date.html',
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

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimePicker
 * @description
 * # niceDatetimePicker
 */
angular.module('niceElements')

.directive('niceDatetimePicker', function($window, $compile) {

  return {
    scope: {
      model: '=', // binding model
      format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
      modelFormat: '@', // default: ''
      date: '@', // default: true, is date picker enabled?
      time: '@', // default: false, is time picker enabled?
      width: '@', // default: 300, width of entire dtp-picker in px
      enableOkButtons: '@', // default: false, is ok/cancel buttons enabled?
      lang: '@', // default: 'en', which locale to use - you must load angular locales first
      minDate: '@', // default: undefined
      maxDate: '@', // default: undefined
      weekStart: '@', // default: 1, which day does the week start? (0 - sunday, 1 - monday, ...)
      okText: '@',
      cancelText: '@',
      shortTime: '@', // default: false,
      title: '@', // default: ''
      noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
      fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
      labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
    },
    templateUrl: 'src/components/nice-datetime-picker/nice-datetime-picker.html',
    link: {
      pre: function($scope, $element, $attrs) {

        // default parameters
        var params = {
          title: '',
          noMargin: false,
          fieldWidth: 'col-sm-8',
          labelWidth: 'col-sm-4',
          format: 'DD.MM.YYYY HH:mm',
          modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
          minDate: null, maxDate: null, lang: 'en',
          weekStart: 1, shortTime: false,
          cancelText: 'Cancel', okText: 'OK',
          date: true, time: false, width: 300, enableOkButtons: false
        };


        var initCurrentDate = function (modelValue) {

          $scope.modelUpdatedInternally = true;
          var tmpCurrentDate = null;
          if (typeof(modelValue) === 'undefined' || modelValue === null) {
            tmpCurrentDate = moment();
          } else {
            if (!params.date && params.time) {
              // if only time
              var _time = moment();
              var i_hour = params.modelFormat.indexOf('HH:mm');
              var i_min = params.modelFormat.indexOf('mm');
              var hours = modelValue.substring(i_hour, i_hour + 2);
              var minutes = modelValue.substring(i_min, i_min + 2);

              if (i_hour > -1 && i_min > -1) {
                _time.hours(hours);
                _time.minutes(minutes);
              } else {
                console.error('Cannot parse current time model with passed modelFilter. Please check if you missed ' +
                    'modelFilter setting in directive.. Falling back to current time instead.');
              }

              tmpCurrentDate = _time;


            } else {
              // all other combinations
              if (typeof(modelValue) === 'string') {
                if (params.modelFormat.indexOf('Z')>=0)
                  tmpCurrentDate = moment(modelValue, params.modelFormat).locale(params.lang);
                else
                  tmpCurrentDate = moment.utc(modelValue, params.modelFormat).local().locale(params.lang);
              }
              else {
                if (params.modelFormat.indexOf('Z')>=0)
                  tmpCurrentDate = moment(modelValue).locale(params.lang);
                else
                  tmpCurrentDate = moment.utc(modelValue).local().locale(params.lang);
              }
            }
          }

          if ($scope.currentDate != tmpCurrentDate){
            $scope.currentDate = tmpCurrentDate;
          }
        };

        // prepare attributes
        params.date = $scope.date === 'true' || $scope.date === true;
        params.time = $scope.time === 'true' || $scope.time === true;
        if ($scope.format && $scope.format != "")
          params.format = $scope.format;
        if ($scope.enableOkButtons)
          params.enableOkButtons = $scope.enableOkButtons === 'true';
        if ($scope.lang)
          params.lang = $scope.lang;
        if ($scope.minDate)
          params.minDate = $scope.minDate;
        if ($scope.maxDate)
          params.maxDate = $scope.maxDate;
        if ($scope.weekStart)
          params.weekStart = parseInt($scope.weekStart);
        if ($scope.okText)
          params.okText = $scope.okText;
        if ($scope.cancelText)
          params.cancelText = $scope.cancelText;
        if ($scope.noMargin)
          params.noMargin = $scope.noMargin === 'true';
        if ($scope.modelFormat)
          params.modelFormat = $scope.modelFormat;

        $scope.date = params.date;
        $scope.time = params.time;

        // copy attributes back to scope - for template usage
        $scope = angular.extend($scope, params);
        $scope.modelUpdatedInternally = false;

        initCurrentDate($scope.model);

        $scope.isOpen = false;

        $scope.openDtp = function () {
          $scope.isOpen = true;
          $scope.$broadcast('dtp-open-click');
        };

        $scope.closeDtp = function(response) {
          $scope.isOpen = false;
          $scope.$broadcast('dtp-close-click');
        };

        $scope.$on('dateSelected', function () {
          $scope.formDatetimePicker.$setDirty();
          //$scope.closeDtp();
          //console.log('date selected');
        });

        $scope.$watch('currentDate', function (newDate) {
          $scope.value = moment(newDate).locale(params.lang).format(params.format);
          if ((!params.date && params.time) || (params.date && !params.time)){
            var _date = moment(newDate, params.modelFormat).locale(params.lang).format(params.modelFormat);
          }else{
            var _date = moment(newDate, params.modelFormat).utc().locale(params.lang).format(params.modelFormat);
          }
          //$scope.model = moment(newDate).locale(params.lang).format(params.modelFormat);
          //$scope.modelUpdatedInternally = true;
          $scope.model = _date;

        });

        $scope.$watch('model', function(newModel, oldModel){
          if (newModel && newModel != oldModel && $scope.modelUpdatedInternally===false) {
            initCurrentDate(newModel);
          }else{

          }
          if ($scope.modelUpdatedInternally){
            $scope.modelUpdatedInternally = false;
          }
        });

      }
    }
  };

});

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
      templateUrl: 'src/components/nice-datetimerange-picker-2/nice-datetimerange-picker-2.html',
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
          $scope.modelFormat = $scope.startDate.format($scope.formatString) + " - " + $scope.endDate.format($scope.formatString);
        };


        $scope.open = function() {
          $scope.isOpen = true;
        };


        $scope.close = function() {
          $scope.innerStartDate = angular.copy($scope.startDate);
          $scope.innerEndDate = angular.copy($scope.endDate);
          $scope.isOpen = false;
        };


        $scope.confirm = function() {
          $scope.startDate = angular.copy($scope.innerStartDate);
          $scope.endDate = angular.copy($scope.innerEndDate);
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
          if(newValues[0] && newValues[1]){
            // Check if start date is after end date
            if($scope.innerStartDate.isAfter($scope.innerEndDate)){
              var temp = angular.copy($scope.innerStartDate);
              $scope.innerStartDate = angular.copy($scope.innerEndDate); 
              $scope.innerEndDate = temp; 
            }

            // Check if end date is before start date
            if($scope.innerEndDate.isBefore($scope.innerStartDate)){
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
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimerangePicker
 * @description
 * # niceDatetimerangePicker
 */
angular.module('niceElements')
  .directive('niceDatetimerangePicker', ['$window', '$timeout', function($window, $timeout) {
    return {
      scope: {
        modelStart: '=', // binding model
        modelEnd: '=', // binding model
        format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
        modelFormat: '@',
        date: '@', // default: true, is date picker enabled?
        time: '@', // default: false, is time picker enabled?
        width: '@', // default: 300, width of entire dtp-picker in px
        enableOkButtons: '@', // default: false, is ok/cancel buttons enabled?
        lang: '@', // default: 'en', which locale to use - you must load angular locales first
        minDate: '@', // default: undefined
        maxDate: '@', // default: undefined
        weekStart: '@', // default: 1, which day does the week start? (0 - sunday, 1 - monday, ...)
        okText: '@',
        cancelText: '@',
        shortTime: '@', // default: false,
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label,
        formatOutput: "@" // Format output or moment
      },
      templateUrl: 'src/components/nice-datetimerange-picker/nice-datetimerange-picker.html',
      link: {
        pre: function($scope, $element, $attrs) {
          // Default parameters
          var params = {
            title: '',
            noMargin: false,
            fieldWidth: 'col-sm-8',
            labelWidth: 'col-sm-4',
            format: 'DD.MM.YYYY HH:mm',
            modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
            minDate: null,
            maxDate: null,
            lang: 'en',
            weekStart: 1,
            shortTime: false,
            cancelText: 'Cancel',
            okText: 'OK',
            date: true,
            time: false,
            width: 300,
            enableOkButtons: false
          };

          if($scope.formatOutput === undefined) $scope.formatOutput = false;

          var setLabelValue = function(){
            var _from = moment($scope.internalStart).format(params.format);
            var _to = moment($scope.internalEnd).format(params.format);
            $scope.value = _from + ' - ' + _to;
          };

          var initCurrentDates = function () {
            if (typeof($scope.modelStart) === 'undefined' || $scope.modelStart === null) {
              var _start = moment().subtract(1, 'days');
              if($scope.formatOutput) _start = _start.format(params.modelFormat);
              $scope.modelStart = _start;

            } else {
              if (!params.date && params.time) {
                // if only time
                var _time = moment();
                var i_hour = params.modelFormat.indexOf('HH:mm');
                var i_min = params.modelFormat.indexOf('mm');
                var hours = $scope.model.substring(i_hour, i_hour + 2);
                var minutes = $scope.model.substring(i_min, i_min + 2);

                if (i_hour > -1 && i_min > -1) {
                  _time.hours(hours);
                  _time.minutes(minutes);
                } else {
                  console.error('Cannot parse current time model with passed modelFilter. Please check if you missed ' +
                    'modelFilter setting in directive.. Falling back to current time instead.');
                }

                $scope.dateStart = _time;
              } else {
                $scope.dateStart = moment($scope.modelStart);
              }
            }

            // initialize dateEnd
            if (typeof($scope.modelEnd) === 'undefined' || $scope.modelEnd === null) {
              var _end = moment();
              if($scope.formatOutput) _end = _end.format(params.modelFormat);
              $scope.modelEnd = _end;

            } else {
              if (!params.date && params.time) {
                // if only time
                var _time = moment();
                var i_hour = params.modelFormat.indexOf('HH:mm');
                var i_min = params.modelFormat.indexOf('mm');
                var hours = $scope.model.substring(i_hour, i_hour + 2);
                var minutes = $scope.model.substring(i_min, i_min + 2);

                if (i_hour > -1 && i_min > -1) {
                  _time.hours(hours);
                  _time.minutes(minutes);
                } else {
                  console.error('Cannot parse current time model with passed modelFilter. Please check if you missed ' +
                    'modelFilter setting in directive.. Falling back to current time instead.');
                }

                $scope.dateEnd = _time;
              } else {
                $scope.dateEnd = moment($scope.modelEnd);
              }
            }

            // fix dateEnd if it's before dateStart
            if ($scope.dateStart > $scope.dateEnd){
              $scope.dateEnd = moment($scope.dateStart);
            }
          };

          // prepare attributes
          params.date = $scope.date === 'true';
          params.time = $scope.time === 'true';
          if ($scope.format && $scope.format != "")
            params.format = $scope.format;
          if ($scope.enableOkButtons)
            params.enableOkButtons = $scope.enableOkButtons === 'true';
          if ($scope.lang)
            params.lang = $scope.lang;
          if ($scope.minDate)
            params.minDate = $scope.minDate;
          if ($scope.maxDate)
            params.maxDate = $scope.maxDate;
          if ($scope.weekStart)
            params.weekStart = parseInt($scope.weekStart);
          if ($scope.okText)
            params.okText = $scope.okText;
          if ($scope.cancelText)
            params.cancelText = $scope.cancelText;
          if ($scope.noMargin)
            params.noMargin = $scope.noMargin === 'true';
          if ($scope.modelFormat)
            params.modelFormat = $scope.modelFormat;

          $scope.date = params.date;
          $scope.time = params.time;

          // copy attributes back to scope - for template usage
          $scope = angular.extend($scope, params);

          $scope.openDtpRange = function () {
            initCurrentDates();
            $scope.showDtpRange = true;
          };

          $scope.okClick = function(){
            setLabelValue();
            var _start = moment($scope.internalStart, params.modelFormat);
            if($scope.formatOutput) _start = _start.format(params.modelFormat);
            $scope.modelStart = _start;

            var _end = moment($scope.internalEnd, params.modelFormat);
            if($scope.formatOutput) _end = _end.format(params.modelFormat);
            $scope.modelEnd = _end;

            //$scope.modelStart = angular.copy($scope.internalStart);
            //$scope.modelEnd = angular.copy($scope.internalEnd);
            $scope.showDtpRange = false;
          };

          $scope.cancelClick = function(){
            $scope.showDtpRange = false;
            //$scope.internalStart = angular.copy($scope.modelStart);
            //$scope.internalEnd = angular.copy($scope.modelEnd);
            var _start = moment($scope.modelStart);
            if($scope.formatOutput) _start = _start.format(params.modelFormat);
            var _end = moment($scope.modelEnd);
            if($scope.formatOutput) _end = _end.format(params.modelFormat);

            $scope.internalStart = _start;
            $scope.internalEnd = _end;
            setLabelValue();
          };

          $scope.selectLastNDays = function(days){
            $scope.dateStart = moment().subtract(days, 'days');
            $scope.dateEnd = moment();
            $scope.internalStart = $scope.dateStart;
            $scope.internalEnd = $scope.dateEnd;
            setLabelValue();
          };

          $scope.selectLastMonth = function(){
            $scope.dateStart = moment().subtract(1, 'months');
            $scope.dateEnd = moment();
            $scope.internalStart = $scope.dateStart;
            $scope.internalEnd = $scope.dateEnd;
            setLabelValue();
          };

          $scope.selectThisMonth = function(){
            $scope.dateStart = moment().date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
            $scope.dateEnd = moment().endOf('month');
            $scope.internalStart = $scope.dateStart;
            $scope.internalEnd = $scope.dateEnd;
            setLabelValue();
          };


          //$scope.$on('dateSelected', function () {
          //  $scope.formDatetimePicker.$setDirty();
          //  console.log('date selected');
          //});

          $scope.$watchGroup(['dateStart', 'dateEnd'], function (newValues) {
            $scope.internalStart = moment(newValues[0]);
            $scope.internalEnd = moment(newValues[1]);
            setLabelValue();
          });

          $scope.$watchGroup(['modelStart', 'modelEnd'], function(){
            initCurrentDates();
          });

        }
      }
    };

  }]);
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
      isDisabled: '@',
      numYears: '@',
      startingYear: '@',
      mature: '@'
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
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDropdownOld
 * @description
 * # niceDropdownOld
 */
angular.module('niceElements')
  .directive('niceDropdownOld', function () {
    return {
      templateUrl: 'src/components/nice-dropdown-old/nice-dropdown-old.html',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',               // Title of the field
        model: '=',               // Aka model
        list: '=',                // List of options
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        addButtonEnable: '=',
        addButtonFunction: '&',
        objValue: '@',            // Optional - default is 'value'
        objKey: '@?',             // Optional - default is 'id'. Used only when returnOnlyKey=true
        selectedIsObj: '@',       // Optional parameter.
        nullable: '@',            // No selection is possible
        required: '@',            // Model cannot be NULL
        showTax: '@',             // Shows tax rate
        noMargin: '@',            // margin-bottom: 0px
        multiple: '@',            // Can select multiple items
        help: '@',
        listenKeydown: '@',
        noOptionsText: "@"
      },
      controller: function($rootScope, $scope, $document, $element) {
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.list) { $scope.list = []; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = "No options"; }
        if(!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        if(!$scope.listenKeydown) { $scope.listenKeydown = false; }
        $scope.valid = $scope.formDropdown;


        $scope.selectedIsObj = $scope.selectedIsObj === 'true' || $scope.selectedIsObj === true;
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.required = $scope.required === 'true' || $scope.required === true;
        $scope.showTax = $scope.showTax === 'true' || $scope.showTax === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;

        $scope.internalSelected = null;
        $scope.id = Math.random().toString(36).substring(7);

        $scope.isOpen = false;
        $scope.toggle = function(){ $scope.isOpen = !$scope.isOpen; };
        $scope.close = function(){ $scope.isOpen = false; };
        $scope.open = function(){ $scope.isOpen = true; };


        // ----------------------------------- Get filter -----------------------------------
        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };


        // ----------------------------------- Set internal list -----------------------------------
        var _set_internal_list = function(){
          $scope.internalList = angular.copy($scope.list);
        };


        // ----------------------------------- Add null object to internal list -----------------------------------
        var _add_null_object_to_internal = function(){
          if ($scope.nullable && !$scope.multiple) {
            var nullObj = {};
            nullObj[$scope.objKey] = null;
            nullObj[$scope.objValue] = '-';
            $scope.internalList = [nullObj].concat($scope.internalList);
          }
        };


        // ----------------------------------- Get selected object -----------------------------------
        var _get_selected_object = function(selected){
          if (!selected) return null;
          if ($scope.selectedIsObj) {
            return selected;
          } else {
            return _.find($scope.internalList, getFilter(selected));
          }
        };


        // ----------------------------------- Init -----------------------------------
        var _set_internal_selected_one = function(selected){
          var obj = {};

          var selectedObj = _get_selected_object(selected);
          // console.log('_set_internal_selected_one', selected, selectedObj);
          if(selectedObj && _.find($scope.internalList, getFilter(selected))){
            obj = selectedObj;
          } else {
            obj = $scope.internalList[0];
          }
          $scope.internalSelected = obj;
          _set_model(obj);
        };


        // ----------------------------------- Get selected objects -----------------------------------
        var _get_selected_objects = function(selected){
          if (!selected)
            return null;

          if ($scope.selectedIsObj)
            return selected;
          else {
            // from [1,2,3] get list of objects [{}, {}, {}]
            return _.map(selected, function (val) {
              return _.find($scope.internalList, getFilter(val));
            });
          }
        };


        // ----------------------------------- Set internal selected multiple -----------------------------------
        var _set_internal_selected_multiple = function(item){
          var _selected_objects = _get_selected_objects(item);
          if (_selected_objects){
            $scope.internalSelected = _selected_objects;
            _set_model($scope.internalSelected);
          } else {
            $scope.internalSelected = [];
            _set_model($scope.internalSelected);
          }
        };


        // ----------------------------------- Set model -----------------------------------
        var _set_model = function(value){
          var _new = angular.copy($scope.model);

          if(!$scope.multiple){
            if (value[$scope.objKey]==null){
              _new = null;
            } else {
              if ($scope.selectedIsObj){
                _new = value;
              } else {
                _new = value[$scope.objKey];
              }
            }
          } else {
            if ($scope.selectedIsObj){
              _new = value;
            } else {
              _new = _.map(value, function (val) {
                return val[$scope.objKey];
              });
            }
          }

          // update model only if it is changed
          if (!_.isEqual(_new, $scope.model)){
            $scope.model = _new;
          }
        };


        // ----------------------------------- Init -----------------------------------
        var init = function() {
          _set_internal_list();
          _add_null_object_to_internal();

          if($scope.multiple && $scope.model){
            if ($scope.internalSelected) {
              // remove already selected but not in list - this happens when list changes from outside
              _set_internal_selected_multiple(_.filter($scope.internalSelected, function (obj) {
                return _.find($scope.internalList, getFilter(obj));
              }));
            } else {
              $scope.internalSelected = [];
            }
          }

          // Set internalSelected
          if($scope.internalList && $scope.internalList.length>0){
            $scope.emptyList = false;

            if ($scope.multiple) {
              _set_internal_selected_multiple($scope.model);
            } else {
              _set_internal_selected_one($scope.model);
            }

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', true);
            }
          } else {
            // Disable dropdown button if list of items is empty
            $scope.emptyList = true;
            var sel = {};
            sel[$scope.objKey] = null;
            sel[$scope.objValue] = $scope.noOptionsText;
            $scope.internalList = [sel];

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', false); // Form is not valid because dropdown is empty and required
            }

            if ($scope.multiple) {
              _set_internal_selected_multiple(sel);
            } else {
              _set_internal_selected_one([sel]);
            }
          }
        };


        // ----------------------------------- Is Item selected -----------------------------------
        $scope.isItemSelected = function(item){
          if (!$scope.internalSelected) return false;

          // Which item is selected
          if ($scope.multiple) {
            return _.where($scope.internalSelected, {'id':item.id}).length > 0;
          } else {
            return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };


        // ----------------------------------- Item clicked -----------------------------------
        $scope.clicked = function(item){
          $scope.formDropdown.$setDirty();
          if($scope.multiple){
            // This actually toggles selection
            var _current = angular.copy($scope.internalSelected);
            if(!_.find(_current, getFilter(item))){
              _current.push(item);
            } else {
              _current = _.reject(_current, getFilter(item[$scope.objKey]));
            }
            _set_internal_selected_multiple(_current);
          } else {
            _set_internal_selected_one(item);
            $scope.close();
          }

        };


        // ----------------------------------- Get label -----------------------------------
        $scope.getLabel = function(item){
          if (item) {
            return item[$scope.objValue];
          } else {
            return '-';
          }
        };


        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watch('list', function (value_new, value_old) {
          init();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          if ($scope.multiple) {
            var _new_model_object = _get_selected_object(value_new);
          } else {
            var _new_model_object = _get_selected_objects(value_new);
          }

          if (!_.isEqual(_new_model_object, $scope.internalSelected)){
            init();
          }
        });


        // ----------------------------------- Listen keydown -----------------------------------
        $scope.bindKeypress = function(){
          if ($scope.listenKeydown) {
            $element.bind('keyup', function (e) {
              // bind to keypress events if dropdown list is opened
              if ($scope.isOpen) {
                var char = String.fromCharCode(e.which).toLowerCase();

                // find first element with value starting on selected char
                var index = _.findIndex($scope.internalList, function (item) {
                  var _name = item[$scope.objValue].toLowerCase();
                  return _name.indexOf(char) === 0;
                });

                if (index >= 0) {
                  // scroll within dropdown list to selected index
                  // var _id_name = '#' + $scope.id + '-' + index;
                  // var _id_first = '#' + $scope.id + '-0';
                  // var _relative_top = Math.abs($(_id_first).offset().top - $(_id_name).offset().top);
                  // if (_relative_top >= 0){
                  //   $("#" + $scope.id).animate({scrollTop: _relative_top}, 100);
                  // }
                }
              }
            });
          }
        };

        $scope.unbindKeypress = function(){
          $element.off('keyup', function (e) {});
        };

      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nice-dropdown
 * @description
 * # nice-dropdown
 */
angular.module('niceElements')
  .directive('niceDropdown', function () {
    return {
      templateUrl: 'src/components/nice-dropdown/nice-dropdown.html',
      restrict: 'E',
      transclude: {
        'button': '?niceDropdownButton',
        'option': '?niceDropdownOption'
      },
      scope: {
        title: '@', // Title of the field
        model: '=', // Aka model
        list: '=', // List of options
        onChange: '=?',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        loading: '=?',
        addButtonFunction: '=?',
        objValue: '@', // Optional - default is 'value'
        objKey: '@?', // Optional - default is 'id'. Used only when returnOnlyKey=true.
        selectedIsKey: '@?',
        nullable: '@', // No selection is possible
        required: '@', // Model cannot be NULL
        noMargin: '@', // margin-bottom: 0px
        multiple: '@', // Can select multiple items
        help: '@',
        noOptionsText: "@",
        noDataText: "@",
        selectText: "@",
        searchText: "@",
        nullableText: "@",
        searchFunction: "=?"
      },
      controller: function ($scope, $element, $timeout) {
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = "No options"; }
        if (!$scope.noDataText) { $scope.noDataText = "No options"; }
        if (!$scope.searchText) { $scope.searchText = "Search..."; }
        if (!$scope.nullableText) { $scope.nullableText = "None"; }
        if (!$scope.selectText) { $scope.selectText = "Select option"; }
        if (!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.required = $scope.required === 'true' || $scope.required === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;
        $scope.valid = $scope.formDropdown;
        $scope.isOpen = false;
        $scope.selected = null;
        $scope.selectedIndex = null;

        $scope.internal = {
          search: ""
        };

        // -----------------------------------Open -----------------------------------
        $scope.toggle = function () {
          if ($scope.isOpen) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.close = function () {
          $scope.isOpen = false;
        };

        $scope.open = function () {
          $scope.focusInput();
          $scope.isOpen = true;
        };


        // ----------------------------------- Focus input -----------------------------------
        $scope.focusInput = function () {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            $timeout(function () {
              input.focus();
            });
          }
        };


        // ----------------------------------- Search -----------------------------------
        $scope.handleSearch = function () {
          $scope.loading = true;
          $scope.searchFunction($scope.internal.search).then(function (response) {
            $scope.internalList = response;
            $scope.loading = false;
            $scope.handleDefault();
          }, function (error) {
            $scope.internalList = null;
            $scope.loading = false;
          });
        };


        // ----------------------------------- Init search -----------------------------------
        if ($scope.searchFunction) {
          $scope.handleSearch();
        }


        // ----------------------------------- Item clicked -----------------------------------
        $scope.handleSelected = function (item, index) {
          $scope.formDropdown.$setDirty();

          if (item != null) {
            if ($scope.multiple) {
              $scope.handleMultipleSelect(item, index);
            } else {
              $scope.handleSingleSelect(item, index);
            }
          } else {
            $scope.handleSingleSelect(undefined, -1);
          }
        };


        // ----------------------------------- Handle multiple select -----------------------------------
        $scope.handleMultipleSelect = function(item, index) {
          if (!$scope.selected) $scope.selected = [];
          if(item._selected) {
            $scope.selected = $scope.selected.filter(function(s) {
              return s[$scope.objKey] != item[$scope.objKey];
            });
          } else {
            $scope.selected.push(item);
          }

          $scope.handleSetModel();
        };


        // ----------------------------------- Handle single slect -----------------------------------
        $scope.handleSingleSelect = function(item, index) {
          $scope.selected = item;
          $scope.close();
          $scope.handleSetModel();
        };


        // ----------------------------------- Handle set model -----------------------------------
        $scope.handleSetModel = function() {
          var obj = angular.copy($scope.selected);

          if ($scope.selected != null) {
            // Remove selected flag
            if ($scope.multiple) {
              angular.forEach(obj, function(o) {
                o._selected = undefined;
              });
            } else {
              obj._selected = undefined;
            }

            // Selected is object
            if ($scope.selectedIsKey) {
              if ($scope.multiple) {
                angular.forEach(obj, function(o) {
                  o = o[$scope.objKey];
                });
              } else {
                obj = obj[$scope.objKey];
              }
            }
          }
          
          // Trigger on change
          if ($scope.onChange) {
            $scope.onChange(obj);
          }
          
          $scope.model = obj;
        };


        // ----------------------------------- Handle default -----------------------------------
        $scope.handleDefault = function() {
          if (!$scope.nullable && !$scope.model && $scope.internalList && $scope.internalList.length > 0) {
            $scope.handleSelected($scope.internalList[0], 0);
          }
        };

        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watch('list', function (value_new, value_old) {
          $scope.internalList = angular.copy($scope.list);
          $scope.handleDefault();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          $scope.selected = angular.copy($scope.model);
          angular.forEach($scope.internalList, function(i) {
            i._selected = false;

            if ($scope.selectedIsKey) {
              // Not object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function(s) {
                  if (i[$scope.objKey] == s) {
                    i._selected = true;
                    $scope.selected.push(i);
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected) {
                  i._selected = true;
                  $scope.selected = i;
                }
              }
            } else {
              // Is object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function(s) {
                  if (i[$scope.objKey] == s[$scope.objKey]) {
                    i._selected = true;
                    $scope.selected.push(i);
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected[$scope.objKey]) {
                  i._selected = true;
                  $scope.selected = i;
                }
              }
            }
          });
        });

        $scope.handleDefault();
      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDtp
 * @description
 * # niceDtp
 */
angular.module('niceElements')

  .directive('niceDtp', function ($window, $parse, $document) {

    return {
      scope: {
        //onChange: '&', // function called on date changed
        model: '=', // binding model
        format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
        modelFormat: '@', // default: ''
        //currentDate: '@',
        date: '@', // default: true, is date picker enabled?
        time: '@', // default: false, is time picker enabled?
        width: '@', // default: 300, width of entire dtp-picker in px
        enableOkButtons: '@', // default: false, is ok/cancel buttons enabled?
        lang: '@', // default: 'en', which locale to use - you must load angular locales first
        minDate: '@', // default: undefined
        maxDate: '@', // default: undefined
        weekStart: '@', // default: 1, which day does the week start? (0 - sunday, 1 - monday, ...)
        okText: '@',
        cancelText: '@',
        shortTime: '@', // default: false,
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
        closed: '='
      },
      templateUrl: 'src/components/nice-dtp/nice-dtp.html',
      link: function ($scope, $element, $attrs) {

        // default parameters
        var params = {
          title: '',
          noMargin: false,
          fieldWidth: 'col-sm-8',
          labelWidth: 'col-sm-4',
          format: 'DD.MM.YYYY HH:mm',
          modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
          minDate: null,
          maxDate: null,
          lang: 'en',
          weekStart: 1,
          shortTime: false,
          cancelText: 'Cancel',
          okText: 'OK',
          date: true,
          time: false,
          width: 300,
          enableOkButtons: false
        };

        var prepareAttrs = function () {
          // prepare attributes
          params.date = $attrs.date === 'true' || $attrs.date === true;
          params.time = $attrs.time === 'true' || $attrs.time === true;
          params.inline = $attrs.inline === 'true' || $attrs.inline === true;
          if ($attrs.format && $attrs.format != "")
            params.format = $attrs.format;
          if ($scope.enableOkButtons && $attrs.enableOkButtons != "")
            params.enableOkButtons = $attrs.enableOkButtons === 'true';
          if ($attrs.lang && $attrs.lang != "")
            params.lang = $attrs.lang;
          if ($attrs.minDate && $attrs.minDate != "")
            params.minDate = $attrs.minDate;
          if ($attrs.maxDate && $attrs.maxDate != "")
            params.maxDate = $attrs.maxDate;
          if ($scope.weekStart && $attrs.weekStart != "")
            params.weekStart = parseInt($attrs.weekStart);
          if ($attrs.okText && $attrs.okText != "")
            params.okText = $attrs.okText;
          if ($attrs.cancelText && $attrs.cancelText != "")
            params.cancelText = $attrs.cancelText;
          if ($attrs.noMargin && $attrs.noMargin != "")
            params.noMargin = $attrs.noMargin === 'true';
          if ($attrs.modelFormat && $attrs.modelFormat != "")
            params.modelFormat = $attrs.modelFormat;

          if ($attrs.width) {
            params.width = parseInt($attrs.width);
          }
          //$scope.dtp_content_style = {width: params.width + 'px'};

          // copy attributes back to scope - for template usage
          $scope = angular.extend($scope, params);

        };

        // functions are defined in a variable 'var that', not in $scope
        var that = {
          init: function () {
            //console.log('init', $scope);

            $scope.showDtp = false;
            that.initDays();
            that.initDates();
          },
          initDays: function () {
            //console.log('initDays');
            $scope.days = [];
            for (var i = params.weekStart; $scope.days.length < 7; i++) {
              if (i > 6) {
                i = 0;
              }
              $scope.days.push(i.toString());
            }
          },
          fixMinMaxDate: function () {
            if ($scope.minDate === "")
              $scope.minDate = null;
            if ($scope.maxDate === "")
              $scope.maxDate = null;
          },
          initDates: function () {
            that.fixMinMaxDate();
            if (typeof ($scope.model) === 'undefined' || $scope.model === null) {
              $scope.currentDate = moment();
            } else {
              //// all other combinations
              //if (typeof($scope.model) === 'string') {
              //  $scope.currentDate = moment($scope.model, params.modelFormat).locale(params.lang);
              //}
              //else {
              $scope.currentDate = moment($scope.model).locale(params.lang);
              //}
            }

            that.setDateModel();
            that.setElementValue();

            // Parse minDate
            if (typeof ($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
              if (typeof ($scope.minDate) === 'string') {
                $scope.minDate = moment($scope.minDate).locale(params.lang);
              }
            }

            // Parse maxDate
            if (typeof ($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
              if (typeof ($scope.maxDate) === 'string') {
                $scope.maxDate = moment($scope.maxDate).locale(params.lang);
              }
            }

            // Fix currentDate if violates minDate and maxDate constraints
            if (params.date === true) {
              if (!that.isAfterMinDate($scope.currentDate)) {
                $scope.currentDate = moment($scope.minDate);
              }
              if (!that.isBeforeMaxDate($scope.currentDate)) {
                $scope.currentDate = moment($scope.maxDate);
              }
            }
          },
          initDate: function () {
            that.fixMinMaxDate();

            $scope.currentView = 0;

            $scope.showCalendar = true;
            $scope.showTime = false;

            var _date = ((typeof ($scope.currentDate) !== 'undefined' && $scope.currentDate !== null) ? $scope.currentDate : null);
            $scope.calendar = that.generateCalendar($scope.currentDate);

            if (typeof ($scope.calendar.week) !== 'undefined' && typeof ($scope.calendar.days) !== 'undefined') {
              that.constructHTMLCalendar(_date, $scope.calendar);
              that.toggleButtons(_date);
            }

            that._centerBox();
            that.showDate(_date);
          },
          initHours: function () {
            that.fixMinMaxDate();
            $scope.currentView = 1;
            $scope.hours = [];
            $scope.minutes = [];
            $scope.showTime = true;
            $scope.showCalendar = false;

            that.showTime($scope.currentDate);

            var pL = 10;
            var pT = 10;
            var mL = 20;
            var mT = 10;
            var r = 100;

            var j = r / 1.55;
            var j_pm = r / 1.15;

            var _hours = [];

            // AM hours
            for (var h = 0; h < 12; ++h) {
              var cH = (($scope.currentDate.format('HH') == 24) ? 0 : $scope.currentDate.format('HH'));
              var x = j * Math.sin(Math.PI * 2 * (h / 12));
              var y = j * Math.cos(Math.PI * 2 * (h / 12));

              var _hour = {
                style: {
                  x: x,
                  y: y,
                  marginLeft: (r + x + parseInt(pL) / 2) - (parseInt(pL) + parseInt(mL)) + 'px',
                  marginTop: (r - y - parseInt(mT) / 2) - (parseInt(pT) + parseInt(mT)) + 'px'
                },
                h: h == 0 ? 12 : h,
                selected: h == parseInt(cH)
              };

              _hours.push(_hour);
            }

            // PM hours
            for (var h = 0; h < 12; ++h) {
              var cH = (($scope.currentDate.format('HH') == 24) ? 0 : $scope.currentDate.format('HH'));
              var x = j_pm * Math.sin(Math.PI * 2 * (h / 12));
              var y = j_pm * Math.cos(Math.PI * 2 * (h / 12));

              var _hour = {
                style: {
                  x: x,
                  y: y,
                  marginLeft: (r + x + parseInt(pL) / 2) - (parseInt(pL) + parseInt(mL)) + 'px',
                  marginTop: (r - y - parseInt(mT) / 2) - (parseInt(pT) + parseInt(mT)) + 'px'
                },
                h: h == 0 ? 0 : h + 12,
                selected: h + 12 == parseInt(cH)
              };

              _hours.push(_hour);
            }

            $scope.hours = _hours;
            that.toggleTime(true);
            that.initHands(true);
          },
          initMinutes: function () {
            that.fixMinMaxDate();
            $scope.currentView = 2;
            $scope.hours = [];
            $scope.minutes = [];
            $scope.showCalendar = false;
            $scope.showTime = true;

            that.showTime($scope.currentDate);

            var pL = 10;
            var pT = 10;
            var mL = 20;
            var mT = 10;
            var w = 200;
            var r = w / 2;
            var j = r / 1.2;
            var _minutes = [];

            for (var m = 0; m < 60; m += 5) {
              var x = j * Math.sin(Math.PI * 2 * (m / 60));
              var y = j * Math.cos(Math.PI * 2 * (m / 60));

              var _minute = {
                style: {
                  x: x,
                  y: y,
                  marginLeft: (r + x + parseInt(pL) / 2) - (parseInt(pL) + parseInt(mL)) + 'px',
                  marginTop: (r - y - parseInt(mT) / 2) - (parseInt(pT) + parseInt(mT)) + 'px'
                },
                m: ((m.toString().length == 2) ? m : '0' + m),
                selected: m == 5 * Math.round($scope.currentDate.minute() / 5)
              };
              _minutes.push(_minute);
            }

            $scope.minutes = _minutes;
            that.toggleTime(false);
            that.initHands(false);
            that._centerBox();
          },
          initHands: function (t) {
            var pL = 10;
            var mL = 20;
            var w = 7.5;
            var h = 7.5;
            var r = 100;
            var _hL = r / 1.7;
            var _mL = r / 1.5;

            var dtpHourHand = $element[0].getElementsByClassName('dtp-hour-hand')[0];
            dtpHourHand.style.left = r + (parseInt(mL) * 1.5) + 'px';
            dtpHourHand.style.height = _hL + 'px';
            dtpHourHand.style.marginTop = (r - _hL - parseInt(pL)) + 'px';
            if (t) dtpHourHand.classList.add("on");

            var dtpMinuteHand = $element[0].getElementsByClassName('dtp-minute-hand')[0];
            dtpMinuteHand.style.left = r + (parseInt(mL) * 1.5) + 'px';
            dtpMinuteHand.style.height = _mL + 'px';
            dtpMinuteHand.style.marginTop = (r - _mL - parseInt(pL)) + 'px';
            if (t) dtpMinuteHand.classList.add("on");

            var dtpClockCenter = $element[0].getElementsByClassName('dtp-clock-center')[0];
            dtpClockCenter.style.left = r + parseInt(pL) + parseInt(mL) - w + 'px';
            dtpClockCenter.style.marginTop = (r - (parseInt(mL) / 2)) - h + 'px';

            that.animateHands();

            that._centerBox();
          },
          animateHands: function () {
            var h = $scope.currentDate.hour();
            var m = $scope.currentDate.minute();

            var dtpHourHand = $element[0].getElementsByClassName('dtp-hour-hand')[0];
            var dtpMinuteHand = $element[0].getElementsByClassName('dtp-minute-hand')[0];
            that.rotateElement(dtpHourHand, (360 / 12) * h);
            that.rotateElement(dtpMinuteHand, ((360 / 60) * (5 * Math.round(m / 5))));
          },
          isAfterMinDate: function (date, checkHour, checkMinute) {
            var _return = true;

            if (typeof ($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
              var _minDate = moment($scope.minDate);
              var _date = moment(date);

              if (!checkHour && !checkMinute) {
                _minDate.hour(0);
                _minDate.minute(0);

                _date.hour(0);
                _date.minute(0);
              }

              _minDate.second(0);
              _date.second(0);
              _minDate.millisecond(0);
              _date.millisecond(0);

              if (!checkMinute) {
                _date.minute(0);
                _minDate.minute(0);

                _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
              } else {
                _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
              }
            }

            return _return;
          },
          isBeforeMaxDate: function (date, checkTime, checkMinute) {
            var _return = true;

            if (typeof ($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
              var _maxDate = moment($scope.maxDate);
              var _date = moment(date);

              if (!checkTime && !checkMinute) {
                _maxDate.hour(0);
                _maxDate.minute(0);

                _date.hour(0);
                _date.minute(0);
              }

              _maxDate.second(0);
              _date.second(0);
              _maxDate.millisecond(0);
              _date.millisecond(0);

              if (!checkMinute) {
                _date.minute(0);
                _maxDate.minute(0);

                _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
              } else {
                _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
              }
            }

            return _return;
          },
          rotateElement: function (el, deg) {
            el.style.transform = 'rotate(' + deg + 'deg)';
          },
          showDate: function (date) {
            //console.log('showDate');
            $scope.showTimeHeader = true;
            if (date) {
              $scope.showDateHeader = true;
              $scope.actualDay = date.locale(params.lang).format('dddd');
              $scope.actualMonth = date.locale(params.lang).format('MMM').toUpperCase();
              $scope.actualNum = date.locale(params.lang).format('DD');
              $scope.actualYear = date.locale(params.lang).format('YYYY');
            }
          },
          showTime: function (date) {
            //console.log('showTime', date);
            if (date) {
              var _minutes = (5 * Math.round(date.minute() / 5));
              var _time = {
                hours: date.format('HH'),
                minutes: ((_minutes.toString().length == 2) ? _minutes : '0' + _minutes)
              };

              if (params.date) {
                $scope.showTimeHeader = true;
                $scope.actualTime = _time;
              } else {
                if (params.shortTime)
                  $scope.actualDay = date.format('A');
                else
                  $scope.actualDay = ' ';

                $scope.showTimeHeader = false;
                $scope.actualTime = _time;
              }
            }
          },
          selectDate: function (date) {
            //console.log('selectDate');
            if (date) {
              $scope.currentDate = date;
              that.showDate($scope.currentDate);
              $scope.$emit('dateSelected', {
                date: date
              });
            }
          },
          generateCalendar: function (date) {
            //console.log('generateCalendar');
            var _calendar = {};

            if (date !== null) {
              var startOfMonth = moment(date).locale(params.lang).startOf('month');
              var endOfMonth = moment(date).locale(params.lang).endOf('month');

              var iNumDay = startOfMonth.format('d');

              _calendar.week = $scope.days;
              _calendar.days = [];

              for (var i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
                if (i === startOfMonth.date()) {
                  var iWeek = _calendar.week.indexOf(iNumDay.toString());
                  if (iWeek > 0) {
                    for (var x = 0; x < iWeek; x++) {
                      _calendar.days.push(0);
                    }
                  }
                }
                _calendar.days.push(moment(startOfMonth).locale(params.lang).date(i));
              }
            }

            return _calendar;
          },
          constructHTMLCalendar: function (date, calendar) {
            $scope.monthAndYear = date.locale(params.lang).format('MMMM YYYY');

            var _weekDays = [];
            for (var i = 0; i < calendar.week.length; i++) {
              _weekDays.push(moment(parseInt(calendar.week[i]), "d").locale(params.lang).format("dd").substring(0, 1));
            }
            $scope.weekDays = _weekDays;

            var _weeks = [];

            var _week = [];
            for (var i = 0; i < calendar.days.length; i++) {
              if (i % 7 == 0) {
                if (i != 0) {
                  _weeks.push(_week);
                }
                var _week = [];
              }

              var _day = {
                label: null,
                selected: false,
                disabled: true,
                data: {}
              };

              if (calendar.days[i] != 0) {
                _day.disabled = false;
                _day.label = moment(calendar.days[i]).locale(params.lang).format("DD");
                _day.data = calendar.days[i];
                if (that.isBeforeMaxDate(moment(calendar.days[i]), false, false) === false || that.isAfterMinDate(moment(calendar.days[i]), false, false) === false) {
                  _day.disabled = true;
                } else {
                  if (moment(calendar.days[i]).locale(params.lang).format("DD") === moment($scope.currentDate).locale(params.lang).format("DD")) {
                    _day.selected = true;

                  }
                }
              }
              _week.push(_day);
            }

            if (_week.length > 0) {
              _weeks.push(_week);
            }

            $scope.weeks = _weeks;
            //console.log('$scope.weeks', $scope.weeks);
            //console.log('$scope.weekDays', $scope.weekDays);
          },
          setName: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
          },
          isPM: function () {
            return $scope.isPM;
          },
          setElementValue: function (date) {

            //if (typeof(date) !== 'undefined'){
            //  $scope.currentDate = moment(date).locale(params.lang);
            //}

            $scope.value = moment($scope.currentDate).locale(params.lang).format(params.format);
          },
          setDateModel: function () {
            $scope.model = angular.copy($scope.currentDate);
            //$scope.model = $scope.currentDate.format(params.modelFormat);
            //$scope.formDatetimePicker.$setDirty();
          },
          toggleButtons: function (date) {
            if (date && date.isValid()) {
              var startOfMonth = moment(date).locale(params.lang).startOf('month');
              var endOfMonth = moment(date).locale(params.lang).endOf('month');

              $scope.btnMonthBeforeEnabled = that.isAfterMinDate(startOfMonth, false, false);
              $scope.btnMonthAfterEnabled = that.isBeforeMaxDate(endOfMonth, false, false);

              var startOfYear = moment(date).locale(params.lang).startOf('year');
              var endOfYear = moment(date).locale(params.lang).endOf('year');

              $scope.btnYearBeforeEnabled = that.isAfterMinDate(startOfYear, false, false);
              $scope.btnYearAfterEnabled = that.isBeforeMaxDate(endOfYear, false, false);
            }
          },
          toggleTime: function (isHours) {
            if (isHours) {
              angular.forEach($scope.hours, function (hour, hourKey) {
                var _date = moment($scope.currentDate);
                _date.hour(that.convertHours(hour.h)).minute(0).second(0);

                if (that.isAfterMinDate(_date, true, false) === false || that.isBeforeMaxDate(_date, true, false) === false) {
                  hour.disabled = true;
                } else {
                  hour.disabled = false;
                }
              });
            } else {
              angular.forEach($scope.minutes, function (minute, minuteKey) {
                var _minute = minute.m;
                var _date = moment($scope.currentDate);
                _date.minute(_minute).second(0);

                if (that.isAfterMinDate(_date, true, true) === false || that.isBeforeMaxDate(_date, true, true) === false) {
                  minute.disabled = true;
                } else {
                  minute.disabled = false;
                }
              });
            }
          },
          _onClick: function () {
            $scope.currentView = 0;

            that.initDates();

            that.show();

            if (params.date) {
              $scope.showDate = true;
              that.initDate();
            } else {
              if (params.time) {
                $scope.showTime = true;
                that.initHours();
              }
            }
          },
          _onBackgroundClick: function (e) {
            e.stopPropagation();
            that.hide();
          },
          _onElementClick: function (e) {
            e.stopPropagation();
          },
          _onCloseClick: function () {
            that.hide();
            if ($scope.closed) $scope.closed(true);
          },
          _onOKClick: function () {
            switch ($scope.currentView) {
              case 0:
                if (params.time === true) {
                  that.initHours();
                } else {
                  that.setElementValue();
                  that.setDateModel();
                  if (!$scope.inline)
                    that.hide();
                }
                break;
              case 1:
                that.initMinutes();
                break;
              case 2:
                that.setElementValue();
                that.setDateModel();
                if ($scope.inline) {
                  that._onClick();
                } else {
                  that.hide();
                }
                break;
            }
          },
          _onCancelClick: function () {
            if (params.time) {
              switch ($scope.currentView) {
                case 0:
                  that.hide();
                  break;
                case 1:
                  if (params.date) {
                    that.initDate();
                  } else {
                    that.hide();
                  }
                  break;
                case 2:
                  that.initHours();
                  break;
              }
            } else {
              that.hide();
            }
          },
          _onMonthBeforeClick: function () {
            if ($scope.btnMonthBeforeEnabled) {
              $scope.currentDate.subtract(1, 'months');
              that.initDate($scope.currentDate);
            }
          },
          _onMonthAfterClick: function () {
            if ($scope.btnMonthAfterEnabled) {
              $scope.currentDate.add(1, 'months');
              that.initDate($scope.currentDate);
            }
          },
          _onYearBeforeClick: function () {
            if ($scope.btnYearBeforeEnabled) {
              $scope.currentDate.subtract(1, 'years');
              that.initDate($scope.currentDate);
            }
          },
          _onYearAfterClick: function () {
            if ($scope.btnYearAfterEnabled) {
              $scope.currentDate.add(1, 'years');
              that.initDate($scope.currentDate);
            }
          },
          _onSelectDate: function (date) {
            // remove selected from all dates in $scope.weeks
            angular.forEach($scope.weeks, function (week, weekKey) {
              angular.forEach($scope.weeks[weekKey], function (day, dayKey) {
                $scope.weeks[weekKey][dayKey].selected = false;
              });
            });
            date.selected = true;
            that.selectDate(date.data);

            if (!params.enableOkButtons) {
              that._onOKClick();
            }
          },
          _onSelectHour: function (hourSelected) {

            if (!hourSelected.disabled) {
              // remove selected from all dates in $scope.weeks
              angular.forEach($scope.hours, function (hour, hourKey) {
                $scope.hours[hourKey].selected = false;
              });
              hourSelected.selected = true;

              var dataHour = parseInt(hourSelected.h);
              if (that.isPM())
                dataHour += 12;

              $scope.currentDate.hour(dataHour);
              that.showTime($scope.currentDate);

              that.animateHands();
              if (!params.enableOkButtons) {
                that._onOKClick();
              }
            } else {
              //console.log('hour disabled');
            }
          },
          _onSelectMinute: function (minuteSelected) {

            if (!minuteSelected.disabled) {
              // remove selected from all minutes in $scope.minutes
              angular.forEach($scope.minutes, function (minute, minuteKey) {
                $scope.minutes[minuteKey].selected = false;
              });
              minuteSelected.selected = true;


              $scope.currentDate.minute(parseInt(minuteSelected.m));
              that.showTime($scope.currentDate);

              that.animateHands();
              if (!params.enableOkButtons) {
                that._onOKClick();
              }
            }
          },
          convertHours: function (h) {
            var _return = h;

            if ((h < 12) && that.isPM())
              _return += 12;

            return _return;
          },
          setDate: function (date) {
            //console.log('setDate');
            params.currentDate = date;
            that.initDates();
          },
          setMinDate: function (date) {
            params.minDate = date;
            that.initDates();
          },
          setMaxDate: function (date) {
            params.maxDate = date;
            that.initDates();
          },
          show: function () {
            $scope.showDtp = true;
            that._centerBox();
          },
          hide: function () {
            $scope.showDtp = false;
          },
          resetDate: function () {

          },
          _centerBox: function () {
            //var h = (this.$dtpElement.height() - this.$dtpElement.find('.dtp-content').height()) / 2;
            //this.$dtpElement.find('.dtp-content').css('marginLeft', -(this.$dtpElement.find('.dtp-content').width() / 2) + 'px');
            //this.$dtpElement.find('.dtp-content').css('top', h + 'px');
          }
        };

        $scope.onClick = that._onClick;
        $scope.onOKClick = that._onOKClick;
        $scope.onCancelClick = that._onCancelClick;
        $scope.onCloseClick = that._onCloseClick;

        $scope.onSelectDate = that._onSelectDate;
        $scope.onMonthBeforeClick = that._onMonthBeforeClick;
        $scope.onMonthAfterClick = that._onMonthAfterClick;
        $scope.onYearBeforeClick = that._onYearBeforeClick;
        $scope.onYearAfterClick = that._onYearAfterClick;

        $scope.onSelectHour = that._onSelectHour;
        $scope.onSelectMinute = that._onSelectMinute;

        $scope.initDate = that.initDate;
        $scope.initHours = that.initHours;
        $scope.initMinutes = that.initMinutes;

        prepareAttrs();
        that.init();

        if ($scope.inline) {
          //console.log('auto show inline');
          that._onClick();
        }

        $scope.$on('dtp-open-click', function () {
          that._onClick();
        });

        $scope.$on('dtp-close-click', function () {
          that.hide();
        });

        $scope.$watch('model', function (newDate) {
          $scope.currentDate = newDate;
          that.showDate($scope.currentDate);
          that.initDate();
        });


        // Close the dropdown if clicked outside
        //$document.bind('click', function(event){
        //  console.log($element.find(event.target));
        //  var isClickedElementChildOfPopup = $element.find(event.target).length == 0;
        //  if (isClickedElementChildOfPopup){
        //    that.hide();
        //  }
        //});
      }
    };

  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceHelp
 * @description
 * # niceHelp
 */
angular.module('niceElements')
  .directive('niceHelp', function () {
    return {
      templateUrl: 'src/components/nice-help/nice-help.html',
      restrict: 'E',
      scope: {
        text: '@'
      },
      link: function postLink(scope, element, attrs) {

      },
      controller: function($rootScope, $scope) {

      }
    };
  });

angular.module('niceElements')
  .directive('niceInput', function () {
    return {
      templateUrl: 'src/components/nice-input/nice-input.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        type: '@',
        title: '@?',
        regex: '@?',
        placeholder: '@',
        minlength: '@?',
        maxlength: '@?',
        required: '=',
        fieldWidth: '@',
        labelWidth: '@',
        hideValid: '@',
        showValid: '@',
        textArea: '@',
        textAreaLines: '@',
        symbol: '@',
        help: '@',
        name: '@',
        noMargin: '@',
        minDecimalsCutZeros: '@', // Use this field to tell how much decimal places must always be, even if number is ceil.
        tabIndex: '@',
        isFocused: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.type) { attrs.type = 'text'; }
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.regex) { attrs.regex = null; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.minlength) { attrs.minlength = 1; }
        if (!attrs.maxlength) { attrs.maxlength = 100; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.textAreaLines) { attrs.textAreaLines = 3; }
        if (!attrs.symbol) { attrs.symbol = ''; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.name) { attrs.name = ''; }
        if (!attrs.minDecimalsCutZeros) { attrs.minDecimalsCutZeros = 0; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        attrs.showValid = angular.isDefined(attrs.showValid);
        attrs.textArea = angular.isDefined(attrs.textArea);
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        attrs.required = attrs.required === 'true';
        //attrs.required = angular.isDefined(attrs.required);

        if(!scope.textArea) {
          scope.elementType = "input";
        } else {
          scope.elementType = "textarea";
        }

        if (scope.isFocused) {
          var input = element[0].getElementsByTagName(scope.elementType)[0];
          if (input) {
            input.focus();
          }
        }

        // Set internal type
        scope.internalType = attrs.type;
        if (attrs.type == "percent") {
          scope.internalType = "percent";
          attrs.symbol = '%';
        } else if (attrs.type == "number") {
          scope.internalType = "number";
          if (scope.model) {
            scope.model = Number(scope.model);
          } else {
            scope.model = null;
          }
        } else if (attrs.type == "integer") {
          scope.internalType = "text";
          scope.model = Number(scope.model);
        } else if (attrs.type == "email") {
          // TODO: get rid of the errors
          scope.regexexp = new RegExp('^[_a-zA-Z0-9]+(.[_a-zA-Z0-9]+)*@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)+(.[a-zA-Z]{2,4})');
        }

        if (angular.isDefined(attrs.valid)) {
          scope.valid = scope.form;
        }

        if (angular.isDefined(attrs.minDecimalsCutZeros) && attrs.type == 'number') {
          scope.model = Number(scope.model);
          if (scope.model.toString().split('.').length < 2 || scope.model.toString().split('.')[1].length < parseInt(attrs.minDecimalsCutZeros))
            scope.model = (Number(scope.model)).toFixed(parseInt(attrs.minDecimalsCutZeros));
        }

        if (angular.isDefined(scope.regex) && scope.regex != '') {
          scope.regexexp = new RegExp(scope.regex);
        }

        scope.$watch('model', function (value_new, value_old) {
          scope.internalModel = scope.model;
        });

        scope.$watch('internalModel', function (value_new, value_old) {
          if (attrs.type == "number" && value_new) {
            if (typeof value_new != "number") {
              scope.internalModel = value_new.replace(',', '.');
              scope.model = scope.internalModel;
            }
          }
        });
        },

        controller: function ($scope) {
          $scope.id = Math.random().toString(36).substring(7);

          $scope.keypress = function (event) {
            if ($scope.type == "number" || $scope.type == "integer") {
              if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
                if ($scope.type == "number") {
                  if (String($scope.model).indexOf(".") >= 0) {
                    event.preventDefault();
                    return false;
                  }
                } else {
                  event.preventDefault();
                  return false;
                }
              } else if (event.charCode == 45) {
                if (String($scope.model).indexOf("-") >= 0) {
                  event.preventDefault();
                  return false;
                }
              } else if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
                return true;
              } else { // Prevent everything else
                event.preventDefault();
                return false;
              }
            }
          };
        }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceLabel
 * @description
 * # niceLabel
 */
angular.module('niceElements')
  .directive('niceLabel', function () {
    return {
      templateUrl: 'src/components/nice-label/nice-label.html',
      restrict: 'E',
      scope: {
        fieldWidth: '@',
        labelWidth: '@',
        value: '@',
        title: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.value) { attrs.labelWidth = ''; }
        if (!attrs.title) { attrs.labelWidth = ''; }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name backofficeApp.directive:loader
 * @description
 * # loader
 */
angular.module('niceElements')
  .directive('niceLoader', function () {
    return {
      templateUrl: 'src/components/nice-loader/nice-loader.html',
      restrict: 'E',
      scope: {
          visibleWhen: '=',
          addClass: '@'
      }
    };
  });

/**
 * @ngdoc directive
 * @name niceElements.factory:NiceNotification
 * @description
 * # NiceNotification
 */

angular.module('niceElements')
  .factory('NiceNotification', function ($timeout, $http, $compile, $templateCache, $rootScope, $injector, $sce) {

    var startTop = 10;
    var startRight = 10;
    var verticalSpacing = 10;
    var horizontalSpacing = 10;
    var type = '';
    var delay = 5000;

    var messageElements = [];

    var notify = function(args, t){

      if (typeof args !== 'object'){
        args = {message:args};
      }

      args.template = args.template ? args.template : 'src/components/nice-notification/nice-notification.html';
      args.delay = !angular.isUndefined(args.delay) ? args.delay : delay;
      args.type = t ? t : '';

      $http.get(args.template,{cache: $templateCache}).success(function(template) {

        var scope = $rootScope.$new();
        scope.message = $sce.trustAsHtml(args.message);
        scope.title = $sce.trustAsHtml(args.title);
        scope.t = args.type.substr(0,1);
        scope.delay = args.delay;

        if (typeof args.scope === 'object'){
          for (var key in args.scope){
            scope[key] = args.scope[key];
          }
        }

        var reposite = function() {
          var j = 0;
          var k = 0;
          var lastTop = startTop;
          var lastRight = startRight;
          for(var i = messageElements.length - 1; i >= 0; i --) {
            var element = messageElements[i];
            var elHeight = parseInt(element[0].offsetHeight);
            var elWidth = parseInt(element[0].offsetWidth);
            if ((top + elHeight) > window.innerHeight) {
              lastTop = startTop;
              k ++;
              j = 0;
            }
            var top = lastTop + (j === 0 ? 0 : verticalSpacing);
            var right = startRight + (k * (horizontalSpacing + elWidth));

            element.css('top', top + 'px');
            element.css('right', right + 'px');

            lastTop = top + elHeight;
            j ++;
          }
        };

        var templateElement = $compile(template)(scope);
        templateElement.addClass(args.type);
        templateElement.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd click', function(e){
          e = e.originalEvent || e;
          if (e.type === 'click' || (e.propertyName === 'opacity' && e.elapsedTime >= 0.4)){
            templateElement.remove();
            messageElements.splice(messageElements.indexOf(templateElement), 1);
            reposite();
          }
        });

        $timeout(function() {
          templateElement.addClass('killed');
          templateElement.remove();
          messageElements.splice(messageElements.indexOf(templateElement), 1);
          reposite();
        }, args.delay);

        angular.element(document.getElementsByTagName('body')).append(templateElement);
        messageElements.push(templateElement);

        $timeout(reposite);

      }).error(function(data){
        throw new Error('Template ('+args.template+') could not be loaded. ' + data);
      });

    };

    notify.config = function(args){
		  startTop = args.top ? args.top : startTop;
		  verticalSpacing = args.verticalSpacing ? args.verticalSpacing : verticalSpacing;
    };

    notify.primary = function() {
      this(args, '');
    };

    notify.error = function(args) {
      this(args, 'error');
    };

    notify.success = function(args) {
      this(args, 'success');
    };

    notify.info = function(args) {
      this(args, 'info');
    };

    notify.warning = function(args) {
      this(args, 'warning');
    };


    return notify;
  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceNumber
 * @description
 * # niceNumber
 */
angular.module('niceElements')
  .directive('niceNumber', function () {
    return {
      templateUrl: 'src/components/nice-number/nice-number.html',
      restrict: 'E',
      scope: {
        model: '=',
        valid: '=',
        disabled: '=',
        title: '@?',
        min: '@',
        max: '@',
        defaultValue: '@',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        showError: '@',
        noMargin: '@',
        step: '@',
        decimals: '@',
        allowNegative: '@'
      },

      link: function (scope, element, attrs) {
        // Set default value
        if (!attrs.defaultValue) {
          attrs.defaultValue = 0;
        } else {
          attrs.defaultValue = parseInt(attrs.defaultValue);
        }

        // Link form object with valid object
        if(angular.isDefined(attrs.valid)) {
          scope.valid = scope.form;
        }

        // Check if number is defined
        if (!angular.isDefined(attrs.model)){
          scope.model = attrs.defaultValue;
        } else {
          if(parseFloat(scope.model)){
            scope.model = parseFloat(scope.model);
          } else {
            scope.model = attrs.defaultValue;
          }
        }
      },

      controller: function($scope) {
        $scope.canAdd = true;
        $scope.canSubstract = true;

        // Fix min
        if(!$scope.min) $scope.min = 0;
        else $scope.min = parseFloat($scope.min);

        // Allow negative
        if ($scope.allowNegative) $scope.min = -Infinity;

        // Fix max
        if($scope.max) $scope.max = parseFloat($scope.max);

        // Fix decimals
        if(!$scope.decimals) $scope.decimals = 0;
        else $scope.decimals = parseInt($scope.decimals);

        // Fix step
        if(!$scope.step) $scope.step = 1;
        else $scope.step = parseFloat($scope.step);

        // Check canAdd or canSubtract
        $scope.check = function(){
          if($scope.min && parseFloat($scope.model) <= $scope.min) {
            $scope.canSubstract = false;
            $scope.model = $scope.min;
          } else {
            $scope.canSubstract = true;
          }

          if($scope.max && parseFloat($scope.model) >= $scope.max) {
            $scope.canAdd = false;
            $scope.model = $scope.max;
          } else {
            $scope.canAdd = true;
          }
        };


        // Check when load
        $scope.check();


        // On input change
        $scope.onChange = function(){
          $scope.check();
        };


        // Add to the value
        $scope.add = function(){
          var result = new Decimal($scope.model).plus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if($scope.max){
            if(result <= parseFloat($scope.max)) {
              $scope.model = result;
              $scope.form.$setDirty();
            }
          } else {
            $scope.model = result;
            $scope.form.$setDirty();
          }
          $scope.check();
        };


        // Subtract to the value
        $scope.subtract = function(){
          var result = new Decimal($scope.model).minus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if(result >= Number($scope.min)){
            $scope.model = result;
            $scope.form.$setDirty();
          }
          $scope.check();
        };
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePercent
 * @description
 * # nicePercent
 */
angular.module('niceElements')
  .directive('nicePercent', function () {
    return {
      templateUrl: 'src/components/nice-percent/nice-percent.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        title: '@?',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        placeholder: '@',
        noMargin: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
      },

      controller: function($rootScope, $scope) {
        // Link form object with valid object
        if (angular.isDefined($scope.valid)){
          $scope.valid = $scope.form;
        }

        var roundN = function(number, decimals){
          return Number(new Decimal(String(number)).toFixed(decimals, 4));
        };

        if (angular.isDefined($scope.model)){
          $scope.internalModel = roundN((angular.copy($scope.model) * 100), 6);
        } else {
          $scope.internalModel = "0";
          $scope.model = 0;
        }

        $scope.change = function(){
          if($scope.internalModel){
            $scope.internalModel = String($scope.internalModel).replace(',', '.');
            if(parseFloat($scope.internalModel) > 100) $scope.internalModel = 100;
            $scope.model = roundN(parseFloat($scope.internalModel) / 100, 6);
          } else {
            $scope.model = 0;
          }
        };

        $scope.keypress = function(event) {
          if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
            if($scope.internalModel.indexOf(".") >= 0){
              event.preventDefault();
              return false;
            }
          } else if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
            return true;
          } else { // Prevent everything else
            event.preventDefault();
            return false;
          }
        };

        $scope.$watch('model', function (value_new, value_old) {
          if (value_new){
            $scope.internalModel = roundN(angular.copy($scope.model) * 100, 6);
          }
        });

        $scope.$watch('internalModel', function (value_new, value_old) {
          if(!$scope.internalModel){
            $scope.internalModel = "0";
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceProgressBar
 * @description
 * # niceProgressBar
 */
angular.module('niceElements')
  .directive('niceProgressBar', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/components/nice-progress-bar/nice-progress-bar.html',
      scope: {
        title: '@',
        noMargin: "@",
        value: '=',
        max: '=',
        color: '='
      },

      controller: function($scope, $element, $timeout) {
        $scope.width = 0;
        $scope.resize = function(){
          $timeout(function() {
            $scope.width = $element[0].getElementsByClassName("progress")[0].offsetWidth;
          },100);
        };
        window.onresize = function() {
          $scope.resize();
        };
        $scope.resize();

        

        $scope.$watch("value", function(valueNew, valueOld){
          $scope.calculate();
        });

        $scope.$watch("max", function(valueNew, valueOld){
          $scope.calculate();
        });

        $scope.calculate = function(){
          $scope.percentage = ($scope.value / $scope.max) * 100;
        };

        $scope.calculate();
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceQuantity
 * @description
 * # niceQuantity
 */
angular.module('niceElements')
  .directive('niceQuantity', function () {
    return {
      templateUrl: 'src/components/nice-quantity/nice-quantity.html',
      restrict: 'E',
      scope: {
        title: '@',
        model: '=',
        max: '=',
        onChange: "&",
        noMargin: "@",
        fieldWidth: '@',
        labelWidth: '@'
      },
      controller: function ($scope) {
        if (!$scope.model) {
          $scope.model = 0;
        }

        $scope.add = function () {
          if ($scope.max) {
            if ($scope.max >= $scope.model + 1) {
              $scope.model += 1;
              $scope.onChange($scope.model);
            }
          } else {
            $scope.model += 1;
            $scope.onChange($scope.model);
          }
        };

        $scope.sub = function () {
          if ($scope.model - 1 >= 0) {
            $scope.model -= 1;
            $scope.onChange($scope.model);
          }
        };

        $scope.handleChange = function () {
          if ($scope.model) {
            $scope.model = Number($scope.model);
          }
        }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSearch
 * @description
 * # niceSearch
 */
angular.module('niceElements')
  .directive('niceSearch', function () {
    return {
      transclude: true,
      templateUrl: 'src/components/nice-search/nice-search.html',
      restrict: 'E',
      scope: {
        model: '=',
        isDisabled: '=',
        title: '@?',
        placeholder: '@',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        hideValid: '@',
        refreshFunction: '=',
        refreshSelectedCallback: '=',
        showDropdown: '@?',
        clearInput: '@',
        resetSearchInput: '@?',
        keyForInputLabel: '@?',
        disableRow: '@?',
        noMargin: '@',
        setText: '@',
        tabIndex: '@',
        isFocused: '@'
      },
      link: function (scope, element, attrs, ctrl, transcludeFn) {

        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        attrs.showDropdown = angular.isDefined(attrs.showDropdown);
        attrs.clearInput = angular.isDefined(attrs.clearInput);
        attrs.resetSearchInput = angular.isDefined(attrs.resetSearchInput);
        attrs.disableRow = angular.isDefined(attrs.disableRow);
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        if (!attrs.setText) { attrs.setText = ''; }

        // This is used for connecting directive's scope to transcluded html.
        // transcludeFn(scope, function(clone, scope) {
        //   var el = element.find('.nice-search');
        //   el.append(clone);
        // });

        // Set default text
        scope.$watch("setText", function(){
          scope.modelString = scope.setText;
        });

        // Check if object is defined
        if(angular.isDefined(scope.model)){
          if (angular.isDefined(scope.keyForInputLabel))
            scope.modelString = scope.model[scope.keyForInputLabel];
          else
            scope.modelString = scope.model;
        }

        var setValid = function(isValid){
          if(scope.required){
            scope.form.$setValidity('objectSelected', isValid);
          }
        };

        scope.$watch('model', function(newValue){
          if(scope.model && scope.model.id){
            setValid(true);
          } else {
            setValid(false);
          }
        });

        scope.selectRow = function(obj){
          if (angular.isDefined(scope.refreshSelectedCallback)){
            scope.refreshSelectedCallback(obj);
          }

          if (scope.resetSearchInput){
            scope.model = null;
          } else {
            scope.model = obj;
          }

          if (angular.isDefined(scope.keyForInputLabel))
            scope.modelString = obj[scope.keyForInputLabel];
          else
            scope.modelString = obj;

          scope.clear();

        };

        scope.clear = function(){
          scope.results = [];

          if(scope.clearInput){
            scope.modelString = "";
          }

          //scope.$apply();
        };

        // Close the dropdown if clicked outside
        var onClick = function(event){
          var isClickedElementChildOfPopup = element.find(event.target).length > 0;

          if (isClickedElementChildOfPopup) return;

          scope.results = [];
          scope.noResults = false;
          scope.$apply();
        };

        angular.element(element).on('click', onClick);

        // Keyboard up/down on search results
        var onKeyDown = function(event) {
          if((event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27) && scope.results && scope.results.length>0){
            event.preventDefault();

            if(event.keyCode == 27){ // Escape
              scope.modelString = "";
              scope.clear();
            }

            if(event.keyCode == 13){ // Enter
              scope.selectRow(scope.results[scope.selectedIndex]);
            }

            if(event.keyCode == 40 && scope.results && scope.selectedIndex+1 < scope.results.length){ // Down
              scope.selectedIndex += 1;
            }

            if(event.keyCode == 38 && scope.results && scope.selectedIndex-1 >= 0){ // Up
              scope.selectedIndex -= 1;
            }

            // TODO: What to do when hover?

            scope.$apply();
          }
        };

        angular.element(element).on('keydown', onKeyDown);

        scope.$on('$destroy', function () {
          angular.element(element).off('click', onClick);
          angular.element(element).off('keydown', onKeyDown);
        });

      },
      controller: function($scope, $timeout, $element) {
        $scope.id = Math.random().toString(36).substring(7);
        $scope.loading = false;
        $scope.noResults = false;
        $scope.requests = 0;

        $scope.focus = function() {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            input.focus();
          }
        };

        // Is focused
        if ($scope.isFocused) {
          $scope.focus();
        }

        $scope.results = [];
        var updateList = function(results, requestNumber){

          if(results){
            if ($scope.requests == requestNumber){
              $scope.noResults = results.length == 0;
              $scope.results = results;

              if(!$scope.noResults){
                $scope.selectedIndex = 0;
              }
            }
          }
          $scope.loading = false;
        };

        // ng-change function
        $scope.updateSearch = function () {
          $scope.loading = true;

          if ($scope.timer_promise)
            $timeout.cancel($scope.timer_promise);

          $scope.timer_promise = $timeout(function(){
            $scope.requests = $scope.requests + 1;
            var requestNumber = angular.copy($scope.requests);
            $scope.refreshFunction($scope.modelString).then(function(response){
              updateList(response, requestNumber);
            }, function(error){
              $scope.loading = false;
            });
            // Why was this here?
            // $scope.model = $scope.modelString;
          }, 200);

        };

        // If search button is clicked set focus or make request
        $scope.search = function(){
          if (!$scope.isDisabled){
            if($scope.showDropdown) {
              $scope.updateSearch();
            }
            $scope.focus();
          }
        };

        // Clear model
        $scope.remove = function(){
          $scope.model = null;
          $scope.modelString = null;
        }
      }
    }
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTimePicker
 * @description
 * # niceTimePicker
 */
angular.module('niceElements')
  .directive('niceTimePicker', function() {
    return {
      scope: {
        model: '=',
        title: '@',
        isDisabled: '=',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@'
      },
      restrict: 'E',
      templateUrl: 'src/components/nice-time-picker/nice-time-picker.html',
      link: function($scope, $element, $attrs) {
        if(!$scope.model) $scope.model = moment();
        $scope.open = false;


        $scope.close = function(){
          $scope.open = false;
        };


        $scope.validateDate = function(){
          $scope.checkDate($scope.modelString);
        };


        $scope.checkDate = function(date){
          var parsedDate = moment(date, "HH:mm");
          if(parsedDate.isValid()){
            $scope.forma.$setValidity("valid-time", true);
            $scope.model = parsedDate;
            $scope.refreshTime();
          } else {
            $scope.forma.$setValidity("valid-time", false);
            $scope.modelString = "";
          }
        };


        $scope.refreshTime = function(){
          $scope.hours = $scope.model.format("HH");
          $scope.minutes = $scope.model.format("mm");
          $scope.modelString = $scope.model.format("HH:mm");
        };


        $scope.changeHour = function(add){
          if(add) $scope.model.add(1, 'hour');
          else $scope.model.subtract(1, 'hour');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };

        $scope.changeMinutes = function(add){
          if(add) $scope.model.add(1, 'minutes');
          else $scope.model.subtract(1, 'minutes');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };


        $scope.$watch("model", function(value, oldValue){
          $scope.refreshTime();
          if(!value.isSame(oldValue)){
            $scope.checkDate(value);
          }
        })
      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceUpload
 * @description
 * # niceUpload
 */
 angular.module('niceElements')
   .directive('niceUpload', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'src/components/nice-upload/nice-upload.html',
      scope: {
        model: '=',
        title: '@',
        text: '@',
        fieldWidth: '@',
        labelWidth: '@',
        noMargin: '@',
        accept: '@',
        uploadFunction: '=',
        callbackFunction: '=',
        callbackFile: '=',
        callbackUrl: '='
      },

      link: function(scope, element, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.text) { attrs.text = 'Click to upload file'; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        var maxImageSize = 1000000; // 1MB

        element.bind("change", function (changeEvent) {

          if (scope.callbackUrl != undefined) {
            scope.callbackUrl(URL.createObjectURL(changeEvent.target.files[0]));
          }

          $timeout(function () {
            var inputObj = changeEvent.target;

            scope.loading = true;
            scope.error = null;
            var reader = new FileReader();

            if (inputObj.files) {
              try {
                var fileSize = inputObj.files[0].size; // in bytes

                reader.onload = function (event) {
                  $timeout(function(){
                    // file size must be smaller than 1MB.
                    if (fileSize <= maxImageSize) {
                      if (scope.callbackFunction != undefined) {
                        scope.loading = false;
                        scope.imageSource = null;
                        scope.callbackFunction(event.target.result);
                        scope.text = inputObj.files[0].name;
                        scope.form.$setDirty();
                      }

                      if(scope.callbackFile != undefined){
                        scope.loading = false;
                        scope.text = inputObj.files[0].name;
                        scope.callbackFile(inputObj.files[0]);
                        scope.form.$setDirty();
                      }

                      if (scope.uploadFunction != undefined) {
                        scope.uploadFunction(inputObj.files[0]).then(function (response) {
                          scope.loading = false;
                          scope.imageSource = event.target.result;
                          scope.model = response.data.url;
                          scope.form.$setDirty();
                        }, function (error) {
                          // Handle upload function error
                          scope.error = error;
                          scope.loading = false;
                          scope.imageSource = null;
                        });
                      } else {
                        // console.error("No upload function set!");
                      }
                    } else {
                      // Handle file too big error
                      scope.error = "File must be smaller than 1MB";
                      scope.loading = false;
                      scope.imageSource = null;
                    }
                  });
                };

              } catch (err) {
                // Handle try catch
                scope.error = "Something went wrong";
                scope.loading = false;
                scope.imageSource = null;
              }

              // when the file is read it triggers the onload event above.
              reader.readAsDataURL(inputObj.files[0]);

            }
          });

        });
      },

      controller: function($scope) {
        $scope.$watch("model", function(value){
          $scope.imageSource = angular.copy($scope.model);
        });
      }

    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceYesno
 * @description
 * # niceYesno
 */
angular.module('niceElements')
  .directive('niceYesno', function () {
    return {
      templateUrl: 'src/components/nice-yesno/nice-yesno.html',
      restrict: 'E',
      scope: {
        model: '=',
        modelValue: '=',
        yes: '@',
        no: '@',
        title: '@',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        options: '=',
        defaultFalse: '@',
        noMargin: '@'
      },
      controller: function($scope, $attrs) {
        if (!$attrs.yes) { $attrs.yes = 'Yes'; }
        if (!$attrs.no) { $attrs.no = 'No'; }
        if (!$attrs.title) { $attrs.title = ''; }
        if (!$attrs.fieldWidth) { $attrs.fieldWidth = 'col-sm-8'; }
        if (!$attrs.labelWidth) { $attrs.labelWidth = 'col-sm-4'; }
        if(!angular.isDefined($scope.model) && !angular.isDefined($scope.options)) $scope.model = !angular.isDefined($scope.defaultFalse);
        if(!angular.isDefined($scope.modelValue) && angular.isDefined($scope.options)) $scope.modelValue = $scope.options[0];

        $attrs.defaultFalse = angular.isDefined($attrs.defaultFalse);
        $attrs.noMargin = angular.isDefined($attrs.noMargin);
        $attrs.isDisabled = angular.isDefined($attrs.isDisabled);

        $scope.buttonClass = "";
        

        // ------------------------- Set overlay button position based on passed state in $scope.model -------------------------
        $scope.setButtonPosition = function(state) {
          if(state) {
            $scope.buttonClass = "yesno-button-yes";
          } else {
            $scope.buttonClass = "yesno-button-no";
          }
        };

        // ------------------------- Watch for changes from outside -------------------------
        $scope.$watch('model', function(value_new, value_old){
          if(angular.isDefined($scope.model)){
            $scope.setButtonLabel($scope.model);
            $scope.setButtonPosition($scope.model);
          }
        });

        // ------------------------- Watch for model value -------------------------
        $scope.$watch('modelValue', function(value_new, value_old){
          if($scope.options){
            $scope.model = $scope.modelValue == $scope.options[0];
          }
        });

        // ------------------------- Set button label -------------------------
        $scope.setButtonLabel = function(state){
          if (state) {
            $scope.state = $scope.yes;
          } else {
            $scope.state = $scope.no;
          }
        };
        
        // ------------------------- Set width -------------------------
        $scope.setWidth = function(width, el){
          el.style.width = width;
        };
  

        // ------------------------- Switch -------------------------
        $scope.switch = function(){
          if(!$scope.isDisabled){
            $scope.model = !$scope.model;

            if($scope.options){
              if($scope.model){
                $scope.modelValue = $scope.options[0];
              } else {
                $scope.modelValue = $scope.options[1];
              }
            }

            $scope.formYesno.$setDirty();
          }
        };

        // Call it first time
        $scope.setButtonPosition($scope.model);

        // Set label based on state passed in $scope.model
        $scope.setButtonLabel($scope.model);
      }
    };
  });

angular.module('niceElements').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/components/nice-button-toggle/nice-button-toggle.html',
    "<div class=\"nice-button-toggle row\">\r" +
    "\n" +
    "    <div class=\"col-xs-offset-4 col-xs-8\">\r" +
    "\n" +
    "            <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"model = !model\">\r" +
    "\n" +
    "                {{ label }}\r" +
    "\n" +
    "                <span ng-show=\"!model\" class=\"glyphicon glyphicon-menu-down\"></span>\r" +
    "\n" +
    "                <span ng-show=\"model\" class=\"glyphicon glyphicon-menu-up\"></span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-button/nice-button.html',
    "<div class=\"nice-button\" ng-class=\"{'margin-bottom-0' : noMargin}\">\r" +
    "\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-class=\"addClass\" ng-click=\"click()\" ng-disabled=\"niceDisabled===true\">\r" +
    "\n" +
    "        <div ng-class=\"{opacity0: loading==true, opacity1: loading==false}\"><ng-transclude></ng-transclude></div>\r" +
    "\n" +
    "        <div ng-class=\"{display0: loading==false, opacity1: loading==true}\" class=\"nice-button-loader-wrapper\"><nice-loader add-class=\"nice-button-loader\"></nice-loader></div>\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-calendar/nice-calendar.html',
    "<div class=\"nice-calendar\" ng-form=\"formCalendar\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"nice-calendar-wrapper\">\r" +
    "\n" +
    "                <div class=\"header\">\r" +
    "\n" +
    "                    <i class=\"fa fa-angle-left\" ng-click=\"previous()\" title=\"{{ translations.prevMonth }}\"></i>\r" +
    "\n" +
    "                    <span title=\"{{ month.format('MM.YYYY' )}}\">{{ month.format(\"MMMM, YYYY\" )}}</span>\r" +
    "\n" +
    "                    <i class=\"fa fa-angle-right\" ng-click=\"next()\" title=\"{{ translations.nextMonth }}\"></i>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"week names\">\r" +
    "\n" +
    "                    <span class=\"day\" translate>{{ translations.mon }}</span>\r" +
    "\n" +
    "                    <span class=\"day\" translate>{{ translations.tue }}</span>\r" +
    "\n" +
    "                    <span class=\"day\" translate>{{ translations.wed }}</span>\r" +
    "\n" +
    "                    <span class=\"day\" translate>{{ translations.thu }}</span>\r" +
    "\n" +
    "                    <span class=\"day\" translate>{{ translations.fri }}</span>\r" +
    "\n" +
    "                    <span class=\"day weekend\" translate>{{ translations.sat }}</span>\r" +
    "\n" +
    "                    <span class=\"day weekend\" translate>{{ translations.sun }}</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"week\" ng-repeat=\"week in weeks\">\r" +
    "\n" +
    "                    <span\r" +
    "\n" +
    "                        class=\"day\"\r" +
    "\n" +
    "                        title=\"{{ day.date.format('DD.MM.YYYY') }}\"\r" +
    "\n" +
    "                        ng-class=\"{\r" +
    "\n" +
    "                            today: day.isToday,\r" +
    "\n" +
    "                            'different-month': !day.isCurrentMonth,\r" +
    "\n" +
    "                            'start-selected': isSameDay(day.date, startDate),\r" +
    "\n" +
    "                            'end-selected': isSameDay(day.date, endDate),\r" +
    "\n" +
    "                            'selected': isBetweenRange(day.date),\r" +
    "\n" +
    "                            'selecting-start': selectStart,\r" +
    "\n" +
    "                            'selecting-end': !selectStart,\r" +
    "\n" +
    "                            'weekend': day.isWeekday,\r" +
    "\n" +
    "                            'disabled': day.isDisabled\r" +
    "\n" +
    "                        }\"\r" +
    "\n" +
    "                        ng-style=\"\r" +
    "\n" +
    "                            (color && isBetweenRange(day.date)) && {'background-color': lighten(color) } ||\r" +
    "\n" +
    "                            (color && isSameDay(day.date, startDate)) && {'background-color': color } ||\r" +
    "\n" +
    "                            (color && isSameDay(day.date, endDate)) && {'background-color': color }\r" +
    "\n" +
    "                        \"\r" +
    "\n" +
    "                        ng-click=\"select(day)\"\r" +
    "\n" +
    "                        ng-repeat=\"day in week.days\"\r" +
    "\n" +
    "                        >\r" +
    "\n" +
    "                        {{ day.number }}\r" +
    "\n" +
    "                        <p class=\"popup\">{{ popupText }}</p>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"clearfix\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"nice-calendar-time\" ng-if=\"time\">\r" +
    "\n" +
    "                    <div class=\"time-picker\">\r" +
    "\n" +
    "                        <select\r" +
    "\n" +
    "                          title=\"{{ translations.selectStartTime }}\"\r" +
    "\n" +
    "                          class=\"time-picker-hour\"\r" +
    "\n" +
    "                          ng-model=\"startDateHour\"\r" +
    "\n" +
    "                          ng-change=\"startHourChange(startDateHour)\"\r" +
    "\n" +
    "                          ng-options=\"hour for hour in hours\">\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"time-picker\">\r" +
    "\n" +
    "                        <select\r" +
    "\n" +
    "                          title=\"{{ translations.selectStartTime }}\"\r" +
    "\n" +
    "                          class=\"time-picker-minute\"\r" +
    "\n" +
    "                          ng-model=\"startDateMinute\"\r" +
    "\n" +
    "                          ng-change=\"startMinuteChange(startDateMinute)\"\r" +
    "\n" +
    "                          ng-options=\"minute for minute in minutes\">\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"time-picket-icon\">\r" +
    "\n" +
    "                        <i class=\"fa fa-clock-o\"></i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"time-picker\">\r" +
    "\n" +
    "                         <select\r" +
    "\n" +
    "                          title=\"{{ translations.selectEndTime }}\"\r" +
    "\n" +
    "                          class=\"time-picker-hour\"\r" +
    "\n" +
    "                          ng-model=\"endDateHour\"\r" +
    "\n" +
    "                          ng-change=\"endHourChange(endDateHour)\"\r" +
    "\n" +
    "                          ng-options=\"hour for hour in hours\">\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"time-picker no-border-right\">\r" +
    "\n" +
    "                        <select\r" +
    "\n" +
    "                          title=\"{{ translations.selectEndTime }}\"\r" +
    "\n" +
    "                          class=\"time-picker-minute\"\r" +
    "\n" +
    "                          ng-model=\"endDateMinute\"\r" +
    "\n" +
    "                          ng-change=\"endMinuteChange(endDateMinute)\"\r" +
    "\n" +
    "                          ng-options=\"minute for minute in minutes\">\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"nice-selected-dates\">\r" +
    "\n" +
    "                    <div class=\"nice-start-date\">\r" +
    "\n" +
    "                        <label>{{ translations.start }}</label>\r" +
    "\n" +
    "                        <div ng-class=\"startTimeClass\">{{ formatDate(startDate) }}</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"nice-end-date\">\r" +
    "\n" +
    "                        <label>{{ translations.end }}</label>\r" +
    "\n" +
    "                        <div ng-class=\"endTimeClass\">{{ formatDate(endDate) }}</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-checkbox/nice-checkbox.html',
    "<div class=\"nice-checkbox\" ng-class=\"{'checked': model, 'margin-bottom-0' : noMargin}\" ng-click=\"toggle()\">\r" +
    "\n" +
    "    <div class=\"checkbox\">\r" +
    "\n" +
    "        <svg class=\"check\" viewBox=\"-281 373 48 48\">\r" +
    "\n" +
    "            <path class=\"check-stroke\" d=\"M-273.2,398.2l10,9.9 l22.4-22.3\"></path>\r" +
    "\n" +
    "        </svg>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div ng-if=\"title\" class=\"message\">{{ title }}</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-choice/nice-choice.html',
    "<div class=\"nice-choice\" ng-class=\"{'margin-bottom-0' : noMargin}\" ng-form=\"formChoice\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <ul class=\"list-unstyled\" ng-class=\"{'disabled': isDisabled}\">\r" +
    "\n" +
    "                <li ng-repeat=\"item in internalList\" ng-class=\"{ 'selected' : isItemSelected(item) }\" ng-click=\"toggle(item)\">\r" +
    "\n" +
    "                    <div class=\"choice-checkbox\" ng-class=\"{'circle' : !multiple }\"><i class=\"fa fa-check\"></i></div>\r" +
    "\n" +
    "                    <div class=\"choice-label\">{{ getLabel(item) }}</div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-comment/nice-comment.html',
    "<div class=\"nice-comment\" ng-class=\"{'margin-bottom-0' : noMargin}\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\" ng-click=\"edit()\">\r" +
    "\n" +
    "            <textarea\r" +
    "\n" +
    "                ng-class=\"{'editing': editing}\"\r" +
    "\n" +
    "                class=\"form-control\"\r" +
    "\n" +
    "                ng-model=\"model\"\r" +
    "\n" +
    "                title=\"{{ help }}\"\r" +
    "\n" +
    "                placeholder=\"{{placeholder}}\"\r" +
    "\n" +
    "                rows=\"{{rows}}\"\r" +
    "\n" +
    "                ng-blur=\"save()\"\r" +
    "\n" +
    "            ></textarea>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-date-range/nice-date-range.html',
    "<ng-form class=\"nice-date-range\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\r" +
    "\n" +
    "  <div class=\"row\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "        <div class=\"input-group\">\r" +
    "\n" +
    "            <input date-range-picker class=\"form-control date-picker\" type=\"text\" options=\"opts\" ng-model=\"model\" />\r" +
    "\n" +
    "            <span date-range-picker options=\"opts\" ng-model=\"model\" class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</ng-form>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-date/nice-date.html',
    "<div class=\"nice-date\" ng-form=\"forma\">\r" +
    "\n" +
    "    <div class=\"nice-date-date\">\r" +
    "\n" +
    "        <div class=\"nice-date-header\">\r" +
    "\n" +
    "            <i class=\"fa fa-angle-left\" ng-click=\"previous()\" title=\"{{ translations.prevMonth }}\"></i>\r" +
    "\n" +
    "            <span title=\"{{ month.format('MM.YYYY' ) }}\">{{ month.format('MMMM, YYYY' ) }}</span>\r" +
    "\n" +
    "            <i class=\"fa fa-angle-right\" ng-click=\"next()\" title=\"{{ translations.nextMonth }}\"></i>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"nice-date-week names\">\r" +
    "\n" +
    "            <span class=\"nice-date-day\" translate>{{ translations.mon }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day\" translate>{{ translations.tue }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day\" translate>{{ translations.wed }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day\" translate>{{ translations.thu }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day\" translate>{{ translations.fri }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day weekend\" translate>{{ translations.sat }}</span>\r" +
    "\n" +
    "            <span class=\"nice-date-day weekend\" translate>{{ translations.sun }}</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"nice-date-week\" ng-repeat=\"week in weeks\">\r" +
    "\n" +
    "            <span\r" +
    "\n" +
    "                class=\"nice-date-day\"\r" +
    "\n" +
    "                title=\"{{ day.date.format('DD.MM.YYYY') }}\"\r" +
    "\n" +
    "                ng-class=\"{\r" +
    "\n" +
    "                    'today': day.isToday,\r" +
    "\n" +
    "                    'different-month': !day.isCurrentMonth,\r" +
    "\n" +
    "                    'selected': isSameDay(model, day.date),\r" +
    "\n" +
    "                    'weekend': day.isWeekday,\r" +
    "\n" +
    "                    'disabled': day.isDisabled,\r" +
    "\n" +
    "                    'between': isBetween(day.date, model, nextDate)\r" +
    "\n" +
    "                }\"\r" +
    "\n" +
    "                ng-click=\"select(day)\"\r" +
    "\n" +
    "                ng-repeat=\"day in week.days\"\r" +
    "\n" +
    "            >{{ day.number }}</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"nice-date-time\" ng-if=\"time\">\r" +
    "\n" +
    "        <div class=\"time-picker time-picker-hour\">\r" +
    "\n" +
    "            <select\r" +
    "\n" +
    "                ng-model=\"timeData.dateHour\"\r" +
    "\n" +
    "                ng-change=\"timeChange(timeData.dateHour, null)\"\r" +
    "\n" +
    "                ng-options=\"hour as hour for hour in hours track by hour\">\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"time-picker time-picker-minute\">\r" +
    "\n" +
    "            <select\r" +
    "\n" +
    "                ng-model=\"timeData.dateMinute\"\r" +
    "\n" +
    "                ng-change=\"timeChange(null, timeData.dateMinute)\"\r" +
    "\n" +
    "                ng-options=\"minute as minute for minute in minutes track by minute\">\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-datetime-picker/nice-datetime-picker.html',
    "<div class=\"nice-datetime-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"nice-dtp-background\" ng-click=\"closeDtp(true)\" ng-if=\"isOpen\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <!--Needed for intercepting form changes ($dirty)!-->\r" +
    "\n" +
    "            <div ng-form=\"formDatetimePicker\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"input-group\" id=\"dropdown{{randNum}}\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" value=\"{{value}}\" ng-click=\"openDtp()\">\r" +
    "\n" +
    "                <span class=\"input-group-addon\" ng-click=\"openDtp()\">\r" +
    "\n" +
    "                    <i class=\"fa\" ng-class=\"{'fa-clock-o': date=='false', 'fa-calendar': date!='false'}\"></i>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- inject nice-dtp here -->\r" +
    "\n" +
    "            <div ng-show=\"isOpen\">\r" +
    "\n" +
    "                <nice-dtp\r" +
    "\n" +
    "                    model=\"currentDate\"\r" +
    "\n" +
    "                    format=\"{{format}}\"\r" +
    "\n" +
    "                    model-format=\"{{modelFormat}}\"\r" +
    "\n" +
    "                    date=\"{{date}}\"\r" +
    "\n" +
    "                    time=\"{{time}}\"\r" +
    "\n" +
    "                    width=\"{{width}}\"\r" +
    "\n" +
    "                    enable-ok-buttons=\"{{enableOkButtons}}\"\r" +
    "\n" +
    "                    lang=\"{{lang}}\"\r" +
    "\n" +
    "                    min-date=\"{{minDate}}\"\r" +
    "\n" +
    "                    max-date=\"{{maxDate}}\"\r" +
    "\n" +
    "                    week-start=\"{{weekStart}}\"\r" +
    "\n" +
    "                    ok-text=\"{{okText}}\"\r" +
    "\n" +
    "                    cancel-text=\"{{cancelText}}\"\r" +
    "\n" +
    "                    closed=\"closeDtp\"\r" +
    "\n" +
    "                ></nice-dtp>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-datetimerange-picker-2/nice-datetimerange-picker-2.html',
    "<div class=\"nice-datetimerange-picker-2\" ng-form=\"formDateRangePicker\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"nice-dtp-background\" ng-click=\"close()\" ng-if=\"isOpen\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"input-group\" ng-class=\"{ 'open': isOpen }\" ng-click=\"open()\">\r" +
    "\n" +
    "                <!-- <input type=\"text\" class=\"form-control\" value=\"{{ modelFormat }}\" ng-keyup=\"inputChanged()\"> -->\r" +
    "\n" +
    "                <div class=\"form-control\" title=\"{{ modelFormat }}\">{{ modelFormat }}</div>\r" +
    "\n" +
    "                <span class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"dtp-wrapper\" ng-show=\"isOpen\">\r" +
    "\n" +
    "                <div class=\"dtp-buttons-left\">\r" +
    "\n" +
    "                    <div class=\"dtp-buttons-top\">\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectToday()\">Last 24 hours</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(7)\">Last 7 days</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastMonth()\">Last month</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectThisMonth()\">This month</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"dtp-buttons-bottom\">\r" +
    "\n" +
    "                        <a class=\"btn btn-danger btn-block\" ng-click=\"close()\">Cancel</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-success btn-block\" ng-click=\"confirm()\">OK</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"dtp-left\">\r" +
    "\n" +
    "                    <nice-date model=\"innerStartDate\" next-date=\"innerEndDate\" time=\"time\"></nice-date>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"dtp-right\">\r" +
    "\n" +
    "                    <nice-date model=\"innerEndDate\" next-date=\"innerStartDate\" time=\"time\"></nice-date>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-datetimerange-picker/nice-datetimerange-picker.html',
    "<div class=\"nice-datetime-picker nice-datetimerange-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"nice-dtp-background\" ng-click=\"cancelClick()\" ng-if=\"showDtpRange\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <!--Needed for intercepting form changes ($dirty)!-->\r" +
    "\n" +
    "            <div ng-form=\"formDatetimeRangePicker\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"dropdown\">\r" +
    "\n" +
    "                <a class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" ng-click=\"openDtpRange()\" href=\"javascript:void(0);\">\r" +
    "\n" +
    "                    <div class=\"input-group\">\r" +
    "\n" +
    "                        <input type=\"text\" class=\"form-control\" value=\"{{value}}\" ng-click=\"openDtpRange()\">\r" +
    "\n" +
    "                        <span class=\"input-group-addon\"><i class=\"fa\" ng-class=\"{'fa-clock-o': date=='false', 'fa-calendar': date!='false'}\"></i></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"dtp-range-wrapper\" ng-show=\"showDtpRange\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"dtp-layer\">\r" +
    "\n" +
    "                    <div class=\"dtp-buttons-left\">\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(1)\">Last 24 hours</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(7)\">Last 7 days</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastMonth()\">Last month</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectThisMonth()\">This month</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"dtp-left\">\r" +
    "\n" +
    "                        <!-- inject nice-dtp here -->\r" +
    "\n" +
    "                        <nice-dtp\r" +
    "\n" +
    "                            model=\"dateStart\"\r" +
    "\n" +
    "                            format=\"{{format}}\"\r" +
    "\n" +
    "                            model-format=\"{{modelFormat}}\"\r" +
    "\n" +
    "                            date=\"{{date}}\"\r" +
    "\n" +
    "                            time=\"{{time}}\"\r" +
    "\n" +
    "                            width=\"{{width}}\"\r" +
    "\n" +
    "                            enable-ok-buttons=\"{{enableOkButtons}}\"\r" +
    "\n" +
    "                            lang=\"{{lang}}\"\r" +
    "\n" +
    "                            min-date=\"{{minDate}}\"\r" +
    "\n" +
    "                            max-date=\"{{maxDate}}\"\r" +
    "\n" +
    "                            week-start=\"{{weekStart}}\"\r" +
    "\n" +
    "                            ok-text=\"{{okText}}\"\r" +
    "\n" +
    "                            cancel-text=\"{{cancelText}}\"\r" +
    "\n" +
    "                            inline=\"true\"\r" +
    "\n" +
    "                        ></nice-dtp>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"dtp-right\">\r" +
    "\n" +
    "                        <!-- inject nice-dtp here -->\r" +
    "\n" +
    "                        <nice-dtp\r" +
    "\n" +
    "                                model=\"dateEnd\"\r" +
    "\n" +
    "                                format=\"{{format}}\"\r" +
    "\n" +
    "                                model-format=\"{{modelFormat}}\"\r" +
    "\n" +
    "                                date=\"{{date}}\"\r" +
    "\n" +
    "                                time=\"{{time}}\"\r" +
    "\n" +
    "                                width=\"{{width}}\"\r" +
    "\n" +
    "                                enable-ok-buttons=\"{{enableOkButtons}}\"\r" +
    "\n" +
    "                                lang=\"{{lang}}\"\r" +
    "\n" +
    "                                min-date=\"{{minDate}}\"\r" +
    "\n" +
    "                                max-date=\"{{maxDate}}\"\r" +
    "\n" +
    "                                week-start=\"{{weekStart}}\"\r" +
    "\n" +
    "                                ok-text=\"{{okText}}\"\r" +
    "\n" +
    "                                cancel-text=\"{{cancelText}}\"\r" +
    "\n" +
    "                                inline=\"true\"\r" +
    "\n" +
    "                         > </nice-dtp>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"dtp-buttons-bottom\">\r" +
    "\n" +
    "                        <a class=\"btn btn-danger btn-block margin-right-20\" ng-click=\"cancelClick()\">Cancel</a>\r" +
    "\n" +
    "                        <a class=\"btn btn-success btn-block\" ng-click=\"okClick()\">OK</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dropdown-date/nice-dropdown-date.html',
    "<div class=\"nice-dropdown-date\" ng-form=\"dropdownDateForm\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-sm-8\"\r" +
    "\n" +
    "             ng-class=\"{\r" +
    "\n" +
    "                fieldWidth: fieldWidth,\r" +
    "\n" +
    "                'has-warning': !isDisabled && dropdownDateForm.$invalid && dropdownDateForm.$dirty,\r" +
    "\n" +
    "                'disabled': isDisabled\r" +
    "\n" +
    "            }\">\r" +
    "\n" +
    "            <div class=\"form-inline\">\r" +
    "\n" +
    "                <div class=\"form-group nice-dropdown-date-day\">\r" +
    "\n" +
    "                    <select\r" +
    "\n" +
    "                        ng-model=\"dateFields.day\"\r" +
    "\n" +
    "                        class=\"form-control\"\r" +
    "\n" +
    "                        ng-options=\"day for day in days\"\r" +
    "\n" +
    "                        ng-change=\"checkDate()\"\r" +
    "\n" +
    "                        ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "                        required=\"true\"\r" +
    "\n" +
    "                    ></select>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"form-group nice-dropdown-date-month\">\r" +
    "\n" +
    "                    <select\r" +
    "\n" +
    "                        ng-model=\"dateFields.month\"\r" +
    "\n" +
    "                        class=\"form-control\"\r" +
    "\n" +
    "                        ng-options=\"month.value as month.name for month in months\"\r" +
    "\n" +
    "                        ng-change=\"checkDate()\"\r" +
    "\n" +
    "                        ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "                        required=\"true\"\r" +
    "\n" +
    "                    ></select>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"form-group nice-dropdown-date-year\">\r" +
    "\n" +
    "                    <select\r" +
    "\n" +
    "                        ng-model=\"dateFields.year\"\r" +
    "\n" +
    "                        class=\"form-control\"\r" +
    "\n" +
    "                        ng-options=\"year for year in years\"\r" +
    "\n" +
    "                        ng-change=\"checkDate()\"\r" +
    "\n" +
    "                        ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "                        required=\"true\"\r" +
    "\n" +
    "                    ></select>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-dropdown-old/nice-dropdown-old.html',
    "<div class=\"nice-dropdown-old\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div ng-class=\"addButtonEnable && !isDisabled ? 'input-group': ''\">\r" +
    "\n" +
    "                <div class=\"btn-group\" dropdown is-open=\"status.isopen\" ng-class=\"{ 'disabled': isDisabled || emptyList }\">\r" +
    "\n" +
    "                    <button\r" +
    "\n" +
    "                        type=\"button\"\r" +
    "\n" +
    "                        class=\"btn btn-block btn-dropdown dropdown-toggle\"\r" +
    "\n" +
    "                        title=\"{{ getLabel(internalSelected) }}\"\r" +
    "\n" +
    "                        dropdown-toggle\r" +
    "\n" +
    "                        ng-disabled=\"isDisabled || emptyList\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <span ng-if=\"internalSelected.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': internalSelected.color_hex_code}\"></span>\r" +
    "\n" +
    "                        <span ng-if=\"!multiple\">{{ getLabel(internalSelected) }}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <span ng-if=\"multiple\">\r" +
    "\n" +
    "                            <!--<span ng-repeat=\"item in internalSelected\"><span ng-if=\"$index > 0\">, </span>{{ getLabel(item) }}</span>-->\r" +
    "\n" +
    "                            <span ng-if=\"internalSelected.length  > 1\">{{ internalSelected.length }} <translate>selected</translate></span>\r" +
    "\n" +
    "                            <span ng-if=\"internalSelected.length  == 1\">{{ getLabel(internalSelected[0]) }}</span>\r" +
    "\n" +
    "                            <span ng-if=\"internalSelected.length == 0\" translate>None</span>\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <!--<span ng-if=\"showTax && internalSelected.value\">{{ internalSelected.value * 100 }}%</span>-->\r" +
    "\n" +
    "                        <span class=\"caret\"></span>\r" +
    "\n" +
    "                    </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ul id=\"{{id}}\" class=\"dropdown-menu\" role=\"menu\">\r" +
    "\n" +
    "                        <li id=\"{{id}}-{{$index}}\" ng-repeat=\"item in internalList\" ng-click=\"clicked(item)\">\r" +
    "\n" +
    "                            <a href>\r" +
    "\n" +
    "                                <span class=\"choice-checkbox\" ng-if=\"multiple\" ng-class=\"{ 'selected' : isItemSelected(item) }\"><i class=\"fa fa-check\"></i></span>\r" +
    "\n" +
    "                                <span ng-if=\"item.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': item.color_hex_code}\"></span>\r" +
    "\n" +
    "                                <span ng-class=\"{'multiple-item': multiple}\">{{ getLabel(item) }}</span>\r" +
    "\n" +
    "                                <!--<span ng-if=\"showTax && item.value\">{{ item.value * 100 }}%</span>-->\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span class=\"input-group-btn\" ng-if=\"addButtonEnable && !isDisabled\">\r" +
    "\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"addButtonFunction()\" type=\"button\">+</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\r" +
    "\n" +
    "    <div ng-form=\"formDropdown\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dropdown/nice-dropdown.html',
    "<div class=\"nice-dropdown\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <!------------------------- Label ------------------------->\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!------------------------- Field ------------------------->\r" +
    "\n" +
    "        <div ng-class=\"[ fieldWidth ? fieldWidth : 'col-sm-8', { 'open': isOpen, 'disabled': isDisabled || emptyList } ]\" click-outside=\"close()\" is-open=\"{{ isOpen }}\">\r" +
    "\n" +
    "            <div class=\"nice-field-wrapper\">\r" +
    "\n" +
    "                <!------------------------- Button ------------------------->\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-dropdown\" ng-click=\"toggle()\" ng-disabled=\"isDisabled || emptyList\">\r" +
    "\n" +
    "                    <div class=\"btn-dropdown-inside\" ng-transclude=\"button\" ng-if=\"selected != null\">\r" +
    "\n" +
    "                        <span ng-if=\"!multiple\">{{ selected[objValue] }}</span>\r" +
    "\n" +
    "                        <span ng-if=\"multiple\">\r" +
    "\n" +
    "                            <span ng-if=\"selected.length > 1\">{{ selected.length }} <translate>selected</translate></span>\r" +
    "\n" +
    "                            <span ng-if=\"selected.length == 1\">{{ selected[0][objValue] }}</span>\r" +
    "\n" +
    "                            <span ng-if=\"selected.length == 0\">None</span>\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"not-selected\" ng-if=\"selected == null\">\r" +
    "\n" +
    "                        {{ selectText }}\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <span class=\"caret\" ng-show=\"!loading\"></span>\r" +
    "\n" +
    "                    <nice-loader visible-when=\"!loading\"></nice-loader>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!------------------------- Dropdown menu ------------------------->\r" +
    "\n" +
    "                <div class=\"dropdown-menu\">\r" +
    "\n" +
    "                    <div class=\"search-bar\" ng-if=\"searchFunction\">\r" +
    "\n" +
    "                        <input ng-model=\"internal.search\" ng-model-options=\"{ debounce: 500 }\" ng-change=\"handleSearch()\" placeholder=\"{{ searchText }}\" />\r" +
    "\n" +
    "                        <span class=\"icon\"><i class=\"fa fa-search\"></i></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"no-data\" ng-if=\"internalList && internalList.length == 0\">{{ noDataText }}</div>\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li ng-if=\"nullable\" ng-click=\"handleSelected(null, -1)\">\r" +
    "\n" +
    "                            {{ nullableText }}\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li ng-repeat=\"item in internalList\" ng-click=\"handleSelected(item, $index)\" ng-class=\"{ 'selected': item._selected }\">\r" +
    "\n" +
    "                            <span class=\"choice-checkbox\" ng-if=\"multiple\"><i class=\"fa fa-check\"></i></span>\r" +
    "\n" +
    "                            <span ng-transclude=\"option\">\r" +
    "\n" +
    "                                <span ng-class=\"{ 'multiple-item': multiple }\">{{ item[objValue] }}</span>\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!------------------------- Add button ------------------------->\r" +
    "\n" +
    "                <button class=\"btn btn-primary add-btn\" type=\"button\" ng-if=\"addButtonFunction\" ng-click=\"addButtonFunction()\">+</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div ng-form=\"formDropdown\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dtp/nice-dtp.html',
    "<div class=\"dtp-wrapper\">\r" +
    "\n" +
    "    <div class=\"dtp\" id=\"this.name\" ng-class=\"{'hidden': !showDtp}\">\r" +
    "\n" +
    "        <div class=\"dtp-content\" ng-style=\"dtp_content_style\">\r" +
    "\n" +
    "            <div class=\"dtp-date-view\">\r" +
    "\n" +
    "                <div class=\"dtp-header\" ng-if=\"!inline\">\r" +
    "\n" +
    "                    <div class=\"dtp-actual-day\">{{actualDay}}</div>\r" +
    "\n" +
    "                    <div class=\"dtp-close\" ng-if=\"!inline\"><a href=\"javascript:void(0);\" ng-click=\"onCloseClick()\"><i class=\"fa fa-close\"></i></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"dtp-date\" ng-if=\"!inline\" ng-class=\"{'hidden': !showDateHeader}\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"left center p10\">\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"dtp-actual-month p80\" ng-click=\"initDate()\">{{actualMonth}}</div>\r" +
    "\n" +
    "                        <div class=\"right center p10\">\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"dtp-actual-num\" ng-click=\"initDate()\">{{actualNum}}</div>\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"left center p10\">\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-year-before\" ng-click=\"onYearBeforeClick()\" ng-class=\"{'disabled': !btnYearBeforeEnabled}\"\"><i class=\"fa fa-chevron-left\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"dtp-actual-year p80\" ng-click=\"initDate()\">{{actualYear}}</div>\r" +
    "\n" +
    "                        <div class=\"right center p10\">\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-year-after\" ng-click=\"onYearAfterClick()\" ng-class=\"{'disabled': !btnYearAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"dtp-time\" ng-show=\"!showTimeHeader\">\r" +
    "\n" +
    "                    <div class=\"dtp-actual-maxtime\">\r" +
    "\n" +
    "                        <a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"dtp-picker\">\r" +
    "\n" +
    "                    <div class=\"dtp-picker-calendar\" ng-class=\"{'hidden': !showCalendar}\">\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div ng-if=\"inline\" class=\"left center p10\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"dtp-picker-month\" ng-class=\"{'p80': inline}\">{{monthAndYear}}</div>\r" +
    "\n" +
    "                            <div class=\"right center p10\" ng-if=\"inline\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <table class=\"table dtp-picker-days\">\r" +
    "\n" +
    "                            <thead>\r" +
    "\n" +
    "                            <th ng-repeat=\"weekDay in weekDays track by $index\">{{weekDay}}</th>\r" +
    "\n" +
    "                            </thead>\r" +
    "\n" +
    "                            <tbody>\r" +
    "\n" +
    "                            <tr ng-repeat=\"week in weeks\">\r" +
    "\n" +
    "                                <td ng-repeat=\"day in week\">\r" +
    "\n" +
    "                                    <span ng-if=\"day.disabled\" class=\"dtp-select-day\">{{day.label}}</span>\r" +
    "\n" +
    "                                    <a ng-if=\"!day.disabled\" ng-click=\"onSelectDate(day)\" href=\"javascript:void(0);\" class=\"dtp-select-day\" ng-class=\"{'selected': day.selected}\">{{day.label}}</a>\r" +
    "\n" +
    "                                </td>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                            </tbody>\r" +
    "\n" +
    "                        </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"dtp-picker-datetime\" ng-class=\"{'hidden': !showTime}\">\r" +
    "\n" +
    "                        <div class=\"dtp-actual-meridien\">\r" +
    "\n" +
    "                            <div class=\"dtp-actual-time p60\" ng-show=\"showTimeHeader\">\r" +
    "\n" +
    "                                <a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"dtp-picker-clock\">\r" +
    "\n" +
    "                            <div class=\"dtp-hand dtp-hour-hand\" ng-show=\"currentView==1\"></div>\r" +
    "\n" +
    "                            <div class=\"dtp-hand dtp-minute-hand\" ng-show=\"currentView==2\"></div>\r" +
    "\n" +
    "                            <div class=\"dtp-clock-center\"></div>\r" +
    "\n" +
    "                            <div ng-repeat=\"hour in hours\" class=\"dtp-picker-time\" ng-style=\"hour.style\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-hour\" ng-class=\"{'selected': hour.selected, 'disabled': hour.disabled}\" ng-click=\"onSelectHour(hour)\">{{hour.h}}</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div ng-repeat=\"minute in minutes\" class=\"dtp-picker-time\" ng-style=\"minute.style\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-minute\" ng-class=\"{'selected': minute.selected, 'disabled': minute.disabled}\" ng-click=\"onSelectMinute(minute)\">{{minute.m}}</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--<div class=\"dtp-buttons\" ng-if=\"enableOkButtons\">-->\r" +
    "\n" +
    "                <!--<button class=\"dtp-btn-cancel btn btn-flat\" ng-click=\"onCancelClick()\">{{cancelText}}</button>-->\r" +
    "\n" +
    "                <!--<button class=\"dtp-btn-ok btn btn-flat\" ng-click=\"onOKClick()\"> {{okText}} </button>-->\r" +
    "\n" +
    "                <!--<div class=\"clearfix\"></div>-->\r" +
    "\n" +
    "            <!--</div>-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-help/nice-help.html',
    "<div class=\"nice-help\">\r" +
    "\n" +
    "    <i class=\"fa fa-question-circle\"></i>\r" +
    "\n" +
    "    <div class=\"help-window\">{{ text }}</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-input/nice-input.html',
    "<ng-form class=\"nice-input\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"forma\">\r" +
    "\n" +
    "  <div class=\"row\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "        <div \r" +
    "\n" +
    "            class=\"form-group\"\r" +
    "\n" +
    "            ng-class=\"{\r" +
    "\n" +
    "            'has-feedback': showValid && !hideValid,\r" +
    "\n" +
    "            'has-warning': !isDisabled && forma.$invalid && forma.$dirty && !hideValid,\r" +
    "\n" +
    "            'has-success': !isDisabled && forma.$valid && forma.$dirty && showValid,\r" +
    "\n" +
    "            'symbol': symbol,\r" +
    "\n" +
    "            'disabled': isDisabled}\"\r" +
    "\n" +
    "        >\r" +
    "\n" +
    "            <input ng-show=\"!textArea\"\r" +
    "\n" +
    "                class=\"form-control\"\r" +
    "\n" +
    "                type=\"{{ internalType }}\"\r" +
    "\n" +
    "                ng-model=\"model\"\r" +
    "\n" +
    "                title=\"{{ help }}\"\r" +
    "\n" +
    "                name=\"{{ name }}\"\r" +
    "\n" +
    "                id=\"{{ id }}\"\r" +
    "\n" +
    "                tabindex=\"{{ tabIndex }}\"\r" +
    "\n" +
    "                placeholder=\"{{ placeholder }}\"\r" +
    "\n" +
    "                ng-minlength=\"minlength\"\r" +
    "\n" +
    "                ng-maxlength=\"maxlength\"\r" +
    "\n" +
    "                ng-required=\"required\"\r" +
    "\n" +
    "                ng-keypress=\"keypress($event)\"\r" +
    "\n" +
    "                ng-pattern=\"regexexp\"\r" +
    "\n" +
    "                ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "            />\r" +
    "\n" +
    "            <textarea ng-show=\"textArea\"\r" +
    "\n" +
    "                class=\"form-control\"\r" +
    "\n" +
    "                ng-model=\"model\"\r" +
    "\n" +
    "                title=\"{{ help }}\"\r" +
    "\n" +
    "                id=\"{{ id }}\"\r" +
    "\n" +
    "                tabindex=\"{{ tabIndex }}\"\r" +
    "\n" +
    "                placeholder=\"{{ placeholder }}\"\r" +
    "\n" +
    "                rows=\"{{textAreaLines}}\"\r" +
    "\n" +
    "                ng-minlength=\"minlength\"\r" +
    "\n" +
    "                ng-maxlength=\"maxlength\"\r" +
    "\n" +
    "                ng-required=\"required\"\r" +
    "\n" +
    "                ng-pattern=\"regexexp\"\r" +
    "\n" +
    "                ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "            ></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span class=\"input-group-addon\" ng-if=\"symbol\">{{ symbol }}</span>\r" +
    "\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\r" +
    "\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-if=\"forma.$error && forma.$dirty\">\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$dirty && forma.$error.email\" translate>Email is not valid.</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$dirty && forma.$error.pattern\" translate>This field requires a specific pattern.</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$error.minlength\"><translate>Your input is too short. It must contain at least</translate> {{ minlength }} <translate>characters</translate>.</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$error.maxlength\" translate>Your input is too long</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$error.required\" ng-if=\"forma.$dirty\" translate>This field is required.</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-if=\"forma.$error.unique\" translate>This field must be unique.</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- <pre>{{ forma | json }}</pre> -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</ng-form>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-label/nice-label.html',
    "<div class=\"nice-label\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-xs-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}</label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-xs-8'\">\r" +
    "\n" +
    "        <p class=\"value\">{{ value }}</p>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-loader/nice-loader.html',
    "<div class=\"nice-loader\" ng-if=\"!visibleWhen\" ng-class=\"addClass\">\r" +
    "\n" +
    "  <svg version=\"1.1\" id=\"loader\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\r" +
    "\n" +
    "    <path fill=\"#000\" d=\"M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z\"></path>\r" +
    "\n" +
    "  </svg>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-notification/nice-notification.html',
    "<div class=\"notification\">\r" +
    "\n" +
    "    <h3 ng-show=\"title\" ng-bind-html=\"title\"></h3>\r" +
    "\n" +
    "    <div class=\"message\" ng-bind-html=\"message\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-number/nice-number.html',
    "<div ng-form=\"form\" class=\"nice-number\" ng-class=\"{'margin-bottom-0' : noMargin}\">\r" +
    "\n" +
    "    <div ng-class=\"{'row' : !disableRow}\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}</label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"input-group\"\r" +
    "\n" +
    "                ng-class=\"{'has-warning': !disabled && form.$invalid && form.$dirty}\">\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canSubstract\" ng-click=\"subtract()\">-</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <input type=\"number\" step=\"{{ step }}\" ng-change=\"onChange()\" class=\"form-control\" max=\"{{ max }}\" min=\"{{ min }}\" ng-model=\"model\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canAdd\" ng-click=\"add()\">+</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-messages=\"form.$error\" ng-if=\"showError\">\r" +
    "\n" +
    "                <div class=\"error-message\" ng-message=\"number\" ng-if=\"form.$dirty\" translate>This field requires a number</div>\r" +
    "\n" +
    "                <div class=\"error-message\" ng-message=\"min\"><translate>Min value is</translate> {{ min }}</div>\r" +
    "\n" +
    "                <div class=\"error-message\" ng-message=\"max\"><translate>Max value is</translate> {{ max }}</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-percent/nice-percent.html',
    "<ng-form class=\"nice-input\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\r" +
    "\n" +
    "  <div class=\"row\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "        <div class=\"form-group has-feedback symbol\"\r" +
    "\n" +
    "             ng-class=\"{\r" +
    "\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\r" +
    "\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\r" +
    "\n" +
    "                'disabled': isDisabled\r" +
    "\n" +
    "        }\">\r" +
    "\n" +
    "            <input\r" +
    "\n" +
    "                class=\"form-control\"\r" +
    "\n" +
    "                type=\"text\"\r" +
    "\n" +
    "                max=\"100\"\r" +
    "\n" +
    "                min=\"0\"\r" +
    "\n" +
    "                ng-model=\"internalModel\"\r" +
    "\n" +
    "                placeholder=\"{{ placeholder }}\"\r" +
    "\n" +
    "                ng-required=\"required\"\r" +
    "\n" +
    "                ng-keypress=\"keypress($event)\"\r" +
    "\n" +
    "                ng-change=\"change()\"\r" +
    "\n" +
    "                ng-disabled=\"isDisabled\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span class=\"input-group-addon\">%</span>\r" +
    "\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\r" +
    "\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-messages=\"form.$error\">\r" +
    "\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"form.$dirty\">This field requires a specific pattern.</div>\r" +
    "\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"form.$dirty\">This field is required.</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-progress-bar/nice-progress-bar.html',
    "<div class=\"nice-progress-bar\" ng-class=\"{'margin-bottom-0' : noMargin}\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"progress\">\r" +
    "\n" +
    "                <div class=\"progress-value\">{{ value }} / {{ max }}</div>\r" +
    "\n" +
    "                <div class=\"progress-bar\" ng-style=\"{'width': percentage+'%', 'background': color}\">\r" +
    "\n" +
    "                    <div class=\"progress-value\" ng-style=\"{'width': width+'px'}\">{{ value }} / {{ max }}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-quantity/nice-quantity.html',
    "<div class=\"nice-quantity\" ng-class=\"{'margin-bottom-0' : noMargin}\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"input-group\">\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-primary btn-left\" ng-click=\"sub()\" type=\"button\">-</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "                <input class=\"value form-control\" ng-model=\"model\" type=\"number\" ng-change=\"handleChange()\" />\r" +
    "\n" +
    "        \r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-primary btn-right\" ng-click=\"add()\" type=\"button\">+</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-search/nice-search.html',
    "<ng-form class=\"nice-input nice-search\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"input-group\" ng-class=\"{\r" +
    "\n" +
    "                'disabled': isDisabled,\r" +
    "\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty,\r" +
    "\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty}\">\r" +
    "\n" +
    "                <input\r" +
    "\n" +
    "                    class=\"form-control\"\r" +
    "\n" +
    "                    type=\"text\"\r" +
    "\n" +
    "                    id=\"{{ id }}\"\r" +
    "\n" +
    "                    ng-model=\"modelString\"\r" +
    "\n" +
    "                    ng-keypress=\"keypress($event)\"\r" +
    "\n" +
    "                    placeholder=\"{{ placeholder }}\"\r" +
    "\n" +
    "                    ng-disabled=\"isDisabled\"\r" +
    "\n" +
    "                    ng-change=\"updateSearch()\"\r" +
    "\n" +
    "                    ng-required=\"required\"\r" +
    "\n" +
    "                    tabindex=\"{{ tabIndex }}\"\r" +
    "\n" +
    "                >\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"search()\" ng-if=\"!model\">\r" +
    "\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-search\" ></i>\r" +
    "\n" +
    "                    <i ng-show=\"loading\" class=\"fa fa-refresh fa-spin\"></i>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"remove()\" ng-if=\"model\">\r" +
    "\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-remove\" ></i>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\"></div>\r" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"nice-dropdown-empty\" ng-if=\"noResults\">\r" +
    "\n" +
    "                <div class=\"nice-search-row\">No results found.</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"nice-dropdown\" ng-if=\"results.length\">\r" +
    "\n" +
    "                <div ng-repeat=\"result in results\" class=\"nice-search-row\" ng-class=\"{'active': selectedIndex == $index}\" ng-click=\"selectRow(result)\">\r" +
    "\n" +
    "                    <span class=\"text-bold\">{{ result[keyForInputLabel] }}</span>\r" +
    "\n" +
    "                    <!--<div ng-transclude></div>-->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--Here is injected dropdown html if passed and results present and open.-->\r" +
    "\n" +
    "    <!--<div ng-transclude></div>-->\r" +
    "\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-time-picker/nice-time-picker.html',
    "<div class=\"nice-time-picker\" ng-form=\"forma\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "            <div class=\"input-group\" ng-class=\"{\r" +
    "\n" +
    "                'has-warning': !isDisabled && forma.$invalid && forma.$dirty,\r" +
    "\n" +
    "                'disabled': isDisabled }\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"modelString\" ng-keyup=\"$event.keyCode == 13 && validateDate()\" ng-blur=\"validateDate()\">\r" +
    "\n" +
    "                <span class=\"input-group-addon\" ng-click=\"open = !open\"><i class=\"fa fa-clock-o\"></i></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"nice-time-picker-dropdown\" ng-if=\"open\">\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">\r" +
    "\n" +
    "                        <button ng-click=\"changeHour(true)\"><i class=\"fa fa-chevron-up\"></i></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">\r" +
    "\n" +
    "                        <button ng-click=\"changeMinutes(true)\"><i class=\"fa fa-chevron-up\"></i></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"row numbers\">\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">{{ hours }}</div>\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">{{ minutes }}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">\r" +
    "\n" +
    "                        <button ng-click=\"changeHour(false)\"><i class=\"fa fa-chevron-down\"></i></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-xs-6\">\r" +
    "\n" +
    "                        <button ng-click=\"changeMinutes(false)\"><i class=\"fa fa-chevron-down\"></i></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"nice-background\" ng-click=\"close()\" ng-if=\"open\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-upload/nice-upload.html',
    "<ng-form class=\"nice-upload\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\r" +
    "\n" +
    "  <div class=\"row\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "        <input class=\"input-file\" type=\"file\" accept=\"{{ accept }}\" ng-model=\"file\" />\r" +
    "\n" +
    "        <div class=\"input-area\">\r" +
    "\n" +
    "            <div class=\"middle-text\" ng-if=\"!imageSource && !loading\">\r" +
    "\n" +
    "                {{ text }}\r" +
    "\n" +
    "                <div class=\"error\" ng-if=\"error\">{{ error }}</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <img ng-if=\"imageSource\" data-ng-src=\"{{ imageSource }}\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"loading\" ng-if=\"loading\">\r" +
    "\n" +
    "            <nice-loader></nice-loader>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</ng-form>\r" +
    "\n"
  );


  $templateCache.put('src/components/nice-yesno/nice-yesno.html',
    "<div class=\"row nice-yesno\" ng-class=\"{'margin-bottom-0' : noMargin}\" ng-form=\"formYesno\">\r" +
    "\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\r" +
    "\n" +
    "        <label class=\"nice\">{{ title }}</label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\r" +
    "\n" +
    "        <div class=\"yesno-wrapper noselect\" ng-class=\"{ 'disabled': isDisabled }\">\r" +
    "\n" +
    "            <div class=\"yesno-yes-bg\" ng-click=\"switch()\">{{ yes }}</div>\r" +
    "\n" +
    "            <div class=\"yesno-no-bg\" ng-click=\"switch()\">{{ no }}</div>\r" +
    "\n" +
    "            <div class=\"yesno-button\" ng-class=\"buttonClass\" ng-click=\"switch()\">{{ state }}</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
