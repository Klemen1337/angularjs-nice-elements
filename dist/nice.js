'use strict';

angular.module('niceElements', [
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'daterangepicker'
]);


/**
 * @ngdoc directive
 * @name niceElements.directive:niceButtonToggle
 * @description
 * # niceButtonToggle
 */
angular.module('niceElements')
  .directive('niceButtonToggle', function () {
    return {
      templateUrl: 'views/nice-button-toggle.html',
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
      templateUrl: 'views/nice-button.html',
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
  .directive("niceCalendar", function() {
    return {
      restrict: "E",
      templateUrl: "views/nice-calendar.html",
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
              scope.formCalendar.$setDirty();

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
              scope.formCalendar.$setDirty();

              // If end date is before start date
              if(scope.endDate.isBefore(scope.startDate)){
                scope.startDate = angular.copy(scope.endDate);
              }
            }
          }
        };


        // ------------------ Time changes ------------------
        scope.startHourChange = function(value){
          scope.startDateHour = value;
          scope.startDate = moment(scope.startDate).hours(scope.startDateHour);
          scope.formCalendar.$setDirty();
        };


        scope.startMinuteChange = function(value) {
          scope.startDateMinute = value;
          scope.startDate = moment(scope.startDate).minutes(scope.startDateMinute);
          scope.formCalendar.$setDirty();
        };


        scope.endHourChange = function(value){
          scope.endDateHour = value;
          scope.endDate = moment(scope.endDate).hours(scope.endDateHour);
          scope.formCalendar.$setDirty();
        };


        scope.endMinuteChange = function(value) {
          scope.endDateMinute = value;
          scope.endDate = moment(scope.endDate).minutes(scope.endDateMinute);
          scope.formCalendar.$setDirty();
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
 * @name niceElements.directive:niceChoice
 * @description
 * # niceChoice
 */
angular.module('niceElements')
  .directive('niceChoice', function () {
    return {
      templateUrl: 'views/nice-choice.html',
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
 * @name niceElements.directive:niceComment
 * @description
 * # niceComment
 */
angular.module('niceElements')
  .directive('niceComment', function ($timeout) {
    return {
      templateUrl: 'views/nice-comment.html',
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
      templateUrl: 'views/nice-date-range.html',
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
      templateUrl: 'views/nice-date.html',
      scope: {
        model: '=',
        title: '@',
        fieldWidth: '@',
        labelWidth: '@',
        format: '@',
        min: '@',
        max: '@',
        noMargin: '@',
        startDate: '=',
        endDate: '='
      },

      link: function(scope, iElement, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.format) { attrs.format = 'dd.MM.yyyy'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if(scope.model) scope.model = new Date();

        scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };
      },

      controller: function($scope) {
        if(!angular.isDefined($scope.model)) $scope.model = moment().format();

        $scope.today = function() {
          $scope.model = new Date();
        };

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
        };

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
    templateUrl: 'views/nice-datetime-picker.html',
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

        $scope.opened = false;

        $scope.openDtp = function () {
          $scope.$broadcast('dtp-open-click');
          $scope.opened = true;
        };

        $scope.closeDtp = function(response) {
          //console.log(response);
          $scope.$broadcast('dtp-close-click');
          $scope.opened = false;
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
      labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
    },
    templateUrl: 'views/nice-datetimerange-picker.html',
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

        var setLabelValue = function(){
          var _from = moment($scope.internalStart).locale(params.lang).format(params.format);
          var _to = moment($scope.internalEnd).locale(params.lang).format(params.format);
          $scope.value = _from + ' - ' + _to;
        };

        var initCurrentDates = function () {
          if (typeof($scope.modelStart) === 'undefined' || $scope.modelStart === null) {
            //$scope.dateStart = moment().subtract(1, 'days');
            var _start = moment().subtract(1, 'days').utc().locale(params.lang).format(params.modelFormat);
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
              // all other combinations
              if (typeof($scope.modelStart) === 'string') {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.dateStart = moment($scope.modelStart, params.modelFormat).locale(params.lang);
                else
                  $scope.dateStart = moment.utc($scope.modelStart, params.modelFormat).local().locale(params.lang);
              }
              else {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.dateStart = moment($scope.modelStart).locale(params.lang);
                else
                  $scope.dateStart = moment.utc($scope.modelStart).local().locale(params.lang);
              }
            }
          }

          // initialize dateEnd
          if (typeof($scope.modelEnd) === 'undefined' || $scope.modelEnd === null) {
            //$scope.dateEnd = moment();
            var _end = moment().utc().locale(params.lang).format(params.modelFormat);
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
              // all other combinations
              if (typeof($scope.modelEnd) === 'string') {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.dateEnd = moment($scope.modelEnd, params.modelFormat).locale(params.lang);
                else
                  $scope.dateEnd = moment.utc($scope.modelEnd, params.modelFormat).local().locale(params.lang);
              }
              else {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.dateEnd = moment($scope.modelEnd).locale(params.lang);
                else
                  $scope.dateEnd = moment.utc($scope.modelEnd).local().locale(params.lang);
              }
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
          var _start = moment($scope.internalStart, params.modelFormat).utc().locale(params.lang).format(params.modelFormat);
          $scope.modelStart = _start;
          var _end = moment($scope.internalEnd, params.modelFormat).utc().locale(params.lang).format(params.modelFormat);
          $scope.modelEnd = _end;
          //$scope.modelStart = angular.copy($scope.internalStart);
          //$scope.modelEnd = angular.copy($scope.internalEnd);
          $scope.showDtpRange = false;
        };

        $scope.cancelClick = function(){
          $scope.showDtpRange = false;
          //$scope.internalStart = angular.copy($scope.modelStart);
          //$scope.internalEnd = angular.copy($scope.modelEnd);
          if (params.modelFormat.indexOf('Z')>=0){
            var _start = moment($scope.modelStart, params.modelFormat).locale(params.lang).format(params.modelFormat);
            var _end = moment($scope.modelEnd, params.modelFormat).locale(params.lang).format(params.modelFormat);
          }else{
            var _start = moment.utc($scope.modelStart, params.modelFormat).local().locale(params.lang).format(params.modelFormat);
            var _end = moment.utc($scope.modelEnd, params.modelFormat).local().locale(params.lang).format(params.modelFormat);
          }

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
          //if (newValues[0]>newValues[1]){
            // switch values
            //$scope.dateStart = newValues[1];
            //$scope.dateEnd = newValues[0];
          //}else{
            $scope.internalStart = moment(newValues[0]).locale(params.lang).format(params.modelFormat);
            $scope.internalEnd = moment(newValues[1]).locale(params.lang).format(params.modelFormat);
            setLabelValue();
          //}

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
    templateUrl: "views/nice-dropdown-date.html",
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
      }
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
      templateUrl: 'views/nice-dropdown.html',
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
        // deprecated: listIsObj - list must always contain objects
        //listIsObj: '@',           // True - list has objects, False - list has strings
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

      compile: function(element, attrs){
        if (!attrs.title) { attrs.title = ''; }
        // if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        // if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.objValue) { attrs.objValue = 'value'; }
        if (!attrs.objKey) { attrs.objKey = 'id'; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.list) { attr.list = []; }
        if (!attrs.noOptionsText) { attrs.noOptionsText = "No options"; }

        attrs.valid = attrs.formDropdown;

        if(!attrs.addButtonFunction) { attrs.addButtonFunction = null; }
      },

      controller: function($rootScope, $scope, $document) {
        $scope.selectedIsObj = $scope.selectedIsObj === 'true' || $scope.selectedIsObj === true;
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.required = $scope.required === 'true' || $scope.required === true;
        $scope.showTax = $scope.showTax === 'true' || $scope.showTax === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;

        $scope.internalSelected = null;
        $scope.id = Math.random().toString(36).substring(7);

        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };


        $scope.isItemSelected = function(item){
          if (!$scope.internalSelected)
            return false;
          // Which item is selected
          if ($scope.multiple) {
              return _.where($scope.internalSelected, {'id':item.id}).length > 0;
          }else{
              return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };

        var _set_internal_list = function(){
          $scope.internalList = angular.copy($scope.list);
        };

        var _add_null_object_to_internal = function(){
          if ($scope.nullable && !$scope.multiple) {
            var nullObj = {};
            nullObj[$scope.objKey] = null;
            nullObj[$scope.objValue] = '-';
            $scope.internalList = [nullObj].concat($scope.internalList);
          }
        };

        var _get_selected_object = function(selected){
          if (!selected)
            return null;

          if ($scope.selectedIsObj)
            return selected;
          else
            return _.find($scope.internalList, getFilter(selected));
        };

        var _set_internal_selected_one = function(selected){
          var obj = {};

          var selectedObj = _get_selected_object(selected);
          // console.log('_set_internal_selected_one', selected, selectedObj);
          if(selectedObj && _.find($scope.internalList, getFilter(selected))){
              obj = selectedObj;
          }else{
              obj = $scope.internalList[0];
          }
          $scope.internalSelected = obj;
          _set_model(obj);
        };

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

        var _set_internal_selected_multiple = function(item){

          var _selected_objects = _get_selected_objects(item);

          if (_selected_objects){
            $scope.internalSelected = _selected_objects;
            _set_model($scope.internalSelected);
          }else{
            $scope.internalSelected = [];
            _set_model($scope.internalSelected);
          }
        };

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
          if (!_.isEqual(_new, $scope.model))
            $scope.model = _new;
        };

        var init = function() {
          _set_internal_list();
          _add_null_object_to_internal();

          if($scope.multiple && $scope.model){
            if ($scope.internalSelected)
              // remove already selected but not in list - this happens when list changes from outside
              _set_internal_selected_multiple(_.filter($scope.internalSelected, function(obj) {
                return _.find($scope.internalList, getFilter(obj));
              }));
            else
              $scope.internalSelected = [];
          }

          // Set internalSelected
          if($scope.internalList && $scope.internalList.length>0){
            $scope.emptyList = false;

            if ($scope.multiple)
              _set_internal_selected_multiple($scope.model);
            else
              _set_internal_selected_one($scope.model);

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

            if ($scope.multiple)
              _set_internal_selected_multiple(sel);
            else
              _set_internal_selected_one([sel]);
          }
        };

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
          }

        };

        $scope.getLabel = function(item){
          if (item)
            return item[$scope.objValue];
          else
            return '-';
        };

        $scope.$watch('list', function (value_new, value_old) {
          init();
        }, true);

        $scope.$watch('model', function (value_new, value_old) {

          if ($scope.multiple)
            var _new_model_object = _get_selected_object(value_new);
          else
            var _new_model_object = _get_selected_objects(value_new);


          if (!_.isEqual(_new_model_object, $scope.internalSelected)){
            init();
          }
        });

        if ($scope.listenKeydown) {
          $document.bind('keypress', function (e) {

            // bind to keypress events if dropdown list is opened
            if ($scope.status['isopen']) {
              var char = String.fromCharCode(e.which).toLowerCase();

              // find first element with value starting on selected char
              var index = _.findIndex($scope.internalList, function (item) {
                var _name = item[$scope.objValue].toLowerCase();
                return _name.indexOf(char) === 0;
              });

              if (index >= 0) {
                // scroll within dropdown list to selected index
                var _id_name = '#' + $scope.id + '-' + index;
                var _id_first = '#' + $scope.id + '-0';
                var _relative_top = Math.abs($(_id_first).offset().top - $(_id_name).offset().top);
                if (_relative_top >= 0)
                  $("#" + $scope.id).animate({scrollTop: _relative_top}, 100);
              }
            }
          });
        }
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

.directive('niceDtp', function($window, $parse, $document) {

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
    templateUrl: 'views/nice-dtp.html',
    link: function($scope, $element, $attrs) {

      // default parameters
      var params = {
        title: '',
        noMargin: false,
        fieldWidth: 'col-sm-8',
        labelWidth: 'col-sm-4',
        format: 'DD.MM.YYYY HH:mm',
        modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
        minDate : null, maxDate : null, lang : 'en',
        weekStart : 1, shortTime : false,
        cancelText : 'Cancel', okText : 'OK',
        date: true, time: false, width: 300, enableOkButtons: false
      };

      var prepareAttrs = function(){
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

        if ($attrs.width){
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
        fixMinMaxDate: function(){
          if ($scope.minDate==="")
            $scope.minDate = null;
          if ($scope.maxDate==="")
            $scope.maxDate = null;
        },
        initDates: function () {
          that.fixMinMaxDate();
          if (typeof($scope.model) === 'undefined' || $scope.model === null){
            $scope.currentDate = moment();
          }else{
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
          if (typeof($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
            if (typeof($scope.minDate) === 'string') {
              $scope.minDate = moment($scope.minDate).locale(params.lang);
            }
          }

          // Parse maxDate
          if (typeof($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
            if (typeof($scope.maxDate) === 'string') {
              $scope.maxDate = moment($scope.maxDate).locale(params.lang);
            }
          }

          // Fix currentDate if violates minDate and maxDate constraints
          if (params.date===true){
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

          var _date = ((typeof($scope.currentDate) !== 'undefined' && $scope.currentDate !== null) ? $scope.currentDate : null);
          $scope.calendar = that.generateCalendar($scope.currentDate);

          if (typeof($scope.calendar.week) !== 'undefined' && typeof($scope.calendar.days) !== 'undefined') {
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

          var w = params.width;

          var ml = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          var mr = $($element).find('.dtp-picker-clock').css('marginRight').replace('px', '');

          var pl = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          var pr = $($element).find('.dtp-picker').css('paddingRight').replace('px', '');

          //$($element).find('.dtp-picker-clock').innerWidth(w - (parseInt(ml) + parseInt(mr) + parseInt(pl) + parseInt(pr)));

          that.showTime($scope.currentDate);

          $scope.showTime = true;
          $scope.showCalendar = false;


          var pL = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          var pT = $($element).find('.dtp-picker').css('paddingTop').replace('px', '');
          var mL = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          var mT = $($element).find('.dtp-picker-clock').css('marginTop').replace('px', '');

          var r = ($($element).find('.dtp-picker-clock').innerWidth() / 2);
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
              h: h == 0 ? 0 : h+12,
              selected: h+12 == parseInt(cH)
            };

            _hours.push(_hour);
          }

          $scope.hours = _hours;

          //$($element, 'a.dtp-select-hour').off('click');

          //$($element, '.dtp-picker-clock').html(hours);
          that.toggleTime(true);

          $($element).find('.dtp-picker-clock').css('height', ($($element).find('.dtp-picker-clock').width()) + (parseInt(pT) + parseInt(mT)) + 'px');

          that.initHands(true);
        },
        initMinutes: function () {
          that.fixMinMaxDate();
          $scope.currentView = 2;
          $scope.hours = [];
          $scope.minutes = [];

          that.showTime($scope.currentDate);

          $scope.showCalendar = false;
          $scope.showTime = true;

          var pL = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          var pT = $($element).find('.dtp-picker').css('paddingTop').replace('px', '');
          var mL = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          var mT = $($element).find('.dtp-picker-clock').css('marginTop').replace('px', '');

          var r = ($($element).find('.dtp-picker-clock').innerWidth() / 2);
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

          $($element).find('.dtp-picker-clock').css('height', ($($element).find('.dtp-picker-clock').width()) + (parseInt(pT) + parseInt(mT)) + 'px');

          that.initHands(false);
          that._centerBox();
        },
        initHands: function (t) {

          var pL = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          var pT = $($element).find('.dtp-picker').css('paddingTop').replace('px', '');
          var mL = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          var mT = $($element).find('.dtp-picker-clock').css('marginTop').replace('px', '');

          var w = $($element).find('.dtp-clock-center').width() / 2;
          var h = $($element).find('.dtp-clock-center').height() / 2;

          var r = ($($element).find('.dtp-picker-clock').innerWidth() / 2);
          var j = r / 1.2;

          var _hL = r / 1.7;
          var _mL = r / 1.5;

          $($element).find('.dtp-hour-hand').css({
            left: r + (parseInt(mL) * 1.5) + 'px',
            height: _hL + 'px',
            marginTop: (r - _hL - parseInt(pL)) + 'px'
          }).addClass((t === true) ? 'on' : '');
          $($element).find('.dtp-minute-hand').css
          ({
            left: r + (parseInt(mL) * 1.5) + 'px',
            height: _mL + 'px',
            marginTop: (r - _mL - parseInt(pL)) + 'px'
          }).addClass((t === false) ? 'on' : '');
          $($element).find('.dtp-clock-center').css
          ({
            left: r + parseInt(pL) + parseInt(mL) - w + 'px',
            marginTop: (r - (parseInt(mL) / 2)) - h + 'px'
          });

          that.animateHands();

          that._centerBox();
        },
        animateHands: function () {
          var h = $scope.currentDate.hour();
          var m = $scope.currentDate.minute();

          that.rotateElement($($element).find('.dtp-hour-hand'), (360 / 12) * h);
          that.rotateElement($($element).find('.dtp-minute-hand'), ((360 / 60) * (5 * Math.round(m / 5))));
        },
        isAfterMinDate: function (date, checkHour, checkMinute) {
          var _return = true;

          if (typeof($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
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
            }
            else {
              _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
            }
          }

          return _return;
        },
        isBeforeMaxDate: function (date, checkTime, checkMinute) {
          var _return = true;

          if (typeof($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
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
            }
            else {
              _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
            }
          }

          return _return;
        },
        rotateElement: function (el, deg) {
          $(el).css
          ({
            WebkitTransform: 'rotate(' + deg + 'deg)',
            '-moz-transform': 'rotate(' + deg + 'deg)'
          });
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

            if (params.date){
              $scope.showTimeHeader = true;
              $scope.actualTime = _time;
            }
            else {
              if (params.shortTime)
                $scope.actualDay = date.format('A');
              else
                $scope.actualDay = ' ';

              $scope.showTimeHeader = false;
              $scope.actualTime= _time;
            }
          }
        },
        selectDate: function (date) {
          //console.log('selectDate');
          if (date) {
            $scope.currentDate = date;
            that.showDate($scope.currentDate);
            $scope.$emit('dateSelected', {date: date});
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
            if (i % 7 == 0){
              if (i!=0){
                _weeks.push(_week);
              }
              var _week = [];
            }

            var _day = {
              label: null,
              selected : false,
              disabled: true,
              data: {}
            };

            if (calendar.days[i] != 0) {
              _day.disabled = false;
              _day.label = moment(calendar.days[i]).locale(params.lang).format("DD");
              _day.data = calendar.days[i];
              if (that.isBeforeMaxDate(moment(calendar.days[i]), false, false) === false || that.isAfterMinDate(moment(calendar.days[i]), false, false) === false) {
                _day.disabled = true;
              }
              else {
                if (moment(calendar.days[i]).locale(params.lang).format("DD") === moment($scope.currentDate).locale(params.lang).format("DD")) {
                  _day.selected = true;

                }
              }
            }
            _week.push(_day);
          }

          if (_week.length > 0){
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
        setDateModel: function() {
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
            angular.forEach($scope.hours, function(hour, hourKey){
              var _date = moment($scope.currentDate);
              _date.hour(that.convertHours(hour.h)).minute(0).second(0);

              if (that.isAfterMinDate(_date, true, false) === false || that.isBeforeMaxDate(_date, true, false) === false) {
                hour.disabled = true;
              }else{
                hour.disabled = false;
              }
            });
          }
          else {
            angular.forEach($scope.minutes, function(minute, minuteKey){
              var _minute = minute.m;
              var _date = moment($scope.currentDate);
              _date.minute(_minute).second(0);

              if (that.isAfterMinDate(_date, true, true) === false || that.isBeforeMaxDate(_date, true, true) === false) {
                minute.disabled = true;
              }else{
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
          }
          else {
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
          if($scope.closed) $scope.closed(true);
        },
        _onOKClick: function () {
          switch ($scope.currentView) {
            case 0:
              if (params.time === true) {
                that.initHours();
              }
              else {
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
              if ($scope.inline){
                that._onClick();
              }else{
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
                }
                else {
                  that.hide();
                }
                break;
              case 2:
                that.initHours();
                break;
            }
          }
          else {
            that.hide();
          }
        },
        _onMonthBeforeClick: function () {
          if ($scope.btnMonthBeforeEnabled){
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
          angular.forEach($scope.weeks, function(week, weekKey){
            angular.forEach($scope.weeks[weekKey], function(day, dayKey){
              $scope.weeks[weekKey][dayKey].selected = false;
            });
          });
          date.selected = true;
          that.selectDate(date.data);

          if (!params.enableOkButtons){
            that._onOKClick();
          }
        },
        _onSelectHour: function (hourSelected) {

          if (!hourSelected.disabled){
            // remove selected from all dates in $scope.weeks
            angular.forEach($scope.hours, function(hour, hourKey){
              $scope.hours[hourKey].selected = false;
            });
            hourSelected.selected = true;

            var dataHour = parseInt(hourSelected.h);
            if (that.isPM())
              dataHour += 12;

            $scope.currentDate.hour(dataHour);
            that.showTime($scope.currentDate);

            that.animateHands();
            if (!params.enableOkButtons){
              that._onOKClick();
            }
          }else{
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

      if ($scope.inline){
        //console.log('auto show inline');
        that._onClick();
      }

      $scope.$on('dtp-open-click', function(){
        that._onClick();
      });

      $scope.$on('dtp-close-click', function(){
        that.hide();
      });

      $scope.$watch('model', function(newDate){
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

angular.module('niceElements')
  .directive('niceInput', function () {
    return {
      templateUrl: 'views/nice-input.html',
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
        attrs.required = attrs.required === 'true';
        //attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        attrs.showValid = angular.isDefined(attrs.showValid);
        attrs.textArea = angular.isDefined(attrs.textArea);
        if (!attrs.textAreaLines) { attrs.textAreaLines = 3; }
        if (!attrs.symbol) { attrs.symbol = ''; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.name) { attrs.name = ''; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        if (!attrs.minDecimalsCutZeros) { attrs.minDecimalsCutZeros = 2; }

        if(!scope.textArea) scope.elementType = "input";
        else scope.elementType = "textarea";

        if(scope.isFocused) {
          $(element).find(scope.elementType).focus();
        }

        // Set internal type
        scope.internalType = attrs.type;
        if(attrs.type == "percent"){
          scope.internalType = "percent";
          attrs.symbol = '%';
        }
        else if(attrs.type == "number"){
          scope.internalType = "text";
          if(scope.model){
            scope.model = parseFloat(scope.model);
          } else {
            scope.model = 0;
          }
        }
        else if(attrs.type == "integer"){
          scope.internalType = "text";
          scope.model = Number(scope.model);
        }else if(attrs.type == "email"){
          // TODO: get rid of the errors
          scope.regexexp = new RegExp('^[_a-zA-Z0-9]+(.[_a-zA-Z0-9]+)*@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)+(.[a-zA-Z]{2,4})');
        }

        if (angular.isDefined(attrs.valid)){
          scope.valid = scope.form;
        }

        if (angular.isDefined(attrs.minDecimalsCutZeros) && attrs.type=='number'){
          scope.model = parseFloat(scope.model);
          if (scope.model.toString().split('.').length < 2 || scope.model.toString().split('.')[1].length < parseInt(attrs.minDecimalsCutZeros))
            scope.model = (parseFloat(scope.model)).toFixed(parseInt(attrs.minDecimalsCutZeros));
        }

        if (angular.isDefined(scope.regex) && scope.regex!=''){
          scope.regexexp = new RegExp(scope.regex);
        }

        scope.$watch('model', function (value_new, value_old) {
            scope.internalModel = scope.model;
        });

        scope.$watch('internalModel', function (value_new, value_old) {
          if(attrs.type == "number" && value_new) {
            if(typeof value_new != "number") {
              scope.internalModel = value_new.replace(',', '.');
              scope.model = scope.internalModel;
            }
          }
        });
      },

      controller: function($rootScope, $scope) {
        $scope.id = Math.random().toString(36).substring(7);

        $scope.keypress = function(event) {
          if($scope.type == "number" || $scope.type == "integer") {
            if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
              if($scope.type == "number"){
                if(String($scope.model).indexOf(".") >= 0){
                  event.preventDefault();
                  return false;
                }
              } else {
                event.preventDefault();
                return false;
              }
            } else if (event.charCode == 45){
              if(String($scope.model).indexOf("-") >= 0){
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
        }

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
      templateUrl: 'views/nice-label.html',
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
      templateUrl: 'views/nice-loader.html',
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

      args.template = args.template ? args.template : 'views/nice-notification.html';
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
      templateUrl: 'views/nice-number.html',
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
        noMargin: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        //if (!attrs.min) { attrs.min = 0; }
        //if (!attrs.max) { attrs.max = 0; }
        if (!attrs.defaultValue) {
          attrs.defaultValue = 0;
        }else{
          attrs.defaultValue = parseInt(attrs.defaultValue);
        }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.showError = angular.isDefined(attrs.showError);
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        // Link form object with valid object
        if(angular.isDefined(attrs.valid)) { scope.valid = scope.form; }

        if(!attrs.min) { attrs.min = 0; }

        var setDefault = function(){
          scope.model = attrs.defaultValue;
        };

        // Check if number is defined
        if (!angular.isDefined(attrs.model)){
          setDefault();
        } else {
          if(parseFloat(scope.model)){
            scope.model = parseFloat(scope.model);
          } else {
            setDefault();
          }
        }

        scope.check();
      },

      controller: function($rootScope, $scope) {
        $scope.canAdd = true;
        $scope.canSubstract = true;

        // Check canAdd or canSubstract
        $scope.check = function(){
          if($scope.min && parseFloat($scope.model) <= $scope.min) $scope.canSubstract = false;
          else $scope.canSubstract = true;

          if($scope.max && parseFloat($scope.model) >= $scope.max) $scope.canAdd = false;
          else $scope.canAdd = true;
        };


        // Add to the value
        $scope.add = function(){
          if($scope.max){
            if(parseInt($scope.model) < $scope.max) {
              $scope.model = parseInt($scope.model) + 1;
              $scope.form.$setDirty();
            }
          } else {
            $scope.model = parseInt($scope.model) + 1;
            $scope.form.$setDirty();
          }
          $scope.check();
        };


        // Substract to the value
        $scope.subtract = function(){
          if(parseInt($scope.model) > $scope.min){
            $scope.model = parseInt($scope.model) - 1;
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
      templateUrl: 'views/nice-percent.html',
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
 * @name niceElements.directive:niceSearch
 * @description
 * # niceSearch
 */
angular.module('niceElements')
  .directive('niceSearch', function () {
    return {
      transclude: true,
      templateUrl: 'views/nice-search.html',
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
        transcludeFn(scope, function(clone, scope) {
          var el = element.find('.nice-search');
          el.append(clone);
        });

        // Is focused
        if(scope.isFocused) {
          $(element).find("input").focus();
        }

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
      controller: function($scope, $timeout) {
        $scope.id = Math.random().toString(36).substring(7);

        $scope.loading = false;
        $scope.noResults = false;
        $scope.requests = 0;

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
            $("#"+$scope.id).focus();
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
      templateUrl: 'views/nice-time-picker.html',
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
 * @name niceElements.directive:niceYesno
 * @description
 * # niceYesno
 */
angular.module('niceElements')
  .directive('niceYesno', function ($compile) {

    var setButtonLabel = function(scope, state){
      if (state)
          scope.state = scope.yes;
        else
          scope.state = scope.no;
    };

    var setWidth = function(width, el){
       el.style.width = width;
    };

     var setWidthBootstrap = function(bootstrapClass, el){
       $(el).addClass(bootstrapClass);
    };


    return {
      templateUrl: 'views/nice-yesno.html',
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

      link: function postLink(scope, element, attrs) {
        if (!attrs.yes) { attrs.yes = 'Yes'; }
        if (!attrs.no) { attrs.no = 'No'; }
        if (!attrs.title) { attrs.title = ''; }
        attrs.isDisabled = angular.isDefined(attrs.isDisabled);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.defaultFalse = angular.isDefined(attrs.defaultFalse);
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if(!angular.isDefined(scope.model) && !angular.isDefined(scope.options)){
          scope.model = !angular.isDefined(scope.defaultFalse);
        }

        if(!angular.isDefined(scope.modelValue) && angular.isDefined(scope.options)){
          scope.modelValue = scope.options[0];
        }

        // Set label based on state passed in scope.model
        setButtonLabel(scope, scope.model);

        // Set overlay button position based on passed state in scope.model
        var setButtonPosition = function(state) {
          var el = element[0].querySelector('.yesno-button');
          if(state) {
            $(el).removeClass('yesno-button-no');
            $(el).addClass('yesno-button-yes');
          } else {
            $(el).addClass('yesno-button-no');
            $(el).removeClass('yesno-button-yes');
          }
        };

        // Save reference to function on scope
        scope.setButtonPosition = setButtonPosition;

        // Call it first time
        setButtonPosition(scope.model);

        // Watch for changes from outside
        scope.$watch('model', function(value_new, value_old){
          if(angular.isDefined(scope.model)){
            setButtonLabel(scope, scope.model);
            scope.setButtonPosition(scope.model);
          }
        });

        scope.$watch('modelValue', function(value_new, value_old){
          if(scope.options){
            scope.model = scope.modelValue == scope.options[0];
          }
        });
      },

      controller: function($rootScope, $scope) {
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
      }
    };
  });

angular.module('niceElements').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/nice-button-toggle.html',
    "<div class=\"nice-button-toggle row\">\n" +
    "    <div class=\"col-xs-offset-4 col-xs-8\">\n" +
    "            <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"model = !model\">\n" +
    "                {{ label }}\n" +
    "                <span ng-show=\"!model\" class=\"glyphicon glyphicon-menu-down\"></span>\n" +
    "                <span ng-show=\"model\" class=\"glyphicon glyphicon-menu-up\"></span>\n" +
    "            </button>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-button.html',
    "<div class=\"nice-button\" ng-class=\"{'margin-bottom-0' : noMargin}\">\n" +
    "\n" +
    "    <div type=\"button\" class=\"btn btn-primary\" ng-class=\"addClass\" ng-click=\"click()\" ng-disabled=\"niceDisabled===true\">\n" +
    "        <div ng-class=\"{opacity0: loading==true, opacity1: loading==false}\"><ng-transclude></ng-transclude></div>\n" +
    "        <div ng-class=\"{display0: loading==false, opacity1: loading==true}\" class=\"nice-button-loader-wrapper\"><nice-loader add-class=\"nice-button-loader\"></nice-loader></div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-calendar.html',
    "<div class=\"nice-calendar\" ng-form=\"formCalendar\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"nice-calendar-wrapper\">\n" +
    "                <div class=\"header\">\n" +
    "                    <i class=\"fa fa-angle-left\" ng-click=\"previous()\"></i>\n" +
    "                    <span>{{ month.format(\"MMMM, YYYY\" )}}</span>\n" +
    "                    <i class=\"fa fa-angle-right\" ng-click=\"next()\"></i>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"week names\">\n" +
    "                    <span class=\"day\" translate>Mon</span>\n" +
    "                    <span class=\"day\" translate>Tue</span>\n" +
    "                    <span class=\"day\" translate>Wed</span>\n" +
    "                    <span class=\"day\" translate>Thu</span>\n" +
    "                    <span class=\"day\" translate>Fri</span>\n" +
    "                    <span class=\"day weekend\" translate>Sat</span>\n" +
    "                    <span class=\"day weekend\" translate>Sun</span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"week\" ng-repeat=\"week in weeks\">\n" +
    "                    <span\n" +
    "                        class=\"day\"\n" +
    "                        ng-class=\"{\n" +
    "                            today: day.isToday,\n" +
    "                            'different-month': !day.isCurrentMonth,\n" +
    "                            'start-selected': isSameDay(day.date, startDate),\n" +
    "                            'end-selected': isSameDay(day.date, endDate),\n" +
    "                            'selected': isBetweenRange(day.date),\n" +
    "                            'selecting-start': selectStart,\n" +
    "                            'selecting-end': !selectStart,\n" +
    "                            'weekend': day.isWeekday,\n" +
    "                            'disabled': day.isDisabled\n" +
    "                        }\"\n" +
    "                        ng-style=\"\n" +
    "                            (color && isBetweenRange(day.date)) && {'background-color': lighten(color) } ||\n" +
    "                            (color && isSameDay(day.date, startDate)) && {'background-color': color } ||\n" +
    "                            (color && isSameDay(day.date, endDate)) && {'background-color': color }\n" +
    "                        \"\n" +
    "                        ng-click=\"select(day)\"\n" +
    "                        ng-repeat=\"day in week.days\"\n" +
    "                        >{{ day.number }}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div class=\"clearfix\"></div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"nice-calendar-time\" ng-if=\"time\">\n" +
    "                    <div class=\"time-picker\">\n" +
    "                        <select\n" +
    "                          class=\"time-picker-hour\"\n" +
    "                          ng-model=\"startDateHour\"\n" +
    "                          ng-change=\"startHourChange(startDateHour)\"\n" +
    "                          ng-options=\"hour for hour in hours\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"time-picker\">\n" +
    "                        <select\n" +
    "                          class=\"time-picker-minute\"\n" +
    "                          ng-model=\"startDateMinute\"\n" +
    "                          ng-change=\"startMinuteChange(startDateMinute)\"\n" +
    "                          ng-options=\"minute for minute in minutes\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"time-picket-icon\">\n" +
    "                        <i class=\"fa fa-clock-o\"></i>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"time-picker\">\n" +
    "                         <select\n" +
    "                          class=\"time-picker-hour\"\n" +
    "                          ng-model=\"endDateHour\"\n" +
    "                          ng-change=\"endHourChange(endDateHour)\"\n" +
    "                          ng-options=\"hour for hour in hours\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"time-picker no-border-right\">\n" +
    "                        <select\n" +
    "                          class=\"time-picker-minute\"\n" +
    "                          ng-model=\"endDateMinute\"\n" +
    "                          ng-change=\"endMinuteChange(endDateMinute)\"\n" +
    "                          ng-options=\"minute for minute in minutes\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"nice-selected-dates\">\n" +
    "                    <div class=\"nice-start-date\">\n" +
    "                        <label translate>Start</label>\n" +
    "                        <div>{{ formatDate(startDate) }}</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"nice-end-date\">\n" +
    "                        <label translate>End</label>\n" +
    "                        <div>{{ formatDate(endDate) }}</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"clearfix\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-choice.html',
    "<div class=\"nice-choice\" ng-class=\"{'margin-bottom-0' : noMargin}\" ng-form=\"formChoice\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <ul class=\"list-unstyled\" ng-class=\"{'disabled': isDisabled}\">\n" +
    "                <li ng-repeat=\"item in internalList\" ng-class=\"{ 'selected' : isItemSelected(item) }\" ng-click=\"toggle(item)\">\n" +
    "                    <div class=\"choice-checkbox\" ng-class=\"{'circle' : !multiple }\"><i class=\"fa fa-check\"></i></div>\n" +
    "                    <div class=\"choice-label\">{{ getLabel(item) }}</div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-comment.html',
    "<div class=\"nice-comment\" ng-class=\"{'margin-bottom-0' : noMargin}\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\" ng-click=\"edit()\">\n" +
    "            <textarea\n" +
    "                ng-class=\"{'editing': editing}\"\n" +
    "                class=\"form-control\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                placeholder=\"{{placeholder}}\"\n" +
    "                rows=\"{{rows}}\"\n" +
    "                ng-blur=\"save()\"\n" +
    "            ></textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-date-range.html',
    "<ng-form class=\"nice-date-range\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input date-range-picker class=\"form-control date-picker\" type=\"text\" options=\"opts\" ng-model=\"model\" />\n" +
    "            <span date-range-picker options=\"opts\" ng-model=\"model\" class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>\n"
  );


  $templateCache.put('views/nice-date.html',
    "<div class=\"nice-date\" ng-form=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    class=\"form-control\"\n" +
    "                    datepicker-popup=\"{{ format }}\"\n" +
    "                    ng-model=\"model\"\n" +
    "                    is-open=\"opened\"\n" +
    "                    min-date=\"{{ min }}\"\n" +
    "                    max-date=\"max\"\n" +
    "                    datepicker-options=\"dateOptions\"\n" +
    "                    ng-required=\"true\"\n" +
    "                    close-text=\"Close\"\n" +
    "                    ng-click=\"open($event)\"\n" +
    "                />\n" +
    "\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-datetime-picker.html',
    "<div class=\"nice-datetime-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "\n" +
    "    <div class=\"nice-dtp-background\" ng-click=\"closeDtp(true)\" ng-if=\"opened\"></div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "            <div ng-form=\"formDatetimePicker\"></div>\n" +
    "\n" +
    "            <div class=\"dropdown\">\n" +
    "                <a class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" ng-click=\"openDtp()\" href=\"javascript:void(0);\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" value=\"{{value}}\" ng-click=\"openDtp()\">\n" +
    "                        <span class=\"input-group-addon\"><i class=\"fa\" ng-class=\"{'fa-clock-o': date=='false', 'fa-calendar': date!='false'}\"></i></span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- inject nice-dtp here -->\n" +
    "            <nice-dtp\n" +
    "                    model=\"currentDate\"\n" +
    "                    format=\"{{format}}\"\n" +
    "                    model-format=\"{{modelFormat}}\"\n" +
    "                    date=\"{{date}}\"\n" +
    "                    time=\"{{time}}\"\n" +
    "                    width=\"{{width}}\"\n" +
    "                    enable-ok-buttons=\"{{enableOkButtons}}\"\n" +
    "                    lang=\"{{lang}}\"\n" +
    "                    min-date=\"{{minDate}}\"\n" +
    "                    max-date=\"{{maxDate}}\"\n" +
    "                    week-start=\"{{weekStart}}\"\n" +
    "                    ok-text=\"{{okText}}\"\n" +
    "                    cancel-text=\"{{cancelText}}\"\n" +
    "                    closed=\"closeDtp\"\n" +
    "            ></nice-dtp>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/nice-datetimerange-picker.html',
    "<div class=\"nice-datetime-picker nice-datetimerange-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "\n" +
    "    <div class=\"nice-dtp-background\" ng-click=\"cancelClick()\" ng-if=\"showDtpRange\"></div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "            <div ng-form=\"formDatetimeRangePicker\"></div>\n" +
    "\n" +
    "            <div class=\"dropdown\">\n" +
    "                <a class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" ng-click=\"openDtpRange()\" href=\"javascript:void(0);\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" value=\"{{value}}\" ng-click=\"openDtpRange()\">\n" +
    "                        <span class=\"input-group-addon\"><i class=\"fa\" ng-class=\"{'fa-clock-o': date=='false', 'fa-calendar': date!='false'}\"></i></span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"dtp-range-wrapper\" ng-show=\"showDtpRange\">\n" +
    "\n" +
    "                <div class=\"dtp-layer\">\n" +
    "                    <div class=\"dtp-buttons-left\">\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(1)\">Last 24 hours</a>\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(7)\">Last 7 days</a>\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectLastMonth()\">Last month</a>\n" +
    "                        <a class=\"btn btn-primary btn-block\" ng-click=\"selectThisMonth()\">This month</a>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"dtp-left\">\n" +
    "                        <!-- inject nice-dtp here -->\n" +
    "                        <nice-dtp\n" +
    "                            model=\"dateStart\"\n" +
    "                            format=\"{{format}}\"\n" +
    "                            model-format=\"{{modelFormat}}\"\n" +
    "                            date=\"{{date}}\"\n" +
    "                            time=\"{{time}}\"\n" +
    "                            width=\"{{width}}\"\n" +
    "                            enable-ok-buttons=\"{{enableOkButtons}}\"\n" +
    "                            lang=\"{{lang}}\"\n" +
    "                            min-date=\"{{minDate}}\"\n" +
    "                            max-date=\"{{maxDate}}\"\n" +
    "                            week-start=\"{{weekStart}}\"\n" +
    "                            ok-text=\"{{okText}}\"\n" +
    "                            cancel-text=\"{{cancelText}}\"\n" +
    "                            inline=\"true\"\n" +
    "                        ></nice-dtp>\n" +
    "                    </div>\n" +
    "                    <div class=\"dtp-right\">\n" +
    "                        <!-- inject nice-dtp here -->\n" +
    "                        <nice-dtp\n" +
    "                                model=\"dateEnd\"\n" +
    "                                format=\"{{format}}\"\n" +
    "                                model-format=\"{{modelFormat}}\"\n" +
    "                                date=\"{{date}}\"\n" +
    "                                time=\"{{time}}\"\n" +
    "                                width=\"{{width}}\"\n" +
    "                                enable-ok-buttons=\"{{enableOkButtons}}\"\n" +
    "                                lang=\"{{lang}}\"\n" +
    "                                min-date=\"{{minDate}}\"\n" +
    "                                max-date=\"{{maxDate}}\"\n" +
    "                                week-start=\"{{weekStart}}\"\n" +
    "                                ok-text=\"{{okText}}\"\n" +
    "                                cancel-text=\"{{cancelText}}\"\n" +
    "                                inline=\"true\"\n" +
    "                         > </nice-dtp>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"dtp-buttons-bottom\">\n" +
    "                        <a class=\"btn btn-danger btn-block margin-right-20\" ng-click=\"cancelClick()\">Cancel</a>\n" +
    "                        <a class=\"btn btn-success btn-block\" ng-click=\"okClick()\">OK</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-dropdown-date.html',
    "<div class=\"nice-dropdown-date\" ng-form=\"dropdownDateForm\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-8\"\n" +
    "             ng-class=\"{\n" +
    "                fieldWidth: fieldWidth,\n" +
    "                'has-warning': !isDisabled && dropdownDateForm.$invalid && dropdownDateForm.$dirty,\n" +
    "                'disabled': isDisabled\n" +
    "            }\">\n" +
    "            <div class=\"form-inline\">\n" +
    "                <div class=\"form-group nice-dropdown-date-day\">\n" +
    "                    <select\n" +
    "                        ng-model=\"dateFields.day\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-options=\"day for day in days\"\n" +
    "                        ng-change=\"checkDate()\"\n" +
    "                        ng-disabled=\"isDisabled\"\n" +
    "                        required=\"true\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group nice-dropdown-date-month\">\n" +
    "                    <select\n" +
    "                        ng-model=\"dateFields.month\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-options=\"month.value as month.name for month in months\"\n" +
    "                        ng-change=\"checkDate()\"\n" +
    "                        ng-disabled=\"isDisabled\"\n" +
    "                        required=\"true\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group nice-dropdown-date-year\">\n" +
    "                    <select\n" +
    "                        ng-model=\"dateFields.year\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-options=\"year for year in years\"\n" +
    "                        ng-change=\"checkDate()\"\n" +
    "                        ng-disabled=\"isDisabled\"\n" +
    "                        required=\"true\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/nice-dropdown.html',
    "<div class=\"nice-dropdown\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div ng-class=\"addButtonEnable && !isDisabled ? 'input-group': ''\">\n" +
    "                <div class=\"btn-group\" dropdown is-open=\"status.isopen\" ng-class=\"{ 'disabled': isDisabled || emptyList }\">\n" +
    "                    <button\n" +
    "                        type=\"button\"\n" +
    "                        class=\"btn btn-block btn-dropdown dropdown-toggle\"\n" +
    "                        title=\"{{ getLabel(internalSelected) }}\"\n" +
    "                        dropdown-toggle\n" +
    "                        ng-disabled=\"isDisabled || emptyList\">\n" +
    "\n" +
    "                        <span ng-if=\"internalSelected.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': internalSelected.color_hex_code}\"></span>\n" +
    "                        <span ng-if=\"!multiple\">{{ getLabel(internalSelected) }}</span>\n" +
    "\n" +
    "                        <span ng-if=\"multiple\">\n" +
    "                            <!--<span ng-repeat=\"item in internalSelected\"><span ng-if=\"$index > 0\">, </span>{{ getLabel(item) }}</span>-->\n" +
    "                            <span ng-if=\"internalSelected.length  > 1\">{{ internalSelected.length }} <translate>selected</translate></span>\n" +
    "                            <span ng-if=\"internalSelected.length  == 1\">{{ getLabel(internalSelected[0]) }}</span>\n" +
    "                            <span ng-if=\"internalSelected.length == 0\" translate>None</span>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <!--<span ng-if=\"showTax && internalSelected.value\">{{ internalSelected.value * 100 }}%</span>-->\n" +
    "                        <span class=\"caret\"></span>\n" +
    "                    </button>\n" +
    "\n" +
    "                    <ul id=\"{{id}}\" class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li id=\"{{id}}-{{$index}}\" ng-repeat=\"item in internalList\" ng-click=\"clicked(item)\">\n" +
    "                            <a href>\n" +
    "                                <span class=\"choice-checkbox\" ng-if=\"multiple\" ng-class=\"{ 'selected' : isItemSelected(item) }\"><i class=\"fa fa-check\"></i></span>\n" +
    "                                <span ng-if=\"item.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': item.color_hex_code}\"></span>\n" +
    "                                <span ng-class=\"{'multiple-item': multiple}\">{{ getLabel(item) }}</span>\n" +
    "                                <!--<span ng-if=\"showTax && item.value\">{{ item.value * 100 }}%</span>-->\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <span class=\"input-group-btn\" ng-if=\"addButtonEnable && !isDisabled\">\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"addButtonFunction()\" type=\"button\">+</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formDropdown\"></div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/nice-dtp.html',
    "<div class=\"dtp-wrapper\">\n" +
    "    <div class=\"dtp\" id=\"this.name\" ng-class=\"{'hidden': !showDtp}\">\n" +
    "        <div class=\"dtp-content\" ng-style=\"dtp_content_style\">\n" +
    "            <div class=\"dtp-date-view\">\n" +
    "                <div class=\"dtp-header\" ng-if=\"!inline\">\n" +
    "                    <div class=\"dtp-actual-day\">{{actualDay}}</div>\n" +
    "                    <div class=\"dtp-close\" ng-if=\"!inline\"><a href=\"javascript:void(0);\" ng-click=\"onCloseClick()\"><i class=\"fa fa-close\"></i></div>\n" +
    "                </div>\n" +
    "                <div class=\"dtp-date\" ng-if=\"!inline\" ng-class=\"{'hidden': !showDateHeader}\">\n" +
    "                    <div>\n" +
    "                        <div class=\"left center p10\">\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"dtp-actual-month p80\" ng-click=\"initDate()\">{{actualMonth}}</div>\n" +
    "                        <div class=\"right center p10\">\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"clearfix\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"dtp-actual-num\" ng-click=\"initDate()\">{{actualNum}}</div>\n" +
    "                    <div>\n" +
    "                        <div class=\"left center p10\">\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-year-before\" ng-click=\"onYearBeforeClick()\" ng-class=\"{'disabled': !btnYearBeforeEnabled}\"\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"dtp-actual-year p80\" ng-click=\"initDate()\">{{actualYear}}</div>\n" +
    "                        <div class=\"right center p10\">\n" +
    "                            <a href=\"javascript:void(0);\" class=\"dtp-select-year-after\" ng-click=\"onYearAfterClick()\" ng-class=\"{'disabled': !btnYearAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"clearfix\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"dtp-time\" ng-show=\"!showTimeHeader\">\n" +
    "                    <div class=\"dtp-actual-maxtime\">\n" +
    "                        <a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"dtp-picker\">\n" +
    "                    <div class=\"dtp-picker-calendar\" ng-class=\"{'hidden': !showCalendar}\">\n" +
    "                        <div>\n" +
    "                            <div ng-if=\"inline\" class=\"left center p10\">\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "                            </div>\n" +
    "                            <div class=\"dtp-picker-month\" ng-class=\"{'p80': inline}\">{{monthAndYear}}</div>\n" +
    "                            <div class=\"right center p10\" ng-if=\"inline\">\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <table class=\"table dtp-picker-days\">\n" +
    "                            <thead>\n" +
    "                            <th ng-repeat=\"weekDay in weekDays track by $index\">{{weekDay}}</th>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                            <tr ng-repeat=\"week in weeks\">\n" +
    "                                <td ng-repeat=\"day in week\">\n" +
    "                                    <span ng-if=\"day.disabled\" class=\"dtp-select-day\">{{day.label}}</span>\n" +
    "                                    <a ng-if=\"!day.disabled\" ng-click=\"onSelectDate(day)\" href=\"javascript:void(0);\" class=\"dtp-select-day\" ng-class=\"{'selected': day.selected}\">{{day.label}}</a>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"dtp-picker-datetime\" ng-class=\"{'hidden': !showTime}\">\n" +
    "                        <div class=\"dtp-actual-meridien\">\n" +
    "                            <div class=\"dtp-actual-time p60\" ng-show=\"showTimeHeader\">\n" +
    "                                <a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\n" +
    "                            </div>\n" +
    "                            <div class=\"clearfix\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"dtp-picker-clock\">\n" +
    "                            <div class=\"dtp-hand dtp-hour-hand\" ng-show=\"currentView==1\"></div>\n" +
    "                            <div class=\"dtp-hand dtp-minute-hand\" ng-show=\"currentView==2\"></div>\n" +
    "                            <div class=\"dtp-clock-center\"></div>\n" +
    "                            <div ng-repeat=\"hour in hours\" class=\"dtp-picker-time\" ng-style=\"hour.style\">\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-hour\" ng-class=\"{'selected': hour.selected, 'disabled': hour.disabled}\" ng-click=\"onSelectHour(hour)\">{{hour.h}}</a>\n" +
    "                            </div>\n" +
    "                            <div ng-repeat=\"minute in minutes\" class=\"dtp-picker-time\" ng-style=\"minute.style\">\n" +
    "                                <a href=\"javascript:void(0);\" class=\"dtp-select-minute\" ng-class=\"{'selected': minute.selected, 'disabled': minute.disabled}\" ng-click=\"onSelectMinute(minute)\">{{minute.m}}</a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"dtp-buttons\" ng-if=\"enableOkButtons\">-->\n" +
    "                <!--<button class=\"dtp-btn-cancel btn btn-flat\" ng-click=\"onCancelClick()\">{{cancelText}}</button>-->\n" +
    "                <!--<button class=\"dtp-btn-ok btn btn-flat\" ng-click=\"onOKClick()\"> {{okText}} </button>-->\n" +
    "                <!--<div class=\"clearfix\"></div>-->\n" +
    "            <!--</div>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-input.html',
    "<ng-form class=\"nice-input\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"forma\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"form-group\"\n" +
    "             ng-class=\"{\n" +
    "                'has-feedback': showValid && !hideValid,\n" +
    "                'has-warning': !isDisabled && forma.$invalid && forma.$dirty && !hideValid,\n" +
    "                'has-success': !isDisabled && forma.$valid && forma.$dirty && showValid,\n" +
    "                'symbol': symbol,\n" +
    "                'disabled': isDisabled\n" +
    "        }\">\n" +
    "            <input ng-show=\"!textArea\"\n" +
    "                class=\"form-control\"\n" +
    "                type=\"{{ internalType }}\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                name=\"{{ name }}\"\n" +
    "                id=\"{{ id }}\"\n" +
    "                tabindex=\"{{ tabIndex }}\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                ng-minlength=\"minlength\"\n" +
    "                ng-maxlength=\"maxlength\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-keypress=\"keypress($event)\"\n" +
    "                ng-pattern=\"regexexp\"\n" +
    "                ng-disabled=\"isDisabled\"\n" +
    "            >\n" +
    "            <textarea ng-show=\"textArea\"\n" +
    "                class=\"form-control\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                id=\"{{ id }}\"\n" +
    "                tabindex=\"{{ tabIndex }}\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                rows=\"{{textAreaLines}}\"\n" +
    "                ng-minlength=\"minlength\"\n" +
    "                ng-maxlength=\"maxlength\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-pattern=\"regexexp\"\n" +
    "                ng-disabled=\"isDisabled\"\n" +
    "            ></textarea>\n" +
    "\n" +
    "            <span class=\"input-group-addon\" ng-if=\"symbol\">{{ symbol }}</span>\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-messages=\"forma.$error\" ng-if=\"forma.$dirty\">\n" +
    "            <div class=\"error-message\" ng-message=\"email\" ng-if=\"forma.$dirty\" translate>Email is not valid.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"forma.$dirty\" translate>This field requires a specific pattern.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"minlength\"><translate>Your input is too short. It must contain at least</translate> {{ minlength }} <translate>characters</translate>.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"maxlength\" translate>Your input is too long</div>\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"forma.$dirty\" translate>This field is required.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"unique\" translate>This field must be unique.</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>\n"
  );


  $templateCache.put('views/nice-label.html',
    "<div class=\"nice-label\">\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-xs-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}</label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-xs-8'\">\n" +
    "        <p class=\"value\">{{ value }}</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-loader.html',
    "<div class=\"nice-loader\" ng-if=\"!visibleWhen\" ng-class=\"addClass\">\n" +
    "  <svg version=\"1.1\" id=\"loader\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n" +
    "    <path fill=\"#000\" d=\"M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z\"></path>\n" +
    "  </svg>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-notification.html',
    "<div class=\"notification\">\n" +
    "    <h3 ng-show=\"title\" ng-bind-html=\"title\"></h3>\n" +
    "    <div class=\"message\" ng-bind-html=\"message\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-number.html',
    "<div ng-form=\"form\" class=\"nice-number\" ng-class=\"{'margin-bottom-0' : noMargin}\">\n" +
    "    <div ng-class=\"{'row' : !disableRow}\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}</label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\"\n" +
    "                ng-class=\"{'has-warning': !disabled && form.$invalid && form.$dirty}\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canSubstract\" ng-click=\"subtract()\">-</button>\n" +
    "                </span>\n" +
    "\n" +
    "                <input type=\"number\" class=\"form-control\" max=\"{{ max }}\" min=\"{{ min }}\" ng-model=\"model\">\n" +
    "\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canAdd\" ng-click=\"add()\">+</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div ng-messages=\"form.$error\" ng-if=\"showError\">\n" +
    "                <div class=\"error-message\" ng-message=\"number\" ng-if=\"form.$dirty\" translate>This field requires a number</div>\n" +
    "                <div class=\"error-message\" ng-message=\"min\"><translate>Min value is</translate> {{ min }}</div>\n" +
    "                <div class=\"error-message\" ng-message=\"max\"><translate>Max value is</translate> {{ max }}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-percent.html',
    "<ng-form class=\"nice-input\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"form-group has-feedback symbol\"\n" +
    "             ng-class=\"{\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\n" +
    "                'disabled': isDisabled\n" +
    "        }\">\n" +
    "            <input\n" +
    "                class=\"form-control\"\n" +
    "                type=\"text\"\n" +
    "                max=\"100\"\n" +
    "                min=\"0\"\n" +
    "                ng-model=\"internalModel\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-keypress=\"keypress($event)\"\n" +
    "                ng-change=\"change()\"\n" +
    "                ng-disabled=\"isDisabled\">\n" +
    "\n" +
    "            <span class=\"input-group-addon\">%</span>\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-messages=\"form.$error\">\n" +
    "            <div class=\"error-message\" ng-message=\"email\" ng-if=\"form.$dirty\">Email is not valid.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"form.$dirty\">This field requires a specific pattern.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"form.$dirty\">This field is required.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"minlength\">Your field is too short. It must contain at least {{ minlength }} characters.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"maxlength\">Your field is too long</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-search.html',
    "<ng-form class=\"nice-input nice-search\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\" ng-class=\"{\n" +
    "                'disabled': isDisabled,\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty}\">\n" +
    "                <input\n" +
    "                    class=\"form-control\"\n" +
    "                    type=\"text\"\n" +
    "                    id=\"{{ id }}\"\n" +
    "                    ng-model=\"modelString\"\n" +
    "                    ng-keypress=\"keypress($event)\"\n" +
    "                    placeholder=\"{{ placeholder }}\"\n" +
    "                    ng-disabled=\"isDisabled\"\n" +
    "                    ng-change=\"updateSearch()\"\n" +
    "                    ng-required=\"required\"\n" +
    "                    tabindex=\"{{ tabIndex }}\"\n" +
    "                >\n" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"search()\" ng-if=\"!model\">\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-search\" ></i>\n" +
    "                    <i ng-show=\"loading\" class=\"fa fa-refresh fa-spin\"></i>\n" +
    "                </span>\n" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"remove()\" ng-if=\"model\">\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-remove\" ></i>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\"></div>\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"nice-dropdown-empty\" ng-if=\"noResults\">\n" +
    "                <div class=\"nice-search-row\">No results found.</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"nice-dropdown\" ng-if=\"results.length\">\n" +
    "                <div ng-repeat=\"result in results\" class=\"nice-search-row\" ng-class=\"{'active': selectedIndex == $index}\" ng-click=\"selectRow(result)\">\n" +
    "                    <span class=\"text-bold\">{{ result[keyForInputLabel] }}</span>\n" +
    "                    <!--<div ng-transclude></div>-->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--Here is injected dropdown html if passed and results present and open.-->\n" +
    "    <!--<div ng-transclude></div>-->\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-time-picker.html',
    "<div class=\"nice-time-picker\" ng-form=\"forma\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\" ng-class=\"{\n" +
    "                'has-warning': !isDisabled && forma.$invalid && forma.$dirty,\n" +
    "                'disabled': isDisabled }\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"modelString\" ng-keyup=\"$event.keyCode == 13 && validateDate()\" ng-blur=\"validateDate()\">\n" +
    "                <span class=\"input-group-addon\" ng-click=\"open = !open\"><i class=\"fa fa-clock-o\"></i></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"nice-time-picker-dropdown\" ng-if=\"open\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-xs-6\">\n" +
    "                        <button ng-click=\"changeHour(true)\"><i class=\"fa fa-chevron-up\"></i></button>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-6\">\n" +
    "                        <button ng-click=\"changeMinutes(true)\"><i class=\"fa fa-chevron-up\"></i></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row numbers\">\n" +
    "                    <div class=\"col-xs-6\">{{ hours }}</div>\n" +
    "                    <div class=\"col-xs-6\">{{ minutes }}</div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-xs-6\">\n" +
    "                        <button ng-click=\"changeHour(false)\"><i class=\"fa fa-chevron-down\"></i></button>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-6\">\n" +
    "                        <button ng-click=\"changeMinutes(false)\"><i class=\"fa fa-chevron-down\"></i></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"nice-background\" ng-click=\"close()\" ng-if=\"open\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-yesno.html',
    "<div class=\"row nice-yesno\" ng-class=\"{'margin-bottom-0' : noMargin}\" ng-form=\"formYesno\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}</label>\n" +
    "    </div>\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"yesno-wrapper noselect\" ng-class=\"{ 'disabled': isDisabled }\">\n" +
    "            <div class=\"yesno-yes-bg\" ng-click=\"switch()\">{{ yes }}</div>\n" +
    "            <div class=\"yesno-no-bg\" ng-click=\"switch()\">{{ no }}</div>\n" +
    "            <div class=\"yesno-button\" ng-click=\"switch()\">{{ state }}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
