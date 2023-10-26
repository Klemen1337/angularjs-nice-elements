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
        model: '=?',
        label: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (angular.isDefined(scope.model)) {
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
      replace: true,
      scope: {
        title: '@',
        icon: '@?',
        noMargin: '=',
        niceClick: '&',
        niceDisabled: '=',
        addClass: '@',
        type: '@?'
      },
      controller: function ($q, $scope, $transclude) {
        if ($scope.addClass != undefined) console.warn("[NICE ELEMENTS] Nice button: add-class attribute is deprecated")
        if (!$scope.type) $scope.type = "button";
        $scope.showSlot = $transclude().length > 0;
        $scope.loading = false;

        $scope.click = function () {
          if ($scope.loading === false && $scope.niceDisabled !== true) {
            $scope.loading = true;

            $q.when($scope.niceClick()).finally(function () {
              $scope.loading = false;
            });
          }
        };
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
  .directive("niceCalendar", function ($timeout, gettextCatalog) {
    return {
      restrict: "E",
      templateUrl: "src/components/nice-calendar/nice-calendar.html",
      scope: {
        title: '@',
        fieldWidth: '@',
        labelWidth: '@',
        minDate: '=',
        maxDate: '=',
        hideHover: '=',
        time: '=',
        noMargin: '@',
        color: '@',
        endDate: '=',
        startDate: '=',
        isDisabled: '=',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },
      link: function (scope, element) {
        // ------------------ Init default values ------------------
        scope.selectStart = true;
        scope.popupText = gettextCatalog.getString("Select start date", null, "Nice");

        scope.hours = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
        ];

        scope.minutes = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59
        ];


        // ------------------ Check if attributes are set ------------------
        if (!scope.startDate) scope.startDate = moment().minutes(0).second(0).millisecond(0);
        if (!scope.endDate) scope.endDate = moment().minutes(0).second(0).millisecond(0);


        // ------------------ Look for model changes ------------------
        scope.$watch("startDate", function (value, valueOld) {
          bootstrap();
        });

        scope.$watch("endDate", function (value, valueOld) {
          bootstrap();
        });

        scope.$watch("minDate", function (value, valueOld) {
          bootstrap();
        });

        scope.$watch("maxDate", function (value, valueOld) {
          bootstrap();
        });


        // ------------------ Bootstrap calendar ------------------
        function bootstrap() {
          // scope.startDate = moment(scope.startDate.second(0).millisecond(0));
          // scope.endDate = moment(scope.endDate.second(0).millisecond(0));

          if (!scope.time) {
            scope.startDateHour = 0;
            scope.startDateMinute = 0;
            scope.startDate.hours(0);
            scope.startDate.minutes(0);
            scope.startDate.seconds(0);
            scope.startDate.millisecond(0);
            scope.endDateHour = 0;
            scope.endDateMinut = 0;
            scope.endDate.hours(23);
            scope.endDate.minutes(59);
            scope.endDate.seconds(59);
            scope.endDate.millisecond(999);
          } else {
            scope.startDateHour = moment(scope.startDate).hours();
            scope.startDateMinute = moment(scope.startDate).minutes();
            scope.endDateHour = moment(scope.endDate).hours();
            scope.endDateMinute = moment(scope.endDate).minutes();
          }

          scope.month = angular.copy(moment(scope.startDate));
          var start = angular.copy(moment(scope.startDate));
          _removeTimeWithDate(start.date(0));
          _buildMonth(scope, start, scope.month);
        }

        bootstrap();


        // ------------------ Day was selected ------------------
        scope.select = function (day) {
          if (!day.isDisabled) {
            var selectedDate = angular.copy(day.date);

            if (scope.selectStart) {
              if (!scope.time) {
                selectedDate.hours(0);
                selectedDate.minutes(0);
                selectedDate.seconds(0);
                selectedDate.millisecond(0);
              } else {
                selectedDate.hours(scope.startDateHour);
                selectedDate.minutes(scope.startDateMinute);
              }

              // Set start date
              scope.startDate = selectedDate;
              scope.selectStart = false;
              scope.popupText = gettextCatalog.getString("Select end date", null, "Nice");
              scope.formCalendar.$setDirty();
              scope.displayStartChange();

              // If start date is after end date
              if (scope.startDate.isAfter(scope.endDate)) {
                scope.endDate = angular.copy(scope.startDate);
              }
            } else {
              if (!scope.time) {
                selectedDate.hours(23);
                selectedDate.minutes(59);
                selectedDate.seconds(59);
                selectedDate.millisecond(999);
              } else {
                selectedDate.hours(scope.endDateHour);
                selectedDate.minutes(scope.endDateMinute);
              }

              // Set end date
              scope.endDate = selectedDate;
              scope.selectStart = true;
              scope.popupText = gettextCatalog.getString("Select start date", null, "Nice");
              scope.formCalendar.$setDirty();
              scope.displayEndChange();

              // If end date is before start date
              if (scope.endDate.isBefore(scope.startDate)) {
                scope.startDate = angular.copy(scope.endDate);
              }
            }

            if (scope.onChange) scope.onChange({ model: { startDate: scope.startDate, endDate: scope.endDate }, element: element });
          }
        };


        // ------------------ Display date changes ------------------
        scope.displayStartChange = function () {
          scope.startTimeClass = "change";
          $timeout(function () {
            scope.startTimeClass = "";
          }, 1000);
        };

        scope.displayEndChange = function () {
          scope.endTimeClass = "change";
          $timeout(function () {
            scope.endTimeClass = "";
          }, 1000);
        };


        // ------------------ Time changes ------------------
        scope.startHourChange = function (value) {
          scope.startDateHour = value;
          scope.startDate = moment(scope.startDate).hours(scope.startDateHour);
          scope.formCalendar.$setDirty();
          scope.displayStartChange();
          scope.handleUpdate();
        };


        scope.startMinuteChange = function (value) {
          scope.startDateMinute = value;
          scope.startDate = moment(scope.startDate).minutes(scope.startDateMinute);
          scope.formCalendar.$setDirty();
          scope.displayStartChange();
          scope.handleUpdate();
        };


        scope.endHourChange = function (value) {
          scope.endDateHour = value;
          scope.endDate = moment(scope.endDate).hours(scope.endDateHour);
          scope.formCalendar.$setDirty();
          scope.displayEndChange();
          scope.handleUpdate();
        };


        scope.endMinuteChange = function (value) {
          scope.endDateMinute = value;
          scope.endDate = moment(scope.endDate).minutes(scope.endDateMinute);
          scope.formCalendar.$setDirty();
          scope.displayEndChange();
          scope.handleUpdate();
        };


        scope.handleUpdate = function () {
          if (scope.onChange) scope.onChange({ model: { startDate: scope.startDate, endDate: scope.endDate }, element: element });
        };


        // ------------------ Go to next month ------------------
        scope.next = function () {
          var next = angular.copy(scope.month);
          _removeTimeWithDate(next.month(next.month() + 1).date(0));
          scope.month.month(scope.month.month() + 1);
          _buildMonth(scope, next, scope.month);
        };


        // ------------------ Go to previous month ------------------
        scope.previous = function () {
          var previous = angular.copy(scope.month);
          _removeTimeWithDate(previous.month(previous.month() - 1).date(0));
          scope.month.month(scope.month.month() - 1);
          _buildMonth(scope, previous, scope.month);
        };


        // ------------------ Check if dates are equal without time ------------------
        scope.isSameDay = function (date1, date2) {
          var d1 = _removeTime(angular.copy(date1));
          var d2 = _removeTime(angular.copy(date2));
          return d1.isSame(d2);
        };


        // ------------------ Check if date is between start and end date ------------------
        scope.isBetweenRange = function (date) {
          return (date.isBefore(moment(scope.endDate)) && date.isAfter(moment(scope.startDate)));
        };


        // ------------------ Format date ------------------
        scope.formatDate = function (date) {
          if (scope.time) return moment(date).format('D.M.YYYY • H:mm');
          else return moment(date).format('D.M.YYYY');
        };


        // ------------------ Lighten color by 20% ------------------
        scope.lighten = function (col) {
          var amt = 20;
          var usePound = false;

          if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
          }

          var num = parseInt(col, 16);
          var r = (num >> 16) + amt;

          if (r > 255) r = 255;
          else if (r < 0) r = 0;

          var b = ((num >> 8) & 0x00FF) + amt;
          if (b > 255) b = 255;
          else if (b < 0) b = 0;

          var g = (num & 0x0000FF) + amt;
          if (g > 255) g = 255;
          else if (g < 0) g = 0;

          return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
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

            if (scope.minDate) day.isDisabled = date.isBefore(moment(scope.minDate));
            if (scope.maxDate) day.isDisabled = date.isAfter(moment(scope.maxDate));
            if (scope.minDate && scope.maxDate) day.isDisabled = !date.isBetween(moment(scope.minDate), moment(scope.maxDate));

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
  .directive('niceCheckbox', function () {
    return {
      templateUrl: 'src/components/nice-checkbox/nice-checkbox.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@',
        noMargin: '@',
        clickDisabled: '@',
        onChange: '&?',
        isDisabled: '=',
      },
      controller: function ($scope) {
        if ($scope.model === undefined) $scope.model = false;

        $scope.toggle = function () {
          if ($scope.isDisabled || $scope.clickDisabled) return;
          $scope.model = !$scope.model;
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
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
      transclude: true,
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
        multiple: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
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
        scope.checkIfFirstTime = function () {
          if (scope.firstTime) {
            scope.firstTime = false;
            return true;
          } else {
            return false;
          }
        };

        // If selected is not yet defined
        if (!angular.isDefined(scope.model)) {
          if (scope.multiple) {
            scope.model = [];
          }
        }

        // Set internalList
        if (scope.listIsObj) {
          scope.internalList = scope.list;
        } else {
          scope.internalList = _.map(scope.list, function (val) {
            var obj = {};
            obj[scope.objKey] = val;
            obj[scope.objValue] = val;
            return obj;
          });
        }

        // Set internalSelected
        if (scope.selectedIsObj) {
          scope.internalSelected = scope.model;
        } else {
          if (scope.multiple) {
            scope.internalSelected = _.map(scope.model, function (val) {
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
            } else {
              scope.internalSelected = scope.internalList[0];
            }
          }
        }
      },
      controller: function ($rootScope, $scope) {
        var getFilter = function (item) {
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };

        $scope.itemHover = function (event, item) {
          if (event.which == 1) {
            $scope.toggle(item);
          }
        }

        $scope.setDefault = function () {
          if (!$scope.multiple) {
            $scope.internalSelected = $scope.internalList[0];
          }
        };

        $scope.isItemSelected = function (item) {
          if (!$scope.internalSelected)
            return false;
          // Which item is selected
          if ($scope.multiple) {
            return _.where($scope.internalSelected, getFilter(item)).length > 0;
          } else {
            return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };

        $scope.toggle = function (item) {
          if ($scope.isDisabled) return;
          $scope.formChoice.$setDirty();

          if (!$scope.multiple) {
            $scope.internalSelected = item;
          } else {
            if ($scope.isItemSelected(item)) {
              $scope.internalSelected = _.without($scope.internalSelected, _.findWhere($scope.internalSelected, getFilter(item)));
            } else {
              $scope.internalSelected.push(item);
            }
          }
        };

        $scope.getLabel = function (item) {
          return item[$scope.objValue];
        };

        $scope.$watchCollection('list', function (value_new, value_old) {
          // Set internalList
          if ($scope.listIsObj) {
            $scope.internalList = $scope.list;
          } else {
            $scope.internalList = _.map($scope.list, function (val) {
              var obj = {};
              obj[$scope.objKey] = val;
              obj[$scope.objValue] = val;
              return obj;
            });
          }
        });

        $scope.$watchCollection('internalSelected', function (value_new, value_old) {
          // Update $scope.selected based on settings
          if (value_new && (!angular.equals(value_new, value_old) || $scope.checkIfFirstTime())) {
            if ($scope.selectedIsObj) {
              $scope.model = value_new;
            } else {
              if ($scope.multiple) {
                $scope.model = _.map(value_new, $scope.objKey);
              } else {
                $scope.model = value_new[$scope.objKey];
              }
            }
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          }
        });

        $scope.$watchCollection('model', function (value_new, value_old) {
          if (!angular.equals(value_new, value_old)) {
            if (!value_new) {
              if (!$scope.multiple)
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

          if (!value_new) {
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
  .directive('clickOutside', function ($document, $parse, $timeout) {
    return {
      restrict: 'A',
      link: function ($scope, elem, attr) {
        $scope.isOpen = false;

        // watch for is open
        attr.$observe('isOpen', function (value) {
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
                fn($scope, { event: e });
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
        isDisabled: '=',
        placeholder: '@',
        noTextLabel: '@',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        help: '@',
        isInline: '=',
        rows: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (scope.model == null) { scope.model = ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.noTextLabel) { angular.isDefined(attrs.noTextLabel); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.rows) { attrs.rows = 1; }

        var textareas = element.find('textarea');

        scope.edit = function () {
          scope.editing = true;
          $timeout(function () {
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
      controller: function ($scope) {
        $scope.editing = false;

        $scope.save = function () {
          $scope.editing = false;
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
  .directive('niceDateInput', function () {
    return {
      restrict: 'E',
      transclude: false,
      templateUrl: 'src/components/nice-date-input/nice-date-input.html',
      scope: {
        model: '=', // binding model
        date: '=?', // default: true, is date picker enabled?
        time: '=?', // default: false, is time picker enabled?
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
      controller: function ($scope, $timeout) {
        $scope.formatDate = "DD.MM.YYYY";
        $scope.formatTime = "HH:mm";
        if ($scope.date === undefined) $scope.date = true;
        if ($scope.time === undefined) $scope.time = true;
        $scope.model = moment($scope.model) || moment().set({ 'second': 0, 'millisecond': 0 });
        $scope.inner = {
          timeModel: angular.copy($scope.model),
          dateModel: angular.copy($scope.model)
        };

        $scope.dateChanged = function () {
          $timeout(function () {
            $scope.modelDate = $scope.inner.dateModel.format($scope.formatDate);
            $scope.handleChange();
          });
        }

        $scope.timeChanged = function () {
          $timeout(function () {
            $scope.modelTime = $scope.inner.timeModel.format($scope.formatTime);
            $scope.handleChange();
          });
        }

        // -------------------- On date change --------------------
        $scope.handleChange = function () {
          var newModel = moment($scope.modelDate + " " + $scope.modelTime, $scope.formatDate + " " + $scope.formatTime).seconds(0).milliseconds(0);
          if (newModel.isValid()) {
            $scope.model = newModel;
            $scope.niceDateInputForm.$setValidity('validDate', true);
          } else {
            $scope.model = null;
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
          $scope.niceDateInputForm.$setDirty();
        }

        // -------------------- Format model --------------------
        $scope.formatModel = function () {
          $scope.modelDate = $scope.model.format($scope.formatDate);
          $scope.modelTime = $scope.model.format($scope.formatTime);
        }
        $scope.formatModel();

        // -------------------- Date --------------------
        $scope.dateBlur = function () {
          var newDate = moment($scope.modelDate, $scope.formatDate);
          if (newDate.isValid()) {
            $scope.niceDateInputForm.$setValidity('validDate', true);
            $scope.handleChange();
          } else {
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
        };

        // -------------------- Time --------------------
        $scope.timeBlur = function () {
          var newTime = moment($scope.modelTime, $scope.formatTime);
          if (newTime.isValid()) {
            $scope.niceDateInputForm.$setValidity('validDate', true);
            $scope.handleChange();
          } else {
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
        };

        // -------------------- Watch model --------------------
        $scope.$watch('model', function () {
          $scope.formatModel();
          $scope.inner = {
            timeModel: angular.copy($scope.model),
            dateModel: angular.copy($scope.model)
          };

        });
      }
    }
  }
  );
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDateRange
 * @description
 * # niceDateRange
 */
angular.module('niceElements')

  .directive('niceDateRange', function () {
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
        startOfTheYear: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      link: function (scope, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.format) { attrs.format = 'dd.MM.yyyy'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if (!angular.isDefined(scope.model)) {
          var model = null;
          if (!angular.isDefined(scope.startOfTheYear)) {
            model = {
              startDate: moment().format(),
              endDate: moment().format()
            };
          } else {
            model = {
              startDate: moment([moment().year()]).format(),
              endDate: moment().format()
            };
          }
          scope.model = model;
          if (scope.onChange) scope.onChange(scope.model);
        }
      },

      controller: function ($scope) {
        $scope.opts = {
          locale: {
            applyClass: 'btn-green',
            firstDay: 1
          },
          ranges: {},
          min: $scope.min,
          max: $scope.max
        };

        $scope.opts.ranges[gettextCatalog.getString("Today", null, "Nice")] = [moment(), moment()];
        $scope.opts.ranges[gettextCatalog.getString("Last 7 days", null, "Nice")] = [moment().subtract(7, 'days'), moment()];
        $scope.opts.ranges[gettextCatalog.getString("Last 30 days", null, "Nice")] = [moment().subtract(30, 'days'), moment()];
        $scope.opts.ranges[gettextCatalog.getString("This month", null, "Nice")] = [moment().startOf('month'), moment().endOf('month')];

        if (angular.isDefined($scope.format)) $scope.opts.format = format;
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

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimePicker
 * @description
 * # niceDatetimePicker
 */
angular.module('niceElements').directive('niceDatetimePicker', function () {
  return {
    restrict: 'E',
    transclude: false,
    templateUrl: 'src/components/nice-datetime-picker/nice-datetime-picker.html',
    scope: {
      model: '=', // binding model
      format: '@', // default: 'D.M.YYYY • H:mm', format for input label string
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
      isDisabled: '=',
      help: '@',
      isInline: '=',
      onChange: '&?'
    },
    controller: function ($scope, gettextCatalog) {
      console.warn("[NICE ELEMENTS] nice-datetime-picker component is deprecated!");
      $scope.date = $scope.date == 'true' || $scope.date == true;
      $scope.time = $scope.time == 'true' || $scope.time == true;
      $scope.noMargin === 'true' || $scope.noMargin === true;
      $scope.enableOkButtons === 'true' || $scope.enableOkButtons === true;
      $scope.lang = $scope.lang || 'en';
      $scope.okText = $scope.okText || gettextCatalog.getString('OK', null, 'Nice');
      $scope.cancelText = $scope.cancelText || gettextCatalog.getString('Cancel', null, 'Nice');
      $scope.weekStart = parseInt($scope.weekStart) || 1;
      $scope.width = parseInt($scope.width) || 300;
      $scope.isOpen = false;
      $scope.internalDate = moment($scope.model) || moment();

      if (!$scope.format) {
        if ($scope.date && !$scope.time) {
          $scope.format = 'D.M.YYYY';
        } else if (!$scope.date && $scope.time) {
          $scope.format = 'HH:mm';
        } else {
          $scope.format = 'D.M.YYYY • H:mm';
        }
      }

      $scope.openDtp = function () {
        if (!$scope.isDisabled) {
          $scope.isOpen = true;
          $scope.$broadcast('dtp-open-click');
        }
      };

      $scope.closeDtp = function (response) {
        $scope.isOpen = false;
        $scope.$broadcast('dtp-close-click');
      };

      $scope.$on('dateSelected', function () {
        $scope.formDatetimePicker.$setDirty();
      });

      $scope.$watch('internalDate', function (newDate) {
        $scope.model = moment(newDate);
        $scope.value = moment(newDate).format($scope.format);
        if ($scope.onChange) $scope.onChange({ model: $scope.model });
      });

      $scope.$watch('model', function (newModel, oldModel) {
        $scope.value = moment(newModel).format($scope.format);
      });
    }
  }
});
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimerangePicker2
 * @description
 * # niceDatetimerangePicker2
 */
angular.module('niceElements')
  .directive('niceDatetimerangePicker2', function () {
    return {
      scope: {
        startDate: '=', // binding model
        endDate: '=', // binding model
        formatString: '@', // default: 'D.M.YYYY • H:mm', format for input label string
        modelFormat: '@',
        time: '=?', // default: false, is time picker enabled?
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
        if ($scope.time == undefined) $scope.time = false;


        // Set format string
        if (!$scope.formatString) {
          if ($scope.time) $scope.formatString = 'D.M.YYYY • H:mm';
          else $scope.formatString = 'D.M.YYYY';
        }

        // Set start date
        if (!$scope.startDate) {
          $scope.startDate = moment();
        } else {
          $scope.model.innerStartDate = angular.copy($scope.startDate);
        }

        // Set end date
        if (!$scope.endDate) {
          $scope.endDate = moment();
        } else {
          $scope.model.innerEndDate = angular.copy($scope.endDate);
        }


        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
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


        $scope.format = function () {
          $scope.modelFormat = $scope.startDate.format($scope.formatString) + " - " + $scope.endDate.format($scope.formatString);
        };


        $scope.open = function () {
          if (!$scope.isDisabled) {
            $scope.isOpen = true;
            $scope.popper.update();
          }
        };


        $scope.close = function () {
          $scope.model.innerStartDate = angular.copy($scope.startDate);
          $scope.model.innerEndDate = angular.copy($scope.endDate);
          $scope.isOpen = false;
        };


        $scope.confirm = function () {
          $scope.startDate = angular.copy($scope.model.innerStartDate);
          $scope.endDate = angular.copy($scope.model.innerEndDate);
          if ($scope.onChange) $scope.onChange({ startDate: $scope.startDate, endDate: $scope.endDate });
          $scope.isOpen = false;
        };


        $scope.selectToday = function () {
          $scope.model.innerStartDate = moment().startOf('day');
          $scope.model.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastNDays = function (days) {
          $scope.model.innerStartDate = moment().subtract(days, 'days').startOf('day');
          $scope.model.innerEndDate = moment().endOf('day');
        };


        $scope.selectLastMonth = function () {
          $scope.model.innerStartDate = moment().subtract(1, 'months').startOf('month').startOf('date');
          $scope.model.innerEndDate = moment().subtract(1, 'months').endOf('month').endOf('date');
        };


        $scope.selectThisMonth = function () {
          $scope.model.innerStartDate = moment().startOf('month').startOf('date');
          $scope.model.innerEndDate = moment().endOf('month').endOf('date');
        };


        // ------------------ Remove time from date ------------------
        $scope._removeTime = function (date) {
          return date.hour(0).minute(0).second(0).millisecond(0);
        };


        $scope.dateChanged = function () {
          $timeout(function () {
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


        $scope.$watchGroup(["startDate", "endDate"], function () {
          $scope.model.innerStartDate = angular.copy($scope.startDate);
          $scope.model.innerEndDate = angular.copy($scope.endDate);
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
  .directive('niceDatetimerangePicker', function (gettextCatalog) {
    return {
      scope: {
        modelStart: '=', // binding model
        modelEnd: '=', // binding model
        format: '@', // default: 'D.M.YYYY • H:mm', format for input label string
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
        formatOutput: '@', // Format output or moment
        isDisabled: '=',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },
      templateUrl: 'src/components/nice-datetimerange-picker/nice-datetimerange-picker.html',
      link: {
        pre: function ($scope) {
          console.warn("[NICE ELEMENTS] nice-datetimerange-picker component is deprecated!");
          // Default parameters
          var params = {
            title: '',
            noMargin: false,
            fieldWidth: 'col-sm-8',
            labelWidth: 'col-sm-4',
            format: 'D.M.YYYY • H:mm',
            modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
            minDate: null,
            maxDate: null,
            lang: 'en',
            weekStart: 1,
            shortTime: false,
            cancelText: gettextCatalog.getString('Cancel', null, 'Nice'),
            okText: gettextCatalog.getString('OK', null, 'Nice'),
            date: true,
            time: false,
            width: 300,
            enableOkButtons: false
          };

          if ($scope.formatOutput === undefined) $scope.formatOutput = false;

          var setLabelValue = function () {
            var _from = moment($scope.internalStart).format(params.format);
            var _to = moment($scope.internalEnd).format(params.format);
            $scope.value = _from + ' - ' + _to;
          };

          var initCurrentDates = function () {
            if (typeof ($scope.modelStart) === 'undefined' || $scope.modelStart === null) {
              var _start = moment().subtract(1, 'days');
              if ($scope.formatOutput) _start = _start.format(params.modelFormat);
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
            if (typeof ($scope.modelEnd) === 'undefined' || $scope.modelEnd === null) {
              var _end = moment();
              if ($scope.formatOutput) _end = _end.format(params.modelFormat);
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

            // Fix dateEnd if it's before dateStart
            if ($scope.dateStart > $scope.dateEnd) {
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
            if (!$scope.isDisabled) {
              initCurrentDates();
              $scope.showDtpRange = true;
            }
          };

          $scope.okClick = function () {
            setLabelValue();
            var _start = moment($scope.internalStart, params.modelFormat);
            if ($scope.formatOutput) _start = _start.format(params.modelFormat);
            $scope.modelStart = _start;

            var _end = moment($scope.internalEnd, params.modelFormat);
            if ($scope.formatOutput) _end = _end.format(params.modelFormat);
            $scope.modelEnd = _end;

            //$scope.modelStart = angular.copy($scope.internalStart);
            //$scope.modelEnd = angular.copy($scope.internalEnd);
            $scope.showDtpRange = false;

            if ($scope.onChange) $scope.onChange({ modelStart: $scope.modelStart, modelEnd: $scope.modelEnd });
          };

          $scope.cancelClick = function () {
            $scope.showDtpRange = false;
            //$scope.internalStart = angular.copy($scope.modelStart);
            //$scope.internalEnd = angular.copy($scope.modelEnd);
            var _start = moment($scope.modelStart);
            if ($scope.formatOutput) _start = _start.format(params.modelFormat);
            var _end = moment($scope.modelEnd);
            if ($scope.formatOutput) _end = _end.format(params.modelFormat);

            $scope.internalStart = _start;
            $scope.internalEnd = _end;
            setLabelValue();
          };

          $scope.selectLastNDays = function (days) {
            $scope.dateStart = moment().subtract(days, 'days');
            $scope.dateEnd = moment();
            $scope.internalStart = $scope.dateStart;
            $scope.internalEnd = $scope.dateEnd;
            setLabelValue();
          };

          $scope.selectLastMonth = function () {
            $scope.dateStart = moment().subtract(1, 'months');
            $scope.dateEnd = moment();
            $scope.internalStart = $scope.dateStart;
            $scope.internalEnd = $scope.dateEnd;
            setLabelValue();
          };

          $scope.selectThisMonth = function () {
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

          $scope.$watchGroup(['modelStart', 'modelEnd'], function () {
            initCurrentDates();
          });

        }
      }
    };

  });
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
        $scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
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
        if ($scope.mature) newestYear -= 17;


        // Create years array
        $scope.years = [];
        for (var i = currentYear; i >= oldestYear; i--) {
          if (i <= newestYear) {
            $scope.years.push(i);
          }
        }


        // Split the current date into sections
        $scope.dateFields = {};


        // Watch for model change
        $scope.$watch('model', function (newDate, oldDate) {
          if (newDate && newDate != oldDate) {
            var date = moment(newDate);
            $scope.dateFields.day = date.get('date');
            $scope.dateFields.month = date.get('month');
            $scope.dateFields.year = date.get('year');
            $scope.checkDate();
          }
        });


        // validate that the date selected is accurate
        $scope.checkDate = function () {
          var date = moment($scope.dateFields.day + "." + ($scope.dateFields.month + 1) + "." + $scope.dateFields.year, "D.M.YYYY");

          if (date.isValid()) {
            // Format
            $scope.model = date.format();
            if ($scope.onChange) $scope.onChange({ model: $scope.model });

            // Change dates
            $scope.days = [];
            for (i = 1; i <= date.daysInMonth(); i++) {
              $scope.days.push(i);
            }

            // Valid
            if ($scope.dropdownDateForm) {
              $scope.dropdownDateForm.$setValidity('validDate', true);
              $scope.dropdownDateForm.$setDirty();
            }
          } else {
            // Invalid
            if ($scope.dropdownDateForm) $scope.dropdownDateForm.$setValidity('validDate', false);
          }
        };


        // Set current date
        if (!$scope.model) {
          var date = moment();
          $scope.dateFields.day = date.get('date');
          $scope.dateFields.month = date.get('month');
          $scope.dateFields.year = date.get('year');
          if ($scope.mature) $scope.dateFields.year -= 18;
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
        required: '=',            // Model cannot be NULL
        showTax: '@',             // Shows tax rate
        noMargin: '@',            // margin-bottom: 0px
        multiple: '@',            // Can select multiple items
        help: '@',
        listenKeydown: '@',
        noOptionsText: '@',
        isInline: '=',
        onChange: '&?'
      },
      controller: function ($scope, $element, gettextCatalog) {
        console.warn("[NICE ELEMENTS] nice-dropdown-old component is deprecated!");

        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.list) { $scope.list = []; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = gettextCatalog.getString("No options", null, "Nice"); }
        if (!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        if (!$scope.listenKeydown) { $scope.listenKeydown = false; }
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
        $scope.toggle = function () { $scope.isOpen = !$scope.isOpen; };
        $scope.close = function () { $scope.isOpen = false; };
        $scope.open = function () { $scope.isOpen = true; };


        // ----------------------------------- Get filter -----------------------------------
        var getFilter = function (item) {
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };


        // ----------------------------------- Set internal list -----------------------------------
        var _set_internal_list = function () {
          $scope.internalList = angular.copy($scope.list);
        };


        // ----------------------------------- Add null object to internal list -----------------------------------
        var _add_null_object_to_internal = function () {
          if ($scope.nullable && !$scope.multiple) {
            var nullObj = {};
            nullObj[$scope.objKey] = null;
            nullObj[$scope.objValue] = '-';
            $scope.internalList = [nullObj].concat($scope.internalList);
          }
        };


        // ----------------------------------- Get selected object -----------------------------------
        var _get_selected_object = function (selected) {
          if (!selected) return null;
          if ($scope.selectedIsObj) {
            return selected;
          } else {
            return _.find($scope.internalList, getFilter(selected));
          }
        };


        // ----------------------------------- Init -----------------------------------
        var _set_internal_selected_one = function (selected) {
          var obj = {};

          var selectedObj = _get_selected_object(selected);
          // console.log('_set_internal_selected_one', selected, selectedObj);
          if (selectedObj && _.find($scope.internalList, getFilter(selected))) {
            obj = selectedObj;
          } else {
            obj = $scope.internalList[0];
          }
          $scope.internalSelected = obj;
          _set_model(obj);
        };


        // ----------------------------------- Get selected objects -----------------------------------
        var _get_selected_objects = function (selected) {
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
        var _set_internal_selected_multiple = function (item) {
          var _selected_objects = _get_selected_objects(item);
          if (_selected_objects) {
            $scope.internalSelected = _selected_objects;
            _set_model($scope.internalSelected);
          } else {
            $scope.internalSelected = [];
            _set_model($scope.internalSelected);
          }
        };


        // ----------------------------------- Set model -----------------------------------
        var _set_model = function (value) {
          var _new = angular.copy($scope.model);

          if (!$scope.multiple) {
            if (value[$scope.objKey] == null) {
              _new = null;
            } else {
              if ($scope.selectedIsObj) {
                _new = value;
              } else {
                _new = value[$scope.objKey];
              }
            }
          } else {
            if ($scope.selectedIsObj) {
              _new = value;
            } else {
              _new = _.map(value, function (val) {
                return val[$scope.objKey];
              });
            }
          }

          // update model only if it is changed
          if (!_.isEqual(_new, $scope.model)) {
            $scope.model = _new;
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          }
        };


        // ----------------------------------- Init -----------------------------------
        var init = function () {
          _set_internal_list();
          _add_null_object_to_internal();

          if ($scope.multiple && $scope.model) {
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
          if ($scope.internalList && $scope.internalList.length > 0) {
            $scope.emptyList = false;

            if ($scope.multiple) {
              _set_internal_selected_multiple($scope.model);
            } else {
              _set_internal_selected_one($scope.model);
            }

            if ($scope.formDropdown && $scope.required) {
              $scope.formDropdown.$setValidity('required', true);
            }
          } else {
            // Disable dropdown button if list of items is empty
            $scope.emptyList = true;
            var sel = {};
            sel[$scope.objKey] = null;
            sel[$scope.objValue] = $scope.noOptionsText;
            $scope.internalList = [sel];

            if ($scope.formDropdown && $scope.required) {
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
        $scope.isItemSelected = function (item) {
          if (!$scope.internalSelected) return false;

          // Which item is selected
          if ($scope.multiple) {
            return _.where($scope.internalSelected, { 'id': item.id }).length > 0;
          } else {
            return $scope.internalSelected[$scope.objKey] == item[$scope.objKey];
          }
        };


        // ----------------------------------- Item clicked -----------------------------------
        $scope.clicked = function (item) {
          $scope.formDropdown.$setDirty();
          if ($scope.multiple) {
            // This actually toggles selection
            var _current = angular.copy($scope.internalSelected);
            if (!_.find(_current, getFilter(item))) {
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
        $scope.getLabel = function (item) {
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

          if (!_.isEqual(_new_model_object, $scope.internalSelected)) {
            init();
          }
        });


        // ----------------------------------- Listen keydown -----------------------------------
        $scope.bindKeypress = function () {
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

        $scope.unbindKeypress = function () {
          $element.off('keyup', function (e) { });
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
  .directive('niceDropdown', function ($window) {
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
        onChange: '&?',
        onSelect: '&?', // Like onChange but always return objects
        onClose: '&?',
        onOpen: '&?',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        loading: '=?',
        addButtonFunction: '=?',
        objValue: '@', // Optional - default is 'value'
        objKey: '@?', // Optional - default is 'id'. Used only when returnOnlyKey=true.
        selectedIsKey: '@?',
        nullable: '@', // No selection is possible
        required: '=', // Model cannot be NULL
        noMargin: '@', // margin-bottom: 0px
        multiple: '@', // Can select multiple items
        help: '@',
        noOptionsText: '@',
        noDataText: '@',
        selectText: '@',
        searchText: '@',
        noSearch: '=',
        nullableText: '@',
        selectedText: '@',
        dropdownDistance: '@',
        searchFunction: '=?',
        filterFunction: '=?',
        isInline: '=',
        clearOnSelect: '@',
        enableLoadMore: '@' // Enable load more
      },
      controller: function ($scope, $http, $element, $timeout, gettextCatalog, NiceService) {
        $scope.id = Math.random().toString(36).substring(7);
        if (!$scope.dropdownDistance) { $scope.dropdownDistance = 5; }
        if (!$scope.objValue) { $scope.objValue = 'value'; }
        if (!$scope.objKey) { $scope.objKey = 'id'; }
        if (!$scope.noOptionsText) { $scope.noOptionsText = gettextCatalog.getString("No options", null, "Nice"); }
        if (!$scope.noDataText) { $scope.noDataText = gettextCatalog.getString("No options", null, "Nice"); }
        if (!$scope.searchText) { $scope.searchText = gettextCatalog.getString("Search...", null, "Nice"); }
        if (!$scope.nullableText) { $scope.nullableText = gettextCatalog.getString("None", null, "Nice"); }
        if (!$scope.selectText) { $scope.selectText = gettextCatalog.getString("None", null, "Nice"); }
        if (!$scope.selectedText) { $scope.selectedText = gettextCatalog.getString("selected", null, "Nice"); }
        if (!$scope.addButtonFunction) { $scope.addButtonFunction = null; }
        $scope.nullable = $scope.nullable === 'true' || $scope.nullable === true;
        $scope.noMargin = $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.multiple = $scope.multiple === 'true' || $scope.multiple === true;
        $scope.clearOnSelect = $scope.clearOnSelect === 'true' || $scope.clearOnSelect === true;
        $scope.isOpen = false;
        $scope.selected = null;
        // $scope.selectedIndex = 0;
        $scope.popper = null;

        $scope.internal = {
          search: ""
        };

        if ($scope.list) {
          $scope.originalList = angular.copy($scope.list);
        }

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('btn-dropdown')[0];
          var tooltip = $element[0].getElementsByClassName('nice-dropdown-menu-wrapper')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, $scope.dropdownDistance],
                },
              },
              {
                name: "sameWidth",
                enabled: true,
                phase: "beforeWrite",
                requires: ["computeStyles"],
                fn: function (e) {
                  var state = e.state;
                  state.styles.popper.width = state.rects.reference.width + "px";
                },
                effect: function (e) {
                  var state = e.state;
                  state.elements.popper.style.width = state.elements.reference.offsetWidth + "px";
                }
              }
            ],
          });
        };

        $timeout(function () {
          $scope.setupPopper();
        });


        // ----------------------------------- Open -----------------------------------
        $scope.toggle = function () {
          if ($scope.isOpen) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.close = function () {
          $scope.isOpen = false;
          if ($scope.onClose) $scope.onClose();
        };

        $scope.open = function () {
          $scope.popper.update();
          if ($scope.filterFunction) $scope.internalList = $scope.filterFunction($scope.originalList);
          $timeout(function () {
            $scope.isOpen = true;
            if ($scope.onOpen) $scope.onOpen();
            $timeout(function () {
              $scope.popper.update();
            });
          });
          $timeout(function () {
            $scope.focusInput();
            $scope.scrollToHover(true);
            if ($scope.enableLoadMore) $scope.handleScrollToBottom();
          }, 100);
        };


        // ----------------------------------- Handle scroll to bottom -----------------------------------
        var lastScrollPosition = Infinity;
        $scope.handleScrollToBottom = function () {
          lastScrollPosition = Infinity;
          var element = angular.element($element[0].getElementsByClassName("nice-dropdown-items")[0]);
          element.bind("scroll mousewheel", function (e) {
            var scrollPosition = element[0].scrollHeight - element[0].scrollTop;
            if (scrollPosition === element[0].clientHeight && lastScrollPosition != scrollPosition) {
              $scope.loadMore();
            }
            if (scrollPosition <= lastScrollPosition) lastScrollPosition = scrollPosition;
          });
        }


        // ----------------------------------- Load more -----------------------------------
        $scope.loadMore = function () {
          if (!$scope.internalList || !$scope.internalList._metadata || !$scope.internalList._metadata.next) return;
          $scope.loading = true;
          $http({
            method: 'GET',
            url: $scope.internalList._metadata.next,
            headers: NiceService.getHeader()
          }).then(function (response) {
            response = response.data;
            var metadata = {
              count: response.count,
              previous: response.previous,
              next: response.next,
            };
            $scope.internalList._metadata = metadata;
            angular.forEach(response.results, function (item) {
              $scope.internalList.push(item);
            });
            lastScrollPosition = Infinity;
            $scope.loading = false;
            return response;
          }, function (error) {
            $scope.loading = false;
            return error;
          });
        }


        // ----------------------------------- Focus input -----------------------------------
        $scope.focusInput = function () {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            $timeout(function () {
              input.focus();
            });
          }
        };


        // ------------------- On blur -------------------
        $scope.onBlur = function () {
          $scope.close();
        };


        $scope.handleNewInternalList = function (items) {
          $scope.originalList = angular.copy(items);
          if ($scope.filterFunction) $scope.internalList = $scope.filterFunction($scope.originalList);
          else $scope.internalList = items;
        }


        // ----------------------------------- Scroll to hover -----------------------------------
        $scope.scrollToHover = function (notSmooth) {
          var dropdownMenu = $element[0].getElementsByClassName("nice-dropdown-menu")[0];
          if (!dropdownMenu) return;
          var dorpdownList = dropdownMenu.getElementsByClassName("nice-dropdown-items")[0];
          var hoverItem = dorpdownList.getElementsByClassName("hover")[0];
          if (!hoverItem) return
          var topPos = hoverItem.offsetTop;
          dorpdownList.scroll({
            top: topPos - 120,
            left: 0,
            behavior: notSmooth ? 'auto' : 'smooth'
          });
        };


        // ----------------------------------- Search -----------------------------------
        $scope.handleSearch = function () {
          if (!$scope.searchFunction) return;
          $scope.loading = true;
          $scope.searchFunction($scope.internal.search).then(function (response) {
            $scope.handleNewInternalList(response);
            $scope.loading = false;
            $scope.handleDefault();
          }, function (error) {
            $scope.internalList = null;
            $scope.loading = false;
          });
        };

        $scope.clearSearch = function () {
          $scope.internal.search = "";
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
        $scope.handleMultipleSelect = function (item, index) {
          if (!$scope.selected) $scope.selected = [];

          if (item._selected) {
            $scope.selected = $scope.selected.filter(function (s) {
              return s[$scope.objKey] != item[$scope.objKey];
            });
          } else {
            $scope.selected.push(item);
          }

          $scope.handleSetModel();
        };


        // ----------------------------------- Select all -----------------------------------
        $scope.selectAll = function () {
          if (!$scope.multiple) return;
          $scope.selected = $scope.internalList;
          angular.forEach($scope.internalList, function (o) {
            o._selected = true;
          });
          $scope.handleSetModel();
        }


        // ----------------------------------- Select none -----------------------------------
        $scope.selectNone = function () {
          if (!$scope.multiple) return;
          $scope.selected = [];
          angular.forEach($scope.internalList, function (o) {
            o._selected = false;
          });
          $scope.handleSetModel();
        }


        // ----------------------------------- Handle single slect -----------------------------------
        $scope.handleSingleSelect = function (item, index) {
          $scope.selected = item;
          $scope.close();
          $scope.handleSetModel();
        };


        // ----------------------------------- Handle set model -----------------------------------
        $scope.handleSetModel = function () {
          var obj = angular.copy($scope.selected);

          if ($scope.selected != null) {
            // Remove selected flag
            if (!$scope.selectedIsKey) {
              if ($scope.multiple) {
                angular.forEach(obj, function (o) {
                  o._selected = undefined;
                });
              } else {
                obj._selected = undefined;
              }
            }

            // Selected is object
            if ($scope.selectedIsKey) {
              if ($scope.multiple) {
                obj = obj.map(function (o) {
                  return o[$scope.objKey];
                });
              } else {
                obj = obj[$scope.objKey];
              }
            }
          }

          if ($scope.clearOnSelect) {
            // Clear on select
            $scope.model = null;
          } else {
            // Set model
            $scope.model = obj;
          }

          // Trigger on change
          $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: obj });
            if ($scope.onSelect) $scope.onSelect({ model: angular.copy($scope.selected) });
          })
        };


        // ----------------------------------- Handle default -----------------------------------
        $scope.handleDefault = function () {
          if ($scope.model) $scope.handleModelChange();
          if (!$scope.nullable && !$scope.model && !$scope.clearOnSelect && $scope.internalList && $scope.internalList.length > 0) {
            $scope.handleSelected($scope.internalList[0], 0);
          }
        };

        // ----------------------------------- Watch for list change -----------------------------------
        $scope.$watchCollection('list', function (value_new, value_old) {
          $scope.handleNewInternalList(angular.copy($scope.list));
          $scope.handleDefault();
        });


        // ----------------------------------- Watch for model change -----------------------------------
        $scope.$watch('model', function (value_new, value_old) {
          $scope.handleModelChange();
        });

        $scope.handleModelChange = function () {
          $scope.selected = angular.copy($scope.model);
          angular.forEach($scope.internalList, function (i, index) {
            i._selected = false;

            if ($scope.selectedIsKey) {
              // Not object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function (s, index) {
                  if (i[$scope.objKey] == s) {
                    i._selected = true;
                    // $scope.selected.push(i);
                    $scope.selected[index] = i
                    // $scope.selectedIndex = index;
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected) {
                  i._selected = true;
                  $scope.selected = i;
                  // $scope.selectedIndex = index;
                  $scope.scrollToHover();
                }
              }
            } else {
              // Is object
              if ($scope.multiple) {
                // Multiple
                angular.forEach($scope.selected, function (s) {
                  if (i[$scope.objKey] == s[$scope.objKey]) {
                    i._selected = true;
                    // $scope.selected.push(i);
                    // $scope.selectedIndex = index;
                  }
                });
              } else {
                // Single
                if ($scope.selected != null && i[$scope.objKey] == $scope.selected[$scope.objKey]) {
                  i._selected = true;
                  $scope.selected = i;
                  // $scope.selectedIndex = index;
                  $scope.scrollToHover();
                }
              }
            }
          });

          // Handle required
          $timeout(function () {
            if ($scope.formDropdown) $scope.formDropdown.$setValidity('required', !(!$scope.selected && $scope.required));
          });
        }

        // ----------------------------------- Watch for keydown and keypress -----------------------------------
        // $element.bind("keydown keypress", function (event) {
        //   // Arrow Up
        //   if (event.keyCode == 38) {
        //     event.preventDefault();
        //     $timeout(function () {
        //       if ($scope.selectedIndex > 0) {
        //         $scope.selectedIndex -= 1;
        //         $timeout(function () {
        //           $scope.scrollToHover();
        //         });
        //       }
        //     });
        //   }

        //   // Arrow Down
        //   if (event.keyCode == 40) {
        //     event.preventDefault();
        //     $timeout(function () {
        //       if ($scope.internalList && $scope.selectedIndex < $scope.internalList.length - 1) {
        //         $scope.selectedIndex += 1;
        //         $timeout(function () {
        //           $scope.scrollToHover();
        //         });
        //       }
        //     });
        //   }

        //   // Enter
        //   if (event.keyCode == 13) {
        //     event.preventDefault();
        //     $timeout(function () {
        //       $scope.handleSelected($scope.internalList[$scope.selectedIndex], $scope.selectedIndex);
        //     });
        //   }

        //   // Escape
        //   if (event.keyCode == 27) {
        //     $timeout(function () {
        //       $scope.close();
        //     });
        //   }
        // });

        $scope.handleDefault();

        // ----------------------------------- Init search -----------------------------------
        if ($scope.searchFunction) {
          $scope.handleSearch();
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

  .directive('niceDtp', function ($window, $parse, $document) {

    return {
      scope: {
        onChange: '&?', // function called on date changed
        model: '=', // binding model
        format: '@', // default: 'D.M.YYYY • H:mm', format for input label string
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
      controller: function ($scope, $element, $attrs, gettextCatalog) {
        console.warn("[NICE ELEMENTS] nice-dtp component is deprecated!");

        // default parameters
        var params = {
          title: '',
          noMargin: false,
          fieldWidth: 'col-sm-8',
          labelWidth: 'col-sm-4',
          format: 'D.M.YYYY • H:mm',
          modelFormat: 'YYYY-MM-DDTHH:mm:ss.SSS',
          minDate: null,
          maxDate: null,
          lang: 'en',
          weekStart: 1,
          shortTime: false,
          cancelText: gettextCatalog.getString('Cancel', null, 'Nice'),
          okText: gettextCatalog.getString('OK', null, 'Nice'),
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

        $scope.date = $attrs.date === 'true' || $attrs.date === true;
        $scope.time = $attrs.time === 'true' || $attrs.time === true;

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
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
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
      replace: true,
      scope: {
        text: '@'
      },
      controller: function ($scope, $element, $timeout) {
        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('nice-help-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-help-popup')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            placement: 'top',
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              },
              {
                name: 'arrow',
                options: {
                  padding: 2,
                },
              }
            ],
          });
        };

        // $timeout(function () {
        //   $scope.setupPopper();
        // });

        $scope.onHover = function () {
          $scope.setupPopper();
        }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceIcon
 * @description
 * # niceIcon
 */
angular.module('niceElements')
  .directive('niceIcon', function () {
    return {
      templateUrl: 'src/components/nice-icon/nice-icon.html',
      restrict: 'E',
      replace: true,
      scope: {
        icon: '@',
        size: '=',
      },
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
        regexRaw: '@?',
        regexError: '@?',
        placeholder: '@',
        min: '@?',
        max: '@?',
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
        isFocused: '@',
        isInline: '=',
        onChange: '&?',
        onClear: '&?',
        numbersOnly: '=', // Allow only numbers in the input
        multilanguage: '=?', // Multiple languages object
        multilanguageField: '@?', // Multiple languages field name
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

        if (!scope.textArea) {
          scope.elementType = "input";
        } else {
          scope.elementType = "textarea";
        }

        if (scope.isFocused) {
          var input = element[0].getElementsByTagName(scope.elementType)[0];
          if (input) input.focus();
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
          if (scope.model.toString().split('.').length < 2 || scope.model.toString().split('.')[1].length < parseInt(attrs.minDecimalsCutZeros)) {
            scope.model = Number((Number(scope.model)).toFixed(parseInt(attrs.minDecimalsCutZeros)));
          }
        }

        if (angular.isDefined(scope.regex) && scope.regex != '') {
          scope.regexexp = new RegExp(scope.regex);
        }

        if (angular.isDefined(scope.regexRaw) && scope.regexRaw != '') {
          scope.regexexp = regexRaw;
        }

        scope.$watch('model', function (value_new, value_old) {
          scope.internalModel = scope.model;
        });

        scope.$watch('internalModel', function (value_new, value_old) {
          if (attrs.type == "number" && value_new) {
            if (typeof value_new != "number") {
              scope.internalModel = value_new.replace(',', '.');
              scope.model = scope.internalModel;
              if (scope.onChange) scope.onChange({ model: scope.model });
            } else {
              if (scope.onChange) scope.onChange({ model: scope.model });
            }
          } else {
            scope.model = scope.internalModel;
            if (scope.onChange) scope.onChange({ model: scope.model });
          }
        });
      },

      controller: function ($scope, $rootScope, ngDialog) {
        $scope.id = Math.random().toString(36).substring(7);

        // Handle multiple language field if empty
        if ($scope.multilanguageField && !$scope.multilanguage) {
          $scope.multilanguage = {};
        }
        if ($scope.multilanguage && $scope.multilanguageField && !$scope.multilanguage[$scope.multilanguageField]) {
          $scope.multilanguage[$scope.multilanguageField] = {};
          $scope.numberOfLanguages = 0;
        }

        // Watch for multilanguage change
        $scope.$watch('multilanguage', function () {
          if ($scope.multilanguage && $scope.multilanguageField && $scope.multilanguage[$scope.multilanguageField]) {
            $scope.numberOfLanguages = Object.keys($scope.multilanguage[$scope.multilanguageField]).length;
          }
        });

        // Open multilanguage modal
        $scope.openMultilanguage = function () {
          var scope = $rootScope.$new(true);
          var dialog = ngDialog.open({
            template: '<nice-multilangual-modal model="model" multilanguage="multilanguage" multilanguage-field="{{ multilanguageField }}" callback="callback" dialog="dialog"></nice-multilangual-modal>',
            plain: true,
            scope: scope,
            className: 'ngdialog ngdialog-theme-default nice-ngdialog-theme',
            showClose: false,
          });
          scope.dialog = dialog;
          scope.model = angular.copy($scope.model);
          scope.multilanguage = angular.copy($scope.multilanguage);
          scope.multilanguageField = $scope.multilanguageField;
          scope.callback = function (newFields) {
            var filteredFields = {};
            angular.forEach(newFields, function (value, key) {
              if (value != '') filteredFields[key] = value;
            })
            if (!$scope.multilanguage) $scope.multilanguage = {};
            if (!$scope.multilanguage[$scope.multilanguageField]) $scope.multilanguage[$scope.multilanguageField] = {};
            $scope.multilanguage[$scope.multilanguageField] = filteredFields;
            $scope.numberOfLanguages = Object.keys($scope.multilanguage[$scope.multilanguageField]).length;
          };
        }

        $scope.keypress = function (event) {
          if ($scope.numbersOnly) {
            if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
              return true;
            } else { // Prevent everything else
              event.preventDefault();
              return false;
            }
          }

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
        title: '@',
        noMargin: '@',
        isInline: '=',
        help: '@'
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
      transclude: true,
      replace: true,
      scope: {
        visibleWhen: '=',
        message: '@',
        fullscreen: '@',
        fulldiv: '@',
        addClass: '@'
      },
      controller: function ($scope, $transclude) {
        $scope.showSlot = $transclude().length > 0;
        if ($scope.visibleWhen != undefined) console.warn("[NICE ELEMENTS] Nice loader: visible-when attribute is deprecated")
        if ($scope.addClass != undefined) console.warn("[NICE ELEMENTS] Nice loader: add-class attribute is deprecated")
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
  .factory('NiceNotification', function ($timeout, $http, $compile, $templateCache, $rootScope, $sce) {

    var startTop = 10;
    var startRight = 10;
    var verticalSpacing = 10;
    var horizontalSpacing = 10;
    var delay = 5000;

    var messageElements = [];

    var notify = function (args, t) {

      if (typeof args !== 'object') {
        args = { message: args };
      }

      args.template = args.template ? args.template : 'src/components/nice-notification/nice-notification.html';
      args.delay = !angular.isUndefined(args.delay) ? args.delay : delay;
      args.type = t ? t : '';

      $http.get(args.template, { cache: $templateCache }).success(function (template) {

        var scope = $rootScope.$new();
        scope.message = $sce.trustAsHtml(args.message);
        scope.title = $sce.trustAsHtml(args.title);
        scope.t = args.type.substr(0, 1);
        scope.delay = args.delay;

        if (typeof args.scope === 'object') {
          for (var key in args.scope) {
            scope[key] = args.scope[key];
          }
        }

        var reposite = function () {
          var j = 0;
          var k = 0;
          var lastTop = startTop;
          var lastRight = startRight;
          for (var i = messageElements.length - 1; i >= 0; i--) {
            var element = messageElements[i];
            var elHeight = parseInt(element[0].offsetHeight);
            var elWidth = parseInt(element[0].offsetWidth);
            if ((top + elHeight) > window.innerHeight) {
              lastTop = startTop;
              k++;
              j = 0;
            }
            var top = lastTop + (j === 0 ? 0 : verticalSpacing);
            var right = startRight + (k * (horizontalSpacing + elWidth));

            element.css('top', top + 'px');
            element.css('right', right + 'px');

            lastTop = top + elHeight;
            j++;
          }
        };

        var templateElement = $compile(template)(scope);
        templateElement.addClass(args.type);
        templateElement.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd click', function (e) {
          e = e.originalEvent || e;
          if (e.type === 'click' || (e.propertyName === 'opacity' && e.elapsedTime >= 0.4)) {
            templateElement.remove();
            messageElements.splice(messageElements.indexOf(templateElement), 1);
            reposite();
          }
        });

        $timeout(function () {
          templateElement.addClass('killed');
          templateElement.remove();
          messageElements.splice(messageElements.indexOf(templateElement), 1);
          reposite();
        }, args.delay);

        angular.element(document.getElementsByTagName('body')).append(templateElement);
        messageElements.push(templateElement);

        $timeout(reposite);

      }).error(function (data) {
        throw new Error('Template (' + args.template + ') could not be loaded. ' + data);
      });

    };

    notify.config = function (args) {
      startTop = args.top ? args.top : startTop;
      verticalSpacing = args.verticalSpacing ? args.verticalSpacing : verticalSpacing;
    };

    notify.primary = function () {
      this(args, '');
    };

    notify.error = function (args) {
      this(args, 'error');
    };

    notify.success = function (args) {
      this(args, 'success');
    };

    notify.info = function (args) {
      this(args, 'info');
    };

    notify.warning = function (args) {
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
        isDisabled: '=',
        title: '@?',
        min: '@',
        max: '@',
        defaultValue: '@',
        required: '=',
        fieldWidth: '@',
        labelWidth: '@',
        hideError: '@',
        preventZero: "@",
        noMargin: '@',
        step: '@',
        decimals: '@',
        allowNegative: '@',
        floatingError: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      controller: function ($scope, $timeout) {
        $scope.canAdd = true;
        $scope.canSubstract = true;
        $scope.preventZero = $scope.preventZero == "true";

        // Link form object with valid object
        if ($scope.valid) {
          $scope.valid = $scope.forma;
        }

        // Fix min
        if (!$scope.min) $scope.min = 0;
        else $scope.min = parseFloat($scope.min);

        // Allow negative
        if ($scope.allowNegative) $scope.min = -Infinity;

        // Fix max
        if ($scope.max) $scope.max = parseFloat($scope.max);

        // Set default value
        if (!$scope.defaultValue) {
          if ($scope.min != 0 && $scope.min != -Infinity) $scope.defaultValue = $scope.min;
          else $scope.defaultValue = 0;
        } else {
          $scope.defaultValue = parseInt($scope.defaultValue);
        }

        // Fix decimals
        if (!$scope.decimals) $scope.decimals = 0;
        else $scope.decimals = parseInt($scope.decimals);

        // Fix step
        if (!$scope.step) $scope.step = 1;
        else $scope.step = parseFloat($scope.step);


        // Check if number is defined
        if (!$scope.model) {
          $scope.model = $scope.defaultValue;
        } else {
          if (parseFloat($scope.model)) {
            $scope.model = parseFloat($scope.model);
          } else {
            $scope.model = $scope.defaultValue;
          }
        }

        // Check canAdd or canSubtract
        $scope.check = function () {
          if ($scope.niceNumberForm) {
            if ($scope.required && ($scope.model == undefined || $scope.model == null)) {
              $scope.niceNumberForm.$setValidity("no-value", false);
            } else {
              $scope.niceNumberForm.$setValidity("no-value", null);
            }
          }

          if ($scope.min && parseFloat($scope.model) <= $scope.min) {
            $scope.canSubstract = false;
            // $scope.model = $scope.min;
          } else {
            $scope.canSubstract = true;
          }

          if ($scope.max && parseFloat($scope.model) >= $scope.max) {
            $scope.canAdd = false;
            // $scope.model = $scope.max;
          } else {
            $scope.canAdd = true;
          }

          if ($scope.niceNumberForm) {
            if ($scope.preventZero && parseFloat($scope.model) == 0) {
              $scope.niceNumberForm.$setValidity("zero", false);
            } else {
              $scope.niceNumberForm.$setValidity("zero", null);
            }
          }

          if ($scope.onChange) $scope.onChange({ model: $scope.model });
        };


        // Check when load
        $timeout(function () {
          $scope.check();
        });


        // On input change
        $scope.inputChanged = function () {
          $scope.check();
        };


        // Watch for model change
        $scope.$watch("model", function () {
          $scope.check();
        });


        // Add to the value
        $scope.add = function () {
          var result = new Decimal($scope.model != undefined ? $scope.model : $scope.defaultValue).plus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if ($scope.max) {
            if (result <= parseFloat($scope.max)) {
              $scope.model = result;
              $scope.niceNumberForm.$setDirty();
            }
          } else {
            $scope.model = result;
            $scope.niceNumberForm.$setDirty();
          }
          $scope.check();
        };


        // Subtract to the value
        $scope.subtract = function () {
          var result = new Decimal($scope.model != undefined ? $scope.model : $scope.defaultValue).minus($scope.step).toNumber();
          if (result >= Number($scope.min)) {
            $scope.model = result;
            $scope.niceNumberForm.$setDirty();
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
        required: '=',
        fieldWidth: '@',
        labelWidth: '@',
        placeholder: '@',
        noMargin: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
      },

      controller: function ($rootScope, $scope) {
        // Link form object with valid object
        if (angular.isDefined($scope.valid)) {
          $scope.valid = $scope.form;
        }

        var roundN = function (number, decimals) {
          return Number(new Decimal(String(number)).toFixed(decimals, 4));
        };

        if (angular.isDefined($scope.model)) {
          $scope.internalModel = roundN((angular.copy($scope.model) * 100), 6);
        } else {
          $scope.internalModel = "0";
          $scope.model = 0;
        }

        $scope.change = function () {
          if ($scope.internalModel) {
            $scope.internalModel = String($scope.internalModel).replace(',', '.');
            if (parseFloat($scope.internalModel) > 100) $scope.internalModel = 100;
            $scope.model = roundN(parseFloat($scope.internalModel) / 100, 6);
          } else {
            $scope.model = 0;
          }
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
        };

        $scope.keypress = function (event) {
          if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
            if ($scope.internalModel.indexOf(".") >= 0) {
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
          if (value_new) {
            $scope.internalModel = roundN(angular.copy($scope.model) * 100, 6);
          }
        });

        $scope.$watch('internalModel', function (value_new, value_old) {
          if (!$scope.internalModel) {
            $scope.internalModel = "0";
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePill
 * @description
 * # nicePill
 */
angular.module('niceElements')
  .directive('nicePill', function () {
    return {
      templateUrl: 'src/components/nice-pill/nice-pill.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valueKey: '@',
        canDelete: '@',
        onDelete: '=?',
      },
      controller: function ($scope) {
        if (!$scope.valueKey) $scope.valueKey = "value";

        $scope.handleDelete = function () {
          $scope.onDelete($scope.model)
        }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePopup
 * @description
 * # nicePopup
 */
angular.module('niceElements')
  .directive('nicePopup', function () {
    return {
      templateUrl: 'src/components/nice-popup/nice-popup.html',
      restrict: 'E',
      transclude: {
        'target': '?nicePopupTarget',
        'content': '?nicePopupContent'
      },
      scope: {
        offsetDistance: '@', // distance, displaces the popper away from, or toward, the reference element in the direction of its placement
        offsetSkidding: '@', // skidding, displaces the popper along the reference element.
        placement: '@', // Describes the preferred placement of the popper
        strategy: '@',
        showArrow: '@',
        onChange: '&?',
      },
      controller: function ($scope, $element, $timeout) {
        $scope.isOpen = false;
        if (!$scope.showArrow) { $scope.showArrow = false; }
        if (!$scope.offsetDistance && $scope.showArrow) { $scope.offsetDistance = 8; }
        if (!$scope.offsetDistance) { $scope.offsetDistance = 5; }
        if (!$scope.offsetSkidding) { $scope.offsetSkidding = 0; }
        if (!$scope.placement) { $scope.placement = "auto"; }
        if (!$scope.strategy) { $scope.strategy = "fixed"; }

        // Placements
        // [
        //   'auto',
        //   'auto-start',
        //   'auto-end',
        //   'top',
        //   'top-start',
        //   'top-end',
        //   'bottom',
        //   'bottom-start',
        //   'bottom-end',
        //   'right',
        //   'right-start',
        //   'right-end',
        //   'left',
        //   'left-start',
        //   'left-end'
        // ]

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var target = $element[0].getElementsByClassName('nice-popup-target')[0];
          var content = $element[0].getElementsByClassName('nice-popup-content')[0];
          $scope.popper = Popper.createPopper(target, content, {
            placement: $scope.placement,
            strategy: $scope.strategy,
            scroll: true,
            resize: true,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [$scope.offsetSkidding, $scope.offsetDistance],
                },
              },
              {
                name: 'arrow',
                options: {
                  padding: 5, // 5px from the edges of the popper
                },
              },
              // {
              //   name: "sameWidth",
              //   enabled: true,
              //   phase: "beforeWrite",
              //   requires: ["computeStyles"],
              //   fn: function (e) {
              //     var state = e.state;
              //     state.styles.popper.width = state.rects.reference.width + "px";
              //   },
              //   effect: function (e) {
              //     var state = e.state;
              //     state.elements.popper.style.width = state.elements.reference.offsetWidth + "px";
              //   }
              // }
            ],
          });
        };

        $timeout(function () {
          $scope.setupPopper();
        });

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
          if ($scope.onChange) $scope.onChange($scope.isOpen);
        };

        $scope.open = function () {
          $scope.popper.update();
          $scope.isOpen = true;
          if ($scope.onChange) $scope.onChange($scope.isOpen);
          $timeout(function () {
            $scope.popper.update();
          });
        };
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
  .directive('niceProgressBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/components/nice-progress-bar/nice-progress-bar.html',
      scope: {
        title: '@',
        noMargin: '@',
        value: '=',
        max: '=',
        color: '=',
        isInline: '=',
        help: '@'
      },

      controller: function ($scope, $element, $timeout) {
        $scope.width = 0;
        $scope.resize = function () {
          $timeout(function () {
            $scope.width = $element[0].getElementsByClassName("progress")[0].offsetWidth;
          }, 100);
        };
        window.onresize = function () {
          $scope.resize();
        };
        $scope.resize();



        $scope.$watch("value", function (valueNew, valueOld) {
          $scope.calculate();
        });

        $scope.$watch("max", function (valueNew, valueOld) {
          $scope.calculate();
        });

        $scope.calculate = function () {
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
        min: '=?',
        max: '=?',
        onChange: '&?',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        isDisabled: '=',
        isInline: '=',
        help: '@',
      },
      controller: function ($scope) {
        $scope.min = Number($scope.min) || 0;
        $scope.max = Number($scope.max) || Infinity;
        if (!$scope.model) $scope.model = Number($scope.min);

        $scope.add = function () {
          $scope.model += 1;
          $scope.handleChange();
        };

        $scope.sub = function () {
          $scope.model -= 1;
          $scope.handleChange();
        };

        $scope.handleChange = function () {
          if ($scope.model != undefined) {
            $scope.model = Number($scope.model);
            if ($scope.model < $scope.min) $scope.model = angular.copy($scope.min);
            if ($scope.model > $scope.max) $scope.model = angular.copy($scope.max);
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          } else {
            $scope.model = angular.copy($scope.min);
            $scope.handleChange();
          }
        };
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
        required: '=',
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
        isFocused: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
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
        scope.$watch("setText", function () {
          scope.modelString = scope.setText;
        });

        // Check if object is defined
        if (angular.isDefined(scope.model)) {
          if (angular.isDefined(scope.keyForInputLabel))
            scope.modelString = scope.model[scope.keyForInputLabel];
          else
            scope.modelString = scope.model;
        }

        var setValid = function (isValid) {
          if (scope.required && scope.form) {
            scope.form.$setValidity('objectSelected', isValid);
          }
        };

        scope.$watch('model', function (newValue) {
          if (scope.model && scope.model.id) {
            setValid(true);
          } else {
            setValid(false);
          }
        });

        scope.selectRow = function (obj) {
          if (angular.isDefined(scope.refreshSelectedCallback)) {
            scope.refreshSelectedCallback(obj);
          }

          if (scope.resetSearchInput) {
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

        scope.clear = function () {
          scope.results = [];

          if (scope.clearInput) {
            scope.modelString = "";
          }

          //scope.$apply();
        };

        // Close the dropdown if clicked outside
        var onClick = function (event) {
          var isClickedElementChildOfPopup = element.find(event.target).length > 0;

          if (isClickedElementChildOfPopup) return;

          scope.results = [];
          scope.noResults = false;
          scope.$apply();
        };

        angular.element(element).on('click', onClick);

        // Keyboard up/down on search results
        var onKeyDown = function (event) {
          if ((event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27) && scope.results && scope.results.length > 0) {
            event.preventDefault();

            if (event.keyCode == 27) { // Escape
              scope.modelString = "";
              scope.clear();
            }

            if (event.keyCode == 13) { // Enter
              scope.selectRow(scope.results[scope.selectedIndex]);
            }

            if (event.keyCode == 40 && scope.results && scope.selectedIndex + 1 < scope.results.length) { // Down
              scope.selectedIndex += 1;
            }

            if (event.keyCode == 38 && scope.results && scope.selectedIndex - 1 >= 0) { // Up
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
      controller: function ($scope, $timeout, $element) {
        $scope.id = Math.random().toString(36).substring(7);
        $scope.loading = false;
        $scope.noResults = false;
        $scope.requests = 0;

        $scope.focus = function () {
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
        var updateList = function (results, requestNumber) {

          if (results) {
            if ($scope.requests == requestNumber) {
              $scope.noResults = results.length == 0;
              $scope.results = results;

              if (!$scope.noResults) {
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

          $scope.timer_promise = $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: $scope.model, modelString: $scope.modelString });
            $scope.requests = $scope.requests + 1;
            var requestNumber = angular.copy($scope.requests);
            $scope.refreshFunction($scope.modelString).then(function (response) {
              updateList(response, requestNumber);
            }, function (error) {
              $scope.loading = false;
            });
            // Why was this here?
            // $scope.model = $scope.modelString;
          }, 200);

        };

        // If search button is clicked set focus or make request
        $scope.search = function () {
          if (!$scope.isDisabled) {
            if ($scope.showDropdown) {
              $scope.updateSearch();
            }
            $scope.focus();
          }
        };

        // Clear model
        $scope.remove = function () {
          $scope.model = null;
          $scope.modelString = null;
        }
      }
    }
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSearch2
 * @description
 * # niceSearch2
 */
angular.module('niceElements')
  .directive('niceSearch2', function () {
    return {
      transclude: true,
      templateUrl: 'src/components/nice-search2/nice-search2.html',
      restrict: 'E',
      scope: {
        model: '=',
        isDisabled: '=',
        showDropdown: '=',
        title: '@?',
        placeholder: '@',
        fieldWidth: '@',
        labelWidth: '@',
        refreshFunction: '=',
        refreshSelectedCallback: '=',
        onSelect: '=',
        onChange: '&?',
        noMargin: '@',
        tabIndex: '@',
        keyForInputLabel: '@',
        debounceTime: '@',
        isInline: '=',
        help: '@'
      },
      controller: function ($scope, $timeout, $element) {
        $scope.loading = false;
        $scope.isOpen = false;
        $scope.debounce = null;
        $scope.results = [];
        $scope.noResults = false;
        $scope.selectedIndex = 0;
        $scope.requestNumber = 0;

        if (!$scope.debounceTime) $scope.debounceTime = 500;
        if (!$scope.model) $scope.model = "";

        // Setup popper
        // https://popper.js.org/docs/v2/constructors/
        $scope.setupPopper = function () {
          var button = $element[0].getElementsByClassName('nice-search-button')[0];
          var tooltip = $element[0].getElementsByClassName('nice-search-dropdown-wrapper')[0];
          $scope.popper = Popper.createPopper(button, tooltip, {
            strategy: 'fixed',
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 5],
                },
              },
              {
                name: "sameWidth",
                enabled: true,
                phase: "beforeWrite",
                requires: ["computeStyles"],
                fn: function (e) {
                  var state = e.state;
                  state.styles.popper.width = state.rects.reference.width + "px";
                },
                effect: function (e) {
                  var state = e.state;
                  state.elements.popper.style.width = state.elements.reference.offsetWidth + "px";
                }
              }
            ],
          });
        };

        $timeout(function () {
          $scope.setupPopper();
        });


        // ------------------- On focus -------------------
        $scope.onFocus = function () {
          if ($scope.showDropdown && $scope.results.length == 0) {
            $scope.getData($scope.model);
          }

          $scope.open();

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.focus();
        };


        // ------------------- On blur -------------------
        $scope.onBlur = function () {
          $scope.close();
        };


        // ------------------- On focus -------------------
        $scope.open = function () {
          $scope.isOpen = true;
          $timeout(function () {
            if ($scope.popper) $scope.popper.update();
          });
        };


        // ------------------- On blur -------------------
        $scope.close = function () {
          $scope.isOpen = false;

          var input = $element[0].getElementsByTagName('input')[0];
          if (input) input.blur();

          $timeout(function () {
            $scope.popper.update();
          })
        };


        // ------------------- Update search -------------------
        $scope.updateSearch = function () {
          if ($scope.debounce) {
            $timeout.cancel($scope.debounce);
          }

          $scope.debounce = $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
            $scope.getData($scope.model);
          }, $scope.debounceTime);
        };


        // ------------------- Get data -------------------
        $scope.getData = function (keywords) {
          if ($scope.refreshFunction != null) {
            $scope.loading = true;
            $scope.requestNumber += 1;
            var requestNumber = angular.copy($scope.requestNumber);
            $scope.refreshFunction(keywords).then(function (results) {
              if ($scope.requestNumber == requestNumber) {
                $timeout(function () {
                  $scope.open();
                  $scope.loading = false;

                  $scope.noResults = results.length == 0;
                  $scope.results = results;

                  if (!$scope.noResults) {
                    $scope.selectedIndex = 0;
                  }
                });
              }
            }, function (error) {
              $scope.loading = false;
              $scope.close();
            });
          } else {
            $scope.loading = false;
            // $scope.close();
          }
        };

        // ------------------------ Button clicked ------------------------
        $scope.buttonClicked = function () {
          if (!$scope.loading && $scope.model != '') $scope.clear();
          if (!$scope.loading && $scope.model == '') $scope.onFocus();
        }

        // ------------------------ If search button is clicked set focus or make request ------------------------
        $scope.search = function () {
          if (!$scope.isDisabled) {
            if ($scope.showDropdown) {
              $scope.updateSearch();
            }
            $scope.focus();
          }
        };


        // ------------------------ Clear search ------------------------
        $scope.clear = function () {
          $scope.model = "";
          $timeout(function () {
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          });
        };


        // ------------------------ Select item ------------------------
        $scope.selectItem = function (item) {
          if ($scope.onSelect) {
            $scope.onSelect(item);
            $scope.clear();
            $scope.close();
          }
        };


        // ----------------------------------- Scroll to hover -----------------------------------
        $scope.scrollToHover = function (notSmooth) {
          var dropdownMenu = $element[0].getElementsByClassName("nice-dropdown")[0];
          var hoverItem = dropdownMenu.getElementsByClassName("active")[0];
          if (hoverItem) {
            var topPos = hoverItem.offsetTop;
            dropdownMenu.scroll({
              top: topPos - 120,
              left: 0,
              behavior: notSmooth ? 'auto' : 'smooth'
            });
          }
        };


        // ----------------------------------- Watch for keydown and keypress -----------------------------------
        $element.bind("keydown keypress", function (event) {
          // Arrow Up
          if (event.keyCode == 38) {
            event.preventDefault();
            $timeout(function () {
              if ($scope.selectedIndex > 0) {
                $scope.selectedIndex -= 1;
                $timeout(function () {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Arrow Down
          if (event.keyCode == 40) {
            event.preventDefault();
            $timeout(function () {
              if ($scope.results && $scope.selectedIndex < $scope.results.length - 1) {
                $scope.selectedIndex += 1;
                $timeout(function () {
                  $scope.scrollToHover();
                });
              }
            });
          }

          // Enter
          if (event.keyCode == 13) {
            event.preventDefault();
            $timeout(function () {
              $scope.selectItem($scope.results[$scope.selectedIndex], $scope.selectedIndex);
            });
          }

          // Escape
          if (event.keyCode == 27) {
            $timeout(function () {
              $scope.close();
            });
          }
        });
      }
    }
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSlot
 * @description
 * # niceSlot
 */
angular.module('niceElements')
  .directive('niceSlot', function () {
    return {
      templateUrl: 'src/components/nice-slot/nice-slot.html',
      restrict: 'E',
      transclude: true,
      scope: {
        fieldWidth: '@',
        labelWidth: '@',
        title: '@',
        noMargin: '@',
        isInline: '=',
        help: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.title) { attrs.title = ' '; }
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSvgs
 * @description
 * # niceSvgs
 */
angular.module('niceElements')
  .directive('niceSvgs', function () {
    return {
      templateUrl: 'src/components/nice-svgs/nice-svgs.html',
      restrict: 'E',
      transclude: true
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTimePicker
 * @description
 * # niceTimePicker
 */
angular.module('niceElements')
  .directive('niceTimePicker', function () {
    return {
      scope: {
        model: '=',
        title: '@',
        isDisabled: '=',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        onChange: '&?',
        isInline: '=',
        help: '@'
      },
      restrict: 'E',
      templateUrl: 'src/components/nice-time-picker/nice-time-picker.html',
      link: function ($scope, $element, $attrs) {
        if (!$scope.model) $scope.model = moment();
        $scope.open = false;


        $scope.close = function () {
          $scope.open = false;
        };


        $scope.validateDate = function () {
          $scope.checkDate($scope.modelString);
        };


        $scope.checkDate = function (date) {
          var parsedDate = moment(date, "HH:mm");
          if (parsedDate.isValid()) {
            if ($scope.forma) $scope.forma.$setValidity("valid-time", true);
            $scope.model = parsedDate;
            $scope.refreshTime();
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          } else {
            if ($scope.forma) $scope.forma.$setValidity("valid-time", false);
            $scope.modelString = "";
          }
        };


        $scope.refreshTime = function () {
          $scope.hours = $scope.model.format("HH");
          $scope.minutes = $scope.model.format("mm");
          $scope.modelString = $scope.model.format("HH:mm");
        };


        $scope.changeHour = function (add) {
          if (add) $scope.model.add(1, 'hour');
          else $scope.model.subtract(1, 'hour');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };

        $scope.changeMinutes = function (add) {
          if (add) $scope.model.add(1, 'minutes');
          else $scope.model.subtract(1, 'minutes');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };


        $scope.$watch("model", function (value, oldValue) {
          $scope.refreshTime();
          if (!value.isSame(oldValue)) {
            $scope.checkDate(value);
          }
        })
      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTitle
 * @description
 * # niceTitle
 */
angular.module('niceElements')
  .directive('niceTitle', function () {
    return {
      templateUrl: 'src/components/nice-title/nice-title.html',
      restrict: 'E',
      scope: {
        labelWidth: '=?',
        text: '=?',
        required: '=?',
        help: '=?'
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceToast
 * @description
 * # niceToast
 */
angular.module('niceElements')
  .directive("niceToast", function () {
    return {
      restrict: "E",
      templateUrl: "src/components/nice-toast/nice-toast.html",
      scope: {
        position: '@',
        timeoutTime: '@',
      },
      controller: function ($scope, $timeout) {
        if (!$scope.position) $scope.position = "bottom center";
        if (!$scope.timeoutTime) $scope.timeoutTime = 2000;
        $scope.toasts = [];

        // -------------------------- Watch for events --------------------------
        $scope.$on('toast', function (e, message, type) {
          $scope.createToast(message, type);
        });


        // -------------------------- Create toast --------------------------
        $scope.createToast = function (message, type) {
          // Create new toast
          var toast = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            message: message,
            type: type || "default"
          };

          // Append toast
          $scope.toasts.push(toast);

          // Remove after some time
          $timeout(function () {
            $scope.removeToast(toast);
          }, $scope.timeoutTime);
        };


        // -------------------------- Remove toast --------------------------
        $scope.removeToast = function (toast) {
          var toastIndex = $scope.toasts.findIndex(function (a) { return a.id == toast.id })
          if (toastIndex >= 0) {
            $scope.toasts.splice(toastIndex, 1);
          }
        }
      }
    };
  });
'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTooltip
 * @description
 * # niceTooltip
 */
angular.module('niceElements')
  .directive('niceTooltip', function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.addClass("nice-tooltip");

        var tooltipWindow = document.createElement('span')
        tooltipWindow.className = 'nice-tooltip-window';
        tooltipWindow.innerHTML = attrs.niceTooltip;

        element.append(tooltipWindow);
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
  .directive('niceUpload', function ($timeout, gettextCatalog) {
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
        callbackUrl: '=',
        isDisabled: '=',
        isInline: '=',
        help: '@',
        maxFileSize: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.text) { attrs.text = gettextCatalog.getString('Click to upload file', null, 'Nice'); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.maxFileSize) scope.maxFileSize = 1; // 1MB
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        scope.startDragging = function () { $timeout(function () { scope.dragging = true; }); }
        scope.endDragging = function () { $timeout(function () { scope.dragging = false; }); }
        scope.startDraggingGlobal = function () { $timeout(function () { scope.draggingGlobal = true; }); }
        scope.endDraggingGlobal = function () { $timeout(function () { scope.dragging = false; scope.draggingGlobal = false; }); }

        scope.dragging = false;
        scope.draggingGlobal = false;
        var inputElement = element[0].querySelector(".input-file");
        // document.addEventListener("dragenter", scope.startDraggingGlobal);
        // document.addEventListener("drop", scope.endDraggingGlobal);
        // document.addEventListener("dragend", scope.endDraggingGlobal);
        // document.addEventListener("mouseleave", scope.endDraggingGlobal);
        // document.addEventListener("dragleave", scope.endDragging);
        inputElement.addEventListener("dragenter", scope.startDragging);
        inputElement.addEventListener("dragleave", scope.endDragging);
        inputElement.addEventListener("dragend", scope.endDraggingGlobal);
        inputElement.addEventListener("drop", scope.endDraggingGlobal);

        scope.$on('$destroy', function () {
          // document.removeEventListener("dragenter", scope.startDraggingGlobal);
          // document.removeEventListener("drop", scope.endDraggingGlobal);
          // document.removeEventListener("dragend", scope.endDraggingGlobal);
          // document.removeEventListener("mouseleave", scope.endDraggingGlobal);
          // document.removeEventListener("dragleave", scope.endDraggingGlobal);
          inputElement.removeEventListener("dragenter", scope.startDragging);
          inputElement.removeEventListener("dragleave", scope.endDragging);
          inputElement.removeEventListener("dragend", scope.endDraggingGlobal);
          inputElement.removeEventListener("drop", scope.endDraggingGlobal);
        });


        element.bind("change", function (changeEvent) {
          if (scope.callbackUrl != undefined) {
            scope.callbackUrl(URL.createObjectURL(changeEvent.target.files[0]));
          }

          $timeout(function () {
            scope.loading = true;
            scope.error = null;
            var inputObj = changeEvent.target;
            var reader = new FileReader();

            if (inputObj.files) {
              try {
                var fileSize = inputObj.files[0].size; // in bytes

                reader.onload = function (event) {
                  $timeout(function () {
                    // file size must be smaller than XMB.
                    if (fileSize > (scope.maxFileSize * 1000000)) {
                      scope.error = gettextCatalog.getString("File must be smaller than {{size}}MB", { size: scope.maxFileSize }, "Nice");
                      scope.loading = false;
                      scope.imageSource = null;
                      return;
                    }

                    if (scope.callbackFunction != undefined) {
                      scope.loading = false;
                      scope.imageSource = null;
                      scope.callbackFunction(event.target.result);
                      scope.text = inputObj.files[0].name;
                      scope.form.$setDirty();
                    }

                    if (scope.callbackFile != undefined) {
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
                      if (event.target.result.substring(0, 10) == "data:image") {
                        scope.imageSource = event.target.result;
                      }
                    }
                  });
                };

              } catch (err) {
                // Handle try catch
                scope.error = gettextCatalog.getString("Something went wrong", null, "Nice");
                scope.loading = false;
                scope.imageSource = null;
              }

              // when the file is read it triggers the onload event above.
              reader.readAsDataURL(inputObj.files[0]);

            }
          });

        });
      },

      controller: function ($scope) {
        $scope.$watch("model", function (value) {
          $scope.imageSource = angular.copy($scope.model);
        });
      }

    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceWrapper
 * @description
 * # niceWrapper
 */
angular.module('niceElements')
  .directive('niceWrapper', function () {
    return {
      templateUrl: 'src/components/nice-wrapper/nice-wrapper.html',
      restrict: 'E',
      replace: true,
      transclude: {
        'title': '?niceWrapperTitle',
        'subtitle': '?niceWrapperSubtitle',
        'footer': '?niceWrapperFooter'
      },
      scope: {
        title: '@',
        subtitle: '@',
        collapsable: '=',
        collapsed: '@',
        noPadding: '@',
        stickyHeader: '@',
        stickyFooter: '@',
      },
      controller: function ($scope, $transclude) {
        $scope.isOpen = true;
        if ($scope.collapsed) $scope.isOpen = false;
        $scope.hasTitle = $transclude.isSlotFilled('title');
        $scope.hasSubtitle = $transclude.isSlotFilled('subtitle');
        $scope.hasFooter = $transclude.isSlotFilled('footer');
        $scope.hasHeader = $scope.hasTitle || $scope.hasSubtitle || $scope.title || $scope.subtitle || $scope.collapsable;

        $scope.toggle = function () {
          if (!$scope.collapsable) return;
          $scope.isOpen = !$scope.isOpen;
        }
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
        noMargin: '@',
        onChange: '&?',
        isInline: '=',
        help: '@'
      },
      controller: function ($scope, gettextCatalog) {
        if (!$scope.yes) { $scope.yes = gettextCatalog.getString('Yes', null, "Nice"); }
        if (!$scope.no) { $scope.no = gettextCatalog.getString('No', null, "Nice"); }
        if (!$scope.title) { $scope.title = ''; }
        if (!$scope.fieldWidth) { $scope.fieldWidth = 'col-sm-8'; }
        if (!$scope.labelWidth) { $scope.labelWidth = 'col-sm-4'; }
        if (!angular.isDefined($scope.model) && !angular.isDefined($scope.options)) $scope.model = !angular.isDefined($scope.defaultFalse);
        if (!angular.isDefined($scope.modelValue) && angular.isDefined($scope.options)) $scope.modelValue = $scope.options[0];

        $scope.defaultFalse = angular.isDefined($scope.defaultFalse);
        $scope.noMargin = angular.isDefined($scope.noMargin);

        $scope.buttonClass = "";


        // ------------------------- Set overlay button position based on passed state in $scope.model -------------------------
        $scope.setButtonPosition = function (state) {
          if (state) {
            $scope.buttonClass = "yesno-button-yes";
          } else {
            $scope.buttonClass = "yesno-button-no";
          }
        };

        // ------------------------- Watch for changes from outside -------------------------
        $scope.$watch('model', function (value_new, value_old) {
          if (angular.isDefined($scope.model)) {
            $scope.setButtonLabel($scope.model);
            $scope.setButtonPosition($scope.model);
          }
        });

        // ------------------------- Watch for model value -------------------------
        $scope.$watch('modelValue', function (value_new, value_old) {
          if ($scope.options) {
            $scope.model = $scope.modelValue == $scope.options[0];
          }
        });

        // ------------------------- Set button label -------------------------
        $scope.setButtonLabel = function (state) {
          if (state) {
            $scope.state = $scope.yes;
          } else {
            $scope.state = $scope.no;
          }
        };

        // ------------------------- Set width -------------------------
        $scope.setWidth = function (width, el) {
          el.style.width = width;
        };


        // ------------------------- Switch -------------------------
        $scope.switch = function () {
          if (!$scope.isDisabled) {
            $scope.model = !$scope.model;

            if ($scope.options) {
              if ($scope.model) {
                $scope.modelValue = $scope.options[0];
              } else {
                $scope.modelValue = $scope.options[1];
              }
            }

            if ($scope.onChange) $scope.onChange({ model: $scope.model });
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

/**
 * @ngdoc date
 * @name niceElements.filter:niceDate
 * @function
 * @description
 * # niceDate
 * Filter in the niceElements.
 */
angular.module('niceElements').filter('niceDate', function () {
  return function (object, addTime, addSeconds) {
    var formatString = "D.M.YYYY";
    if (addTime) {
      formatString = "D.M.YYYY • H:mm";
      if (addSeconds) formatString += ":ss";
    }
    return moment(object).format(formatString);
  };
});
/**
 * @ngdoc date
 * @name niceElements.filter:niceHighlight
 * @function
 * @description
 * # niceHighlight
 * Filter in the niceElements.
 */
angular.module('niceElements').filter('niceHighlight', function () {
  return function (value, highlightedText) {
    if (!value) return "";
    var regex = new RegExp(highlightedText, 'gmi');
    var newValue = String(value).replace(regex, "<span class='nice-highligh'>$&</span>");
    return newValue;
  };
});

/**
 * @ngdoc date
 * @name niceElements.service:NiceService
 * @function
 * @description
 * # NiceService
 * Service in the niceElements.
 */
angular.module('niceElements')
  .service('NiceService', function () {
    var service = {
      name: "Nice elements",
      version: "1.9.7",
      getHeader: function () {
        return {};
      }
    };

    return service;
  })
angular.module('niceElements')
  .directive('niceMultilangualModal', function () {
    return {
      templateUrl: 'src/modals/nice-multilangual-modal/nice-multilangual-modal.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        callback: '=',
        dialog: '=',
        multilanguage: '=', // Multiple languages object
        multilanguageField: '@', // Multiple languages field name
      },

      controller: function ($scope, $timeout) {
        $scope.selector = {
          newLanguage: null
        };

        if (!$scope.multilanguage) $scope.multilanguage = {};
        if (!$scope.multilanguage[$scope.multilanguageField]) $scope.multilanguage[$scope.multilanguageField] = {};
        $scope.fields = angular.copy($scope.multilanguage[$scope.multilanguageField]);

        $scope.languages = [
          { id: 'sl', value: "Slovenščina" },
          { id: 'en', value: "English" },
          { id: 'de', value: "Deutsch" },
          { id: 'it', value: "Italiano" },
          { id: 'fr', value: "Français" },
        ];
        $scope.languagesMap = {};
        angular.forEach($scope.languages, function (l) { $scope.languagesMap[l.id] = l.value; })


        $scope.filterLanguages = function (list) {
          return _.filter(list, function (l) { return !Object.keys($scope.fields).includes(l.id); })
        };

        $scope.addLanguage = function () {
          if (!$scope.selector.newLanguage) return;
          $scope.fields[$scope.selector.newLanguage.id] = "";
          $scope.selector.newLanguage = null;
          $scope.hide = true;
          $timeout(function () {
            $scope.hide = false;
          })
        }

        $scope.removeLanguage = function (key) {
          delete $scope.fields[key];
          $scope.hide = true;
          $timeout(function () {
            $scope.hide = false;
          })
        }

        $scope.save = function () {
          $scope.callback($scope.fields);
          $scope.dialog.close();
        }

        $scope.close = function () {
          $scope.dialog.close();
        }
      }
    };
  });

angular.module('niceElements').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('src/components/nice-button-toggle/nice-button-toggle.html',
    "<div class=\"nice-component nice-button-toggle row\">\n" +
    "<div class=\"col-xs-offset-4 col-xs-8\">\n" +
    "<button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"model = !model\">\n" +
    "<span>{{ label }}</span>\n" +
    "<span ng-show=\"!model\" class=\"glyphicon glyphicon-menu-down\"></span>\n" +
    "<span ng-show=\"model\" class=\"glyphicon glyphicon-menu-up\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/nice-button/nice-button.html',
    "<button type=\"{{ type }}\" class=\"nice-component nice-button btn btn-primary\" ng-class=\"{ 'margin-bottom-0' : noMargin }\" ng-click=\"click()\" ng-disabled=\"niceDisabled == true\">\n" +
    "<nice-icon icon=\"{{ icon }}\" ng-if=\"icon\" ng-class=\"{ 'opacity-0': loading }\"></nice-icon>\n" +
    "<span ng-if=\"showSlot\" ng-transclude ng-class=\"{ 'opacity-0': loading }\"></span>\n" +
    "<nice-loader ng-if=\"loading\" fulldiv=\"true\" class=\"nice-button-loader\"></nice-loader>\n" +
    "</button>"
  );


  $templateCache.put('src/components/nice-calendar/nice-calendar.html',
    "<div class=\"nice-component nice-calendar\" ng-form=\"formCalendar\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"disabled-shield\" ng-if=\"isDisabled\"></div>\n" +
    "<div class=\"nice-calendar-wrapper\">\n" +
    "<div class=\"nice-calendar-weeks\">\n" +
    "<div class=\"header\">\n" +
    "<button class=\"btn\" type=\"button\" ng-click=\"previous()\" title=\"{{ 'Previous month' | translate:'Nice' }}\" ng-disabled=\"isDisabled\"><i class=\"fa fa-angle-left\"></i></button>\n" +
    "<span title=\"{{ month.format('M.YYYY' )}}\">{{ month.format(\"MMMM, YYYY\" )}}</span>\n" +
    "<button class=\"btn\" type=\"button\" ng-click=\"next()\" title=\"{{ 'Next month' | translate:'Nice' }}\" ng-disabled=\"isDisabled\"><i class=\"fa fa-angle-right\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"week names\">\n" +
    "<span class=\"day\" translate translate-context=\"Nice\">Mon</span>\n" +
    "<span class=\"day\" translate translate-context=\"Nice\">Tue</span>\n" +
    "<span class=\"day\" translate translate-context=\"Nice\">Wed</span>\n" +
    "<span class=\"day\" translate translate-context=\"Nice\">Thu</span>\n" +
    "<span class=\"day\" translate translate-context=\"Nice\">Fri</span>\n" +
    "<span class=\"day weekend\" translate translate-context=\"Nice\">Sat</span>\n" +
    "<span class=\"day weekend\" translate translate-context=\"Nice\">Sun</span>\n" +
    "</div>\n" +
    "<div class=\"week\" ng-repeat=\"week in weeks\">\n" +
    "<button class=\"day\" type=\"button\" title=\"{{ day.date.format('D.M.YYYY') }}\" ng-class=\"{\n" +
    "                                today: day.isToday,\n" +
    "                                'different-month': !day.isCurrentMonth,\n" +
    "                                'start-selected': isSameDay(day.date, startDate),\n" +
    "                                'end-selected': isSameDay(day.date, endDate),\n" +
    "                                'selected': isBetweenRange(day.date),\n" +
    "                                'selecting-start': selectStart,\n" +
    "                                'selecting-end': !selectStart,\n" +
    "                                'weekend': day.isWeekday,\n" +
    "                                'disabled': day.isDisabled\n" +
    "                            }\" ng-style=\"\n" +
    "                                (color && isBetweenRange(day.date)) && {'background-color': lighten(color) } ||\n" +
    "                                (color && isSameDay(day.date, startDate)) && {'background-color': color } ||\n" +
    "                                (color && isSameDay(day.date, endDate)) && {'background-color': color }\n" +
    "                            \" ng-click=\"select(day)\" ng-repeat=\"day in week.days\" ng-disabled=\"isDisabled\">\n" +
    "{{ day.number }}\n" +
    "<p class=\"popup\" ng-if=\"!hideHover\">{{ popupText }}</p>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"nice-calendar-time\" ng-if=\"time\">\n" +
    "<div class=\"time-picker\">\n" +
    "<select title=\"{{ 'Select start time' | translate:'Nice' }}\" class=\"time-picker-hour\" ng-model=\"startDateHour\" ng-change=\"startHourChange(startDateHour)\" ng-options=\"hour for hour in hours\" ng-disabled=\"isDisabled\">\n" +
    "</select>\n" +
    "</div>\n" +
    "<div class=\"time-picker\">\n" +
    "<select title=\"{{ 'Select start time' | translate:'Nice' }}\" class=\"time-picker-minute\" ng-model=\"startDateMinute\" ng-change=\"startMinuteChange(startDateMinute)\" ng-options=\"minute for minute in minutes\" ng-disabled=\"isDisabled\">\n" +
    "</select>\n" +
    "</div>\n" +
    "<div class=\"time-picker-icon\">\n" +
    "<nice-icon icon=\"icon-clock\"></nice-icon>\n" +
    "</div>\n" +
    "<div class=\"time-picker\">\n" +
    "<select title=\"{{ 'Select end time' | translate:'Nice' }}\" class=\"time-picker-hour\" ng-model=\"endDateHour\" ng-change=\"endHourChange(endDateHour)\" ng-options=\"hour for hour in hours\" ng-disabled=\"isDisabled\">\n" +
    "</select>\n" +
    "</div>\n" +
    "<div class=\"time-picker no-border-right\">\n" +
    "<select title=\"{{ 'Select end time' | translate:'Nice' }}\" class=\"time-picker-minute\" ng-model=\"endDateMinute\" ng-change=\"endMinuteChange(endDateMinute)\" ng-options=\"minute for minute in minutes\" ng-disabled=\"isDisabled\">\n" +
    "</select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"nice-selected-dates\">\n" +
    "<div class=\"nice-start-date\">\n" +
    "<label translate translate-context=\"Nice\">Start</label>\n" +
    "<div ng-class=\"startTimeClass\">{{ formatDate(startDate) }}</div>\n" +
    "</div>\n" +
    "<div class=\"nice-end-date\">\n" +
    "<label translate translate-context=\"Nice\">End</label>\n" +
    "<div ng-class=\"endTimeClass\">{{ formatDate(endDate) }}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-checkbox/nice-checkbox.html',
    "<div class=\"nice-component nice-checkbox\" ng-class=\"{ 'checked': model, 'margin-bottom-0' : noMargin, 'nice-checkbox-disabled': isDisabled }\" ng-click=\"toggle()\">\n" +
    "<button class=\"btn checkbox\" type=\"button\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon class=\"check\" icon=\"icon-check\"></nice-icon>\n" +
    "</button>\n" +
    "<div ng-if=\"title\" class=\"message\" ng-class=\"{ 'nice-disabled': isDisabled }\">{{ title }}</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-choice/nice-choice.html',
    "<div class=\"nice-component nice-choice\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" ng-form=\"formChoice\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<ul class=\"list-unstyled\" ng-class=\"{ 'disabled': isDisabled }\">\n" +
    "<li ng-repeat=\"item in internalList\" ng-class=\"{ 'selected' : isItemSelected(item) }\" ng-click=\"toggle(item)\">\n" +
    "<button class=\"choice-checkbox\" type=\"button\" ng-class=\"{'circle' : !multiple }\" ng-mouseenter=\"itemHover($event, item)\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon ng-if=\"multiple\" icon=\"icon-check\"></nice-icon>\n" +
    "<div ng-if=\"!multiple\" class=\"multiple-circle\"></div>\n" +
    "</button>\n" +
    "<div ng-transclude class=\"choice-label\">{{ getLabel(item) }}</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-comment/nice-comment.html',
    "<div class=\"nice-component nice-comment\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\" ng-click=\"edit()\">\n" +
    "<textarea ng-class=\"{'editing': editing}\" class=\"form-control\" ng-model=\"model\" placeholder=\"{{placeholder}}\" rows=\"{{rows}}\" ng-blur=\"save()\" ng-disabled=\"isDisabled\"></textarea>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-date-input/nice-date-input.html',
    "<div class=\"nice-component nice-date-input\" ng-form=\"niceDateInputForm\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline, 'error': niceDateInputForm.$invalid }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"input-group nice-date-input\" ng-show=\"date\" ng-class=\"{ 'has-warning': !disabled && niceDateInputForm.$invalid && niceDateInputForm.$dirty }\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"modelDate\" ng-blur=\"dateBlur($event)\" ng-disabled=\"isDisabled\">\n" +
    "<nice-popup placement=\"bottom\">\n" +
    "<nice-popup-target>\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" type=\"button\" tabindex=\"-1\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon icon=\"icon-calendar\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</nice-popup-target>\n" +
    "<nice-popup-content>\n" +
    "<nice-date is-inline=\"true\" inline=\"true\" model=\"inner.dateModel\" on-change=\"dateChanged()\" no-margin=\"true\" is-disabled=\"isDisabled\"></nice-date>\n" +
    "</nice-popup-content>\n" +
    "</nice-popup>\n" +
    "</div>\n" +
    "<div class=\"input-group nice-time-input\" ng-show=\"time\" ng-class=\"{ 'has-warning': !disabled && niceDateInputForm.$invalid && niceDateInputForm.$dirty }\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"modelTime\" ng-blur=\"timeBlur($event)\" ng-disabled=\"isDisabled\">\n" +
    "<nice-popup placement=\"bottom\">\n" +
    "<nice-popup-target>\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" type=\"button\" tabindex=\"-1\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon icon=\"icon-clock\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</nice-popup-target>\n" +
    "<nice-popup-content>\n" +
    "<nice-date is-inline=\"true\" inline=\"true\" model=\"inner.timeModel\" on-change=\"timeChanged()\" time=\"true\" date=\"false\" no-margin=\"true\" is-disabled=\"isDisabled\"></nice-date>\n" +
    "</nice-popup-content>\n" +
    "</nice-popup>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-date-range/nice-date-range.html',
    "<ng-form class=\"nice-component nice-date-range\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" name=\"form\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"input-group\">\n" +
    "<input date-range-picker class=\"form-control date-picker\" type=\"text\" options=\"opts\" ng-model=\"model\">\n" +
    "<span date-range-picker options=\"opts\" ng-model=\"model\" class=\"input-group-addon\">\n" +
    "<nice-icon icon=\"icon-calendar\"></nice-icon>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-date/nice-date.html',
    "<div class=\"nice-component nice-date\" ng-form=\"forma\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"nice-date-background\" ng-click=\"toggleOpen()\" ng-if=\"isOpen && !inline\"></div>\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"disabled-shield\" ng-if=\"isDisabled\"></div>\n" +
    "<div class=\"nice-date-button input-group\" ng-class=\"{ 'open': isOpen }\" ng-show=\"!inline\" ng-click=\"toggleOpen()\">\n" +
    "<input type=\"text\" class=\"form-control\" value=\"{{ model | niceDate:time }}\" readonly=\"readonly\" ng-disabled=\"isDisabled\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon icon=\"icon-calendar\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-class=\"{ 'nice-date-dropdown-wrapper': !inline }\">\n" +
    "<div ng-class=\"{ 'nice-date-dropdown': !inline, 'with-time': time, 'no-date': !date }\" ng-if=\"inline || isOpen\">\n" +
    "<div class=\"nice-date-date\" ng-if=\"date\" role=\"grid\">\n" +
    "<div class=\"nice-date-header\">\n" +
    "<span>\n" +
    "<select class=\"year-picker\" ng-model=\"innerDate.year\" ng-change=\"handleDateChange()\" ng-options=\"year for year in years\" ng-disabled=\"isDisabled\">\n" +
    "</select>,\n" +
    "<select class=\"month-picker\" ng-model=\"innerDate.month\" ng-change=\"handleDateChange()\" ng-options=\"month.value as month.name for month in months\" ng-disabled=\"isDisabled\">\n" +
    "</select>\n" +
    "</span>\n" +
    "<button class=\"btn btn-default-naked\" type=\"button\" ng-disabled=\"isDisabled\" ng-click=\"previous()\"><i class=\"fa fa-angle-left\"></i></button>\n" +
    "<button class=\"btn btn-default-naked\" type=\"button\" ng-disabled=\"isDisabled\" ng-click=\"today()\"><i class=\"fa fa-circle\"></i></button>\n" +
    "<button class=\"btn btn-default-naked\" type=\"button\" ng-disabled=\"isDisabled\" ng-click=\"next()\"><i class=\"fa fa-angle-right\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"nice-date-week names\">\n" +
    "<span class=\"nice-date-day\" ng-class=\"{ 'weekend': $index == 6 || $index == 5 }\" ng-repeat=\"day in weekdays\">{{ day }}</span>\n" +
    "</div>\n" +
    "<div class=\"nice-date-week\" role=\"row\" ng-repeat=\"week in weeks\">\n" +
    "<button class=\"nice-date-day\" type=\"button\" role=\"gridcell\" title=\"{{ day.value }}\" ng-class=\"{\n" +
    "                                    'today': day.isToday,\n" +
    "                                    'different-month': !day.isCurrentMonth,\n" +
    "                                    'selected': isSameDay(model, day.date),\n" +
    "                                    'weekend': day.isWeekday,\n" +
    "                                    'disabled': day.isDisabled,\n" +
    "                                    'between': isBetween(day.date, model, nextDate)\n" +
    "                                }\" ng-click=\"select(day)\" ng-repeat=\"day in week.days\" ng-disabled=\"isDisabled\">\n" +
    "{{ day.number }}\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"nice-date-time\" ng-if=\"time\">\n" +
    "<nice-icon icon=\"icon-clock\"></nice-icon>\n" +
    "<div class=\"time-picker time-picker-hour\">\n" +
    "<select ng-disabled=\"isDisabled\" ng-model=\"innerDate.hour\" ng-change=\"timeChange()\" ng-options=\"hour as hour for hour in hours track by hour\" ng-disabled=\"isDisabled\"></select>\n" +
    "</div>\n" +
    "<div class=\"divider\">:</div>\n" +
    "<div class=\"time-picker time-picker-minute\">\n" +
    "<select ng-disabled=\"isDisabled\" ng-model=\"innerDate.minute\" ng-change=\"timeChange()\" ng-options=\"minute as minute for minute in minutes track by minute\" ng-disabled=\"isDisabled\"></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-datetime-picker/nice-datetime-picker.html',
    "<div class=\"nice-component nice-datetime-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline  }\">\n" +
    "<div class=\"nice-dtp-background\" ng-click=\"closeDtp(true)\" ng-if=\"isOpen\"></div>\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div ng-form=\"formDatetimePicker\"></div>\n" +
    "<div class=\"input-group\" id=\"dropdown{{randNum}}\">\n" +
    "<input type=\"text\" class=\"form-control\" value=\"{{ value }}\" ng-click=\"openDtp()\" ng-disabled=\"isDisabled\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default\" ng-click=\"openDtp()\">\n" +
    "<nice-icon ng-if=\"date == 'true'\" icon=\"icon-calendar\"></nice-icon>\n" +
    "<nice-icon ng-if=\"date != 'true'\" icon=\"icon-clock\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-show=\"isOpen\">\n" +
    "<nice-dtp model=\"internalDate\" format=\"{{ format }}\" model-format=\"{{ modelFormat }}\" date=\"{{ date == 'true' }}\" time=\"{{ time == 'true' }}\" width=\"{{ width }}\" enable-ok-buttons=\"{{ enableOkButtons }}\" lang=\"{{ lang }}\" min-date=\"{{ minDate }}\" max-date=\"{{ maxDate }}\" week-start=\"{{ weekStart }}\" ok-text=\"{{ okText }}\" cancel-text=\"{{ cancelText }}\" closed=\"closeDtp\"></nice-dtp>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-datetimerange-picker-2/nice-datetimerange-picker-2.html',
    "<div class=\"nice-component nice-datetimerange-picker-2\" ng-form=\"formDateRangePicker\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"nice-dtp-background\" ng-click=\"close()\" ng-if=\"isOpen\"></div>\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"nice-daterange-picker-button input-group\" ng-class=\"{ 'open': isOpen }\" ng-click=\"open()\">\n" +
    "<input type=\"text\" class=\"form-control\" value=\"{{ modelFormat }}\" readonly=\"readonly\" ng-disabled=\"isDisabled\">\n" +
    "<button class=\"btn input-group-addon\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon icon=\"icon-calendar\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"nice-daterange-picker-wrapper\">\n" +
    "<div class=\"dtp-wrapper\" ng-if=\"isOpen\">\n" +
    "<div class=\"dtp-buttons-left\">\n" +
    "<div class=\"dtp-buttons-top\">\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectToday()\" translate translate-context=\"Nice\">Last 24 hours</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(7)\" translate translate-context=\"Nice\">Last 7 days</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectLastMonth()\" translate translate-context=\"Nice\">Last month</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectThisMonth()\" translate translate-context=\"Nice\">This month</a>\n" +
    "</div>\n" +
    "<div class=\"dtp-buttons-bottom\">\n" +
    "<a class=\"btn btn-danger btn-block\" ng-click=\"close()\" translate translate-context=\"Nice\">Cancel</a>\n" +
    "<a class=\"btn btn-success btn-block\" ng-click=\"confirm()\" translate translate-context=\"Nice\">OK</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"dtp-left\">\n" +
    "<nice-date model=\"model.innerStartDate\" next-date=\"model.innerEndDate\" is-inline=\"true\" no-margin=\"true\" inline=\"true\" time=\"time\" on-change=\"dateChanged(model)\"></nice-date>\n" +
    "</div>\n" +
    "<div class=\"dtp-right\">\n" +
    "<nice-date model=\"model.innerEndDate\" next-date=\"model.innerStartDate\" is-inline=\"true\" no-margin=\"true\" inline=\"true\" time=\"time\" on-change=\"dateChanged(model)\"></nice-date>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-datetimerange-picker/nice-datetimerange-picker.html',
    "<div class=\"nice-component nice-datetime-picker nice-datetimerange-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"nice-dtp-background\" ng-click=\"cancelClick()\" ng-if=\"showDtpRange\"></div>\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div ng-form=\"formDatetimeRangePicker\"></div>\n" +
    "<div class=\"dropdown\">\n" +
    "<div class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" ng-click=\"openDtpRange()\">\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"text\" class=\"form-control\" value=\"{{value}}\" ng-disabled=\"isDisabled\" ng-click=\"openDtpRange()\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon ng-if=\"date != 'false'\" icon=\"icon-calendar\"></nice-icon>\n" +
    "<nice-icon ng-if=\"date == 'false'\" icon=\"icon-clock\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"dtp-range-wrapper\" ng-show=\"showDtpRange\">\n" +
    "<div class=\"dtp-layer\">\n" +
    "<div class=\"dtp-buttons-left\">\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(1)\" translate translate-context=\"Nice\">Last 24 hours</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectLastNDays(7)\" translate translate-context=\"Nice\">Last 7 days</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectLastMonth()\" translate translate-context=\"Nice\">Last month</a>\n" +
    "<a class=\"btn btn-primary btn-block\" ng-click=\"selectThisMonth()\" translate translate-context=\"Nice\">This month</a>\n" +
    "</div>\n" +
    "<div class=\"dtp-left\">\n" +
    "<nice-dtp model=\"dateStart\" format=\"{{format}}\" model-format=\"{{modelFormat}}\" date=\"{{date}}\" time=\"{{time}}\" width=\"{{width}}\" enable-ok-buttons=\"{{enableOkButtons}}\" lang=\"{{lang}}\" min-date=\"{{minDate}}\" max-date=\"{{maxDate}}\" week-start=\"{{weekStart}}\" ok-text=\"{{okText}}\" cancel-text=\"{{cancelText}}\" inline=\"true\"></nice-dtp>\n" +
    "</div>\n" +
    "<div class=\"dtp-right\">\n" +
    "<nice-dtp model=\"dateEnd\" format=\"{{format}}\" model-format=\"{{modelFormat}}\" date=\"{{date}}\" time=\"{{time}}\" width=\"{{width}}\" enable-ok-buttons=\"{{enableOkButtons}}\" lang=\"{{lang}}\" min-date=\"{{minDate}}\" max-date=\"{{maxDate}}\" week-start=\"{{weekStart}}\" ok-text=\"{{okText}}\" cancel-text=\"{{cancelText}}\" inline=\"true\"></nice-dtp>\n" +
    "</div>\n" +
    "<div class=\"dtp-buttons-bottom\">\n" +
    "<a class=\"btn btn-danger btn-block margin-right-20\" ng-click=\"cancelClick()\" translate translate-context=\"Nice\">Cancel</a>\n" +
    "<a class=\"btn btn-success btn-block\" ng-click=\"okClick()\" translate translate-context=\"Nice\">OK</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dropdown-date/nice-dropdown-date.html',
    "<div class=\"nice-component nice-dropdown-date\" ng-form=\"dropdownDateForm\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[\n" +
    "                fieldWidth ? fieldWidth : 'col-sm-8',\n" +
    "                {\n" +
    "                  'has-warning': !isDisabled && dropdownDateForm.$invalid && dropdownDateForm.$dirty,\n" +
    "                  'nice-disabled': isDisabled\n" +
    "                }\n" +
    "            ]\">\n" +
    "<div class=\"form-inline\">\n" +
    "<div class=\"input-group nice-dropdown-date-day\">\n" +
    "<select ng-model=\"dateFields.day\" class=\"form-control\" ng-options=\"day for day in days\" ng-change=\"checkDate()\" ng-disabled=\"isDisabled\" required=\"true\"></select>\n" +
    "</div>\n" +
    "<div class=\"input-group nice-dropdown-date-month\">\n" +
    "<select ng-model=\"dateFields.month\" class=\"form-control\" ng-options=\"month.value as month.name for month in months\" ng-change=\"checkDate()\" ng-disabled=\"isDisabled\" required=\"true\"></select>\n" +
    "</div>\n" +
    "<div class=\"input-group nice-dropdown-date-year\">\n" +
    "<select ng-model=\"dateFields.year\" class=\"form-control\" ng-options=\"year for year in years\" ng-change=\"checkDate()\" ng-disabled=\"isDisabled\" required=\"true\"></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dropdown-old/nice-dropdown-old.html',
    "<div class=\"nice-component nice-dropdown-old\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div ng-class=\"addButtonEnable && !isDisabled ? 'input-group': ''\">\n" +
    "<div class=\"btn-group\" dropdown is-open=\"status.isopen\" ng-class=\"{ 'disabled': isDisabled || emptyList }\">\n" +
    "<button type=\"button\" class=\"btn btn-block btn-dropdown dropdown-toggle\" title=\"{{ getLabel(internalSelected) }}\" dropdown-toggle ng-disabled=\"isDisabled || emptyList\">\n" +
    "<span ng-if=\"internalSelected.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': internalSelected.color_hex_code}\"></span>\n" +
    "<span ng-if=\"!multiple\">{{ getLabel(internalSelected) }}</span>\n" +
    "<span ng-if=\"multiple\">\n" +
    "<span ng-if=\"internalSelected.length  > 1\">{{ internalSelected.length }}<translate translate-context=\"Nice\">selected</translate></span>\n" +
    "<span ng-if=\"internalSelected.length  == 1\">{{ getLabel(internalSelected[0]) }}</span>\n" +
    "<span ng-if=\"internalSelected.length == 0\" translate translate-context=\"Nice\">None</span>\n" +
    "</span>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<ul id=\"{{id}}\" class=\"dropdown-menu\" role=\"menu\">\n" +
    "<li id=\"{{id}}-{{$index}}\" ng-repeat=\"item in internalList\" ng-click=\"clicked(item)\">\n" +
    "<a href>\n" +
    "<span class=\"choice-checkbox\" ng-if=\"multiple\" ng-class=\"{ 'selected' : isItemSelected(item) }\"><i class=\"fa fa-check\"></i></span>\n" +
    "<span ng-if=\"item.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': item.color_hex_code}\"></span>\n" +
    "<span ng-class=\"{'multiple-item': multiple}\">{{ getLabel(item) }}</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<span class=\"input-group-btn\" ng-if=\"addButtonEnable && !isDisabled\">\n" +
    "<button class=\"btn btn-primary\" ng-click=\"addButtonFunction()\" type=\"button\">+</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-form=\"formDropdown\"></div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dropdown/nice-dropdown.html',
    "<div class=\"nice-component nice-dropdown\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\" ng-form=\"formDropdown\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[ fieldWidth ? fieldWidth : 'col-sm-8', { 'open': isOpen, 'nice-disabled': isDisabled || emptyList } ]\" click-outside=\"close()\" is-open=\"{{ isOpen }}\">\n" +
    "<div class=\"nice-field-wrapper\">\n" +
    "<button class=\"btn btn-dropdown\" type=\"button\" ng-ref=\"dropdown-button\" ng-click=\"toggle()\" ng-disabled=\"isDisabled || emptyList\" aria-expanded=\"{{ isOpen }}\" aria-haspopup=\"true\" aria-controls=\"menu\" id=\"nice-dropdown-{{ id }}\">\n" +
    "<div class=\"btn-dropdown-inside\" ng-transclude=\"button\" ng-if=\"selected != null\">\n" +
    "<span ng-if=\"!multiple\">{{ selected[objValue] }}</span>\n" +
    "<span ng-if=\"multiple\">\n" +
    "<span ng-if=\"selected.length > 1\">{{ selected.length }} {{ selectedText }}</span>\n" +
    "<span ng-if=\"selected.length == 1\">{{ selected[0][objValue] }}</span>\n" +
    "<span ng-if=\"selected.length == 0\">{{ nullableText }}</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"not-selected\" ng-if=\"selected == null\">{{ selectText }}</div>\n" +
    "<span class=\"caret\" ng-show=\"!loading\"></span>\n" +
    "<nice-loader ng-if=\"loading\"></nice-loader>\n" +
    "</button>\n" +
    "<div class=\"nice-dropdown-menu-wrapper\">\n" +
    "<div class=\"nice-dropdown-menu\" ng-if=\"isOpen\">\n" +
    "<div class=\"search-bar\" ng-if=\"!noSearch && searchFunction\">\n" +
    "<input ng-model=\"internal.search\" ng-model-options=\"{ debounce: 500 }\" ng-change=\"handleSearch()\" placeholder=\"{{ searchText }}\">\n" +
    "<div class=\"count\" ng-if=\"internalList && internalList._metadata && enableLoadMore\">{{ internalList.length }}/{{ internalList._metadata.count }}</div>\n" +
    "<nice-icon ng-if=\"!internal.search\" class=\"icon\" icon=\"icon-search\"></nice-icon>\n" +
    "<nice-icon ng-if=\"internal.search\" class=\"icon\" icon=\"icon-x\" ng-click=\"clearSearch()\"></nice-icon>\n" +
    "</div>\n" +
    "<div class=\"nice-dropdown-actions\" ng-if=\"multiple\">\n" +
    "<button class=\"btn btn-default btn-sm\" ng-click=\"selectAll()\" translate translate-context=\"Nice\">All</button>\n" +
    "<button class=\"btn btn-default btn-sm\" ng-click=\"selectNone()\">{{ nullableText }}</button>\n" +
    "</div>\n" +
    "<div class=\"nice-dropdown-items\" aria-labelledby=\"nice-dropdown-{{ id }}\" role=\"listbox\">\n" +
    "<div role=\"none\" class=\"nice-no-data\" ng-if=\"internalList && internalList.length == 0\">{{ noDataText }}</div>\n" +
    "<button role=\"option\" class=\"nice-dropdown-item null-item\" ng-if=\"!multiple && nullable && internalList.length != 0\" ng-click=\"handleSelected(null, -1)\" ng-disabled=\"isDisabled\">\n" +
    "{{ nullableText }}\n" +
    "</button>\n" +
    "<button role=\"option\" class=\"nice-dropdown-item\" ng-repeat=\"item in internalList\" ng-click=\"handleSelected(item, $index)\" ng-class=\"{ 'selected': item._selected }\" ng-disabled=\"isDisabled\">\n" +
    "<div class=\"choice-checkbox\" ng-if=\"multiple\" role=\"menuitemcheckbox\"><i class=\"fa fa-check\"></i></div>\n" +
    "<div class=\"choice-option\" ng-transclude=\"option\" ng-class=\"{ 'multiple-item': multiple }\">{{ item[objValue] }}</div>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button class=\"btn btn-primary btn-icon add-btn\" type=\"button\" ng-if=\"addButtonFunction && !isDisabled\" ng-click=\"addButtonFunction()\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon icon=\"icon-plus\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-dtp/nice-dtp.html',
    "<div class=\"dtp-wrapper\">\n" +
    "<div class=\"dtp\" id=\"this.name\" ng-class=\"{'hidden': !showDtp}\">\n" +
    "<div class=\"dtp-content\" ng-style=\"dtp_content_style\">\n" +
    "<div class=\"dtp-date-view\">\n" +
    "<div class=\"dtp-header\" ng-if=\"!inline\">\n" +
    "<div class=\"dtp-actual-day\">{{actualDay}}</div>\n" +
    "<div class=\"dtp-close\" ng-if=\"!inline\"><a href=\"javascript:void(0);\" ng-click=\"onCloseClick()\"><i class=\"fa fa-close\"></i></a></div>\n" +
    "</div>\n" +
    "<div class=\"dtp-date\" ng-if=\"!inline\" ng-class=\"{'hidden': !showDateHeader}\">\n" +
    "<div>\n" +
    "<div class=\"left center p10\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"dtp-actual-month p80\" ng-click=\"initDate()\">{{actualMonth}}</div>\n" +
    "<div class=\"right center p10\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"clearfix\"></div>\n" +
    "</div>\n" +
    "<div class=\"dtp-actual-num\" ng-click=\"initDate()\">{{actualNum}}</div>\n" +
    "<div>\n" +
    "<div class=\"left center p10\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-year-before\" ng-click=\"onYearBeforeClick()\" ng-class=\"{'disabled': !btnYearBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"dtp-actual-year p80\" ng-click=\"initDate()\">{{actualYear}}</div>\n" +
    "<div class=\"right center p10\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-year-after\" ng-click=\"onYearAfterClick()\" ng-class=\"{'disabled': !btnYearAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"clearfix\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"dtp-time\" ng-show=\"!showTimeHeader\">\n" +
    "<div class=\"dtp-actual-maxtime\">\n" +
    "<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"dtp-picker\">\n" +
    "<div class=\"dtp-picker-calendar\" ng-class=\"{'hidden': !showCalendar}\">\n" +
    "<div>\n" +
    "<div ng-if=\"inline\" class=\"left center p10\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-month-before\" ng-click=\"onMonthBeforeClick()\" ng-class=\"{'disabled': !btnMonthBeforeEnabled}\"><i class=\"fa fa-chevron-left\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"dtp-picker-month\" ng-class=\"{'p80': inline}\">{{monthAndYear}}</div>\n" +
    "<div class=\"right center p10\" ng-if=\"inline\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-month-after\" ng-click=\"onMonthAfterClick()\" ng-class=\"{'disabled': !btnMonthAfterEnabled}\"><i class=\"fa fa-chevron-right\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table dtp-picker-days\">\n" +
    "<thead>\n" +
    "<th ng-repeat=\"weekDay in weekDays track by $index\">{{weekDay}}</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"week in weeks\">\n" +
    "<td ng-repeat=\"day in week\">\n" +
    "<span ng-if=\"day.disabled\" class=\"dtp-select-day\">{{day.label}}</span>\n" +
    "<a ng-if=\"!day.disabled\" ng-click=\"onSelectDate(day)\" href=\"javascript:void(0);\" class=\"dtp-select-day\" ng-class=\"{'selected': day.selected}\">{{day.label}}</a>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div class=\"dtp-picker-datetime\" ng-class=\"{'hidden': !showTime}\">\n" +
    "<div class=\"dtp-actual-meridien\">\n" +
    "<div class=\"dtp-actual-time p60\" ng-show=\"showTimeHeader\">\n" +
    "<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==1}\" ng-click=\"initHours()\" href=\"javascript:void(0);\">{{actualTime.hours}}</a>:<a class=\"dtp-hours-minutes-btn\" ng-class=\"{'selected': currentView==2}\" ng-click=\"initMinutes()\" href=\"javascript:void(0);\">{{actualTime.minutes}}</a>\n" +
    "</div>\n" +
    "<div class=\"clearfix\"></div>\n" +
    "</div>\n" +
    "<div class=\"dtp-picker-clock\">\n" +
    "<div class=\"dtp-hand dtp-hour-hand\" ng-show=\"currentView==1\"></div>\n" +
    "<div class=\"dtp-hand dtp-minute-hand\" ng-show=\"currentView==2\"></div>\n" +
    "<div class=\"dtp-clock-center\"></div>\n" +
    "<div ng-repeat=\"hour in hours\" class=\"dtp-picker-time\" ng-style=\"hour.style\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-hour\" ng-class=\"{'selected': hour.selected, 'disabled': hour.disabled}\" ng-click=\"onSelectHour(hour)\">{{hour.h}}</a>\n" +
    "</div>\n" +
    "<div ng-repeat=\"minute in minutes\" class=\"dtp-picker-time\" ng-style=\"minute.style\">\n" +
    "<a href=\"javascript:void(0);\" class=\"dtp-select-minute\" ng-class=\"{'selected': minute.selected, 'disabled': minute.disabled}\" ng-click=\"onSelectMinute(minute)\">{{minute.m}}</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-help/nice-help.html',
    "<div class=\"nice-help\" ng-mouseover=\"onHover()\">\n" +
    "<nice-icon icon=\"icon-help-circle\" class=\"nice-help-button\"></nice-icon>\n" +
    "<div class=\"nice-help-popup\">\n" +
    "<span ng-bind-html=\"text\">{{ text }}</span>\n" +
    "<div data-popper-arrow class=\"nice-help-arrow\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-icon/nice-icon.html',
    "<svg class=\"nice-icon\" ng-style=\"{ 'width': size + 'px', 'height': size + 'px' }\">\n" +
    "<use ng-attr-xlink:href=\"{{ '#' + icon }}\" xlink:href=\"\"></use>\n" +
    "</svg>"
  );


  $templateCache.put('src/components/nice-input/nice-input.html',
    "<ng-form class=\"nice-component nice-input\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" name=\"forma\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"input-group\" ng-class=\"{\n" +
    "                    'has-feedback': showValid && !hideValid,\n" +
    "                    'has-warning': !isDisabled && forma.$invalid && forma.$dirty && !hideValid,\n" +
    "                    'has-success': !isDisabled && forma.$valid && forma.$dirty && showValid,\n" +
    "                    'symbol': symbol,\n" +
    "                    'nice-disabled': isDisabled\n" +
    "                }\">\n" +
    "<textarea ng-if=\"textArea\" class=\"form-control\" ng-model=\"$parent.model\" id=\"{{ id }}\" tabindex=\"{{ tabIndex }}\" placeholder=\"{{ placeholder }}\" rows=\"{{textAreaLines}}\" max=\"{{ max }}\" min=\"{{ min }}\" ng-minlength=\"minlength\" ng-maxlength=\"maxlength\" ng-required=\"required\" ng-pattern=\"regexexp\" ng-disabled=\"isDisabled\"></textarea>\n" +
    "<input ng-if=\"!textArea\" class=\"form-control\" type=\"{{ internalType }}\" ng-model=\"$parent.model\" name=\"{{ name }}\" id=\"{{ id }}\" tabindex=\"{{ tabIndex }}\" placeholder=\"{{ placeholder }}\" max=\"{{ max }}\" min=\"{{ min }}\" ng-minlength=\"minlength\" ng-maxlength=\"maxlength\" ng-required=\"required\" ng-keypress=\"keypress($event)\" ng-pattern=\"regexexp\" ng-disabled=\"isDisabled\">\n" +
    "<div class=\"input-group-addon\" ng-if=\"symbol\">{{ symbol }}</div>\n" +
    "<button class=\"input-group-btn\" ng-if=\"multilanguageField\" ng-click=\"openMultilanguage()\">\n" +
    "<nice-icon icon=\"icon-translate\"></nice-icon>\n" +
    "<div class=\"nice-input-addon-bubble\" ng-if=\"numberOfLanguages > 0\">{{ numberOfLanguages }}</div>\n" +
    "</button>\n" +
    "<button class=\"input-group-btn\" ng-if=\"onClear\" ng-click=\"onClear()\">\n" +
    "<nice-icon icon=\"icon-x\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div ng-if=\"forma.$error && forma.$dirty\">\n" +
    "<div class=\"error-message\" ng-if=\"forma.$dirty && forma.$error.email\" translate translate-context=\"Nice\">Email is not valid.</div>\n" +
    "<div class=\"error-message\" ng-if=\"forma.$dirty && forma.$error.pattern\">\n" +
    "<span ng-if=\"regexError\">{{ regexError }}</span>\n" +
    "<span ng-if=\"!regexError\" translate translate-context=\"Nice\">This field requires a specific pattern.</span>\n" +
    "</div>\n" +
    "<div class=\"error-message\" ng-if=\"forma.$error.minlength\">\n" +
    "<translate translate-context=\"Nice\">Your input is too short. It must contain at least</translate>&nbsp;{{ minlength }}&nbsp;<translate translate-context=\"Nice\">characters</translate>.\n" +
    "</div>\n" +
    "<div class=\"error-message\" ng-if=\"forma.$error.maxlength\" translate translate-context=\"Nice\">Your input is too long</div>\n" +
    "<div class=\"error-message\" ng-if=\"forma.$error.required\" ng-if=\"forma.$dirty\" translate translate-context=\"Nice\">This field is required.</div>\n" +
    "<div class=\"error-message\" ng-if=\"forma.$error.unique\" translate translate-context=\"Nice\">This field must be unique.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-label/nice-label.html',
    "<div class=\"nice-component nice-label\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-xs-8'\">\n" +
    "<p class=\"value\">{{ value }}</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-loader/nice-loader.html',
    "<div class=\"nice-loader\" ng-class=\"{ 'nice-loader-fullscreen': fullscreen, 'nice-loader-fulldiv': fulldiv }\">\n" +
    "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n" +
    "<path d=\"M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z\"></path>\n" +
    "</svg>\n" +
    "<div class=\"nice-loader-message\" ng-if=\"message\">{{ message }}</div>\n" +
    "<ng-transclude ng-if=\"showSlot\"></ng-transclude>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-notification/nice-notification.html',
    "<div class=\"notification\">\n" +
    "<h3 ng-show=\"title\" ng-bind-html=\"title\"></h3>\n" +
    "<div class=\"message\" ng-bind-html=\"message\"></div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-number/nice-number.html',
    "<div class=\"nice-component nice-number\" ng-form=\"niceNumberForm\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div ng-class=\"{'row' : !disableRow}\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"input-group\" ng-class=\"{'has-warning': !isDisabled && niceNumberForm.$invalid && niceNumberForm.$dirty}\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-left\" type=\"button\" ng-disabled=\"!canSubstract || isDisabled\" ng-click=\"subtract()\" tabindex=\"-1\">\n" +
    "<nice-icon icon=\"icon-minus\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "<input type=\"number\" step=\"{{ step }}\" ng-change=\"inputChanged()\" class=\"form-control\" max=\"{{ max }}\" min=\"{{ min }}\" ng-disabled=\"isDisabled\" ng-model=\"model\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" type=\"button\" ng-disabled=\"!canAdd || isDisabled\" ng-click=\"add()\" tabindex=\"-1\">\n" +
    "<nice-icon icon=\"icon-plus\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"error-messages\" ng-if=\"niceNumberForm.$error && !hideError\" ng-class=\"{ 'floating-error': floatingError }\">\n" +
    "<div class=\"error-message\" ng-if=\"niceNumberForm.$dirty && niceNumberForm.$error.number\" translate translate-context=\"Nice\">This field requires a number</div>\n" +
    "<div class=\"error-message\" ng-if=\"niceNumberForm.$error.min\">\n" +
    "<translate translate-context=\"Nice\">Minimum value is</translate>{{ min }}\n" +
    "</div>\n" +
    "<div class=\"error-message\" ng-if=\"niceNumberForm.$error.max\">\n" +
    "<translate translate-context=\"Nice\">Maximum value is</translate>{{ max }}\n" +
    "</div>\n" +
    "<div class=\"error-message\" ng-if=\"niceNumberForm.$error.zero\">\n" +
    "<translate translate-context=\"Nice\">0 is not allowed</translate>\n" +
    "</div>\n" +
    "<div class=\"error-message\" ng-if=\"niceNumberForm.$error.no-value && !niceNumberForm.$error.zero && !niceNumberForm.$error.min && !niceNumberForm.$error.max\">\n" +
    "<translate translate-context=\"Nice\">Value is missing</translate>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-percent/nice-percent.html',
    "<ng-form class=\"nice-component nice-input\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" name=\"form\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"input-group has-feedback symbol\" ng-class=\"{\n" +
    "                    'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\n" +
    "                    'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\n" +
    "                    'disabled': isDisabled\n" +
    "                }\">\n" +
    "<input class=\"form-control\" type=\"text\" max=\"100\" min=\"0\" ng-model=\"internalModel\" placeholder=\"{{ placeholder }}\" ng-required=\"required\" ng-keypress=\"keypress($event)\" ng-change=\"change()\" ng-disabled=\"isDisabled\">\n" +
    "<span class=\"input-group-addon\">%</span>\n" +
    "</div>\n" +
    "<div ng-if=\"form.$error\">\n" +
    "<div class=\"error-message\" ng-if=\"form.$dirty && form.$error.pattern\" translate translate-context=\"Nice\">This field requires a specific pattern.</div>\n" +
    "<div class=\"error-message\" ng-if=\"form.$dirty && form.$error.required\" translate translate-context=\"Nice\">This field is required.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-pill/nice-pill.html',
    "<div class=\"nice-pill\">\n" +
    "<div class=\"nice-pill-inner\" ng-transclude></div>\n" +
    "<nice-button class=\"nice-pill-remove btn-primary-naked\" icon=\"icon-x\" nice-click=\"handleDelete()\" ng-if=\"onDelete\"></nice-button>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-popup/nice-popup.html',
    "<div class=\"nice-popup\" click-outside=\"close()\">\n" +
    "<div class=\"nice-popup-target\" ng-transclude=\"target\" ng-click=\"toggle()\"></div>\n" +
    "<div class=\"nice-popup-content\">\n" +
    "<div class=\"nice-popup-arrow\" data-popper-arrow ng-show=\"isOpen && showArrow\"></div>\n" +
    "<div ng-transclude=\"content\" ng-if=\"isOpen\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-progress-bar/nice-progress-bar.html',
    "<div class=\"nice-component nice-progress-bar\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"progress\">\n" +
    "<div class=\"progress-value\">{{ value }} / {{ max }}</div>\n" +
    "<div class=\"progress-bar\" ng-style=\"{'width': percentage+'%', 'background': color}\">\n" +
    "<div class=\"progress-value\" ng-style=\"{'width': width+'px'}\">{{ value }} / {{ max }}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-quantity/nice-quantity.html',
    "<div class=\"nice-component nice-quantity\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"input-group\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-left\" ng-click=\"sub()\" type=\"button\" ng-disabled=\"(model <= min) || isDisabled\" tabindex=\"-1\">\n" +
    "<nice-icon icon=\"icon-minus\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "<input class=\"value form-control\" ng-model=\"model\" type=\"number\" min=\"{{ min }}\" max=\"{{ max }}\" ng-change=\"handleChange()\" ng-disabled=\"isDisabled\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" ng-click=\"add()\" type=\"button\" ng-disabled=\"(model >= max) || isDisabled\" tabindex=\"-1\">\n" +
    "<nice-icon icon=\"icon-plus\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-search/nice-search.html',
    "<ng-form class=\"nice-component nice-input nice-search\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline}\" name=\"form\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"input-group\" ng-class=\"{ 'disabled': isDisabled }\">\n" +
    "<input class=\"form-control\" type=\"text\" id=\"{{ id }}\" ng-model=\"modelString\" ng-keypress=\"keypress($event)\" placeholder=\"{{ placeholder }}\" ng-disabled=\"isDisabled\" ng-change=\"updateSearch()\" ng-required=\"required\" tabindex=\"{{ tabIndex }}\">\n" +
    "<button class=\"btn input-group-addon\" ng-click=\"search()\" ng-if=\"!model\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon ng-show=\"!loading\" icon=\"icon-search\"></nice-icon>\n" +
    "<nice-loader ng-if=\"loading\"></nice-loader>\n" +
    "</button>\n" +
    "<button class=\"btn input-group-addon\" ng-click=\"remove()\" ng-if=\"model\" ng-disabled=\"isDisabled\">\n" +
    "<nice-icon ng-show=\"!loading\" icon=\"icon-x\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-if=\"noResults || results.length\">\n" +
    "<div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\"></div>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"nice-dropdown-empty\" ng-if=\"noResults\">\n" +
    "<div class=\"nice-search-row\" translate translate-context=\"Nice\">No results found.</div>\n" +
    "</div>\n" +
    "<div class=\"nice-dropdown\" ng-if=\"results.length\">\n" +
    "<div ng-repeat=\"result in results\" class=\"nice-search-row\" ng-class=\"{'active': selectedIndex == $index}\" ng-click=\"selectRow(result)\">\n" +
    "<span class=\"text-bold\">{{ result[keyForInputLabel] }}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-search2/nice-search2.html',
    "<ng-form class=\"nice-component nice-input nice-search2\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" name=\"form\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\" click-outside=\"close()\">\n" +
    "<div class=\"nice-search-button input-group\" ng-class=\"{ 'disabled': isDisabled }\">\n" +
    "<input class=\"form-control\" type=\"text\" id=\"{{ id }}\" ng-model=\"model\" placeholder=\"{{ placeholder }}\" ng-disabled=\"isDisabled\" ng-change=\"updateSearch()\" ng-focus=\"onFocus()\" tabindex=\"{{ tabIndex }}\">\n" +
    "<button class=\"btn input-group-addon\" ng-disabled=\"isDisabled\" ng-click=\"buttonClicked()\">\n" +
    "<nice-icon ng-show=\"!loading && model != ''\" icon=\"icon-x\"></nice-icon>\n" +
    "<nice-icon ng-show=\"!loading && model == ''\" icon=\"icon-search\"></nice-icon>\n" +
    "<nice-loader ng-if=\"loading\"></nice-loader>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"nice-search-dropdown-wrapper\">\n" +
    "<div class=\"nice-search-dropdown\" ng-if=\"showDropdown && isOpen\">\n" +
    "<div class=\"nice-search-row nice-search-row-loading\" ng-if=\"loading && results.length == 0\">\n" +
    "<nice-loader ng-if=\"loading\"></nice-loader>\n" +
    "</div>\n" +
    "<div class=\"nice-search-row nice-search-row-empty\" ng-if=\"!loading && results.length == 0\" translate translate-context=\"Nice\">No results found.</div>\n" +
    "<div ng-repeat=\"result in results\" class=\"nice-search-row\" ng-class=\"{'active': selectedIndex == $index}\" ng-click=\"selectItem(result)\">\n" +
    "<ng-transclude>{{ result[keyForInputLabel] }}</ng-transclude>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-slot/nice-slot.html',
    "<div class=\"nice-component nice-slot\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-xs-8'\">\n" +
    "<ng-transclude></ng-transclude>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-svgs/nice-svgs.html',
    "<svg class=\"nice-svgs\" style=\"display:none;\">\n" +
    "<symbol id=\"olaii-logo\" viewBox=\"0 0 115 78\">\n" +
    "<path d=\"M86.1 15.6C86.1 15.2 86.1 14.7 86.3 14.2C86.5 13.7 86.7 13.2 87.1 12.7C87.5 12.2 88 11.8 88.6 11.5C89.2 11.2 90 11 91 10.9C91.6 10.9 92.2 10.9 92.7 11C93.2 11.1 93.7 11.3 94.1 11.6C94.5 11.9 94.8 12.2 95.1 12.7C95.4 13.2 95.5 13.7 95.5 14.3C95.5 14.9 95.5 15.5 95.3 16C95.1 16.6 94.9 17.1 94.5 17.5C94.1 18 93.6 18.3 93 18.6C92.4 18.9 91.7 19.1 90.8 19.1C89.3 19.2 88.2 18.9 87.4 18.2C86.6 17.7 86.2 16.8 86.1 15.6Z\"/>\n" +
    "<path d=\"M110.5 43.3C109.6 44 108.6 44.6 107.6 45.2C106.6 45.8 105.5 46.3 104.4 46.7C103.3 47.1 102.3 47.3 101.3 47.4C100.4 47.4 99.7 47.4 99 47.1C98.4 46.9 97.9 46.6 97.5 46.1C97.1 45.7 96.8 45.1 96.6 44.5C96.4 43.9 96.3 43.2 96.3 42.4C96.2 41.3 96.3 40.1 96.5 38.6C96.8 35.6 97.1 33.9 97.2 33.5C97.4 32.8 97.8 31.1 98.4 28.6C99 26.5 99.3 25.2 99.4 24.5C99.5 24.1 99.7 23.7 100.1 23.3C100.4 23 100.8 22.7 101.3 22.5C101.7 22.3 102.2 22.1 102.7 22C103.2 21.9 103.6 21.8 104 21.8C104.7 21.8 105.2 21.9 105.5 22.1C105.8 22.4 105.9 22.7 105.9 23.2C105.9 23.6 105.9 24.1 105.7 24.8C105.6 25.5 105.4 26.3 105.2 27.2C105 28.1 104.7 29.2 104.4 30.6C104 32 103.8 33.2 103.7 34.2C103.6 35.2 103.4 36.2 103.2 37.1C103 38.1 102.9 39 103 39.7C103 40.5 103.2 41.1 103.3 41.5C103.5 41.9 103.9 42.2 104.4 42.1C105 42.1 105.7 41.8 106.4 41.4C107.1 40.9 107.9 40.4 108.6 39.7C109.3 39 110.1 38.4 110.8 37.7C113 35.2 114 36.7 114 39.3C114 40 113.9 40.2 113.4 40.7C112.3 41.8 110.9 42.9 110.5 43.3Z\"/>\n" +
    "<path d=\"M99.9 14.9C99.9 14.5 99.9 14 100.1 13.5C100.3 13 100.5 12.5 100.9 12C101.3 11.5 101.8 11.1 102.4 10.8C103 10.5 103.8 10.3 104.8 10.2C105.4 10.2 106 10.2 106.5 10.3C107 10.4 107.5 10.6 107.9 10.9C108.3 11.2 108.6 11.5 108.9 12C109.2 12.5 109.3 13 109.3 13.6C109.3 14.2 109.3 14.8 109.1 15.3C108.9 15.9 108.7 16.4 108.3 16.8C107.9 17.3 107.4 17.6 106.8 17.9C106.2 18.2 105.5 18.4 104.6 18.4C103.1 18.5 102 18.2 101.2 17.5C100.4 17.1 100 16.1 99.9 14.9Z\"/>\n" +
    "<path d=\"M63.1 40.8C63.1 41.2 63.2 41.7 63.2 42.1C63.3 42.5 63.4 42.9 63.6 43.2C63.8 43.5 64 43.8 64.3 44C64.6 44.2 64.9 44.3 65.3 44.3C65.9 44.3 66.5 44 67 43.4C67.5 42.8 67.9 42.1 68.2 41.3C68.5 40.5 68.8 39.7 69 38.8C69.2 38 69.3 37.3 69.3 36.7L70.8 28.3C70.1 28.3 69.4 28.5 68.8 28.9C68.1 29.3 67.5 29.8 67 30.4C66.4 31 65.9 31.7 65.5 32.5C65 33.3 64.6 34.2 64.2 35.4C63.8 36.5 63.5 37.5 63.3 38.4C63.1 39.2 63.1 40 63.1 40.8ZM49.5 29.4C50.2 28 50.9 26.4 51.7 24.6C52.5 22.8 53.2 21 53.9 19.1C54.6 17.2 55.2 15.4 55.6 13.5C56.1 11.7 56.4 9.89999 56.4 8.39999C56.4 7.89999 56.3 7.49999 56.3 7.09999C56.3 6.69999 56.2 6.59999 56 6.59999C55.5 6.59999 55 6.99999 54.5 7.59999C54 8.29999 53.5 9.19999 53 10.3C52.5 11.4 51.9 13.3 51.3 15.8C50.7 18.3 50.3 19.6 50.3 19.6C50.3 19.6 50.1 20.8 49.8 23.1C49.7 25.6 49.5 27.7 49.5 29.4ZM95.8 44.5C95.1 45 94.4 45.4 93.7 45.8C92.7 46.4 91.6 46.9 90.5 47.3C89.4 47.7 88.4 47.9 87.4 48C86.5 48 85.8 48 85.1 47.7C84.5 47.5 84 47.2 83.6 46.7C83.2 46.3 82.9 45.7 82.7 45.1C82.7 45 82.7 44.9 82.6 44.9C82.3 45.3 81.9 45.6 81.5 45.9C80.7 46.6 79.8 47.2 78.9 47.7C78 48.2 77 48.5 76.1 48.5C75 48.6 74 48.2 73.2 47.6C72.4 46.9 71.7 45.9 71.1 44.5C70.7 45 70.2 45.5 69.6 46C69 46.5 68.4 47 67.7 47.4C67 47.8 66.3 48.2 65.5 48.5C64.7 48.8 64 49 63.2 49C62.4 49 61.6 48.9 60.8 48.6C60 48.3 59.3 47.9 58.7 47.3C58.5 47.1 58.3 46.9 58.1 46.7C57.6 47 57 47.3 56.4 47.6C55.7 48 55 48.3 54.3 48.6C53.6 48.9 52.9 49.1 52.2 49.3C51.5 49.5 50.9 49.6 50.3 49.6C49.4 49.6 48.5 49.3 47.7 48.5C47 47.9 46.4 47 45.8 46C44.5 48.1 43 49.9 41.4 51.6C39.3 53.7 37.5 54.9 36.3 51C35.7 49.1 35.5 48 35.7 46.6C35.9 45.2 36.3 44.8 37.2 43.9C39.4 41.8 41.4 39.7 43.4 37.4C43.3 36.7 43.3 36 43.2 35.2C43.1 33.5 43.3 31.3 43.6 28.5C44 25.7 44.1 24.3 44.1 24.3C44.1 24.3 44.4 22.9 45 20C45.6 17.2 46.3 14.9 46.9 13.1C47.6 11.4 48.3 9.69999 49.1 8.19999C49.9 6.69999 50.8 5.39999 51.7 4.19999C52.6 3.09999 53.6 2.19999 54.6 1.49999C55.6 0.799994 56.7 0.499994 57.8 0.399994C58.6 0.399994 59.3 0.499994 59.8 0.799994C60.3 1.09999 60.8 1.49999 61.1 1.89999C61.4 2.39999 61.7 2.89999 61.8 3.59999C61.9 4.19999 62 4.89999 62.1 5.49999C62.2 7.09999 62.1 8.79999 61.8 10.5C61.5 12.2 61.1 13.9 60.5 15.6C59.9 17.3 59.3 19.1 58.5 20.8C57.7 22.5 56.9 24.3 56.1 26C55.3 27.7 54.4 29.4 53.5 31.1C52.6 32.8 51.9 34.4 51.1 36C51 36.2 50.9 36.4 50.9 36.7C50.8 37 50.7 37.3 50.7 37.6C50.6 37.9 50.6 38.3 50.5 38.6C50.4 39 50.4 39.3 50.3 39.7V40.1C50.3 40.5 50.4 41 50.5 41.4C50.6 41.8 50.7 42.2 50.9 42.5C51 42.8 51.2 43.1 51.4 43.3C51.6 43.5 51.7 43.6 51.8 43.6C52.1 43.6 52.5 43.5 52.9 43.3C53.3 43.1 53.8 42.9 54.2 42.7C54.7 42.4 55.2 42.2 55.7 41.8C56 41.6 56.2 41.5 56.5 41.3C56.5 40.2 56.6 39.2 56.9 38.1C57.2 36.7 57.7 35.2 58.4 33.6C59.1 32 59.8 30.6 60.7 29.4C61.5 28.2 62.4 27.2 63.4 26.3C64.4 25.4 65.4 24.7 66.6 24.1C67.7 23.5 68.9 23.2 70.1 23.2C70.5 23.2 70.8 23.2 71 23.4C71.2 23.5 71.4 23.7 71.6 23.9C71.8 24.1 71.9 24.3 72.1 24.5C72.2 24.7 72.4 24.8 72.6 24.9C72.8 25 73 25 73.2 25C73.4 25 73.6 25 73.9 25C74.1 25 74.3 25 74.5 25C74.7 25 74.9 25 75.1 25C75.4 25 75.6 25 75.8 25C76 25 76.2 25.1 76.4 25.3C76.6 25.5 76.7 25.7 76.8 26C76.9 26.3 77 26.7 77 27.3C77 28.1 77 29 76.9 30C76.8 31 76.6 32 76.5 33.1C76.3 34.2 76.1 35.4 75.9 36.7C75.7 38.1 75.6 39.2 75.6 40.1C75.6 40.9 75.7 41.5 75.9 41.9C76.1 42.3 76.4 42.5 76.9 42.5C77.3 42.5 77.6 42.4 78 42.2C78.4 42 78.8 41.8 79.2 41.4C79.6 41.1 80 40.7 80.4 40.4C80.8 40 81.1 39.6 81.5 39.2C82 38.6 82.5 38 83 37.3C83.2 35.4 83.4 34.3 83.5 34C83.7 33.3 84.1 31.6 84.7 29.1C85.3 27 85.6 25.7 85.7 25C85.8 24.6 86 24.2 86.4 23.8C86.7 23.5 87.1 23.2 87.6 23C88 22.8 88.5 22.6 89 22.5C89.5 22.4 89.9 22.3 90.3 22.3C91 22.3 91.5 22.4 91.8 22.6C92.1 22.9 92.2 23.2 92.2 23.7C92.2 24.1 92.2 24.6 92 25.3C91.9 26 91.7 26.8 91.5 27.7C91.3 28.6 91 29.7 90.7 31.1C90.3 32.5 90.1 33.7 90 34.7C89.9 35.7 89.7 36.7 89.5 37.6C89.3 38.6 89.2 39.5 89.3 40.2C89.3 41 89.5 41.6 89.6 42C89.8 42.4 90.2 42.7 90.7 42.6C91.3 42.6 92 42.3 92.7 41.9C93.4 41.4 94.2 40.9 94.9 40.2C95.2 39.9 95.6 39.6 95.9 39.3C95.8 40.4 95.8 41.3 95.8 42.2C95.6 43.2 95.7 43.9 95.8 44.5Z\"/>\n" +
    "<path d=\"M18.3 51.5C19.7 51.4 20.9 51.1 22.1 50.5C23.3 49.9 24.3 49.1 25.2 48.2C26.1 47.2 27 46.1 27.7 44.8C28.4 43.5 29.1 42.1 29.7 40.7C30.3 39.2 30.7 37.7 31.1 36.2C31.5 34.6 31.8 33.1 32 31.6C32.2 30.1 32.4 28.6 32.5 27.2C32.6 25.8 32.6 24.5 32.5 23.4C32.4 21.7 32.2 20.2 31.7 18.8C31.3 17.4 30.7 16.1 29.9 15.1C29.1 14.1 28.2 13.2 27 12.7C25.9 12.1 24.6 11.9 23.1 12C21.5 12.1 20 12.5 18.6 13.4C17.2 14.2 15.8 15.3 14.6 16.7C13.4 18.1 12.2 19.6 11.2 21.4C10.2 23.2 9.4 25 8.7 27C8 28.9 7.5 30.9 7.2 32.9C6.9 34.9 6.7 36.8 6.8 38.6C6.9 40.6 7.2 42.4 7.8 44C8.4 45.7 9.1 47.1 10.1 48.3C11.1 49.5 12.2 50.4 13.6 51C15.1 51.3 16.6 51.6 18.3 51.5ZM18 57.5C15.4 57.6 13.1 57.2 11 56.3C8.9 55.4 7.1 54 5.6 52.2C4.1 50.4 2.9 48.2 2 45.7C1.1 43.2 0.600003 40.4 0.400003 37.3C0.300003 35.6 0.400003 33.9 0.500003 32.2C0.700003 30.5 0.900003 28.7 1.3 26.9C1.7 25.1 2.2 23.4 2.9 21.7C3.5 20 4.3 18.4 5.2 16.9C6.1 15.4 7.1 14 8.2 12.6C9.3 11.3 10.6 10.2 12 9.2C13.4 8.2 14.9 7.4 16.6 6.9C18.2 6.3 20 6 21.9 5.9C24.5 5.8 26.8 6.1 28.9 7C31 7.8 32.7 9 34.2 10.7C35.7 12.3 36.8 14.2 37.7 16.5C38.6 18.8 39 21.3 39.2 24.1C39.3 26.4 39.2 28.8 38.9 31.3C38.6 33.8 38 36.3 37.3 38.7C36.5 41.1 35.6 43.5 34.4 45.7C33.2 47.9 31.8 49.9 30.2 51.6C28.6 53.3 26.8 54.7 24.7 55.8C22.6 56.8 20.4 57.4 18 57.5Z\"/>\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8.49999 67.3C40.1 56.8 72.8 52.6 106.4 53.9C109 53.9 107.7 55.8 106.6 57.6C105.9 58.8 105.6 58.5 103.4 58.3C86.4 56.9 65.6 59.2 48.9 62.8C34.1 66 20.9 69.3 8.79999 77.1C7.49999 77.9 6.49999 77.6 6.19999 76.3C5.99999 74 6.19999 72.1 6.69999 70C7.09999 68.8 7.09999 67.8 8.49999 67.3Z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-activity\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22 11h-4c-0.439 0-0.812 0.283-0.949 0.684l-2.051 6.154-5.051-15.154c-0.175-0.524-0.741-0.807-1.265-0.633-0.31 0.103-0.535 0.343-0.633 0.633l-2.772 8.316h-3.279c-0.552 0-1 0.448-1 1s0.448 1 1 1h4c0.423-0.003 0.81-0.267 0.949-0.684l2.051-6.154 5.051 15.154c0.098 0.29 0.323 0.529 0.632 0.632 0.524 0.175 1.090-0.109 1.265-0.632l2.773-8.316h3.279c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-airplay\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 16h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1c-0.552 0-1 0.448-1 1s0.448 1 1 1h1c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-16c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM12.768 14.36c-0.035-0.043-0.079-0.087-0.128-0.128-0.424-0.354-1.055-0.296-1.408 0.128l-5 6c-0.144 0.172-0.232 0.396-0.232 0.64 0 0.552 0.448 1 1 1h10c0.225 0.001 0.453-0.075 0.64-0.232 0.424-0.354 0.482-0.984 0.128-1.408zM12 16.562l2.865 3.438h-5.73z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-alert-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM11 8v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM12 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-alert-octagon\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.86 1c-0.256 0-0.512 0.098-0.707 0.293l-5.86 5.86c-0.181 0.181-0.293 0.431-0.293 0.707v8.28c0 0.256 0.098 0.512 0.293 0.707l5.86 5.86c0.181 0.181 0.431 0.293 0.707 0.293h8.28c0.256 0 0.512-0.098 0.707-0.293l5.86-5.86c0.181-0.181 0.293-0.431 0.293-0.707v-8.28c0-0.256-0.098-0.512-0.293-0.707l-5.86-5.86c-0.181-0.181-0.431-0.293-0.707-0.293zM8.274 3h7.452l5.274 5.274v7.452l-5.274 5.274h-7.452l-5.274-5.274v-7.452zM11 8v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM12 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-alert-triangle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.148 4.374c0.073-0.123 0.185-0.242 0.334-0.332 0.236-0.143 0.506-0.178 0.756-0.116s0.474 0.216 0.614 0.448l8.466 14.133c0.070 0.12 0.119 0.268 0.128 0.434-0.015 0.368-0.119 0.591-0.283 0.759-0.18 0.184-0.427 0.298-0.693 0.301l-16.937-0.001c-0.152-0.001-0.321-0.041-0.481-0.134-0.239-0.138-0.399-0.359-0.466-0.607s-0.038-0.519 0.092-0.745zM9.432 3.346l-8.47 14.14c-0.422 0.731-0.506 1.55-0.308 2.29s0.68 1.408 1.398 1.822c0.464 0.268 0.976 0.4 1.475 0.402h16.943c0.839-0.009 1.587-0.354 2.123-0.902s0.864-1.303 0.855-2.131c-0.006-0.536-0.153-1.044-0.406-1.474l-8.474-14.147c-0.432-0.713-1.11-1.181-1.854-1.363s-1.561-0.081-2.269 0.349c-0.429 0.26-0.775 0.615-1.012 1.014zM11 9v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-align-center\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 9h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1h12c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 5h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 13h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM18 17h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1h12c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-align-justify\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 9h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 5h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 13h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 17h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-align-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 9h-14c-0.552 0-1 0.448-1 1s0.448 1 1 1h14c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 5h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 13h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM17 17h-14c-0.552 0-1 0.448-1 1s0.448 1 1 1h14c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-align-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 9h-14c-0.552 0-1 0.448-1 1s0.448 1 1 1h14c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 5h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 13h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1h18c0.552 0 1-0.448 1-1s-0.448-1-1-1zM21 17h-14c-0.552 0-1 0.448-1 1s0.448 1 1 1h14c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-anchor\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14 5c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM5 11h-3c-0.552 0-1 0.448-1 1 0 3.037 1.232 5.789 3.222 7.778s4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778c0-0.552-0.448-1-1-1h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h1.945c-0.23 2.086-1.173 3.956-2.581 5.364s-3.278 2.351-5.364 2.581v-12.071c0.703-0.181 1.332-0.549 1.828-1.045 0.723-0.723 1.172-1.725 1.172-2.829s-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828c0.496 0.497 1.125 0.865 1.828 1.046v12.071c-2.086-0.23-3.956-1.173-5.364-2.581s-2.351-3.278-2.581-5.364h1.945c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-aperture\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.422 7l2.223-3.85c1.825 0.337 3.457 1.225 4.719 2.486 0.416 0.416 0.792 0.873 1.121 1.364h-5.194zM7.38 10l-2.222-3.847c0.153-0.179 0.312-0.351 0.478-0.517 1.5-1.5 3.525-2.472 5.775-2.617l-2.592 4.49zM7.958 15h-4.446c-0.332-0.938-0.512-1.948-0.512-3 0-1.43 0.333-2.781 0.926-3.982l2.6 4.504zM17.473 11.478l-1.431-2.478h4.446c0.332 0.938 0.512 1.948 0.512 3 0 1.43-0.333 2.781-0.926 3.982l-2.576-4.462zM12.588 20.981l4.032-6.981 2.222 3.848c-0.153 0.178-0.312 0.351-0.478 0.516-1.5 1.5-3.525 2.472-5.775 2.617zM10.7 22.924c0.046 0.008 0.092 0.014 0.139 0.015 0.381 0.040 0.769 0.061 1.161 0.061 3.037 0 5.789-1.232 7.778-3.222 0.366-0.366 0.706-0.757 1.017-1.171 0.042-0.047 0.079-0.097 0.11-0.149 1.318-1.813 2.095-4.046 2.095-6.458 0-1.539-0.317-3.005-0.888-4.336-0.016-0.044-0.034-0.086-0.055-0.126-0.553-1.244-1.33-2.367-2.279-3.316-1.701-1.701-3.96-2.849-6.478-3.146-0.046-0.008-0.092-0.014-0.139-0.015-0.381-0.040-0.769-0.061-1.161-0.061-3.037 0-5.789 1.232-7.778 3.222-0.366 0.365-0.706 0.757-1.017 1.171-0.042 0.047-0.079 0.097-0.111 0.149-1.317 1.813-2.094 4.046-2.094 6.458 0 1.539 0.317 3.005 0.888 4.336 0.016 0.044 0.034 0.086 0.055 0.126 0.553 1.244 1.33 2.367 2.279 3.316 1.701 1.701 3.96 2.849 6.478 3.146zM12.578 17l-2.223 3.85c-1.825-0.337-3.457-1.225-4.719-2.486-0.416-0.416-0.792-0.873-1.121-1.364h5.194zM15.465 12l-1.732 3h-3.466l-1.732-3 1.732-3h3.466z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-archive\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 9h16v11h-16zM1 2c-0.552 0-1 0.448-1 1v5c0 0.552 0.448 1 1 1h1v12c0 0.552 0.448 1 1 1h18c0.552 0 1-0.448 1-1v-12h1c0.552 0 1-0.448 1-1v-5c0-0.552-0.448-1-1-1zM2 4h20v3h-20zM10 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.293 11.293l-5.293 5.293v-11.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v11.586l-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l7 7c0.092 0.092 0.202 0.166 0.324 0.217 0.245 0.101 0.521 0.101 0.766 0 0.118-0.049 0.228-0.121 0.324-0.217l7-7c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-down-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM11 8v5.586l-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4 4c0.092 0.092 0.202 0.166 0.324 0.217 0.245 0.101 0.521 0.101 0.766 0 0.118-0.049 0.228-0.121 0.324-0.217l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293v-5.586c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-down-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 16h-7.586l8.293-8.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-8.293 8.293v-7.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v10c0 0.552 0.448 1 1 1h10c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-down-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16 7v7.586l-8.293-8.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l8.293 8.293h-7.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h10c0.136 0 0.265-0.027 0.383-0.076s0.228-0.121 0.324-0.217c0.092-0.092 0.166-0.202 0.217-0.324 0.049-0.118 0.076-0.247 0.076-0.383v-10c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.707 18.293l-5.293-5.293h11.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-11.586l5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-7 7c-0.096 0.096-0.168 0.206-0.217 0.324-0.051 0.122-0.076 0.253-0.076 0.383 0 0.256 0.098 0.512 0.293 0.707l7 7c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-left-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM16 11h-5.586l2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4 4c-0.096 0.096-0.168 0.206-0.217 0.324-0.051 0.122-0.076 0.253-0.076 0.383 0 0.256 0.098 0.512 0.293 0.707l4 4c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293h5.586c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.293 5.707l5.293 5.293h-11.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h11.586l-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l7-7c0.092-0.092 0.166-0.202 0.217-0.324 0.101-0.245 0.101-0.521 0-0.766-0.049-0.118-0.121-0.228-0.217-0.324l-7-7c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-right-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h5.586l-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l4-4c0.092-0.092 0.166-0.202 0.217-0.324 0.101-0.245 0.101-0.521 0-0.766-0.049-0.118-0.121-0.228-0.217-0.324l-4-4c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293h-5.586c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.707 12.707l5.293-5.293v11.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-11.586l5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-7-7c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076c-0.256 0-0.512 0.098-0.707 0.293l-7 7c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-up-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM13 16v-5.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.096-0.096-0.206-0.168-0.324-0.217-0.122-0.051-0.253-0.076-0.383-0.076-0.256 0-0.512 0.098-0.707 0.293l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293v5.586c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-up-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-arrow-up-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 8h7.586l-8.293 8.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l8.293-8.293v7.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-10c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-10c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-at-sign\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 12c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM15.74 15.318c0.13 0.182 0.274 0.353 0.431 0.51 0.723 0.723 1.725 1.172 2.829 1.172s2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828v-1c0-3.037-1.233-5.789-3.222-7.778s-4.741-3.222-7.779-3.221-5.788 1.232-7.778 3.222-3.221 4.741-3.221 7.778 1.233 5.789 3.222 7.778 4.741 3.222 7.778 3.221c2.525 0 4.855-0.852 6.69-2.269 0.437-0.337 0.518-0.965 0.18-1.403s-0.965-0.518-1.403-0.18c-1.487 1.148-3.377 1.844-5.435 1.852-2.54-0.009-4.776-1.014-6.398-2.636-1.627-1.629-2.634-3.877-2.634-6.363s1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.363v1c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414v-5c0-0.552-0.448-1-1-1s-1 0.448-1 1c-0.835-0.627-1.875-1-3-1-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464c0.070-0.070 0.139-0.143 0.205-0.217z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-award\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.986 15.424l0.75 5.652-3.221-1.933c-0.311-0.184-0.703-0.196-1.029 0l-3.221 1.933 0.751-5.651c0.921 0.371 1.929 0.575 2.984 0.575s2.063-0.205 2.986-0.576zM15.332 12.991c-0.058 0.030-0.113 0.065-0.163 0.105-0.92 0.573-2.005 0.904-3.169 0.904-1.657 0-3.156-0.67-4.243-1.757s-1.757-2.586-1.757-4.243 0.67-3.156 1.757-4.243 2.586-1.757 4.243-1.757 3.156 0.67 4.243 1.757 1.757 2.586 1.757 4.243-0.67 3.156-1.757 4.243c-0.278 0.278-0.583 0.529-0.911 0.748zM7.14 14.355l-1.131 8.513c-0.073 0.547 0.312 1.050 0.86 1.123 0.234 0.031 0.461-0.022 0.646-0.134l4.485-2.691 4.486 2.691c0.474 0.284 1.088 0.131 1.372-0.343 0.122-0.203 0.163-0.431 0.134-0.646l-1.13-8.515c0.28-0.215 0.546-0.448 0.795-0.697 1.446-1.446 2.343-3.447 2.343-5.656s-0.897-4.21-2.343-5.657-3.448-2.343-5.657-2.343-4.21 0.897-5.657 2.343-2.343 3.448-2.343 5.657 0.897 4.21 2.343 5.657c0.25 0.25 0.516 0.483 0.796 0.698z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bar-chart\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13 20v-10c0-0.552-0.448-1-1-1s-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1zM19 20v-16c0-0.552-0.448-1-1-1s-1 0.448-1 1v16c0 0.552 0.448 1 1 1s1-0.448 1-1zM7 20v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bar-chart-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19 20v-10c0-0.552-0.448-1-1-1s-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1zM13 20v-16c0-0.552-0.448-1-1-1s-1 0.448-1 1v16c0 0.552 0.448 1 1 1s1-0.448 1-1zM7 20v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-battery\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 5c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v8c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-8c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM3 7h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v8c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-8c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM24 13v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-battery-charging\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 17h-2c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-8c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h3.19c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.19c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v8c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h2c0.552 0 1-0.448 1-1s-0.448-1-1-1zM15 7h2c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v8c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-3.19c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.19c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-8c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM24 13v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM10.168 5.445l-4 6c-0.306 0.46-0.182 1.080 0.277 1.387 0.172 0.115 0.367 0.169 0.555 0.168h4.131l-2.964 4.445c-0.306 0.46-0.182 1.080 0.277 1.387s1.080 0.182 1.387-0.277l4-6c0.106-0.156 0.169-0.348 0.169-0.555 0-0.552-0.448-1-1-1h-4.131l2.964-4.445c0.306-0.46 0.182-1.080-0.277-1.387s-1.080-0.182-1.387 0.277z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bell\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 8c0 4.011 0.947 6.52 1.851 8h-13.702c0.904-1.48 1.851-3.989 1.851-8 0-1.381 0.559-2.63 1.464-3.536s2.155-1.464 3.536-1.464 2.63 0.559 3.536 1.464 1.464 2.155 1.464 3.536zM19 8c0-1.933-0.785-3.684-2.050-4.95s-3.017-2.050-4.95-2.050-3.684 0.785-4.95 2.050-2.050 3.017-2.050 4.95c0 6.127-2.393 8.047-2.563 8.174-0.453 0.308-0.573 0.924-0.269 1.381 0.192 0.287 0.506 0.443 0.832 0.445h18c0.552 0 1-0.448 1-1 0-0.339-0.168-0.638-0.429-0.821-0.176-0.13-2.571-2.050-2.571-8.179zM12.865 20.498c-0.139 0.239-0.359 0.399-0.608 0.465s-0.52 0.037-0.759-0.101c-0.162-0.094-0.283-0.222-0.359-0.357-0.274-0.48-0.884-0.647-1.364-0.373s-0.647 0.884-0.373 1.364c0.25 0.439 0.623 0.823 1.093 1.096 0.716 0.416 1.535 0.501 2.276 0.304s1.409-0.678 1.824-1.394c0.277-0.478 0.114-1.090-0.363-1.367s-1.090-0.114-1.367 0.363z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bell-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.865 20.498c-0.139 0.239-0.359 0.399-0.608 0.465s-0.52 0.037-0.759-0.101c-0.162-0.094-0.283-0.222-0.359-0.357-0.274-0.48-0.884-0.647-1.364-0.373s-0.647 0.884-0.373 1.364c0.25 0.439 0.623 0.823 1.093 1.096 0.716 0.416 1.535 0.501 2.276 0.304s1.409-0.678 1.824-1.394c0.277-0.478 0.114-1.090-0.363-1.367s-1.090-0.114-1.367 0.363zM19 7.977c-0.004-1.923-0.784-3.666-2.043-4.928-1.264-1.268-3.014-2.055-4.947-2.058-1.448-0.002-2.799 0.437-3.9 1.18-0.457 0.309-0.578 0.931-0.269 1.389s0.931 0.578 1.389 0.269c0.764-0.516 1.708-0.829 2.73-0.837 1.448 0.011 2.684 0.569 3.581 1.47 0.902 0.905 1.458 2.15 1.459 3.526-0.042 1.658 0.173 3.476 0.665 5.277 0.146 0.533 0.695 0.847 1.228 0.701s0.847-0.695 0.701-1.228c-0.443-1.625-0.632-3.25-0.594-4.708 0-0.005 0-0.011 0-0.016 0-0.003 0-0.006 0-0.009zM6.996 8.411l7.59 7.589h-9.437c0.872-1.428 1.783-3.812 1.847-7.589zM0.293 1.707l4.856 4.856c-0.106 0.493-0.155 0.984-0.149 1.45 0 6.114-2.393 8.034-2.563 8.161-0.453 0.308-0.573 0.924-0.269 1.381 0.192 0.287 0.506 0.443 0.832 0.445h13.586l5.707 5.707c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-22-22c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bluetooth\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13 9.586v-6.172l3.086 3.086zM13 14.414l3.086 3.086-3.086 3.086zM5.793 7.207l4.793 4.793-4.793 4.793c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.793-3.793v8.586c0 0.256 0.098 0.512 0.293 0.707 0.391 0.391 1.024 0.391 1.414 0l5.5-5.5c0.391-0.391 0.391-1.024 0-1.414l-4.793-4.793 4.793-4.793c0.391-0.391 0.391-1.024 0-1.414l-5.5-5.5c-0.181-0.181-0.431-0.293-0.707-0.293-0.552 0-1 0.448-1 1v8.586l-3.793-3.793c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bold\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 11v-6h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121-0.335 1.577-0.879 2.121-1.292 0.879-2.121 0.879zM5 12v8c0 0.552 0.448 1 1 1h9c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536-0.561-2.632-1.464-3.536c-0.325-0.325-0.695-0.606-1.1-0.832 0.034-0.032 0.067-0.064 0.1-0.097 0.903-0.903 1.464-2.155 1.464-3.535s-0.561-2.632-1.464-3.536-2.156-1.464-3.536-1.464h-8c-0.552 0-1 0.448-1 1zM7 13h8c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121-0.335 1.577-0.879 2.121-1.292 0.879-2.121 0.879h-8z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-book\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6.5 1c-0.966 0-1.843 0.393-2.475 1.025s-1.025 1.509-1.025 2.475v15c0 0.966 0.393 1.843 1.025 2.475s1.509 1.025 2.475 1.025h13.5c0.552 0 1-0.448 1-1v-20c0-0.552-0.448-1-1-1zM19 18v3h-12.5c-0.414 0-0.788-0.167-1.061-0.439s-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439zM6.5 3h12.5v13h-12.5c-0.537 0-1.045 0.121-1.5 0.337v-11.837c0-0.414 0.167-0.788 0.439-1.061s0.647-0.439 1.061-0.439z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-book-open\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 4v13h-6c-0.728 0-1.412 0.195-2 0.535v-10.535c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879zM11 17.535c-0.588-0.34-1.272-0.535-2-0.535h-6v-13h5c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121zM22 2h-6c-1.38 0-2.632 0.561-3.536 1.464-0.167 0.167-0.322 0.346-0.464 0.536-0.142-0.19-0.297-0.369-0.464-0.536-0.904-0.903-2.156-1.464-3.536-1.464h-6c-0.552 0-1 0.448-1 1v15c0 0.552 0.448 1 1 1h7c0.553 0 1.051 0.223 1.414 0.586s0.586 0.861 0.586 1.414c0 0.552 0.448 1 1 1s1-0.448 1-1c0-0.553 0.223-1.051 0.586-1.414s0.861-0.586 1.414-0.586h7c0.552 0 1-0.448 1-1v-15c0-0.552-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-bookmark\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.419 21.814c0.161 0.116 0.363 0.186 0.581 0.186 0.552 0 1-0.448 1-1v-16c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-10c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c-0.001 0.199 0.060 0.404 0.186 0.581 0.321 0.449 0.946 0.554 1.395 0.232l6.419-4.584zM18 19.057l-5.419-3.871c-0.355-0.254-0.819-0.242-1.162 0l-5.419 3.871v-14.057c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h10c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-box\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.961 6.828l-6.961 4.027-6.961-4.027 6.456-3.689c0.112-0.064 0.232-0.105 0.355-0.124 0.218-0.034 0.445 0.003 0.654 0.124zM11.526 22.961c0.141 0.076 0.303 0.119 0.474 0.119 0.173 0 0.336-0.044 0.478-0.121 0.356-0.058 0.701-0.18 1.017-0.36l7.001-4.001c0.618-0.357 1.060-0.897 1.299-1.514 0.133-0.342 0.202-0.707 0.205-1.084v-8c0-0.478-0.113-0.931-0.314-1.334-0.022-0.071-0.052-0.14-0.091-0.207-0.046-0.079-0.1-0.149-0.162-0.21-0.031-0.043-0.064-0.086-0.097-0.127-0.23-0.286-0.512-0.528-0.831-0.715l-7.009-4.005c-0.61-0.352-1.3-0.465-1.954-0.364-0.363 0.057-0.715 0.179-1.037 0.363l-7.001 4.001c-0.383 0.221-0.699 0.513-0.941 0.85-0.060 0.060-0.114 0.13-0.159 0.207-0.039 0.068-0.070 0.138-0.092 0.21-0.040 0.080-0.076 0.163-0.108 0.246-0.132 0.343-0.201 0.708-0.204 1.078v8.007c0.001 0.71 0.248 1.363 0.664 1.878 0.23 0.286 0.512 0.528 0.831 0.715l7.009 4.005c0.324 0.187 0.67 0.307 1.022 0.362zM11 12.587v7.991l-6.495-3.711c-0.111-0.065-0.207-0.148-0.285-0.245-0.139-0.172-0.22-0.386-0.22-0.622v-7.462zM13 20.578v-7.991l7-4.049v7.462c-0.001 0.121-0.025 0.246-0.070 0.362-0.080 0.206-0.225 0.384-0.426 0.5z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-briefcase\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9 6v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 20v-12h6v12zM7 8v12h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM17 6v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-3c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM17 20v-12h3c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-calendar\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 2v1h-2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-2v-1c0-0.552-0.448-1-1-1s-1 0.448-1 1v1h-6v-1c0-0.552-0.448-1-1-1s-1 0.448-1 1zM20 9h-16v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h2v1c0 0.552 0.448 1 1 1s1-0.448 1-1v-1h6v1c0 0.552 0.448 1 1 1s1-0.448 1-1v-1h2c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM4 11h16v9c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-camera\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M24 19v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-6c-0.326 0.002-0.64 0.158-0.832 0.445l-1.703 2.555h-3.465c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h18c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121zM22 19c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-18c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-11c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.346 0 0.65-0.175 0.832-0.445l1.703-2.555h4.93l1.703 2.555c0.192 0.287 0.506 0.443 0.832 0.445h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM17 13c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM15 13c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-camera-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9 4h5.465l1.703 2.555c0.192 0.287 0.506 0.443 0.832 0.445h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v9.34c0 0.552 0.448 1 1 1s1-0.448 1-1v-9.34c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1zM8.262 9.676c-0.146 0.163-0.283 0.337-0.409 0.522-0.78 1.139-1.023 2.489-0.788 3.745s0.952 2.426 2.091 3.205 2.489 1.023 3.745 0.788c0.887-0.166 1.73-0.572 2.424-1.197l3.261 3.261h-15.586c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-11c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h2.586zM10.413 8.998l-8.706-8.705c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3.293 3.293h-0.586c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h17.586l1.707 1.707c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-13.268-13.268zM13.907 15.321c-0.4 0.336-0.875 0.555-1.375 0.649-0.756 0.142-1.563-0.005-2.247-0.473s-1.113-1.167-1.255-1.923 0.005-1.563 0.473-2.247c0.056-0.082 0.115-0.16 0.176-0.233z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cast\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M1.8 17.080c0.938 0.191 1.729 0.694 2.292 1.386 0.405 0.497 0.693 1.093 0.829 1.741 0.114 0.54 0.644 0.886 1.185 0.772s0.886-0.644 0.772-1.185c-0.202-0.96-0.63-1.847-1.235-2.591-0.845-1.038-2.038-1.796-3.443-2.083-0.541-0.11-1.069 0.239-1.18 0.78s0.239 1.069 0.78 1.18zM1.889 13.044c2.001 0.223 3.744 1.163 5.006 2.546 1.119 1.226 1.859 2.799 2.061 4.526 0.064 0.549 0.561 0.941 1.109 0.877s0.941-0.561 0.877-1.109c-0.251-2.15-1.174-4.112-2.57-5.642-1.578-1.729-3.763-2.908-6.263-3.186-0.549-0.061-1.043 0.334-1.104 0.883s0.334 1.043 0.883 1.104zM3 8v-2c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-16c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM2 21c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-check\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-check-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 11.080v0.92c-0.001 2.485-1.009 4.733-2.64 6.362s-3.88 2.634-6.365 2.632-4.734-1.009-6.362-2.64-2.634-3.879-2.633-6.365 1.009-4.733 2.64-6.362 3.88-2.634 6.365-2.633c1.33 0.001 2.586 0.289 3.649 0.775 0.502 0.23 1.096 0.008 1.325-0.494s0.008-1.096-0.494-1.325c-1.327-0.606-2.866-0.955-4.479-0.956-3.037-0.002-5.789 1.229-7.78 3.217s-3.224 4.74-3.226 7.777 1.229 5.789 3.217 7.78 4.739 3.225 7.776 3.226 5.789-1.229 7.78-3.217 3.225-4.739 3.227-7.777v-0.92c0-0.552-0.448-1-1-1s-1 0.448-1 1zM21.293 3.293l-9.293 9.302-2.293-2.292c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3 3c0.391 0.391 1.024 0.39 1.415 0l10-10.010c0.39-0.391 0.39-1.024-0.001-1.414s-1.024-0.39-1.414 0.001z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-check-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8.293 11.707l3 3c0.391 0.391 1.024 0.391 1.414 0l10-10c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-9.293 9.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM20 12v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h11c0.552 0 1-0.448 1-1s-0.448-1-1-1h-11c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevron-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevron-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevron-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevron-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.707 14.293l-6-6c-0.391-0.391-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevrons-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6.293 13.707l5 5c0.391 0.391 1.024 0.391 1.414 0l5-5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4.293 4.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM6.293 6.707l5 5c0.391 0.391 1.024 0.391 1.414 0l5-5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4.293 4.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevrons-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.707 16.293l-4.293-4.293 4.293-4.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414zM18.707 16.293l-4.293-4.293 4.293-4.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevrons-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13.707 17.707l5-5c0.391-0.391 0.391-1.024 0-1.414l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4.293 4.293-4.293 4.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM6.707 17.707l5-5c0.391-0.391 0.391-1.024 0-1.414l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4.293 4.293-4.293 4.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chevrons-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.707 10.293l-5-5c-0.391-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l4.293-4.293 4.293 4.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414zM17.707 17.293l-5-5c-0.391-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l4.293-4.293 4.293 4.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-chrome\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.402 10.033l-2.244-3.881c0.152-0.178 0.312-0.35 0.478-0.516 1.63-1.63 3.878-2.636 6.364-2.636s4.734 1.006 6.364 2.636c0.416 0.416 0.792 0.873 1.121 1.364h-7.485c-1.38 0-2.632 0.561-3.536 1.464-0.447 0.447-0.81 0.978-1.063 1.569zM10.7 22.924c0.046 0.008 0.092 0.014 0.139 0.015 0.381 0.040 0.769 0.061 1.161 0.061 3.037 0 5.789-1.232 7.778-3.222s3.222-4.741 3.222-7.778c0-1.539-0.317-3.005-0.888-4.336-0.016-0.044-0.034-0.086-0.055-0.126-0.553-1.244-1.33-2.367-2.279-3.316-1.989-1.99-4.741-3.222-7.778-3.222s-5.789 1.232-7.778 3.222c-0.366 0.365-0.706 0.757-1.017 1.171-0.042 0.047-0.079 0.097-0.111 0.149-1.317 1.813-2.094 4.046-2.094 6.458 0 3.037 1.232 5.789 3.222 7.778 1.701 1.701 3.96 2.849 6.478 3.146zM12.595 16.965l-2.241 3.885c-1.825-0.337-3.457-1.225-4.718-2.486-1.63-1.63-2.636-3.878-2.636-6.364 0-1.43 0.333-2.782 0.927-3.982l3.643 6.302c0.236 0.45 0.539 0.859 0.894 1.215 0.904 0.904 2.156 1.465 3.536 1.465 0.201 0 0.4-0.012 0.595-0.035zM14.638 13.431c-0.015 0.022-0.030 0.046-0.044 0.069l-0.076 0.132c-0.115 0.176-0.248 0.34-0.396 0.489-0.545 0.544-1.293 0.879-2.122 0.879s-1.577-0.335-2.121-0.879c-0.166-0.166-0.312-0.351-0.436-0.551-0.011-0.024-0.024-0.047-0.037-0.070l-0.082-0.141c-0.207-0.408-0.324-0.87-0.324-1.359 0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121c0 0.518-0.131 1.006-0.362 1.431zM12.588 20.981l3.64-6.311c0.489-0.772 0.772-1.688 0.772-2.67 0-1.125-0.373-2.165-1-3h4.488c0.332 0.938 0.512 1.948 0.512 3 0 2.486-1.006 4.734-2.636 6.364-1.5 1.5-3.525 2.472-5.776 2.617z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-clipboard\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 5c0 0.552 0.225 1.053 0.586 1.414s0.862 0.586 1.414 0.586h6c0.552 0 1.053-0.225 1.414-0.586s0.586-0.862 0.586-1.414h1c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM9 1c-0.552 0-1.053 0.225-1.414 0.586s-0.586 0.862-0.586 1.414h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-1c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586zM9 3h6v2h-6z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-clock\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM11 6v6c0 0.389 0.222 0.727 0.553 0.894l4 2c0.494 0.247 1.095 0.047 1.342-0.447s0.047-1.095-0.447-1.342l-3.448-1.723v-5.382c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 11c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-8.995c-1.463-0.008-2.853-0.461-4.005-1.258-1.334-0.922-2.348-2.304-2.784-3.992-0.483-1.872-0.163-3.761 0.748-5.305s2.408-2.739 4.28-3.223 3.761-0.163 5.305 0.748 2.739 2.408 3.223 4.28c0.115 0.435 0.505 0.75 0.968 0.75zM18 9h-0.52c-0.725-2.057-2.143-3.708-3.915-4.753-1.983-1.169-4.415-1.583-6.821-0.961s-4.334 2.16-5.503 4.143-1.582 4.415-0.961 6.821c0.56 2.169 1.867 3.951 3.583 5.137 1.478 1.023 3.261 1.603 5.132 1.613h9.005c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud-drizzle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 19v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM7 13v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM15 19v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM15 13v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 21v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 15v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM20.401 17.496c1.517-0.665 2.623-1.883 3.181-3.312s0.572-3.074-0.092-4.591c-0.574-1.311-1.563-2.316-2.752-2.925-0.836-0.428-1.771-0.66-2.73-0.668h-0.528c-0.725-2.057-2.143-3.708-3.915-4.753-1.983-1.169-4.415-1.582-6.821-0.961s-4.334 2.161-5.503 4.144-1.582 4.415-0.961 6.821c0.509 1.97 1.634 3.623 3.099 4.783 0.433 0.343 1.062 0.27 1.405-0.163s0.27-1.062-0.163-1.405c-1.132-0.897-2.008-2.179-2.405-3.716-0.483-1.871-0.163-3.76 0.748-5.305s2.408-2.739 4.28-3.223 3.761-0.163 5.305 0.748 2.739 2.408 3.223 4.28c0.115 0.435 0.505 0.75 0.968 0.75h1.252c0.647 0.005 1.275 0.162 1.834 0.448 0.793 0.406 1.448 1.073 1.832 1.947 0.443 1.012 0.435 2.106 0.062 3.061s-1.109 1.765-2.121 2.208c-0.506 0.222-0.736 0.811-0.515 1.317s0.811 0.736 1.317 0.515z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud-lightning\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19.199 17.88c1.623-0.33 2.961-1.288 3.808-2.566s1.208-2.884 0.878-4.507c-0.303-1.491-1.136-2.742-2.267-3.592-1.018-0.767-2.279-1.21-3.614-1.215h-0.524c-0.725-2.057-2.143-3.708-3.915-4.753-1.983-1.169-4.415-1.582-6.821-0.961s-4.334 2.162-5.503 4.144-1.582 4.415-0.961 6.821c0.597 2.313 2.043 4.184 3.919 5.365 0.143 0.090 0.288 0.176 0.436 0.258 0.483 0.268 1.092 0.093 1.359-0.39s0.093-1.092-0.39-1.359c-0.115-0.064-0.229-0.131-0.34-0.201-1.462-0.921-2.583-2.374-3.048-4.173-0.483-1.872-0.163-3.761 0.747-5.305s2.408-2.739 4.28-3.223 3.761-0.163 5.305 0.747 2.739 2.408 3.223 4.28c0.116 0.435 0.506 0.75 0.969 0.75h1.256c0.896 0.004 1.74 0.3 2.42 0.812 0.754 0.567 1.307 1.397 1.509 2.392 0.22 1.083-0.019 2.15-0.585 3.005s-1.456 1.491-2.539 1.711c-0.541 0.11-0.891 0.638-0.781 1.179s0.638 0.891 1.179 0.781zM12.168 10.445l-4 6c-0.306 0.46-0.182 1.080 0.277 1.387 0.172 0.115 0.367 0.169 0.555 0.168h4.131l-2.964 4.445c-0.306 0.46-0.182 1.080 0.277 1.387s1.080 0.182 1.387-0.277l4-6c0.106-0.156 0.169-0.348 0.169-0.555 0-0.552-0.448-1-1-1h-4.131l2.964-4.445c0.306-0.46 0.182-1.080-0.277-1.387s-1.080-0.182-1.387 0.277z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23.531 17.34c0.646-1.525 0.612-3.17 0.036-4.592s-1.696-2.627-3.221-3.273c-0.776-0.328-1.588-0.483-2.357-0.475h-0.506c-0.62-1.78-1.761-3.26-3.211-4.309-1.298-0.938-2.844-1.531-4.487-1.687-0.55-0.052-1.038 0.351-1.090 0.901s0.351 1.038 0.901 1.090c1.286 0.122 2.493 0.586 3.505 1.317 1.283 0.928 2.252 2.286 2.671 3.934 0.112 0.437 0.503 0.754 0.968 0.754h1.271c0.49-0.005 1.030 0.094 1.555 0.317 1.017 0.431 1.763 1.232 2.148 2.182s0.407 2.044-0.024 3.061c-0.215 0.509 0.022 1.095 0.531 1.311s1.095-0.022 1.311-0.531zM4.854 6.268l12.732 12.732h-8.596c-0.96 0.010-1.903-0.172-2.774-0.527-1.431-0.583-2.669-1.635-3.471-3.085-0.935-1.692-1.097-3.601-0.601-5.324 0.432-1.5 1.36-2.854 2.709-3.797zM0.293 1.707l3.129 3.13c-1.581 1.2-2.676 2.856-3.2 4.675-0.637 2.212-0.43 4.67 0.773 6.845 1.030 1.863 2.626 3.219 4.466 3.969 1.117 0.454 2.324 0.686 3.549 0.674h8.99c0.489-0.001 0.967-0.060 1.417-0.169l2.876 2.876c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-22-22c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud-rain\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 13v8c0 0.552 0.448 1 1 1s1-0.448 1-1v-8c0-0.552-0.448-1-1-1s-1 0.448-1 1zM7 13v8c0 0.552 0.448 1 1 1s1-0.448 1-1v-8c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 15v8c0 0.552 0.448 1 1 1s1-0.448 1-1v-8c0-0.552-0.448-1-1-1s-1 0.448-1 1zM20.401 17.496c1.517-0.665 2.623-1.883 3.181-3.312s0.572-3.074-0.092-4.591c-0.574-1.311-1.563-2.316-2.752-2.925-0.836-0.428-1.771-0.66-2.73-0.668h-0.528c-0.725-2.057-2.143-3.708-3.915-4.753-1.983-1.169-4.415-1.582-6.821-0.961s-4.334 2.161-5.503 4.144-1.582 4.415-0.961 6.821c0.509 1.97 1.634 3.623 3.099 4.783 0.433 0.343 1.062 0.27 1.405-0.163s0.27-1.062-0.163-1.405c-1.132-0.897-2.008-2.179-2.405-3.716-0.483-1.871-0.163-3.76 0.748-5.305s2.408-2.739 4.28-3.223 3.761-0.163 5.305 0.748 2.739 2.408 3.223 4.28c0.115 0.435 0.505 0.75 0.968 0.75h1.252c0.647 0.005 1.275 0.162 1.834 0.448 0.793 0.406 1.448 1.073 1.832 1.947 0.443 1.012 0.435 2.106 0.062 3.061s-1.109 1.765-2.121 2.208c-0.506 0.222-0.736 0.811-0.515 1.317s0.811 0.736 1.317 0.515z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cloud-snow\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.401 18.496c1.517-0.665 2.623-1.883 3.181-3.312s0.572-3.074-0.092-4.591c-0.574-1.311-1.563-2.316-2.752-2.925-0.836-0.428-1.771-0.66-2.73-0.668h-0.528c-0.725-2.057-2.143-3.708-3.915-4.753-1.983-1.169-4.415-1.582-6.821-0.961s-4.334 2.161-5.503 4.144-1.582 4.415-0.961 6.821c0.509 1.97 1.634 3.623 3.099 4.783 0.433 0.343 1.062 0.27 1.405-0.163s0.27-1.062-0.163-1.405c-1.132-0.897-2.008-2.179-2.405-3.716-0.483-1.871-0.163-3.76 0.748-5.305s2.408-2.739 4.28-3.223 3.761-0.163 5.305 0.748 2.739 2.408 3.223 4.28c0.115 0.435 0.505 0.75 0.968 0.75h1.252c0.647 0.005 1.275 0.162 1.834 0.448 0.793 0.406 1.448 1.073 1.832 1.947 0.443 1.012 0.435 2.106 0.062 3.061s-1.109 1.765-2.121 2.208c-0.506 0.222-0.736 0.811-0.515 1.317s0.811 0.736 1.317 0.515zM8 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM8 21c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM12 19c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM12 23c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM16 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM16 21c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-code\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM7.293 5.293l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-codepen\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.256 12l-2.256 1.579v-3.159zM21 13.579l-2.256-1.579 2.256-1.579zM17 13.221l3.212 2.249-7.212 4.687v-4.137zM8.744 12l3.256-2.279 3.256 2.279-3.256 2.279zM3.788 15.469l3.212-2.248 4 2.8v4.137zM12.557 1.169c-0.159-0.107-0.351-0.169-0.557-0.169s-0.398 0.062-0.557 0.169l-9.969 6.48c-0.112 0.070-0.213 0.163-0.293 0.278-0.125 0.178-0.184 0.383-0.181 0.585v6.976c-0.002 0.184 0.046 0.37 0.148 0.536 0.041 0.068 0.091 0.131 0.149 0.188 0.047 0.047 0.1 0.089 0.158 0.127l0.019 0.012 9.969 6.48c0.159 0.107 0.351 0.169 0.557 0.169s0.398-0.062 0.557-0.169l9.969-6.48c0.112-0.069 0.213-0.162 0.293-0.277 0.125-0.178 0.183-0.383 0.181-0.586v-6.976c0.002-0.184-0.046-0.37-0.148-0.536-0.041-0.067-0.091-0.131-0.149-0.188-0.047-0.047-0.1-0.089-0.158-0.127l-0.019-0.012zM13 7.979v-4.136l7.212 4.688-3.212 2.248zM11 3.843v4.137l-4 2.8-3.212-2.249z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-codesandbox\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.441 4.245l-2.441 1.41-2.441-1.41 1.936-1.106c0.112-0.064 0.232-0.105 0.355-0.124 0.218-0.034 0.445 0.003 0.654 0.124zM4 13.733l2.5 1.444v2.83l-1.995-1.14c-0.111-0.065-0.207-0.148-0.285-0.245-0.139-0.172-0.22-0.386-0.22-0.622zM17.5 18.007v-2.83l2.5-1.444v2.267c-0.001 0.121-0.025 0.246-0.070 0.362-0.080 0.206-0.225 0.384-0.426 0.5zM18.961 6.828l-6.961 4.027-6.961-4.027 2.51-1.435 3.951 2.283c0.319 0.184 0.697 0.173 1.001 0l3.95-2.282zM11.526 22.961c0.141 0.076 0.303 0.119 0.474 0.119 0.173 0 0.336-0.044 0.478-0.121 0.356-0.058 0.701-0.18 1.017-0.36l3.198-1.828c0.218-0.043 0.411-0.157 0.554-0.316l3.249-1.857c0.618-0.357 1.060-0.897 1.299-1.514 0.133-0.342 0.202-0.707 0.205-1.084v-8c0-0.478-0.113-0.931-0.314-1.334-0.022-0.071-0.052-0.14-0.091-0.207-0.046-0.079-0.1-0.149-0.162-0.21-0.031-0.043-0.064-0.086-0.097-0.127-0.23-0.286-0.512-0.528-0.831-0.715l-3.258-1.861c-0.147-0.167-0.343-0.276-0.553-0.317l-3.197-1.827c-0.61-0.352-1.3-0.465-1.954-0.364-0.363 0.057-0.715 0.179-1.037 0.363l-3.2 1.828c-0.21 0.041-0.406 0.15-0.553 0.316l-3.249 1.857c-0.383 0.221-0.699 0.513-0.941 0.85-0.060 0.060-0.114 0.13-0.159 0.207-0.039 0.068-0.070 0.138-0.092 0.21-0.040 0.080-0.076 0.163-0.108 0.246-0.132 0.343-0.201 0.708-0.204 1.078v8.007c0.001 0.71 0.248 1.363 0.664 1.878 0.23 0.286 0.512 0.528 0.831 0.715l3.258 1.862c0.142 0.16 0.335 0.274 0.554 0.316l3.197 1.827c0.324 0.187 0.67 0.307 1.022 0.362zM11 12.587v7.991l-2.5-1.428v-4.55c0-0.368-0.199-0.69-0.5-0.866l-4-2.311v-2.885zM13 20.578v-7.991l7-4.049v2.885l-4 2.311c-0.319 0.184-0.498 0.517-0.5 0.866v4.55z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-coffee\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19 15v-6c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121-0.335 1.577-0.879 2.121-1.292 0.879-2.121 0.879zM2 7c-0.552 0-1 0.448-1 1v9c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464h8c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536-0.561-2.632-1.464-3.536-2.156-1.464-3.536-1.464h-1zM3 9h14v8c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879h-8c-0.829 0-1.577-0.335-2.121-0.879s-0.879-1.292-0.879-2.121zM5 1v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1zM9 1v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 1v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-columns\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 4h7c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-7c-0.552 0-1 0.448-1 1s0.448 1 1 1h7c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-7c-0.552 0-1 0.448-1 1s0.448 1 1 1zM12 2h-7c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h7c0.552 0 1-0.448 1-1s-0.448-1-1-1h-7c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h7c0.552 0 1-0.448 1-1s-0.448-1-1-1zM11 3v18c0 0.552 0.448 1 1 1s1-0.448 1-1v-18c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-command\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16 16h2c0.553 0 1.051 0.223 1.414 0.586s0.586 0.861 0.586 1.414-0.223 1.051-0.586 1.414-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414zM8 16v2c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586zM8 8h-2c-0.553 0-1.051-0.223-1.414-0.586s-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM16 8h-8v8h8zM18 4c0.553 0 1.051 0.223 1.414 0.586s0.586 0.861 0.586 1.414-0.223 1.051-0.586 1.414-0.861 0.586-1.414 0.586h-2v-2c0-0.553 0.223-1.051 0.586-1.414s0.861-0.586 1.414-0.586zM10 10v-4c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172zM10 14h-4c-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM14 14v4c0 1.104 0.449 2.106 1.172 2.828s1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172zM14 10v4h-4v-4zM18 2c-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828v4h4c1.104 0 2.106-0.449 2.828-1.172s1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-compass\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM17.189 8.076c0.066-0.196 0.072-0.418 0-0.632-0.175-0.524-0.741-0.807-1.265-0.632l-6.36 2.12c-0.29 0.098-0.529 0.323-0.632 0.632l-2.12 6.36c-0.066 0.196-0.072 0.418 0 0.632 0.175 0.524 0.741 0.807 1.265 0.632l6.36-2.12c0.29-0.098 0.529-0.323 0.632-0.632zM14.659 9.341l-1.33 3.988-3.988 1.33 1.329-3.988z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-copy\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 8c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v9c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h9c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-9c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM11 10h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v9c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-9c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-9c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM5 14h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-9c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1c0 0.552 0.448 1 1 1s1-0.448 1-1v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-9c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v9c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h1c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-down-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19 4v7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879h-9.586l3.293-3.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5 5c-0.092 0.092-0.166 0.202-0.217 0.324-0.15 0.362-0.078 0.795 0.217 1.090l5 5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-3.293-3.293h9.586c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-down-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 4v7c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464h9.586l-3.293 3.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5-5c0.092-0.092 0.166-0.202 0.217-0.324 0.15-0.362 0.078-0.795-0.217-1.090l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3.293 3.293h-9.586c-0.829 0-1.577-0.335-2.121-0.879s-0.879-1.292-0.879-2.121v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-left-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 3h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v9.586l-3.293-3.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.092 0.092 0.202 0.166 0.324 0.217 0.245 0.101 0.521 0.101 0.766 0 0.118-0.049 0.228-0.121 0.324-0.217l5-5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293v-9.586c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-left-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 19h-7c-0.829 0-1.577-0.335-2.121-0.879s-0.879-1.292-0.879-2.121v-9.586l3.293 3.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5-5c-0.096-0.096-0.206-0.168-0.324-0.217s-0.247-0.076-0.383-0.076-0.265 0.027-0.383 0.076c-0.118 0.049-0.228 0.121-0.324 0.217l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464h7c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-right-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 5h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v9.586l-3.293-3.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.092 0.092 0.202 0.166 0.324 0.217 0.245 0.101 0.521 0.101 0.766 0 0.118-0.049 0.228-0.121 0.324-0.217l5-5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293v-9.586c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-right-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 21h7c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536v-9.586l3.293 3.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5-5c-0.092-0.092-0.202-0.166-0.324-0.217-0.362-0.15-0.795-0.078-1.090 0.217l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879h-7c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-up-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 20v-7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-9.586l3.293-3.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5 5c-0.096 0.096-0.168 0.206-0.217 0.324s-0.076 0.247-0.076 0.383 0.027 0.265 0.076 0.383c0.049 0.118 0.121 0.228 0.217 0.324l5 5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-3.293-3.293h9.586c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v7c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-corner-up-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 20v-7c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h9.586l-3.293 3.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5-5c0.092-0.092 0.166-0.202 0.217-0.324 0.101-0.245 0.101-0.521 0-0.766-0.049-0.118-0.121-0.228-0.217-0.324l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3.293 3.293h-9.586c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v7c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-cpu\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6 5h12c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-12c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM9 8c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1zM10 10h4v4h-4zM1 15h2v3c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h4v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-3h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-4v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2v3h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-credit-card\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 3c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v12c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h18c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM22 9h-20v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h18c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM2 11h20v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-18c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-crop\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.077 7.077l8.932-0.077c0.268 0 0.516 0.111 0.698 0.293s0.293 0.431 0.293 0.707v9h-9c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.698zM1.009 7.13l4.068-0.035-0.077 8.896c0 0.837 0.337 1.588 0.879 2.13s1.293 0.879 2.121 0.879h9v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4v-9c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.13-0.879l-8.896 0.077 0.035-4.068c0.005-0.553-0.439-1.004-0.991-1.009s-1.004 0.439-1.009 0.991l-0.036 4.103-4.103 0.036c-0.552 0.005-0.996 0.456-0.991 1.009s0.456 0.996 1.009 0.991z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-crosshair\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM13 20.945v-2.945c0-0.552-0.448-1-1-1s-1 0.448-1 1v2.945c-2.086-0.23-3.956-1.173-5.364-2.581s-2.351-3.278-2.581-5.364h2.945c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2.945c0.23-2.086 1.173-3.956 2.581-5.364s3.278-2.351 5.364-2.581v2.945c0 0.552 0.448 1 1 1s1-0.448 1-1v-2.945c2.086 0.23 3.956 1.173 5.364 2.581s2.351 3.278 2.581 5.364h-2.945c-0.552 0-1 0.448-1 1s0.448 1 1 1h2.945c-0.23 2.086-1.173 3.956-2.581 5.364s-3.278 2.351-5.364 2.581z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-database\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 5.002c0 0 0.003-0.095 0.213-0.288 0.245-0.225 0.671-0.483 1.306-0.73 1.499-0.585 3.821-0.984 6.481-0.984s4.982 0.399 6.482 0.984c0.634 0.247 1.061 0.505 1.306 0.73 0.205 0.189 0.212 0.281 0.212 0.288 0 0.003-0.007 0.095-0.213 0.284-0.245 0.225-0.671 0.483-1.306 0.73-1.499 0.585-3.821 0.984-6.481 0.984s-4.982-0.399-6.482-0.984c-0.634-0.247-1.061-0.505-1.306-0.73-0.208-0.192-0.212-0.284-0.212-0.284zM20 14.532v4.471c-0.041 0.097-0.096 0.181-0.217 0.291-0.245 0.225-0.671 0.482-1.303 0.728-1.495 0.582-3.809 0.978-6.48 0.978s-4.985-0.396-6.48-0.978c-0.633-0.246-1.058-0.503-1.303-0.728-0.12-0.11-0.176-0.194-0.199-0.242l-0.006-4.514c0.248 0.126 0.51 0.242 0.782 0.348 1.797 0.699 4.377 1.114 7.206 1.114s5.409-0.415 7.206-1.114c0.277-0.108 0.543-0.225 0.794-0.354zM20 7.527v4.463c0 0.004 0 0.008 0 0.013-0.041 0.097-0.096 0.181-0.217 0.291-0.245 0.225-0.671 0.482-1.303 0.728-1.495 0.582-3.809 0.978-6.48 0.978s-4.985-0.396-6.48-0.978c-0.633-0.246-1.058-0.503-1.303-0.728-0.12-0.11-0.176-0.194-0.199-0.242-0.001-0.040-0.004-0.079-0.009-0.117l-0.005-4.407c0.248 0.128 0.513 0.244 0.788 0.352 1.801 0.702 4.388 1.12 7.208 1.12s5.407-0.418 7.208-1.12c0.276-0.108 0.542-0.225 0.792-0.353zM2 5v14c0 0.058 0.002 0.116 0.007 0.174 0.057 0.665 0.425 1.197 0.857 1.594 0.498 0.457 1.175 0.824 1.93 1.118 1.797 0.699 4.377 1.114 7.206 1.114s5.409-0.415 7.206-1.114c0.755-0.294 1.432-0.661 1.93-1.118 0.432-0.397 0.8-0.929 0.857-1.594 0.005-0.058 0.007-0.116 0.007-0.174v-14c0-0.056-0.002-0.112-0.007-0.168-0.055-0.664-0.422-1.195-0.852-1.59-0.498-0.459-1.177-0.827-1.933-1.122-1.801-0.702-4.388-1.12-7.208-1.12s-5.407 0.418-7.208 1.12c-0.756 0.295-1.435 0.664-1.933 1.122-0.43 0.395-0.797 0.927-0.852 1.59-0.005 0.056-0.007 0.112-0.007 0.168z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-delete\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 5c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12.546l-6.125-7 6.125-7zM21 3h-13c-0.3 0-0.568 0.132-0.753 0.341l-7 8c-0.333 0.38-0.326 0.942 0 1.317l7 8c0.198 0.226 0.474 0.341 0.753 0.342h13c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM11.293 9.707l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-disc\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM16 12c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM14 12c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-dollar-sign\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 11h-1.5c-0.691 0-1.314-0.279-1.768-0.732s-0.732-1.077-0.732-1.768 0.279-1.314 0.732-1.768 1.077-0.732 1.768-0.732h1.5zM13 13h1.5c0.691 0 1.314 0.279 1.768 0.732s0.732 1.077 0.732 1.768-0.279 1.314-0.732 1.768-1.077 0.732-1.768 0.732h-1.5zM17 4h-4v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-1.5c-1.242 0-2.369 0.505-3.182 1.318s-1.318 1.94-1.318 3.182 0.505 2.369 1.318 3.182 1.94 1.318 3.182 1.318h1.5v5h-5c-0.552 0-1 0.448-1 1s0.448 1 1 1h5v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h1.5c1.242 0 2.369-0.505 3.182-1.318s1.318-1.94 1.318-3.182-0.505-2.369-1.318-3.182-1.94-1.318-3.182-1.318h-1.5v-5h4c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-download\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 15v4c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 12.586v-9.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v9.586l-3.293-3.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.092 0.092 0.202 0.166 0.324 0.217s0.253 0.076 0.383 0.076c0.256 0 0.512-0.098 0.707-0.293l5-5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-download-cloud\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 12v6.586l-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4 4c0.092 0.092 0.202 0.166 0.324 0.217 0.245 0.101 0.521 0.101 0.766 0 0.118-0.049 0.228-0.121 0.324-0.217l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293v-6.586c0-0.552-0.448-1-1-1s-1 0.448-1 1zM21.455 18.908c1.355-0.953 2.196-2.367 2.46-3.878s-0.050-3.126-1.003-4.481c-0.825-1.174-1.998-1.963-3.287-2.324-0.526-0.147-1.072-0.223-1.621-0.225h-0.523c-0.722-2.058-2.137-3.71-3.907-4.758-1.981-1.172-4.412-1.589-6.819-0.972s-4.338 2.155-5.51 4.136-1.589 4.412-0.972 6.819c0.371 1.446 1.075 2.725 1.983 3.734 0.37 0.41 1.002 0.444 1.412 0.074s0.444-1.002 0.074-1.412c-0.692-0.769-1.242-1.76-1.533-2.893-0.481-1.873-0.157-3.761 0.756-5.304s2.412-2.736 4.285-3.216 3.761-0.157 5.304 0.756 2.736 2.412 3.216 4.285c0.116 0.435 0.506 0.751 0.97 0.751h1.256c0.37 0.001 0.737 0.052 1.090 0.151 0.861 0.241 1.639 0.765 2.19 1.548 0.636 0.904 0.845 1.978 0.669 2.988s-0.736 1.95-1.64 2.585c-0.452 0.318-0.56 0.941-0.243 1.393s0.941 0.56 1.393 0.243z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-droplet\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.707 1.983c-0.391-0.391-1.025-0.39-1.415 0.001l-5.653 5.663c-1.757 1.758-2.635 4.063-2.634 6.365s0.88 4.607 2.638 6.363c1.756 1.755 4.059 2.633 6.358 2.634 2.308-0.001 4.613-0.881 6.37-2.638 1.755-1.756 2.633-4.059 2.634-6.358-0.001-2.309-0.881-4.613-2.638-6.369zM12.001 4.105l4.952 4.952c1.368 1.367 2.052 3.156 2.052 4.949s-0.682 3.583-2.049 4.95-3.156 2.051-4.949 2.052-3.583-0.682-4.95-2.049-2.051-3.156-2.052-4.949 0.682-3.583 2.049-4.95z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-edit\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 3h-7c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h7c0.552 0 1-0.448 1-1s-0.448-1-1-1zM17.793 1.793l-9.5 9.5c-0.122 0.121-0.217 0.28-0.263 0.465l-1 4c-0.039 0.15-0.042 0.318 0 0.485 0.134 0.536 0.677 0.862 1.213 0.728l4-1c0.167-0.041 0.33-0.129 0.465-0.263l9.5-9.5c0.609-0.609 0.914-1.41 0.914-2.207s-0.305-1.598-0.914-2.207-1.411-0.915-2.208-0.915-1.598 0.305-2.207 0.914zM19.207 3.207c0.219-0.219 0.504-0.328 0.793-0.328s0.574 0.109 0.793 0.328 0.328 0.504 0.328 0.793-0.109 0.574-0.328 0.793l-9.304 9.304-2.114 0.529 0.529-2.114z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-edit-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.293 2.293l-13.5 13.5c-0.117 0.116-0.21 0.268-0.258 0.444l-1.5 5.5c-0.046 0.163-0.049 0.346 0 0.526 0.145 0.533 0.695 0.847 1.228 0.702l5.5-1.5c0.159-0.042 0.315-0.129 0.444-0.258l13.5-13.5c0.747-0.747 1.121-1.729 1.121-2.707s-0.374-1.96-1.121-2.707-1.729-1.121-2.707-1.121-1.96 0.374-2.707 1.121zM17.707 3.707c0.357-0.357 0.824-0.535 1.293-0.535s0.936 0.178 1.293 0.536 0.535 0.823 0.535 1.292-0.178 0.936-0.535 1.293l-13.312 13.312-3.556 0.97 0.97-3.555z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-edit-3\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 21h9c0.552 0 1-0.448 1-1s-0.448-1-1-1h-9c-0.552 0-1 0.448-1 1s0.448 1 1 1zM15.793 2.793l-12.5 12.5c-0.122 0.121-0.217 0.28-0.263 0.465l-1 4c-0.039 0.15-0.042 0.318 0 0.485 0.134 0.536 0.677 0.862 1.213 0.728l4-1c0.167-0.041 0.33-0.129 0.465-0.263l12.5-12.5c0.609-0.609 0.914-1.41 0.914-2.207s-0.305-1.598-0.914-2.207-1.411-0.915-2.208-0.915-1.598 0.305-2.207 0.914zM17.207 4.207c0.219-0.219 0.504-0.328 0.793-0.328s0.574 0.109 0.793 0.328 0.328 0.504 0.328 0.793-0.109 0.574-0.328 0.793l-12.304 12.304-2.115 0.529 0.529-2.115z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-external-link\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 13v6c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-11c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-11c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h11c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM10.707 14.707l9.293-9.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.586l-9.293 9.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-eye\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M0.106 11.553c-0.136 0.274-0.146 0.603 0 0.894 0 0 0.396 0.789 1.12 1.843 0.451 0.656 1.038 1.432 1.757 2.218 0.894 0.979 2.004 1.987 3.319 2.8 1.595 0.986 3.506 1.692 5.698 1.692s4.103-0.706 5.698-1.692c1.315-0.813 2.425-1.821 3.319-2.8 0.718-0.786 1.306-1.562 1.757-2.218 0.724-1.054 1.12-1.843 1.12-1.843 0.136-0.274 0.146-0.603 0-0.894 0 0-0.396-0.789-1.12-1.843-0.451-0.656-1.038-1.432-1.757-2.218-0.894-0.979-2.004-1.987-3.319-2.8-1.595-0.986-3.506-1.692-5.698-1.692s-4.103 0.706-5.698 1.692c-1.315 0.813-2.425 1.821-3.319 2.8-0.719 0.786-1.306 1.561-1.757 2.218-0.724 1.054-1.12 1.843-1.12 1.843zM2.14 12c0.163-0.281 0.407-0.681 0.734-1.158 0.41-0.596 0.94-1.296 1.585-2.001 0.805-0.881 1.775-1.756 2.894-2.448 1.35-0.834 2.901-1.393 4.647-1.393s3.297 0.559 4.646 1.393c1.119 0.692 2.089 1.567 2.894 2.448 0.644 0.705 1.175 1.405 1.585 2.001 0.328 0.477 0.572 0.876 0.734 1.158-0.163 0.281-0.407 0.681-0.734 1.158-0.41 0.596-0.94 1.296-1.585 2.001-0.805 0.881-1.775 1.756-2.894 2.448-1.349 0.834-2.9 1.393-4.646 1.393s-3.297-0.559-4.646-1.393c-1.119-0.692-2.089-1.567-2.894-2.448-0.644-0.705-1.175-1.405-1.585-2.001-0.328-0.477-0.572-0.877-0.735-1.158zM16 12c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM14 12c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-eye-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10.128 5.214c0.651-0.152 1.296-0.221 1.86-0.214 1.758 0 3.309 0.559 4.658 1.393 1.119 0.692 2.089 1.567 2.894 2.448 0.644 0.705 1.175 1.405 1.585 2.001 0.327 0.475 0.57 0.874 0.733 1.155-0.546 0.953-1.16 1.821-1.778 2.542-0.359 0.419-0.311 1.051 0.108 1.41s1.051 0.311 1.41-0.108c0.818-0.954 1.611-2.112 2.283-3.37 0.148-0.279 0.163-0.618 0.013-0.919 0 0-0.396-0.789-1.12-1.843-0.451-0.656-1.038-1.432-1.757-2.218-0.894-0.979-2.004-1.987-3.319-2.8-1.595-0.985-3.506-1.691-5.686-1.691-0.734-0.009-1.54 0.079-2.34 0.266-0.538 0.126-0.872 0.664-0.746 1.202s0.664 0.872 1.202 0.746zM10.027 11.442l2.531 2.531c-0.182 0.061-0.372 0.094-0.563 0.101-0.513 0.018-1.030-0.159-1.434-0.536s-0.617-0.88-0.635-1.393c-0.008-0.238 0.025-0.476 0.101-0.704zM5.983 7.397l2.553 2.553c-0.434 0.691-0.636 1.484-0.608 2.266 0.036 1.022 0.463 2.033 1.271 2.785s1.846 1.107 2.868 1.071c0.692-0.024 1.379-0.228 1.984-0.608l2.322 2.322c-1.378 0.799-2.895 1.196-4.384 1.214-1.734 0-3.285-0.559-4.634-1.393-1.119-0.692-2.089-1.567-2.894-2.448-0.644-0.705-1.175-1.405-1.585-2.001-0.326-0.475-0.57-0.873-0.732-1.154 1.050-1.822 2.376-3.379 3.841-4.607zM0.293 1.707l4.271 4.271c-1.731 1.479-3.269 3.358-4.445 5.549-0.148 0.279-0.164 0.619-0.013 0.92 0 0 0.396 0.789 1.12 1.843 0.451 0.656 1.038 1.432 1.757 2.218 0.894 0.979 2.004 1.987 3.319 2.8 1.595 0.986 3.506 1.692 5.71 1.692 1.993-0.024 4.019-0.601 5.815-1.759l4.466 4.466c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.876-8.876c-0.002-0.002-0.005-0.005-0.007-0.007l-4.209-4.21c-0.008-0.007-0.016-0.016-0.024-0.024l-8.884-8.883c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-facebook\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 3v2h-2c-0.552 0-1.053 0.225-1.414 0.586s-0.586 0.862-0.586 1.414v3c0 0.552 0.448 1 1 1h2.719l-0.5 2h-2.219c-0.552 0-1 0.448-1 1v7h-2v-7c0-0.552-0.448-1-1-1h-2v-2h2c0.552 0 1-0.448 1-1v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172zM18 1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243v2h-2c-0.552 0-1 0.448-1 1v4c0 0.552 0.448 1 1 1h2v7c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-7h2c0.466 0 0.858-0.319 0.97-0.757l1-4c0.134-0.536-0.192-1.079-0.728-1.213-0.083-0.021-0.167-0.031-0.242-0.030h-3v-2h3c0.552 0 1-0.448 1-1v-4c0-0.552-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-fast-forward\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14 16.955v-9.91l6.371 4.955zM3 16.955v-9.91l6.371 4.955zM2.614 19.789l9-7c0.251-0.195 0.383-0.486 0.386-0.78v6.991c0 0.552 0.448 1 1 1 0.232 0 0.446-0.079 0.614-0.211l9-7c0.436-0.339 0.514-0.967 0.175-1.403-0.054-0.069-0.115-0.129-0.175-0.175l-9-7c-0.436-0.339-1.064-0.261-1.403 0.175-0.143 0.184-0.212 0.401-0.211 0.614v6.99c-0.002-0.211-0.071-0.424-0.211-0.604-0.054-0.069-0.115-0.129-0.175-0.175l-9-7c-0.436-0.339-1.064-0.261-1.403 0.175-0.143 0.184-0.212 0.401-0.211 0.614v14c0 0.552 0.448 1 1 1 0.232 0 0.446-0.079 0.614-0.211z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-feather\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.111 15.792c0.069-0.053 0.13-0.115 0.183-0.184l2.653-2.661c1.367-1.367 2.051-3.161 2.051-4.952s-0.684-3.585-2.051-4.952-3.161-2.051-4.952-2.051-3.585 0.684-4.952 2.051l-6.75 6.75c-0.195 0.195-0.293 0.451-0.293 0.707v8.086l-2.707 2.707c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.707-2.707h8.086c0.277 0 0.527-0.112 0.708-0.294zM9.414 16h5.665l-1.994 2h-5.671zM17.073 14h-5.659l5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-9.293 9.293v-5.672l6.457-6.457c0.977-0.977 2.256-1.465 3.538-1.465s2.561 0.488 3.538 1.465 1.465 2.256 1.465 3.538-0.488 2.561-1.465 3.538z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-figma\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13 12.5c0-0.691 0.279-1.314 0.732-1.768s1.077-0.732 1.768-0.732 1.314 0.279 1.768 0.732 0.732 1.077 0.732 1.768-0.279 1.314-0.732 1.768-1.077 0.732-1.768 0.732-1.314-0.279-1.768-0.732-0.732-1.077-0.732-1.768zM8.5 8c-0.691 0-1.314-0.279-1.768-0.732s-0.732-1.077-0.732-1.768 0.279-1.314 0.732-1.768 1.077-0.732 1.768-0.732h2.5v5zM13 8v-5h2.5c0.691 0 1.314 0.279 1.768 0.732s0.732 1.077 0.732 1.768-0.279 1.314-0.732 1.768-1.077 0.732-1.768 0.732zM11 17v2.5c0 0.691-0.279 1.314-0.732 1.768s-1.077 0.732-1.768 0.732-1.314-0.279-1.768-0.732-0.732-1.077-0.732-1.768 0.279-1.314 0.732-1.768 1.077-0.732 1.768-0.732zM4 12.5c0 1.242 0.505 2.369 1.318 3.182 0.112 0.112 0.23 0.218 0.353 0.318-0.123 0.1-0.241 0.206-0.353 0.318-0.813 0.813-1.318 1.94-1.318 3.182s0.505 2.369 1.318 3.182 1.94 1.318 3.182 1.318 2.369-0.505 3.182-1.318 1.318-1.94 1.318-3.182v-3.258c0.715 0.478 1.575 0.758 2.5 0.758 1.242 0 2.369-0.505 3.182-1.318s1.318-1.94 1.318-3.182-0.505-2.369-1.318-3.182c-0.112-0.112-0.23-0.218-0.353-0.318 0.123-0.1 0.241-0.206 0.353-0.318 0.813-0.813 1.318-1.94 1.318-3.182s-0.505-2.369-1.318-3.182-1.94-1.318-3.182-1.318h-7c-1.242 0-2.369 0.505-3.182 1.318s-1.318 1.94-1.318 3.182 0.505 2.369 1.318 3.182c0.112 0.112 0.23 0.218 0.353 0.318-0.123 0.1-0.241 0.206-0.353 0.318-0.813 0.813-1.318 1.94-1.318 3.182zM6 12.5c0-0.691 0.279-1.314 0.732-1.768s1.077-0.732 1.768-0.732h2.5v5h-2.5c-0.691 0-1.314-0.279-1.768-0.732s-0.732-1.077-0.732-1.768z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-file\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.586 8h-3.586v-3.586zM20.707 8.293l-7-7c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076h-7c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-11c0-0.276-0.112-0.526-0.293-0.707zM12 3v6c0 0.552 0.448 1 1 1h6v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-file-minus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.586 7h-2.586v-2.586zM20.707 7.293l-6-6c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076h-8c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.276-0.112-0.526-0.293-0.707zM13 3v5c0 0.552 0.448 1 1 1h5v11c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM9 16h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-file-plus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.586 7h-2.586v-2.586zM20.707 7.293l-6-6c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076h-8c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.276-0.112-0.526-0.293-0.707zM13 3v5c0 0.552 0.448 1 1 1h5v11c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM9 16h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-file-text\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.586 7h-2.586v-2.586zM20.707 7.293l-6-6c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076h-8c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-12c0-0.276-0.112-0.526-0.293-0.707zM13 3v5c0 0.552 0.448 1 1 1h5v11c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM16 12h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1zM16 16h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1zM10 8h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-film\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16 11h-8v-8h8zM8 13h8v8h-8zM6 6h-3v-1.82c0-0.326 0.131-0.62 0.346-0.834s0.508-0.346 0.834-0.346h1.82zM3 8h3v3h-3zM6 16h-3v-3h3zM3 18h3v3h-1.82c-0.326 0-0.62-0.131-0.834-0.346s-0.346-0.508-0.346-0.834zM21 16h-3v-3h3zM18 18h3v1.82c0 0.326-0.131 0.62-0.346 0.834s-0.508 0.346-0.834 0.346h-1.82zM21 6h-3v-3h1.82c0.326 0 0.62 0.131 0.834 0.346s0.346 0.508 0.346 0.834zM23 7v-2.82c0-0.878-0.357-1.674-0.931-2.249s-1.371-0.931-2.249-0.931h-15.64c-0.878 0-1.674 0.357-2.249 0.931s-0.931 1.371-0.931 2.249v15.64c0 0.878 0.357 1.674 0.931 2.249s1.371 0.931 2.249 0.931h15.64c0.878 0 1.674-0.357 2.249-0.931s0.931-1.371 0.931-2.249zM18 8h3v3h-3z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-filter\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19.845 4l-6.609 7.814c-0.147 0.173-0.236 0.399-0.236 0.646v6.922l-2-1v-5.922c0.001-0.227-0.077-0.457-0.236-0.646l-6.609-7.814zM22 2h-20c-0.552 0-1 0.448-1 1 0 0.247 0.089 0.473 0.236 0.646l7.764 9.18v6.174c0 0.389 0.222 0.727 0.553 0.894l4 2c0.494 0.247 1.095 0.047 1.342-0.447 0.072-0.146 0.106-0.301 0.105-0.447v-8.174l7.764-9.18c0.357-0.422 0.304-1.053-0.118-1.409-0.189-0.16-0.419-0.238-0.646-0.237z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-flag\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 13.397v-9.859c0.44-0.218 1.365-0.538 3-0.538 1.281 0 2.361 0.421 3.629 0.928 1.232 0.493 2.652 1.072 4.371 1.072 1.298 0 2.278-0.175 3-0.397v9.859c-0.44 0.218-1.365 0.538-3 0.538-1.281 0-2.361-0.421-3.629-0.928-1.232-0.493-2.652-1.072-4.371-1.072-1.298 0-2.278 0.175-3 0.397zM5 22v-6.462c0.44-0.218 1.365-0.538 3-0.538 1.281 0 2.361 0.421 3.629 0.928 1.232 0.493 2.652 1.072 4.371 1.072 3.247 0 4.507-1.093 4.707-1.293 0.195-0.195 0.293-0.451 0.293-0.707v-12c0-0.552-0.448-1-1-1-0.265 0-0.506 0.103-0.685 0.272-0.096 0.078-0.984 0.728-3.315 0.728-1.281 0-2.361-0.421-3.629-0.928-1.232-0.493-2.652-1.072-4.371-1.072-3.247 0-4.507 1.093-4.707 1.293-0.195 0.195-0.293 0.451-0.293 0.707v19c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-folder\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 19v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-8.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-5c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121zM21 19c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4.465l1.703 2.555c0.192 0.287 0.506 0.443 0.832 0.445h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-folder-minus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 19v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-8.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-5c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121zM21 19c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4.465l1.703 2.555c0.192 0.287 0.506 0.443 0.832 0.445h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM9 15h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-folder-plus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 19v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-8.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-5c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121zM21 19c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4.465l1.703 2.555c0.192 0.287 0.506 0.443 0.832 0.445h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM9 15h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-framer\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.414 8l-5-5h10.586v5zM6 16v-6h5.586l5 5h-4.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h7c0.256 0 0.512-0.098 0.707-0.293 0.391-0.391 0.391-1.024 0-1.414l-5.293-5.293h4.586c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1h-14c-0.552 0-1 0.448-1 1 0 0.276 0.112 0.526 0.293 0.707l5.293 5.293h-4.586c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1s1-0.448 1-1zM4.293 16.707l7 7c0.391 0.391 1.024 0.391 1.414 0 0.195-0.195 0.293-0.451 0.293-0.707v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1v4.586l-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM5 17h7c0.552 0 1-0.448 1-1s-0.448-1-1-1h-7c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-frown\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM16.8 15.4c0 0-0.131-0.173-0.331-0.383-0.145-0.153-0.338-0.341-0.577-0.54-0.337-0.281-0.772-0.59-1.297-0.853-0.705-0.352-1.579-0.624-2.595-0.624s-1.89 0.272-2.595 0.624c-0.525 0.263-0.96 0.572-1.297 0.853-0.239 0.199-0.432 0.387-0.577 0.54-0.2 0.21-0.331 0.383-0.331 0.383-0.331 0.442-0.242 1.069 0.2 1.4s1.069 0.242 1.4-0.2c0.041-0.050 0.181-0.206 0.181-0.206 0.1-0.105 0.237-0.239 0.408-0.382 0.243-0.203 0.549-0.419 0.91-0.6 0.48-0.239 1.050-0.412 1.701-0.412s1.221 0.173 1.701 0.413c0.36 0.18 0.667 0.397 0.91 0.6 0.171 0.143 0.308 0.277 0.408 0.382 0.14 0.155 0.181 0.205 0.181 0.205 0.331 0.442 0.958 0.531 1.4 0.2s0.531-0.958 0.2-1.4zM9 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM15 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-gift\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 13v8h-6v-8zM13 21v-8h6v8zM7.5 6c-0.414 0-0.788-0.167-1.061-0.439s-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439c0.629 0 1.142 0.223 1.584 0.586 0.376 0.308 0.701 0.719 0.976 1.177 0.241 0.401 0.433 0.821 0.58 1.203zM13.346 6c0.161-0.416 0.353-0.836 0.593-1.237 0.275-0.459 0.601-0.869 0.976-1.177 0.443-0.363 0.956-0.586 1.585-0.586 0.414 0 0.788 0.167 1.061 0.439s0.439 0.647 0.439 1.061-0.167 0.788-0.439 1.061-0.647 0.439-1.061 0.439zM11 8v3h-8v-3h4.5zM19.663 6c0.216-0.455 0.337-0.963 0.337-1.5 0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025c-1.16 0-2.109 0.43-2.852 1.039-0.603 0.494-1.068 1.103-1.423 1.694-0.080 0.133-0.155 0.266-0.225 0.398-0.070-0.132-0.145-0.265-0.225-0.398-0.355-0.591-0.82-1.2-1.423-1.694-0.743-0.609-1.692-1.039-2.852-1.039-0.966 0-1.843 0.393-2.475 1.025s-1.025 1.509-1.025 2.475c0 0.537 0.121 1.045 0.337 1.5h-2.337c-0.552 0-1 0.448-1 1v5c0 0.552 0.448 1 1 1h1v9c0 0.552 0.448 1 1 1h16c0.552 0 1-0.448 1-1v-9h1c0.552 0 1-0.448 1-1v-5c0-0.552-0.448-1-1-1zM13 8h8v3h-8z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-git-branch\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 6c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM8 18c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM16.954 9.862c-0.2 1.865-1.039 3.537-2.297 4.795s-2.93 2.098-4.795 2.297c-0.185-0.685-0.547-1.297-1.033-1.783-0.497-0.496-1.126-0.864-1.829-1.045v-11.126c0-0.552-0.448-1-1-1s-1 0.448-1 1v11.126c-0.703 0.181-1.332 0.549-1.828 1.045-0.723 0.723-1.172 1.725-1.172 2.829s0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172c0.506-0.506 0.878-1.148 1.055-1.867 2.409-0.211 4.574-1.277 6.188-2.89s2.679-3.779 2.89-6.188c0.719-0.177 1.361-0.549 1.867-1.055 0.723-0.722 1.172-1.724 1.172-2.828s-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828c0.486 0.486 1.098 0.848 1.783 1.033z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-git-commit\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 12c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM17.010 13h5.95c0.552 0 1-0.448 1-1s-0.448-1-1-1h-5.95c-0.037 0-0.073 0.002-0.109 0.006-0.198-0.982-0.685-1.86-1.365-2.541-0.904-0.904-2.156-1.465-3.536-1.465s-2.632 0.561-3.536 1.464c-0.681 0.681-1.167 1.559-1.365 2.54-0.032-0.002-0.066-0.004-0.099-0.004h-5.95c-0.552 0-1 0.448-1 1s0.448 1 1 1h5.95c0.033 0 0.067-0.002 0.099-0.005 0.198 0.982 0.685 1.86 1.365 2.54 0.904 0.904 2.156 1.465 3.536 1.465s2.632-0.561 3.536-1.464c0.681-0.681 1.167-1.559 1.365-2.541 0.036 0.004 0.072 0.006 0.109 0.006z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-git-merge\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 18c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM8 6c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM7 21v-5.999c0.284 0.379 0.595 0.736 0.929 1.070 1.614 1.614 3.779 2.679 6.188 2.89 0.177 0.719 0.549 1.361 1.055 1.867 0.722 0.723 1.724 1.172 2.828 1.172s2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172c-0.486 0.486-0.848 1.098-1.033 1.783-1.865-0.2-3.537-1.039-4.795-2.297s-2.098-2.93-2.297-4.795c0.683-0.186 1.295-0.549 1.781-1.035 0.723-0.722 1.172-1.724 1.172-2.828s-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828c0.496 0.497 1.125 0.865 1.828 1.046v11.126c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-git-pull-request\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 18c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM8 6c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM13 7h3c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v6.126c-0.703 0.181-1.332 0.549-1.828 1.045-0.723 0.723-1.172 1.725-1.172 2.829s0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828c-0.497-0.497-1.125-0.864-1.828-1.045v-6.127c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5 9.874v11.126c0 0.552 0.448 1 1 1s1-0.448 1-1v-11.126c0.703-0.181 1.332-0.549 1.828-1.045 0.723-0.723 1.172-1.725 1.172-2.829s-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828c0.496 0.497 1.125 0.865 1.828 1.046z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-github\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8.713 18.042c-1.268 0.38-2.060 0.335-2.583 0.17-0.231-0.073-0.431-0.176-0.614-0.302-0.411-0.284-0.727-0.675-1.119-1.172-0.356-0.451-0.85-1.107-1.551-1.476-0.185-0.098-0.386-0.177-0.604-0.232-0.536-0.134-1.079 0.192-1.213 0.728s0.192 1.079 0.728 1.213c0.074 0.023 0.155 0.060 0.155 0.060 0.252 0.133 0.487 0.404 0.914 0.946 0.366 0.464 0.856 1.098 1.553 1.579 0.332 0.229 0.711 0.426 1.149 0.564 1.015 0.321 2.236 0.296 3.76-0.162 0.529-0.159 0.829-0.716 0.67-1.245s-0.716-0.829-1.245-0.67zM17 22v-3.792c0.052-0.684-0.056-1.343-0.292-1.942 0.777-0.171 1.563-0.427 2.297-0.823 2.083-1.124 3.496-3.242 3.496-6.923 0-1.503-0.516-2.887-1.379-3.981 0.355-1.345 0.226-2.726-0.293-3.933-0.122-0.283-0.359-0.482-0.634-0.564-0.357-0.106-1.732-0.309-4.373 1.362-2.273-0.541-4.557-0.509-6.646-0.002-2.639-1.669-4.013-1.466-4.37-1.36-0.296 0.088-0.521 0.3-0.635 0.565-0.554 1.292-0.624 2.672-0.292 3.932-0.93 1.178-1.387 2.601-1.379 4.017 0 3.622 1.389 5.723 3.441 6.859 0.752 0.416 1.56 0.685 2.357 0.867-0.185 0.468-0.286 0.961-0.304 1.456-0.005 0.141-0.003 0.283 0.005 0.424l0.001 3.838c0 0.552 0.448 1 1 1s1-0.448 1-1v-3.87c0-0.021-0.001-0.045-0.002-0.069-0.006-0.084-0.007-0.168-0.004-0.252 0.020-0.568 0.241-1.126 0.665-1.564 0.145-0.149 0.246-0.347 0.274-0.572 0.068-0.548-0.321-1.048-0.869-1.116-0.34-0.042-0.677-0.094-1.006-0.159-0.79-0.156-1.518-0.385-2.147-0.733-1.305-0.723-2.391-2.071-2.41-5.042 0.013-1.241 0.419-2.319 1.224-3.165 0.257-0.273 0.35-0.671 0.212-1.040-0.28-0.748-0.341-1.58-0.14-2.392 0.491 0.107 1.354 0.416 2.647 1.282 0.235 0.157 0.533 0.214 0.825 0.133 1.997-0.557 4.242-0.602 6.47 0.002 0.271 0.073 0.569 0.033 0.818-0.135 1.293-0.866 2.156-1.175 2.647-1.282 0.189 0.766 0.157 1.595-0.141 2.392-0.129 0.352-0.058 0.755 0.213 1.040 0.758 0.795 1.224 1.872 1.224 3.060 0 3.075-1.114 4.445-2.445 5.163-0.623 0.336-1.343 0.555-2.123 0.7-0.322 0.060-0.651 0.106-0.983 0.143-0.21 0.023-0.418 0.114-0.584 0.275-0.397 0.384-0.408 1.017-0.024 1.414 0.067 0.070 0.13 0.143 0.188 0.22 0.34 0.449 0.521 1.015 0.474 1.617 0 0.024-0.001 0.051-0.003 0.078v3.872c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-gitlab\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23.238 15.199c0.261-0.17 0.493-0.446 0.635-0.764 0.172-0.385 0.214-0.831 0.075-1.305l-1.266-3.749-2.432-7.484c-0.068-0.229-0.195-0.443-0.397-0.637-0.266-0.242-0.603-0.367-0.941-0.372-0.351-0.005-0.707 0.119-0.976 0.365-0.165 0.147-0.296 0.334-0.378 0.547-0.006 0.015-0.012 0.033-0.018 0.052l-2.217 6.818h-6.647l-2.207-6.773c-0.068-0.229-0.195-0.443-0.397-0.637-0.265-0.242-0.602-0.367-0.94-0.372-0.351-0.006-0.707 0.118-0.976 0.365-0.166 0.146-0.296 0.334-0.379 0.546-0.006 0.016-0.012 0.034-0.018 0.052l-2.441 7.512-1.22 3.78c-0.106 0.329-0.117 0.676-0.038 1.004 0.098 0.407 0.336 0.783 0.702 1.052l10.65 7.74c0.346 0.248 0.818 0.26 1.176 0zM22.003 13.624l-10.003 7.27-9.983-7.255 1.205-3.662 1.886-5.805 1.891 5.808c0.137 0.42 0.525 0.687 0.951 0.69h8.1c0.442 0 0.817-0.287 0.951-0.691l1.886-5.804 1.892 5.824z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-globe\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.951 11c-0.214-2.69-1.102-5.353-2.674-7.71 1.57 0.409 2.973 1.232 4.087 2.346 1.408 1.408 2.351 3.278 2.581 5.364zM14.279 20.709c1.483-2.226 2.437-4.853 2.669-7.709h3.997c-0.23 2.086-1.173 3.956-2.581 5.364-1.113 1.113-2.516 1.936-4.085 2.345zM7.049 13c0.214 2.69 1.102 5.353 2.674 7.71-1.57-0.409-2.973-1.232-4.087-2.346-1.408-1.408-2.351-3.278-2.581-5.364zM9.721 3.291c-1.482 2.226-2.436 4.853-2.669 7.709h-3.997c0.23-2.086 1.173-3.956 2.581-5.364 1.114-1.113 2.516-1.936 4.085-2.345zM12.004 1c0 0 0 0 0 0-3.044 0.001-5.794 1.233-7.782 3.222-1.99 1.989-3.222 4.741-3.222 7.778s1.232 5.789 3.222 7.778c1.988 1.989 4.738 3.221 7.774 3.222 0 0 0 0 0 0 3.044-0.001 5.793-1.233 7.782-3.222 1.99-1.989 3.222-4.741 3.222-7.778s-1.232-5.789-3.222-7.778c-1.988-1.989-4.738-3.221-7.774-3.222zM14.946 13c-0.252 2.788-1.316 5.36-2.945 7.451-1.729-2.221-2.706-4.818-2.945-7.451zM11.999 3.549c1.729 2.221 2.706 4.818 2.945 7.451h-5.89c0.252-2.788 1.316-5.36 2.945-7.451z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-grid\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 2c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1h7c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1zM4 4h5v5h-5zM14 2c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1h7c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1zM15 4h5v5h-5zM14 13c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1h7c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1zM15 15h5v5h-5zM3 13c-0.552 0-1 0.448-1 1v7c0 0.552 0.448 1 1 1h7c0.552 0 1-0.448 1-1v-7c0-0.552-0.448-1-1-1zM4 15h5v5h-5z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-hard-drive\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 13v5c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-5zM6.344 5.558c0.066-0.131 0.16-0.246 0.272-0.337 0.172-0.139 0.387-0.221 0.624-0.221h9.513c0.15 0.001 0.295 0.034 0.426 0.094 0.201 0.092 0.37 0.249 0.477 0.464l2.725 5.442h-16.762zM4.556 4.662l-3.441 6.872c-0.031 0.059-0.056 0.121-0.075 0.187-0.028 0.094-0.041 0.188-0.040 0.279v6c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-6c0-0.151-0.033-0.293-0.091-0.417-0.005-0.010-0.010-0.021-0.015-0.031l-0.009-0.018-3.441-6.872c-0.315-0.634-0.829-1.111-1.433-1.387-0.388-0.177-0.812-0.272-1.244-0.275h-9.527c-0.711 0-1.367 0.249-1.883 0.667-0.331 0.268-0.605 0.606-0.801 0.995zM6 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM10 17c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-hash\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.216 10l-0.444 4h-3.988l0.444-4zM15.006 2.89l-0.568 5.11h-3.988l0.543-4.89c0.061-0.549-0.335-1.043-0.883-1.104s-1.043 0.335-1.104 0.884l-0.568 5.11h-4.438c-0.552 0-1 0.448-1 1s0.448 1 1 1h4.216l-0.444 4h-3.772c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.549l-0.543 4.89c-0.061 0.549 0.335 1.043 0.883 1.104s1.043-0.335 1.104-0.883l0.569-5.111h3.988l-0.543 4.89c-0.061 0.549 0.335 1.043 0.883 1.104s1.043-0.335 1.104-0.883l0.568-5.111h4.438c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4.216l0.444-4h3.772c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.549l0.543-4.89c0.061-0.549-0.335-1.043-0.883-1.104s-1.043 0.335-1.104 0.883z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-headphones\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 19c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h2v3zM4 19v-4h2c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v3c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM2 19c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h1c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-2v-1c0-2.209 0.894-4.208 2.343-5.657s3.448-2.343 5.657-2.343 4.208 0.894 5.657 2.343 2.343 3.448 2.343 5.657v1h-2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v3c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h1c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-2.761-1.12-5.263-2.929-7.071s-4.31-2.929-7.071-2.929-5.263 1.12-7.071 2.929-2.929 4.31-2.929 7.071v6z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-heart\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.133 5.317c0.88 0.881 1.319 2.031 1.319 3.184s-0.44 2.303-1.319 3.182l-8.133 8.133-8.133-8.133c-0.879-0.879-1.318-2.029-1.318-3.183s0.439-2.304 1.318-3.183 2.029-1.318 3.183-1.318 2.304 0.439 3.183 1.318l1.060 1.060c0.391 0.391 1.024 0.391 1.414 0l1.062-1.062c0.879-0.879 2.029-1.318 3.182-1.317s2.303 0.44 3.182 1.319zM21.547 3.903c-1.269-1.269-2.934-1.904-4.596-1.905s-3.327 0.634-4.597 1.903l-0.354 0.355-0.353-0.353c-1.269-1.269-2.935-1.904-4.597-1.904s-3.328 0.635-4.597 1.904-1.904 2.935-1.904 4.597 0.635 3.328 1.904 4.597l8.84 8.84c0.391 0.391 1.024 0.391 1.414 0l8.84-8.84c1.269-1.269 1.904-2.934 1.905-4.596s-0.634-3.327-1.905-4.598z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-help-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.033 9.332c0.183-0.521 0.559-0.918 1.022-1.14s1.007-0.267 1.528-0.083c0.458 0.161 0.819 0.47 1.050 0.859 0.183 0.307 0.284 0.665 0.286 1.037 0 0.155-0.039 0.309-0.117 0.464-0.080 0.16-0.203 0.325-0.368 0.49-0.709 0.709-1.831 1.092-1.831 1.092-0.524 0.175-0.807 0.741-0.632 1.265s0.741 0.807 1.265 0.632c0 0 1.544-0.506 2.613-1.575 0.279-0.279 0.545-0.614 0.743-1.010 0.2-0.4 0.328-0.858 0.328-1.369-0.004-0.731-0.204-1.437-0.567-2.049-0.463-0.778-1.19-1.402-2.105-1.724-1.042-0.366-2.135-0.275-3.057 0.167s-1.678 1.238-2.044 2.28c-0.184 0.521 0.090 1.092 0.611 1.275s1.092-0.091 1.275-0.611zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-hexagon\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 16c-0.001 0.121-0.025 0.246-0.070 0.362-0.080 0.206-0.225 0.384-0.426 0.5l-6.999 3.999c-0.112 0.064-0.232 0.105-0.355 0.124-0.218 0.034-0.445-0.003-0.654-0.124l-6.991-3.995c-0.111-0.065-0.207-0.148-0.285-0.245-0.139-0.171-0.22-0.385-0.22-0.621v-7.993c0.001-0.128 0.025-0.253 0.070-0.369 0.080-0.206 0.225-0.384 0.426-0.5l6.999-3.999c0.112-0.064 0.232-0.105 0.355-0.124 0.218-0.034 0.445 0.003 0.654 0.124l6.991 3.995c0.111 0.065 0.207 0.148 0.285 0.245 0.139 0.171 0.22 0.385 0.22 0.621zM22 16v-8c-0.001-0.71-0.248-1.363-0.664-1.878-0.23-0.286-0.512-0.528-0.831-0.715l-7.009-4.005c-0.61-0.352-1.3-0.465-1.954-0.364-0.363 0.057-0.715 0.179-1.037 0.363l-7.001 4.001c-0.618 0.357-1.060 0.897-1.299 1.514-0.133 0.342-0.202 0.707-0.205 1.077v8.007c0.001 0.71 0.248 1.363 0.664 1.878 0.23 0.286 0.512 0.528 0.831 0.715l7.009 4.005c0.61 0.352 1.3 0.465 1.954 0.364 0.363-0.057 0.715-0.179 1.037-0.363l7.001-4.001c0.618-0.357 1.060-0.897 1.299-1.514 0.133-0.342 0.202-0.707 0.205-1.084z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-home\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M2.386 8.211c-0.236 0.184-0.386 0.469-0.386 0.789v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-11c-0.001-0.3-0.134-0.593-0.386-0.789l-9-7c-0.358-0.275-0.861-0.285-1.228 0zM16 21v-9c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v9h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10.511l8-6.222 8 6.222v10.511c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM10 21v-8h4v8z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-image\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM11 8.5c0-0.69-0.281-1.316-0.732-1.768s-1.078-0.732-1.768-0.732-1.316 0.281-1.768 0.732-0.732 1.078-0.732 1.768 0.281 1.316 0.732 1.768 1.078 0.732 1.768 0.732 1.316-0.281 1.768-0.732 0.732-1.078 0.732-1.768zM9 8.5c0 0.138-0.055 0.262-0.146 0.354s-0.216 0.146-0.354 0.146-0.262-0.055-0.354-0.146-0.146-0.216-0.146-0.354 0.055-0.262 0.146-0.354 0.216-0.146 0.354-0.146 0.262 0.055 0.354 0.146 0.146 0.216 0.146 0.354zM7.414 20l8.586-8.586 4 4v3.586c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM20 12.586l-3.293-3.293c-0.391-0.391-1.024-0.391-1.414 0l-10.644 10.644c-0.135-0.050-0.255-0.129-0.356-0.23-0.182-0.182-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-inbox\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 13v5c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-5h4.465l1.703 2.555c0.182 0.27 0.486 0.445 0.832 0.445h4c0.326-0.002 0.64-0.158 0.832-0.445l1.703-2.555zM6.344 5.558c0.066-0.131 0.16-0.246 0.272-0.337 0.172-0.139 0.387-0.221 0.624-0.221h9.513c0.15 0.001 0.295 0.034 0.426 0.094 0.201 0.092 0.37 0.249 0.477 0.464l2.725 5.442h-4.381c-0.346 0-0.65 0.175-0.832 0.445l-1.703 2.555h-2.93l-1.703-2.555c-0.192-0.287-0.506-0.443-0.832-0.445h-4.381zM4.556 4.662l-3.441 6.872c-0.031 0.059-0.056 0.121-0.075 0.187-0.028 0.094-0.041 0.188-0.040 0.279v6c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-6c0-0.151-0.033-0.293-0.091-0.417-0.005-0.010-0.010-0.021-0.015-0.031l-0.009-0.018-3.441-6.872c-0.315-0.634-0.829-1.111-1.433-1.387-0.388-0.177-0.812-0.272-1.244-0.275h-9.527c-0.711 0-1.367 0.249-1.883 0.667-0.331 0.268-0.605 0.606-0.801 0.995z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-info\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM13 16v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.552 0.448 1 1 1s1-0.448 1-1zM12 9c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-instagram\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 1c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243v10c0 1.657 0.673 3.158 1.757 4.243s2.586 1.757 4.243 1.757h10c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243v-10c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757zM7 3h10c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828v10c0 1.105-0.447 2.103-1.172 2.828s-1.723 1.172-2.828 1.172h-10c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828v-10c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172zM16.989 11.223c-0.15-0.972-0.571-1.857-1.194-2.567-0.754-0.861-1.804-1.465-3.009-1.644-0.464-0.074-0.97-0.077-1.477-0.002-1.366 0.202-2.521 0.941-3.282 1.967s-1.133 2.347-0.93 3.712 0.941 2.521 1.967 3.282 2.347 1.133 3.712 0.93 2.521-0.941 3.282-1.967 1.133-2.347 0.93-3.712zM15.011 11.517c0.122 0.82-0.1 1.609-0.558 2.227s-1.15 1.059-1.969 1.18-1.609-0.1-2.227-0.558-1.059-1.15-1.18-1.969 0.1-1.609 0.558-2.227 1.15-1.059 1.969-1.18c0.313-0.046 0.615-0.042 0.87-0.002 0.74 0.11 1.366 0.47 1.818 0.986 0.375 0.428 0.63 0.963 0.72 1.543zM17.5 7.5c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-italic\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13.557 5l-5.25 14h-3.307c-0.552 0-1 0.448-1 1s0.448 1 1 1h9c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.557l5.25-14h3.307c0.552 0 1-0.448 1-1s-0.448-1-1-1h-9c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-key\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.293 1.293l-2 2c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2-2c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0zM12.092 10.898c-1.262-1.244-2.908-1.869-4.553-1.873-1.652-0.003-3.308 0.62-4.578 1.873-1.277 1.26-1.923 2.921-1.935 4.583s0.614 3.332 1.874 4.609c1.34 1.323 3.009 1.946 4.671 1.935s3.323-0.657 4.583-1.935 1.884-2.947 1.873-4.609-0.657-3.323-1.935-4.583zM10.688 12.322c0.885 0.873 1.332 2.020 1.339 3.173s-0.424 2.306-1.297 3.191-2.020 1.332-3.173 1.339-2.306-0.424-3.191-1.297c-0.916-0.927-1.347-2.080-1.339-3.233s0.455-2.3 1.339-3.173c0.879-0.867 2.023-1.299 3.169-1.296 1.141 0.002 2.279 0.435 3.152 1.296zM12.097 12.317l4.11-4.11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4.11 4.11c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM14.793 8.207l3 3c0.391 0.391 1.024 0.391 1.414 0l3.5-3.5c0.391-0.391 0.391-1.024 0-1.414l-3-3c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293-2.086 2.086-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM16.207 8.207l3.5-3.5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.5 3.5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-layers\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 3.118l7.764 3.882-7.764 3.882-7.764-3.882zM11.553 1.106l-10 5c-0.494 0.247-0.694 0.847-0.447 1.341 0.101 0.203 0.261 0.356 0.447 0.447l10 5c0.292 0.146 0.62 0.136 0.894 0l10-5c0.494-0.247 0.694-0.848 0.447-1.342-0.101-0.202-0.262-0.355-0.447-0.447l-10-5c-0.292-0.146-0.62-0.136-0.894 0zM1.553 17.894l10 5c0.292 0.146 0.62 0.136 0.894 0l10-5c0.494-0.247 0.694-0.848 0.447-1.342s-0.848-0.694-1.342-0.447l-9.552 4.777-9.553-4.776c-0.494-0.247-1.095-0.047-1.342 0.447s-0.047 1.095 0.447 1.342zM1.553 12.894l10 5c0.292 0.146 0.62 0.136 0.894 0l10-5c0.494-0.247 0.694-0.848 0.447-1.342s-0.848-0.694-1.342-0.447l-9.552 4.777-9.553-4.776c-0.494-0.247-1.095-0.047-1.342 0.447s-0.047 1.095 0.447 1.342z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-layout\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM20 8h-16v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707zM8 10v10h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-9zM10 20v-10h10v9c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-life-buoy\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM15 12c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM17.618 4.968l-2.86 2.86c0 0 0 0 0 0-0.791-0.523-1.739-0.828-2.758-0.828s-1.967 0.305-2.757 0.829l-2.86-2.86c1.539-1.233 3.492-1.969 5.617-1.969s4.078 0.736 5.618 1.968zM19.032 6.382c1.232 1.54 1.968 3.493 1.968 5.618s-0.736 4.078-1.968 5.618l-2.86-2.86c0.523-0.791 0.828-1.739 0.828-2.758s-0.305-1.967-0.829-2.757zM7.829 14.757l-2.86 2.86c-1.233-1.539-1.969-3.492-1.969-5.617s0.736-4.078 1.968-5.618l2.86 2.86c-0.523 0.791-0.828 1.739-0.828 2.758s0.305 1.967 0.829 2.757zM6.382 19.032l2.86-2.86c0.791 0.523 1.739 0.828 2.758 0.828s1.967-0.305 2.757-0.829l2.86 2.86c-1.539 1.233-3.492 1.969-5.617 1.969s-4.078-0.736-5.618-1.968z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-link\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-link-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 8h3c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 16h-3c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-linkedin\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16 7c-1.933 0-3.684 0.785-4.95 2.050s-2.050 3.017-2.050 4.95v7c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707v7c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-7c0-1.933-0.785-3.684-2.050-4.95s-3.017-2.050-4.95-2.050zM16 9c1.381 0 2.63 0.559 3.536 1.464s1.464 2.155 1.464 3.536v6h-2v-6c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121v6h-2v-6c0-1.381 0.559-2.63 1.464-3.536s2.155-1.464 3.536-1.464zM2 8c-0.552 0-1 0.448-1 1v12c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-12c0-0.552-0.448-1-1-1zM3 10h2v10h-2zM7 4c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121 0.337 1.58 0.879 2.121 1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121zM5 4c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707 0.111-0.525 0.293-0.707 0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-list\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 7h13c0.552 0 1-0.448 1-1s-0.448-1-1-1h-13c-0.552 0-1 0.448-1 1s0.448 1 1 1zM8 13h13c0.552 0 1-0.448 1-1s-0.448-1-1-1h-13c-0.552 0-1 0.448-1 1s0.448 1 1 1zM8 19h13c0.552 0 1-0.448 1-1s-0.448-1-1-1h-13c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM3 13c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM3 19c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-loader\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-lock\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-log-in\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 4h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h4c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM12.586 11h-9.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h9.586l-3.293 3.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5-5c0.096-0.096 0.168-0.206 0.217-0.324s0.076-0.247 0.076-0.383c0-0.13-0.025-0.261-0.076-0.383-0.049-0.118-0.121-0.228-0.217-0.324l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-log-out\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9 20h-4c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h4c0.552 0 1-0.448 1-1s-0.448-1-1-1zM18.586 11h-9.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h9.586l-3.293 3.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5-5c0.092-0.092 0.166-0.202 0.217-0.324 0.15-0.362 0.078-0.795-0.217-1.090l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-mail\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 7.921l8.427 5.899c0.34 0.235 0.795 0.246 1.147 0l8.426-5.899v10.079c0 0.272-0.11 0.521-0.295 0.705s-0.433 0.295-0.705 0.295h-16c-0.272 0-0.521-0.11-0.705-0.295s-0.295-0.433-0.295-0.705zM1 5.983c0 0.010 0 0.020 0 0.030v11.987c0 0.828 0.34 1.579 0.88 2.12s1.292 0.88 2.12 0.88h16c0.828 0 1.579-0.34 2.12-0.88s0.88-1.292 0.88-2.12v-11.988c0-0.010 0-0.020 0-0.030-0.005-0.821-0.343-1.565-0.88-2.102-0.541-0.54-1.292-0.88-2.12-0.88h-16c-0.828 0-1.579 0.34-2.12 0.88-0.537 0.537-0.875 1.281-0.88 2.103zM20.894 5.554l-8.894 6.225-8.894-6.225c0.048-0.096 0.112-0.183 0.188-0.259 0.185-0.185 0.434-0.295 0.706-0.295h16c0.272 0 0.521 0.11 0.705 0.295 0.076 0.076 0.14 0.164 0.188 0.259z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-map\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 3.723v13.697l-5 2.857v-13.697zM17 20.277v-13.697l5-2.857v13.696zM15.535 22.885c0.082 0.043 0.17 0.075 0.263 0.094 0.033 0.007 0.067 0.012 0.101 0.015s0.068 0.005 0.102 0.005c-0.001 0.001-0.001 0.001-0.001 0.001s0 0 0.001 0c0.173 0 0.344-0.046 0.496-0.132l0.015-0.009 6.985-3.991c0.32-0.183 0.501-0.518 0.503-0.868v-16c0-0.552-0.448-1-1-1-0.183 0-0.354 0.049-0.496 0.132l-6.535 3.734-7.503-3.752c-0.083-0.042-0.171-0.075-0.264-0.094-0.034-0.007-0.067-0.012-0.101-0.015s-0.068-0.005-0.102-0.005c0.001 0 0.001 0 0.001 0s0 0-0.001 0c-0.173 0-0.344 0.046-0.495 0.132l-0.015 0.008-6.985 3.992c-0.321 0.183-0.502 0.518-0.504 0.868v16c0 0.552 0.448 1 1 1 0.183 0 0.354-0.049 0.496-0.132l6.535-3.734zM15 6.618v13.764l-6-3v-13.764z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-map-pin\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22 10c0-2.761-1.12-5.263-2.929-7.071s-4.31-2.929-7.071-2.929-5.263 1.12-7.071 2.929-2.929 4.31-2.929 7.071c0 0.569 0.053 1.128 0.15 1.676 0.274 1.548 0.899 3.004 1.682 4.32 2.732 4.591 7.613 7.836 7.613 7.836 0.331 0.217 0.765 0.229 1.109 0 0 0 4.882-3.245 7.613-7.836 0.783-1.316 1.408-2.772 1.682-4.32 0.098-0.548 0.151-1.107 0.151-1.676zM20 10c0 0.444-0.041 0.887-0.119 1.328-0.221 1.25-0.737 2.478-1.432 3.646-1.912 3.214-5.036 5.747-6.369 6.74-1.398-0.916-4.588-3.477-6.53-6.74-0.695-1.168-1.211-2.396-1.432-3.646-0.077-0.441-0.118-0.884-0.118-1.328 0-2.209 0.894-4.208 2.343-5.657s3.448-2.343 5.657-2.343 4.208 0.894 5.657 2.343 2.343 3.448 2.343 5.657zM16 10c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM14 10c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-maximize\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 2h-3c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM22 8v-3c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v3c0 0.552 0.448 1 1 1s1-0.448 1-1zM16 22h3c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM2 16v3c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-maximize-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.586 4l-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.414 20l5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293v-3.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-meh\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 16h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM15 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-menu\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-message-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22 11.497v-0.497c0-0.017-0.001-0.038-0.002-0.058-0.136-2.338-1.113-4.461-2.642-6.051-1.602-1.667-3.814-2.752-6.301-2.889-0.016-0.001-0.036-0.002-0.055-0.002h-0.489c-1.405-0.016-2.882 0.31-4.264 1.008-1.223 0.621-2.291 1.488-3.139 2.535-1.322 1.634-2.107 3.705-2.108 5.946-0.014 1.275 0.253 2.61 0.824 3.877l-1.772 5.317c-0.066 0.196-0.072 0.418 0 0.632 0.175 0.524 0.741 0.807 1.265 0.632l5.314-1.771c1.16 0.527 2.484 0.826 3.876 0.823 1.372-0.009 2.714-0.308 3.941-0.866 1.912-0.871 3.54-2.373 4.541-4.375 0.644-1.249 1.015-2.715 1.011-4.261zM20 11.503c0.003 1.225-0.292 2.375-0.789 3.339-0.801 1.602-2.082 2.785-3.592 3.472-0.97 0.442-2.035 0.679-3.126 0.686-1.221 0.003-2.371-0.292-3.335-0.789-0.249-0.129-0.528-0.142-0.775-0.060l-3.803 1.268 1.268-3.803c0.088-0.263 0.060-0.537-0.056-0.767-0.552-1.094-0.804-2.254-0.792-3.338 0.001-1.789 0.619-3.42 1.663-4.709 0.671-0.829 1.518-1.517 2.49-2.010 1.092-0.552 2.252-0.804 3.336-0.792h0.456c1.962 0.107 3.704 0.961 4.969 2.277 1.202 1.251 1.972 2.916 2.086 4.753z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-message-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22 15v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-14c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.256 0.098 0.512 0.293 0.707 0.391 0.391 1.024 0.391 1.414 0l3.707-3.707h11.586c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121zM20 15c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.526 0.112-0.707 0.293l-2.293 2.293v-13.586c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-mic\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 2c0.553 0 1.051 0.223 1.414 0.586s0.586 0.861 0.586 1.414v8c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414v-8c0-0.553 0.223-1.051 0.586-1.414s0.861-0.586 1.414-0.586zM12 0c-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828v8c0 1.104 0.449 2.106 1.172 2.828s1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828v-8c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172zM8 24h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-2.062c1.809-0.226 3.432-1.056 4.657-2.281 1.446-1.447 2.343-3.448 2.343-5.657v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2c0 1.657-0.67 3.156-1.757 4.243s-2.586 1.757-4.243 1.757-3.156-0.67-4.243-1.757-1.757-2.586-1.757-4.243v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2c0 2.209 0.897 4.21 2.343 5.657 1.225 1.225 2.847 2.055 4.657 2.281v2.062h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-mic-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.516 13.93c-0.164 0.044-0.336 0.067-0.514 0.067-0.555-0.001-1.053-0.223-1.415-0.585-0.363-0.362-0.587-0.86-0.587-1.412v-0.586zM16 9.34v-5.34c0.001-1.103-0.447-2.105-1.169-2.829s-1.723-1.173-2.827-1.174c-1.014-0.001-1.943 0.377-2.649 1.002-0.636 0.563-1.092 1.327-1.274 2.197-0.113 0.541 0.234 1.070 0.775 1.183s1.070-0.234 1.183-0.775c0.092-0.44 0.322-0.825 0.641-1.108 0.35-0.31 0.806-0.497 1.308-0.499 0.571 0.003 1.066 0.226 1.427 0.587 0.363 0.364 0.586 0.862 0.585 1.416v5.34c0 0.552 0.448 1 1 1s1-0.448 1-1zM18 10v2c0 0.376-0.035 0.74-0.093 1.045-0.102 0.543 0.255 1.066 0.798 1.168s1.066-0.255 1.168-0.798c0.082-0.434 0.127-0.922 0.127-1.415v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM8 24h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-2.024c1.446-0.189 2.791-0.732 3.934-1.627l5.359 5.359c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.838-5.838c-0.045-0.079-0.101-0.153-0.169-0.219-0.063-0.062-0.132-0.113-0.205-0.155l-15.788-15.789c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l7.707 7.707v2.586c0.001 1.105 0.451 2.106 1.174 2.828s1.725 1.17 2.829 1.169c0.739-0.001 1.433-0.202 2.027-0.553l1.477 1.477c-0.959 0.693-2.078 1.068-3.212 1.123-0.094-0.029-0.193-0.044-0.295-0.044-0.103 0-0.201 0.015-0.295 0.044-1.417-0.069-2.812-0.637-3.905-1.707-1.153-1.129-1.753-2.608-1.798-4.106-0.002-0.112-0.002-0.224-0.002-0.224v-2.007c0-0.552-0.448-1-1-1s-1 0.448-1 1v1.993c0 0.149 0.003 0.298 0.003 0.298 0.060 1.994 0.861 3.969 2.398 5.475 1.299 1.273 2.924 2.013 4.599 2.223v2.011h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-minimize\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 3v3c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1zM21 7h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM17 21v-3c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v3c0 0.552 0.448 1 1 1s1-0.448 1-1zM3 17h3c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-minimize-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.414 9l5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293v-3.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.136 0.027 0.265 0.076 0.383s0.121 0.228 0.216 0.323c0.001 0.001 0.001 0.001 0.002 0.002 0.092 0.092 0.202 0.166 0.323 0.216 0.118 0.049 0.247 0.076 0.383 0.076h6c0.552 0 1-0.448 1-1s-0.448-1-1-1zM3.707 21.707l5.293-5.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.096-0.095-0.206-0.167-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.586l-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-minus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 13h14c0.552 0 1-0.448 1-1s-0.448-1-1-1h-14c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-minus-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-minus-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-monitor\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 16h-8c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM11 18v2h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-2h7c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-16c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-moon\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21.996 12.882c0.022-0.233-0.038-0.476-0.188-0.681-0.325-0.446-0.951-0.544-1.397-0.219-0.95 0.693-2.060 1.086-3.188 1.162-1.368 0.092-2.765-0.283-3.95-1.158-1.333-0.985-2.139-2.415-2.367-3.935s0.124-3.124 1.109-4.456c0.142-0.191 0.216-0.435 0.191-0.691-0.053-0.55-0.542-0.952-1.092-0.898-2.258 0.22-4.314 1.18-5.895 2.651-1.736 1.615-2.902 3.847-3.137 6.386-0.254 2.749 0.631 5.343 2.266 7.311s4.022 3.313 6.772 3.567 5.343-0.631 7.311-2.266 3.313-4.022 3.567-6.772zM19.567 14.674c-0.49 1.363-1.335 2.543-2.416 3.441-1.576 1.309-3.648 2.016-5.848 1.813s-4.108-1.278-5.417-2.854-2.016-3.648-1.813-5.848c0.187-2.032 1.117-3.814 2.507-5.106 0.782-0.728 1.71-1.3 2.731-1.672-0.456 1.264-0.577 2.606-0.384 3.899 0.303 2.023 1.38 3.934 3.156 5.247 1.578 1.167 3.448 1.668 5.272 1.545 0.752-0.050 1.496-0.207 2.21-0.465z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-more-horizontal\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM21 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM7 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-more-vertical\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 5c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-mouse-pointer\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4.857 4.857l12.284 5.118-4.883 1.658c-0.285 0.098-0.522 0.32-0.625 0.625l-1.658 4.883zM13.010 14.424l5.283 5.283c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.283-5.283 5.868-1.993c0.523-0.178 0.803-0.746 0.625-1.268-0.096-0.283-0.306-0.494-0.562-0.601l-16.97-7.070c-0.51-0.212-1.095 0.029-1.308 0.539-0.107 0.256-0.099 0.532 0 0.769l7.070 16.97c0.212 0.51 0.798 0.751 1.308 0.539 0.275-0.115 0.472-0.338 0.562-0.601z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-move\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 4.414v6.586h-6.586l1.293-1.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3 3c-0.181 0.181-0.293 0.431-0.293 0.707 0 0.136 0.027 0.265 0.076 0.383s0.121 0.228 0.217 0.324l3 3c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.293-1.293h6.586v6.586l-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3 3c0.096 0.096 0.206 0.168 0.324 0.217s0.247 0.076 0.383 0.076c0.13 0 0.261-0.025 0.383-0.076 0.118-0.049 0.228-0.121 0.324-0.217l3-3c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.293 1.293v-6.586h6.586l-1.293 1.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3-3c0.096-0.096 0.168-0.206 0.217-0.324 0.15-0.362 0.078-0.795-0.217-1.090l-3-3c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l1.293 1.293h-6.586v-6.586l1.293 1.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-3-3c-0.092-0.092-0.202-0.166-0.324-0.217-0.245-0.101-0.521-0.101-0.766 0-0.118 0.049-0.228 0.121-0.324 0.217l-3 3c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-music\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 18c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM22 16v-13c0-0.050-0.004-0.107-0.014-0.164-0.091-0.545-0.606-0.913-1.151-0.822l-12 2c-0.476 0.081-0.835 0.492-0.835 0.986v9.535c-0.588-0.34-1.272-0.535-2-0.535-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828v-12.153l10-1.667v8.355c-0.588-0.34-1.272-0.535-2-0.535-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM20 16c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-navigation\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M2.572 10.096c-0.262 0.125-0.467 0.36-0.542 0.661-0.134 0.536 0.192 1.079 0.728 1.213l7.418 1.854 1.854 7.418c0.071 0.281 0.261 0.528 0.542 0.661 0.499 0.236 1.095 0.023 1.332-0.476l9-19c0.124-0.263 0.133-0.575 0-0.856-0.236-0.499-0.833-0.712-1.332-0.476zM5.953 10.708l13.945-6.606-6.606 13.945-1.322-5.29c-0.092-0.369-0.378-0.638-0.728-0.728z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-navigation-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.938 1.654c-0.099-0.266-0.307-0.488-0.593-0.593-0.518-0.191-1.093 0.074-1.284 0.593l-7 19c-0.098 0.269-0.082 0.576 0.070 0.842 0.274 0.48 0.885 0.646 1.364 0.372l6.505-3.716 6.504 3.716c0.249 0.141 0.554 0.176 0.842 0.070 0.518-0.191 0.784-0.766 0.593-1.284zM12 4.893l5.113 13.877-4.617-2.638c-0.317-0.181-0.691-0.17-0.992 0l-4.617 2.638z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-octagon\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.86 1c-0.256 0-0.512 0.098-0.707 0.293l-5.86 5.86c-0.181 0.181-0.293 0.431-0.293 0.707v8.28c0 0.256 0.098 0.512 0.293 0.707l5.86 5.86c0.181 0.181 0.431 0.293 0.707 0.293h8.28c0.256 0 0.512-0.098 0.707-0.293l5.86-5.86c0.181-0.181 0.293-0.431 0.293-0.707v-8.28c0-0.256-0.098-0.512-0.293-0.707l-5.86-5.86c-0.181-0.181-0.431-0.293-0.707-0.293zM8.274 3h7.452l5.274 5.274v7.452l-5.274 5.274h-7.452l-5.274-5.274v-7.452z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-package\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.507 9.405l-2.507 1.45-6.961-4.027 2.511-1.435zM18.961 6.828l-2.456 1.421-6.944-4.005 1.934-1.105c0.112-0.064 0.232-0.105 0.355-0.124 0.218-0.034 0.445 0.003 0.654 0.124zM11.526 22.961c0.141 0.076 0.303 0.119 0.474 0.119 0.173 0 0.336-0.044 0.478-0.121 0.356-0.058 0.701-0.18 1.017-0.36l7.001-4.001c0.618-0.357 1.060-0.897 1.299-1.514 0.133-0.342 0.202-0.707 0.205-1.084v-8c0-0.478-0.113-0.931-0.314-1.334-0.022-0.071-0.052-0.14-0.091-0.207-0.046-0.079-0.1-0.149-0.162-0.21-0.031-0.043-0.064-0.086-0.097-0.127-0.23-0.286-0.512-0.528-0.831-0.715l-7.009-4.005c-0.61-0.352-1.3-0.465-1.954-0.364-0.363 0.057-0.715 0.179-1.037 0.363l-3.199 1.828c-0.21 0.041-0.406 0.15-0.553 0.316l-3.249 1.857c-0.383 0.221-0.699 0.513-0.941 0.85-0.060 0.060-0.114 0.13-0.159 0.207-0.039 0.068-0.070 0.138-0.092 0.21-0.040 0.080-0.076 0.163-0.108 0.246-0.132 0.343-0.201 0.708-0.204 1.078v8.007c0.001 0.71 0.248 1.363 0.664 1.878 0.23 0.286 0.512 0.528 0.831 0.715l7.009 4.005c0.324 0.187 0.67 0.307 1.022 0.362zM11 12.587v7.991l-6.495-3.711c-0.111-0.065-0.207-0.148-0.285-0.245-0.139-0.172-0.22-0.386-0.22-0.622v-7.462zM13 20.578v-7.991l7-4.049v7.462c-0.001 0.121-0.025 0.246-0.070 0.362-0.080 0.206-0.225 0.384-0.426 0.5z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-paperclip\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.733 10.343l-9.19 9.19c-0.977 0.977-2.256 1.465-3.538 1.465s-2.561-0.488-3.538-1.465-1.465-2.256-1.465-3.538 0.488-2.561 1.465-3.538l9.19-9.19c0.586-0.586 1.353-0.879 2.123-0.879s1.536 0.293 2.123 0.879 0.879 1.353 0.879 2.123-0.293 1.536-0.879 2.123l-9.2 9.19c-0.196 0.196-0.451 0.294-0.708 0.294s-0.512-0.098-0.708-0.293-0.293-0.45-0.293-0.708 0.098-0.512 0.293-0.708l8.49-8.48c0.391-0.39 0.391-1.023 0.001-1.414s-1.023-0.391-1.414-0.001l-8.49 8.48c-0.586 0.586-0.879 1.356-0.879 2.122s0.293 1.536 0.879 2.122 1.356 0.879 2.122 0.879 1.536-0.293 2.122-0.879l9.2-9.19c0.977-0.977 1.465-2.258 1.465-3.537s-0.489-2.561-1.465-3.537-2.258-1.465-3.537-1.465-2.561 0.489-3.537 1.465l-9.19 9.19c-1.367 1.367-2.051 3.161-2.051 4.952s0.684 3.585 2.051 4.952 3.161 2.051 4.952 2.051 3.585-0.684 4.952-2.051l9.19-9.19c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-pause\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6 3c-0.552 0-1 0.448-1 1v16c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-16c0-0.552-0.448-1-1-1zM7 5h2v14h-2zM14 3c-0.552 0-1 0.448-1 1v16c0 0.552 0.448 1 1 1h4c0.552 0 1-0.448 1-1v-16c0-0.552-0.448-1-1-1zM15 5h2v14h-2z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-pause-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM11 15v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.552 0.448 1 1 1s1-0.448 1-1zM15 15v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-pen-tool\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.707 13.707l0.293-0.293 1.586 1.586-5.586 5.586-1.586-1.586 0.293-0.293zM2.252 1.032c-0.035-0.009-0.070-0.016-0.106-0.021-0.143-0.022-0.284-0.011-0.417 0.026-0.132 0.037-0.259 0.102-0.37 0.195-0.092 0.077-0.171 0.171-0.231 0.279-0.060 0.106-0.099 0.22-0.116 0.337-0.020 0.128-0.015 0.255 0.012 0.371 0.001 0.005 0.003 0.011 0.004 0.016l0.004 0.017 3.496 14.483c0.094 0.388 0.403 0.669 0.776 0.746l5.765 1.153c-0.141 0.359-0.067 0.783 0.224 1.073l3 3c0.391 0.391 1.024 0.391 1.414 0l7-7c0.391-0.391 0.391-1.024 0-1.414l-3-3c-0.29-0.29-0.714-0.365-1.073-0.224l-1.153-5.765c-0.078-0.392-0.376-0.684-0.746-0.776zM14 11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879c-0.463 0-0.902 0.105-1.293 0.293l-4.487-4.487 10.425 2.516 1.27 6.349-4.243 4.243-6.349-1.27-2.517-10.424 4.487 4.487c-0.188 0.391-0.293 0.83-0.293 1.293 0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121zM12 11c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707c0-0.27 0.106-0.514 0.281-0.695 0.004-0.004 0.008-0.008 0.013-0.012s0.008-0.008 0.012-0.013c0.18-0.174 0.424-0.28 0.694-0.28 0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-percent\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.293 4.293l-14 14c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l14-14c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0zM10 6.5c0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025-1.843 0.393-2.475 1.025-1.025 1.509-1.025 2.475 0.393 1.843 1.025 2.475 1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475zM8 6.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061zM21 17.5c0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025-1.843 0.393-2.475 1.025-1.025 1.509-1.025 2.475 0.393 1.843 1.025 2.475 1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475zM19 17.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-call\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.859 5.981c0.943 0.184 1.74 0.683 2.31 1.374 0.42 0.51 0.716 1.124 0.852 1.793 0.109 0.541 0.637 0.891 1.178 0.782s0.891-0.637 0.782-1.178c-0.2-0.992-0.64-1.907-1.269-2.669-0.854-1.036-2.057-1.789-3.47-2.064-0.542-0.106-1.067 0.248-1.173 0.79s0.248 1.067 0.79 1.173zM14.94 1.994c2 0.222 3.743 1.162 5.005 2.544 1.118 1.224 1.858 2.794 2.062 4.519 0.065 0.548 0.562 0.941 1.11 0.876s0.941-0.562 0.876-1.11c-0.253-2.147-1.176-4.106-2.571-5.634-1.578-1.728-3.762-2.906-6.261-3.183-0.549-0.061-1.043 0.335-1.104 0.883s0.335 1.043 0.883 1.104zM23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-forwarded\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 6h5.586l-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l4-4c0.092-0.092 0.166-0.202 0.217-0.324 0.101-0.245 0.101-0.521 0-0.766-0.049-0.118-0.121-0.228-0.217-0.324l-4-4c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293h-5.586c-0.552 0-1 0.448-1 1s0.448 1 1 1zM23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-incoming\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22.293 0.293l-5.293 5.293v-3.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.256 0.098 0.512 0.293 0.707 0.096 0.096 0.206 0.168 0.324 0.217s0.247 0.076 0.383 0.076h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.586l5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0zM23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-missed\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.293 1.707l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6.029 12.266c-1.682-2.593-2.64-5.44-2.914-8.185-0.024-0.266 0.064-0.523 0.229-0.721s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l1.279-1.279c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.715-0.456-1.346-0.963-1.805-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.201c0.306 3.062 1.371 6.214 3.226 9.075 0.3 0.463 0.92 0.595 1.383 0.295s0.595-0.92 0.295-1.383zM9.285 16.13l1.421-1.421c0.929 0.828 1.918 1.531 2.899 2.075 0.397 0.221 0.88 0.142 1.193-0.167l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.24 0.034 0.458 0.164 0.612 0.352 0.146 0.178 0.231 0.405 0.229 0.649v3.006c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-0.907-0.576-1.737-1.21-2.457-1.856zM22.293 0.293l-12.231 12.23c-0.031 0.024-0.061 0.051-0.089 0.079-0.029 0.029-0.055 0.059-0.080 0.090l-9.6 9.6c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l6.162-6.162c0.823 0.748 1.764 1.47 2.77 2.109 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121v-2.994c0.004-0.723-0.249-1.4-0.682-1.929-0.46-0.561-1.125-0.958-1.917-1.070-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-0.609-0.387-1.221-0.844-1.81-1.361l11.584-11.583c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-phone-outgoing\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.707 8.707l5.293-5.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.586l-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM23 16.92c0.016-0.714-0.236-1.404-0.673-1.943-0.46-0.566-1.129-0.967-1.925-1.080-0.8-0.098-1.695-0.314-2.586-0.646-0.433-0.159-0.893-0.218-1.344-0.174-0.663 0.064-1.307 0.349-1.819 0.855l-0.72 0.72c-1.77-1.117-3.36-2.667-4.583-4.589l0.726-0.726c0.322-0.33 0.563-0.726 0.707-1.156 0.212-0.632 0.214-1.336-0.039-2.011-0.289-0.753-0.518-1.644-0.644-2.595-0.104-0.714-0.456-1.345-0.963-1.804-0.539-0.486-1.256-0.779-2.027-0.771h-2.996c-0.088 0-0.182 0.004-0.273 0.012-0.824 0.075-1.542 0.478-2.033 1.066s-0.758 1.367-0.683 2.199c0.3 3.076 1.365 6.243 3.216 9.102 1.502 2.413 3.648 4.623 6.298 6.306 2.568 1.697 5.684 2.862 9.086 3.231 0.092 0.009 0.191 0.013 0.288 0.013 0.828-0.003 1.578-0.343 2.118-0.887s0.873-1.297 0.87-2.121zM21 16.92v3c0.001 0.28-0.109 0.53-0.29 0.712s-0.429 0.295-0.706 0.296c-3.149-0.336-5.961-1.391-8.263-2.912-2.428-1.543-4.359-3.537-5.702-5.694-1.697-2.62-2.655-5.481-2.924-8.238-0.024-0.268 0.064-0.526 0.229-0.724s0.403-0.33 0.678-0.355l3.088-0.005c0.271-0.003 0.507 0.094 0.687 0.256 0.17 0.154 0.288 0.366 0.323 0.608 0.142 1.072 0.408 2.117 0.757 3.025 0.081 0.216 0.080 0.447 0.010 0.658-0.049 0.145-0.131 0.281-0.242 0.395l-1.262 1.261c-0.324 0.324-0.379 0.814-0.162 1.201 1.584 2.785 3.839 4.957 6.381 6.378 0.397 0.222 0.882 0.144 1.195-0.166l1.27-1.27c0.166-0.164 0.377-0.257 0.598-0.279 0.152-0.015 0.31 0.005 0.459 0.060 1.022 0.381 2.070 0.636 3.034 0.754 0.241 0.034 0.462 0.166 0.615 0.355 0.147 0.181 0.231 0.412 0.226 0.682z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-pie-chart\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.289 15.501c-0.968 2.289-2.771 3.968-4.906 4.835s-4.599 0.917-6.888-0.051-3.968-2.771-4.835-4.906-0.918-4.6 0.050-6.889c0.936-2.214 2.652-3.856 4.689-4.743 0.506-0.221 0.738-0.81 0.518-1.316s-0.81-0.738-1.316-0.518c-2.489 1.084-4.589 3.094-5.733 5.798-1.183 2.798-1.119 5.812-0.062 8.419s3.112 4.814 5.909 5.997 5.812 1.119 8.419 0.062 4.814-3.112 5.997-5.909c0.215-0.509-0.023-1.095-0.532-1.311s-1.095 0.023-1.311 0.532zM20.945 11h-7.945v-7.945c2.086 0.23 3.956 1.173 5.364 2.581s2.351 3.278 2.581 5.364zM23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1h10c0.552 0 1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-play\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.541 2.159c-0.153-0.1-0.34-0.159-0.541-0.159-0.552 0-1 0.448-1 1v18c-0.001 0.182 0.050 0.372 0.159 0.541 0.299 0.465 0.917 0.599 1.382 0.3l14-9c0.114-0.072 0.219-0.174 0.3-0.3 0.299-0.465 0.164-1.083-0.3-1.382zM6 4.832l11.151 7.168-11.151 7.168z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-play-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.555 7.168c-0.156-0.105-0.348-0.168-0.555-0.168-0.552 0-1 0.448-1 1v8c-0.001 0.188 0.053 0.383 0.168 0.555 0.306 0.46 0.927 0.584 1.387 0.277l6-4c0.103-0.068 0.2-0.162 0.277-0.277 0.306-0.46 0.182-1.080-0.277-1.387zM11 9.869l3.197 2.131-3.197 2.131z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-plus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-plus-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h3v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-plus-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 13h3v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-pocket\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v6c0 3.037 1.232 5.789 3.222 7.778s4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778v-6c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM4 4h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v6c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364v-6c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM7.293 10.707l4 4c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-3.293-3.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-power\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17.653 7.347c1.562 1.563 2.343 3.608 2.342 5.657s-0.782 4.094-2.344 5.656c-1.562 1.561-3.606 2.342-5.654 2.342-2.052 0-4.098-0.782-5.659-2.344s-2.342-3.608-2.342-5.656 0.781-4.094 2.342-5.656c0.39-0.391 0.39-1.024 0-1.414s-1.024-0.39-1.414 0c-1.952 1.952-2.928 4.513-2.928 7.070s0.976 5.118 2.928 7.070c1.952 1.953 4.513 2.93 7.071 2.93s5.119-0.976 7.072-2.928c1.953-1.952 2.93-4.513 2.93-7.070-0.001-2.561-0.977-5.12-2.928-7.072-0.39-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM11 2v10c0 0.552 0.448 1 1 1s1-0.448 1-1v-10c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-printer\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 8h-10v-5h10zM5 19v3c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-3h1c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-5c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-1v-6c0-0.552-0.448-1-1-1h-12c-0.552 0-1 0.448-1 1v6h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v5c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879zM6 13c-0.552 0-1 0.448-1 1v3h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-5c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v5c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1v-3c0-0.552-0.448-1-1-1zM7 15h10v6h-10z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-radio\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121 0.337 1.58 0.879 2.121 1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121zM13 12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707 0.111-0.525 0.293-0.707 0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707zM15.533 8.468c0.977 0.976 1.466 2.254 1.466 3.535s-0.487 2.559-1.462 3.536c-0.39 0.391-0.39 1.024 0.001 1.414s1.024 0.39 1.414-0.001c1.366-1.367 2.048-3.161 2.047-4.951s-0.686-3.583-2.053-4.949c-0.391-0.39-1.024-0.39-1.414 0.001s-0.39 1.024 0.001 1.414zM8.467 15.532c-0.977-0.975-1.466-2.253-1.467-3.534s0.487-2.559 1.462-3.536c0.39-0.391 0.39-1.024-0.001-1.414s-1.024-0.39-1.414 0.001c-1.365 1.366-2.048 3.16-2.047 4.95s0.686 3.583 2.053 4.949c0.391 0.39 1.024 0.39 1.414-0.001s0.39-1.024-0.001-1.414zM18.363 5.637c1.757 1.758 2.635 4.059 2.635 6.364 0 2.304-0.878 4.605-2.635 6.362-0.39 0.391-0.39 1.024 0 1.414s1.024 0.39 1.414 0c2.147-2.147 3.22-4.963 3.221-7.776 0-2.815-1.074-5.631-3.221-7.778-0.39-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM5.637 18.363c-1.757-1.758-2.635-4.059-2.635-6.364 0-2.304 0.878-4.605 2.635-6.362 0.39-0.391 0.39-1.024 0-1.414s-1.024-0.39-1.414 0c-2.147 2.147-3.22 4.963-3.221 7.776s1.074 5.63 3.221 7.778c0.39 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-refresh-ccw\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21.433 8.666c-0.921-2.603-2.812-4.587-5.12-5.689s-5.040-1.323-7.643-0.402c-1.472 0.521-2.752 1.354-3.744 2.364l-2.926 2.75v-3.689c0-0.552-0.448-1-1-1s-1 0.448-1 1v5.998c0 0.015 0 0.030 0.001 0.044 0.005 0.115 0.029 0.225 0.069 0.326 0.040 0.102 0.098 0.198 0.173 0.285 0.012 0.013 0.024 0.027 0.036 0.039 0.091 0.095 0.201 0.172 0.324 0.225 0.119 0.051 0.249 0.080 0.386 0.082 0.004 0 0.007 0 0.011 0h6c0.552 0 1-0.448 1-1s-0.448-0.999-1-0.999h-3.476l2.83-2.659c0.777-0.792 1.797-1.46 2.983-1.88 2.083-0.737 4.265-0.561 6.114 0.322s3.359 2.468 4.096 4.551c0.184 0.521 0.756 0.793 1.276 0.609s0.793-0.756 0.609-1.276zM20.475 15l-2.8 2.631c-1.584 1.585-3.63 2.366-5.679 2.366s-4.095-0.78-5.657-2.342c-0.89-0.89-1.523-1.931-1.883-2.981-0.18-0.522-0.748-0.8-1.271-0.621s-0.8 0.748-0.621 1.271c0.46 1.339 1.257 2.642 2.361 3.745 1.953 1.952 4.514 2.928 7.072 2.927s5.118-0.978 7.048-2.909l2.955-2.775v3.688c0 0.552 0.448 1 1 1s1-0.448 1-1v-5.998c0-0.015 0-0.030-0.001-0.044-0.005-0.115-0.029-0.225-0.069-0.326-0.040-0.102-0.098-0.198-0.173-0.285-0.012-0.013-0.024-0.027-0.036-0.039-0.091-0.095-0.201-0.172-0.324-0.225-0.119-0.051-0.249-0.080-0.386-0.082-0.004 0-0.007 0-0.011 0h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-refresh-cw\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4.453 9.334c0.737-2.083 2.247-3.669 4.096-4.552s4.032-1.059 6.114-0.322c1.186 0.42 2.206 1.088 2.983 1.88l2.83 2.66h-3.476c-0.552 0-1 0.448-1 1s0.448 1 1 1h5.997c0.005 0 0.009 0 0.014 0 0.137-0.001 0.268-0.031 0.386-0.082 0.119-0.051 0.229-0.126 0.324-0.225 0.012-0.013 0.024-0.026 0.036-0.039 0.075-0.087 0.133-0.183 0.173-0.285s0.064-0.211 0.069-0.326c0.001-0.015 0.001-0.029 0.001-0.043v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v3.689l-2.926-2.749c-0.992-1.010-2.271-1.843-3.743-2.364-2.603-0.921-5.335-0.699-7.643 0.402s-4.199 3.086-5.12 5.689c-0.185 0.52 0.088 1.091 0.608 1.276s1.092-0.088 1.276-0.609zM2 16.312l2.955 2.777c1.929 1.931 4.49 2.908 7.048 2.909s5.119-0.975 7.072-2.927c1.104-1.104 1.901-2.407 2.361-3.745 0.18-0.522-0.098-1.091-0.621-1.271s-1.091 0.098-1.271 0.621c-0.361 1.050-0.993 2.091-1.883 2.981-1.563 1.562-3.609 2.342-5.657 2.342s-4.094-0.782-5.679-2.366l-2.8-2.633h3.475c0.552 0 1-0.448 1-1s-0.448-1-1-1h-5.997c-0.005 0-0.009 0-0.014 0-0.137 0.001-0.268 0.031-0.386 0.082-0.119 0.051-0.229 0.126-0.324 0.225-0.012 0.013-0.024 0.026-0.036 0.039-0.075 0.087-0.133 0.183-0.173 0.285s-0.064 0.211-0.069 0.326c-0.001 0.015-0.001 0.029-0.001 0.043v6c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-repeat\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 11v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h11.586l-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l4-4c0.096-0.096 0.168-0.206 0.217-0.324s0.076-0.247 0.076-0.383c0-0.13-0.025-0.261-0.076-0.383-0.049-0.118-0.121-0.228-0.217-0.324l-4-4c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293h-11.586c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM20 13v2c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879h-11.586l2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4 4c-0.092 0.092-0.166 0.202-0.217 0.324s-0.076 0.253-0.076 0.383c0 0.256 0.098 0.512 0.293 0.707l4 4c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293h11.586c1.38 0 2.632-0.561 3.536-1.464s1.464-2.156 1.464-3.536v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-rewind\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10 16.955l-6.371-4.955 6.371-4.955zM21.386 19.789c0.168 0.132 0.382 0.211 0.614 0.211 0.552 0 1-0.448 1-1v-14c0.001-0.213-0.068-0.43-0.211-0.614-0.339-0.436-0.967-0.514-1.403-0.175l-9 7c-0.061 0.046-0.122 0.106-0.175 0.175-0.14 0.18-0.209 0.392-0.211 0.604v-6.99c0.001-0.213-0.068-0.43-0.211-0.614-0.339-0.436-0.967-0.514-1.403-0.175l-9 7c-0.061 0.046-0.122 0.106-0.175 0.175-0.339 0.436-0.261 1.064 0.175 1.403l9 7c0.168 0.132 0.382 0.211 0.614 0.211 0.552 0 1-0.448 1-1v-6.991c0.003 0.295 0.135 0.585 0.386 0.78zM21 16.955l-6.371-4.955 6.371-4.955z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-rotate-ccw\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M2.567 15.332c0.918 2.604 2.805 4.591 5.112 5.696s5.038 1.33 7.643 0.413 4.591-2.805 5.696-5.112 1.33-5.038 0.413-7.643-2.805-4.591-5.112-5.696-5.038-1.33-7.643-0.413c-1.474 0.52-2.755 1.352-3.749 2.362l-2.927 2.75v-3.689c0-0.552-0.448-1-1-1s-1 0.448-1 1v5.998c0 0.015 0 0.030 0.001 0.044 0.005 0.115 0.029 0.225 0.069 0.326 0.040 0.102 0.098 0.198 0.173 0.285 0.012 0.013 0.024 0.027 0.036 0.039 0.091 0.095 0.201 0.172 0.324 0.225 0.119 0.051 0.249 0.080 0.386 0.082 0.004 0 0.007 0 0.011 0h6c0.552 0 1-0.448 1-1s-0.448-0.999-1-0.999h-3.476l2.829-2.659c0.779-0.792 1.8-1.459 2.987-1.877 2.084-0.734 4.266-0.555 6.114 0.33s3.356 2.473 4.090 4.557 0.555 4.266-0.33 6.114-2.473 3.356-4.557 4.090-4.266 0.555-6.114-0.33-3.356-2.473-4.090-4.557c-0.184-0.521-0.755-0.794-1.275-0.611s-0.794 0.755-0.611 1.275z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-rotate-cw\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19.547 14.667c-0.736 2.083-2.245 3.67-4.094 4.553s-4.031 1.061-6.114 0.325-3.67-2.245-4.553-4.094-1.061-4.031-0.325-6.114 2.245-3.67 4.094-4.553 4.031-1.061 6.114-0.325c1.188 0.42 2.209 1.088 2.987 1.882l2.824 2.659h-3.48c-0.552 0-1 0.448-1 1s0.448 1 1 1h5.997c0.004 0 0.009 0 0.013 0 0.137-0.001 0.267-0.030 0.386-0.082 0.119-0.051 0.229-0.126 0.324-0.225 0.012-0.012 0.023-0.025 0.034-0.038 0.076-0.087 0.134-0.184 0.175-0.287s0.065-0.213 0.069-0.328c0.002-0.014 0.002-0.028 0.002-0.042v-5.998c0-0.552-0.448-1-1-1s-1 0.448-1 1v3.685l-2.916-2.745c-0.993-1.012-2.274-1.846-3.748-2.366-2.604-0.921-5.336-0.698-7.644 0.405s-4.197 3.088-5.117 5.692-0.696 5.335 0.406 7.643 3.088 4.197 5.692 5.117 5.335 0.697 7.643-0.406 4.197-3.088 5.117-5.692c0.184-0.521-0.089-1.092-0.61-1.276s-1.092 0.089-1.276 0.61z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-rss\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 12c2.209 0 4.208 0.894 5.657 2.343s2.343 3.448 2.343 5.657c0 0.552 0.448 1 1 1s1-0.448 1-1c0-2.761-1.12-5.263-2.929-7.071s-4.31-2.929-7.071-2.929c-0.552 0-1 0.448-1 1s0.448 1 1 1zM4 5c4.142 0 7.891 1.678 10.607 4.393s4.393 6.465 4.393 10.607c0 0.552 0.448 1 1 1s1-0.448 1-1c0-4.694-1.904-8.946-4.979-12.021s-7.327-4.979-12.021-4.979c-0.552 0-1 0.448-1 1s0.448 1 1 1zM7 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-save\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19 22c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-11c0-0.256-0.098-0.512-0.293-0.707l-5-5c-0.181-0.181-0.431-0.293-0.707-0.293h-11c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879zM8 20v-6h8v6zM6 4v4c0 0.552 0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-7v-3h7.586l4.414 4.414v10.586c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1v-7c0-0.552-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v7h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-scissors\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.378 16.551c0.011 0.012 0.023 0.025 0.035 0.036s0.024 0.023 0.036 0.035c0.343 0.359 0.551 0.843 0.551 1.378 0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586c0.535 0 1.019 0.208 1.378 0.551zM13.764 15.188l5.53 5.52c0.391 0.39 1.024 0.39 1.414-0.001s0.39-1.024-0.001-1.414l-5.53-5.52c-0.391-0.39-1.024-0.39-1.414 0.001s-0.39 1.024 0.001 1.414zM7.449 7.378c-0.012 0.011-0.024 0.023-0.036 0.035s-0.024 0.024-0.035 0.036c-0.359 0.343-0.843 0.551-1.378 0.551-0.553 0-1.051-0.223-1.414-0.586s-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414c0 0.535-0.208 1.019-0.551 1.378zM8.032 9.446l2.554 2.554-2.554 2.554c-0.596-0.352-1.291-0.554-2.032-0.554-1.104 0-2.106 0.449-2.828 1.172s-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828c0-0.741-0.202-1.436-0.554-2.032l11.261-11.261c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-7.293 7.293-2.554-2.554c0.352-0.596 0.554-1.291 0.554-2.032 0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172c0.741 0 1.436-0.202 2.032-0.554z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-search\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-send\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22.963 2.269c0.043-0.151 0.050-0.314 0.015-0.476-0.024-0.113-0.068-0.224-0.131-0.325-0.064-0.102-0.145-0.19-0.238-0.262-0.117-0.090-0.249-0.15-0.386-0.181s-0.282-0.034-0.426-0.004c-0.042 0.009-0.085 0.021-0.126 0.035l-0.021 0.007-19.98 6.993c-0.252 0.088-0.467 0.276-0.584 0.538-0.224 0.505 0.003 1.096 0.508 1.32l8.649 3.844 3.844 8.649c0.108 0.243 0.313 0.443 0.583 0.538 0.521 0.182 1.092-0.092 1.274-0.614l6.993-19.979c0.010-0.027 0.019-0.054 0.027-0.082zM10.779 11.807l-6.068-2.696 13.483-4.72zM19.609 5.806l-4.72 13.483-2.696-6.068z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-server\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4 1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v4c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-4c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM4 3h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v4c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-4c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM4 13c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v4c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-4c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM4 15h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v4c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-4c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM6 7c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM6 19c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-settings\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16 12c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM14 12c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414zM20.315 15.404c0.046-0.105 0.112-0.191 0.192-0.257 0.112-0.092 0.251-0.146 0.403-0.147h0.090c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121-0.337-1.58-0.879-2.121-1.293-0.879-2.121-0.879h-0.159c-0.11-0.001-0.215-0.028-0.308-0.076-0.127-0.066-0.23-0.172-0.292-0.312-0.003-0.029-0.004-0.059-0.004-0.089-0.024-0.055-0.040-0.111-0.049-0.168 0.020-0.334 0.077-0.454 0.168-0.547l0.062-0.062c0.585-0.586 0.878-1.356 0.877-2.122s-0.294-1.536-0.881-2.122c-0.586-0.585-1.356-0.878-2.122-0.877s-1.536 0.294-2.12 0.879l-0.046 0.046c-0.083 0.080-0.183 0.136-0.288 0.166-0.14 0.039-0.291 0.032-0.438-0.033-0.101-0.044-0.187-0.11-0.253-0.19-0.092-0.112-0.146-0.251-0.147-0.403v-0.090c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121v0.159c-0.001 0.11-0.028 0.215-0.076 0.308-0.066 0.127-0.172 0.23-0.312 0.292-0.029 0.003-0.059 0.004-0.089 0.004-0.055 0.024-0.111 0.040-0.168 0.049-0.335-0.021-0.455-0.078-0.548-0.169l-0.062-0.062c-0.586-0.585-1.355-0.878-2.122-0.878s-1.535 0.294-2.122 0.882c-0.585 0.586-0.878 1.355-0.878 2.122s0.294 1.536 0.879 2.12l0.048 0.047c0.080 0.083 0.136 0.183 0.166 0.288 0.039 0.14 0.032 0.291-0.031 0.434-0.006 0.016-0.013 0.034-0.021 0.052-0.041 0.109-0.108 0.203-0.191 0.275-0.11 0.095-0.25 0.153-0.383 0.156h-0.090c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.294-0.879 2.122 0.337 1.58 0.879 2.121 1.293 0.879 2.121 0.879h0.159c0.11 0.001 0.215 0.028 0.308 0.076 0.128 0.067 0.233 0.174 0.296 0.321 0.024 0.055 0.040 0.111 0.049 0.168-0.020 0.334-0.077 0.454-0.168 0.547l-0.062 0.062c-0.585 0.586-0.878 1.356-0.877 2.122s0.294 1.536 0.881 2.122c0.586 0.585 1.356 0.878 2.122 0.877s1.536-0.294 2.12-0.879l0.047-0.048c0.083-0.080 0.183-0.136 0.288-0.166 0.14-0.039 0.291-0.032 0.434 0.031 0.016 0.006 0.034 0.013 0.052 0.021 0.109 0.041 0.203 0.108 0.275 0.191 0.095 0.11 0.153 0.25 0.156 0.383v0.092c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121v-0.159c0.001-0.11 0.028-0.215 0.076-0.308 0.067-0.128 0.174-0.233 0.321-0.296 0.055-0.024 0.111-0.040 0.168-0.049 0.334 0.020 0.454 0.077 0.547 0.168l0.062 0.062c0.586 0.585 1.356 0.878 2.122 0.877s1.536-0.294 2.122-0.881c0.585-0.586 0.878-1.356 0.877-2.122s-0.294-1.536-0.879-2.12l-0.048-0.047c-0.080-0.083-0.136-0.183-0.166-0.288-0.039-0.14-0.032-0.291 0.031-0.434zM18.396 9.302c-0.012-0.201-0.038-0.297-0.076-0.382v0.080c0 0.043 0.003 0.084 0.008 0.125 0.021 0.060 0.043 0.119 0.068 0.177 0.004 0.090 0.005 0.091 0.005 0.092 0.249 0.581 0.684 1.030 1.208 1.303 0.371 0.193 0.785 0.298 1.211 0.303h0.18c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707-0.111 0.525-0.293 0.707-0.431 0.293-0.707 0.293h-0.090c-0.637 0.003-1.22 0.228-1.675 0.603-0.323 0.266-0.581 0.607-0.75 0.993-0.257 0.582-0.288 1.21-0.127 1.782 0.119 0.423 0.341 0.814 0.652 1.136l0.072 0.073c0.196 0.196 0.294 0.45 0.294 0.707s-0.097 0.512-0.292 0.707c-0.197 0.197-0.451 0.295-0.709 0.295s-0.512-0.097-0.707-0.292l-0.061-0.061c-0.463-0.453-1.040-0.702-1.632-0.752-0.437-0.037-0.882 0.034-1.293 0.212-0.578 0.248-1.027 0.683-1.3 1.206-0.193 0.371-0.298 0.785-0.303 1.211v0.181c0 0.276-0.111 0.525-0.293 0.707s-0.43 0.292-0.706 0.292-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707v-0.090c-0.015-0.66-0.255-1.242-0.644-1.692-0.284-0.328-0.646-0.585-1.058-0.744-0.575-0.247-1.193-0.274-1.756-0.116-0.423 0.119-0.814 0.341-1.136 0.652l-0.073 0.072c-0.196 0.196-0.45 0.294-0.707 0.294s-0.512-0.097-0.707-0.292c-0.197-0.197-0.295-0.451-0.295-0.709s0.097-0.512 0.292-0.707l0.061-0.061c0.453-0.463 0.702-1.040 0.752-1.632 0.037-0.437-0.034-0.882-0.212-1.293-0.248-0.578-0.683-1.027-1.206-1.3-0.371-0.193-0.785-0.298-1.211-0.303l-0.18 0.001c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707 0.111-0.525 0.293-0.707 0.431-0.293 0.707-0.293h0.090c0.66-0.015 1.242-0.255 1.692-0.644 0.328-0.284 0.585-0.646 0.744-1.058 0.247-0.575 0.274-1.193 0.116-1.756-0.119-0.423-0.341-0.814-0.652-1.136l-0.073-0.073c-0.196-0.196-0.294-0.45-0.294-0.707s0.097-0.512 0.292-0.707c0.197-0.197 0.451-0.295 0.709-0.295s0.512 0.097 0.707 0.292l0.061 0.061c0.463 0.453 1.040 0.702 1.632 0.752 0.37 0.032 0.745-0.014 1.101-0.137 0.096-0.012 0.186-0.036 0.266-0.072-0.031 0.001-0.061 0.003-0.089 0.004-0.201 0.012-0.297 0.038-0.382 0.076h0.080c0.043 0 0.084-0.003 0.125-0.008 0.060-0.021 0.119-0.043 0.177-0.068 0.090-0.004 0.091-0.005 0.092-0.005 0.581-0.249 1.030-0.684 1.303-1.208 0.193-0.37 0.298-0.785 0.303-1.21v-0.181c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707v0.090c0.003 0.637 0.228 1.22 0.603 1.675 0.266 0.323 0.607 0.581 0.996 0.751 0.578 0.255 1.206 0.286 1.778 0.125 0.423-0.119 0.814-0.341 1.136-0.652l0.073-0.072c0.196-0.196 0.45-0.294 0.707-0.294s0.512 0.097 0.707 0.292c0.197 0.197 0.295 0.451 0.295 0.709s-0.097 0.512-0.292 0.707l-0.061 0.061c-0.453 0.463-0.702 1.040-0.752 1.632-0.032 0.37 0.014 0.745 0.137 1.101 0.012 0.095 0.037 0.185 0.072 0.266-0.001-0.032-0.002-0.062-0.004-0.089z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-share\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M3 12v8c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-8c0-0.552-0.448-1-1-1s-1 0.448-1 1v8c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-8c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 4.414v10.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-10.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.092-0.092-0.202-0.166-0.324-0.217-0.245-0.101-0.521-0.101-0.766 0-0.118 0.049-0.228 0.121-0.324 0.217l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-share-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.214 18.098c0.025-0.033 0.048-0.067 0.070-0.104 0.020-0.035 0.038-0.071 0.054-0.107 0.073-0.108 0.156-0.209 0.248-0.301 0.363-0.363 0.861-0.586 1.414-0.586s1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414-0.223 1.051-0.586 1.414-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414c0-0.325 0.077-0.631 0.214-0.902zM16.301 6.056c-0.009-0.017-0.018-0.034-0.028-0.051s-0.020-0.034-0.031-0.050c-0.154-0.283-0.242-0.608-0.242-0.955 0-0.553 0.223-1.051 0.586-1.414s0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414-0.223 1.051-0.586 1.414-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586c-0.108-0.108-0.204-0.228-0.285-0.358zM7.699 10.944c0.009 0.017 0.018 0.034 0.028 0.051s0.020 0.034 0.031 0.050c0.154 0.283 0.242 0.608 0.242 0.955s-0.088 0.672-0.243 0.956c-0.011 0.016-0.021 0.033-0.031 0.050s-0.019 0.033-0.027 0.050c-0.081 0.13-0.177 0.25-0.285 0.358-0.363 0.363-0.861 0.586-1.414 0.586s-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586c0.108 0.108 0.204 0.228 0.285 0.358zM14.15 6.088l-5.308 3.097c-0.004-0.005-0.009-0.009-0.014-0.014-0.722-0.722-1.724-1.171-2.828-1.171s-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172c0.005-0.005 0.009-0.009 0.014-0.014l5.309 3.094c-0.098 0.347-0.151 0.714-0.151 1.092 0 1.104 0.449 2.106 1.172 2.828s1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172c-0.003 0.003-0.007 0.007-0.010 0.010l-5.312-3.095c0.098-0.346 0.15-0.71 0.15-1.087s-0.052-0.742-0.15-1.088l5.308-3.098c0.004 0.005 0.009 0.009 0.014 0.014 0.722 0.723 1.724 1.172 2.828 1.172s2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828-0.449-2.106-1.172-2.828-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828c0 0.377 0.052 0.742 0.15 1.088z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-shield\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 20.862c-1.184-0.672-4.42-2.695-6.050-5.549-0.079-0.138-0.153-0.276-0.223-0.417-0.456-0.911-0.727-1.878-0.727-2.896v-6.307l7-2.625 7 2.625v6.307c0 1.018-0.271 1.985-0.726 2.897-0.070 0.14-0.145 0.279-0.223 0.417-1.631 2.854-4.867 4.876-6.050 5.549zM12.447 22.894c0 0 4.989-2.475 7.34-6.589 0.096-0.168 0.188-0.34 0.276-0.515 0.568-1.135 0.937-2.408 0.937-3.79v-7c0-0.426-0.267-0.79-0.649-0.936l-8-3c-0.236-0.089-0.485-0.082-0.702 0l-8 3c-0.399 0.149-0.646 0.527-0.649 0.936v7c0 1.382 0.369 2.655 0.938 3.791 0.087 0.175 0.179 0.346 0.276 0.515 2.351 4.114 7.34 6.589 7.34 6.589 0.292 0.146 0.62 0.136 0.894 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-shield-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.645 14.296c0.241-0.776 0.358-1.567 0.355-2.3v-6.996c0-0.426-0.267-0.79-0.649-0.936l-8-3c-0.236-0.088-0.484-0.082-0.701 0l-3.16 1.18c-0.517 0.192-0.78 0.768-0.587 1.286s0.769 0.78 1.287 0.587l2.809-1.049 7.001 2.625v6.311c0.002 0.522-0.082 1.111-0.265 1.7-0.164 0.527 0.131 1.088 0.659 1.251s1.088-0.131 1.251-0.659zM5 6.414l11.231 11.231c-1.189 1.207-2.63 2.314-4.262 3.199-1.209-0.69-4.402-2.702-6.019-5.531-0.079-0.138-0.153-0.276-0.223-0.417-0.456-0.911-0.727-1.878-0.727-2.896zM0.293 1.707l2.824 2.825c-0.075 0.142-0.116 0.302-0.117 0.468v7c0 1.382 0.369 2.655 0.938 3.791 0.087 0.175 0.179 0.346 0.276 0.515 2.351 4.114 7.34 6.589 7.34 6.589 0.298 0.149 0.636 0.135 0.914-0.010 1.985-1.047 3.74-2.366 5.178-3.825l4.648 4.648c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-22.001-22.001c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-shopping-bag\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-shopping-cart\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 21c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM22 21c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM7.221 7h14.57l-1.371 7.191c-0.046 0.228-0.166 0.425-0.332 0.568-0.18 0.156-0.413 0.246-0.688 0.241h-9.734c-0.232 0.003-0.451-0.071-0.626-0.203-0.19-0.143-0.329-0.351-0.379-0.603zM1 2h3.18l0.848 4.239c0.108 0.437 0.502 0.761 0.972 0.761h1.221l-0.4-2h-0.821c-0.552 0-1 0.448-1 1 0 0.053 0.004 0.105 0.012 0.155 0.004 0.028 0.010 0.057 0.017 0.084l1.671 8.347c0.149 0.751 0.57 1.383 1.14 1.811 0.521 0.392 1.17 0.613 1.854 0.603h9.706c0.748 0.015 1.455-0.261 1.995-0.727 0.494-0.426 0.848-1.013 0.985-1.683l1.602-8.402c0.103-0.543-0.252-1.066-0.795-1.17-0.065-0.013-0.13-0.019-0.187-0.018h-16.18l-0.84-4.196c-0.094-0.462-0.497-0.804-0.98-0.804h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-shuffle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4.707 20.707l15.293-15.293v2.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-5c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-5c-0.552 0-1 0.448-1 1s0.448 1 1 1h2.586l-15.293 15.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM14.293 15.707l4.293 4.293h-2.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h5c0.13 0 0.261-0.025 0.383-0.076s0.232-0.125 0.324-0.217c0.096-0.096 0.168-0.206 0.217-0.324s0.076-0.247 0.076-0.383v-5c0-0.552-0.448-1-1-1s-1 0.448-1 1v2.586l-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM3.293 4.707l5 5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-sidebar\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM10 20v-16h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM8 4v16h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-skip-back\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18.375 20.781c0.17 0.136 0.388 0.219 0.625 0.219 0.552 0 1-0.448 1-1v-16c0.001-0.218-0.071-0.439-0.219-0.625-0.345-0.431-0.974-0.501-1.406-0.156l-10 8c-0.053 0.042-0.108 0.095-0.156 0.156-0.345 0.431-0.275 1.061 0.156 1.406zM18 17.919l-7.399-5.919 7.399-5.919zM6 19v-14c0-0.552-0.448-1-1-1s-1 0.448-1 1v14c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-skip-forward\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.625 3.219c-0.17-0.136-0.388-0.219-0.625-0.219-0.552 0-1 0.448-1 1v16c-0.001 0.218 0.071 0.439 0.219 0.625 0.345 0.431 0.974 0.501 1.406 0.156l10-8c0.053-0.042 0.108-0.095 0.156-0.156 0.345-0.431 0.275-1.061-0.156-1.406zM6 6.081l7.399 5.919-7.399 5.919zM18 5v14c0 0.552 0.448 1 1 1s1-0.448 1-1v-14c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-slack\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.5 11c0.69 0 1.316-0.28 1.768-0.732s0.732-1.078 0.732-1.768v-5c0-0.69-0.28-1.316-0.732-1.768s-1.078-0.732-1.768-0.732-1.316 0.28-1.768 0.732-0.732 1.078-0.732 1.768v5c0 0.69 0.28 1.316 0.732 1.768s1.078 0.732 1.768 0.732zM14.5 9c-0.14 0-0.264-0.055-0.354-0.146s-0.146-0.214-0.146-0.354v-5c0-0.14 0.055-0.264 0.146-0.354s0.214-0.146 0.354-0.146 0.264 0.055 0.354 0.146 0.146 0.214 0.146 0.354v5c0 0.14-0.055 0.264-0.146 0.354s-0.214 0.146-0.354 0.146zM20.5 11c0.69 0 1.316-0.28 1.768-0.732s0.732-1.078 0.732-1.768-0.28-1.316-0.732-1.768-1.078-0.732-1.768-0.732-1.316 0.28-1.768 0.732-0.732 1.078-0.732 1.768v1.5c0 0.552 0.448 1 1 1zM20.5 9h-0.5v-0.5c0-0.14 0.055-0.264 0.146-0.354s0.214-0.146 0.354-0.146 0.264 0.055 0.354 0.146 0.146 0.214 0.146 0.354-0.055 0.264-0.146 0.354-0.214 0.146-0.354 0.146zM9.5 13c-0.69 0-1.316 0.28-1.768 0.732s-0.732 1.078-0.732 1.768v5c0 0.69 0.28 1.316 0.732 1.768s1.078 0.732 1.768 0.732 1.316-0.28 1.768-0.732 0.732-1.078 0.732-1.768v-5c0-0.69-0.28-1.316-0.732-1.768s-1.078-0.732-1.768-0.732zM9.5 15c0.14 0 0.264 0.055 0.354 0.146s0.146 0.214 0.146 0.354v5c0 0.14-0.055 0.264-0.146 0.354s-0.214 0.146-0.354 0.146-0.264-0.055-0.354-0.146-0.146-0.214-0.146-0.354v-5c0-0.14 0.055-0.264 0.146-0.354s0.214-0.146 0.354-0.146zM3.5 13c-0.69 0-1.316 0.28-1.768 0.732s-0.732 1.078-0.732 1.768 0.28 1.316 0.732 1.768 1.078 0.732 1.768 0.732 1.316-0.28 1.768-0.732 0.732-1.078 0.732-1.768v-1.5c0-0.552-0.448-1-1-1zM3.5 15h0.5v0.5c0 0.14-0.055 0.264-0.146 0.354s-0.214 0.146-0.354 0.146-0.264-0.055-0.354-0.146-0.146-0.214-0.146-0.354 0.055-0.264 0.146-0.354 0.214-0.146 0.354-0.146zM13 14.5c0 0.69 0.28 1.316 0.732 1.768s1.078 0.732 1.768 0.732h5c0.69 0 1.316-0.28 1.768-0.732s0.732-1.078 0.732-1.768-0.28-1.316-0.732-1.768-1.078-0.732-1.768-0.732h-5c-0.69 0-1.316 0.28-1.768 0.732s-0.732 1.078-0.732 1.768zM15 14.5c0-0.14 0.055-0.264 0.146-0.354s0.214-0.146 0.354-0.146h5c0.14 0 0.264 0.055 0.354 0.146s0.146 0.214 0.146 0.354-0.055 0.264-0.146 0.354-0.214 0.146-0.354 0.146h-5c-0.14 0-0.264-0.055-0.354-0.146s-0.146-0.214-0.146-0.354zM15.5 20c0.14 0 0.264 0.055 0.354 0.146s0.146 0.214 0.146 0.354-0.055 0.264-0.146 0.354-0.214 0.146-0.354 0.146-0.264-0.055-0.354-0.146-0.146-0.214-0.146-0.354v-0.5zM15.5 18h-1.5c-0.552 0-1 0.448-1 1v1.5c0 0.69 0.28 1.316 0.732 1.768s1.078 0.732 1.768 0.732 1.316-0.28 1.768-0.732 0.732-1.078 0.732-1.768-0.28-1.316-0.732-1.768-1.078-0.732-1.768-0.732zM9 9.5c0 0.14-0.055 0.264-0.146 0.354s-0.214 0.146-0.354 0.146h-5c-0.14 0-0.264-0.055-0.354-0.146s-0.146-0.214-0.146-0.354 0.055-0.264 0.146-0.354 0.214-0.146 0.354-0.146h5c0.14 0 0.264 0.055 0.354 0.146s0.146 0.214 0.146 0.354zM11 9.5c0-0.69-0.28-1.316-0.732-1.768s-1.078-0.732-1.768-0.732h-5c-0.69 0-1.316 0.28-1.768 0.732s-0.732 1.078-0.732 1.768 0.28 1.316 0.732 1.768 1.078 0.732 1.768 0.732h5c0.69 0 1.316-0.28 1.768-0.732s0.732-1.078 0.732-1.768zM8.5 4c-0.14 0-0.264-0.055-0.354-0.146s-0.146-0.214-0.146-0.354 0.055-0.264 0.146-0.354 0.214-0.146 0.354-0.146 0.264 0.055 0.354 0.146 0.146 0.214 0.146 0.354v0.5zM8.5 6h1.5c0.552 0 1-0.448 1-1v-1.5c0-0.69-0.28-1.316-0.732-1.768s-1.078-0.732-1.768-0.732-1.316 0.28-1.768 0.732-0.732 1.078-0.732 1.768 0.28 1.316 0.732 1.768 1.078 0.732 1.768 0.732z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-slash\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM19.032 17.618l-12.65-12.65c1.54-1.232 3.493-1.968 5.618-1.968 2.486 0 4.734 1.006 6.364 2.636s2.636 3.878 2.636 6.364c0 2.125-0.736 4.078-1.968 5.618zM4.968 6.382l12.65 12.65c-1.54 1.232-3.493 1.968-5.618 1.968-2.486 0-4.734-1.006-6.364-2.636s-2.636-3.878-2.636-6.364c0-2.125 0.736-4.078 1.968-5.618z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-sliders\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 10v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1v7c0 0.552 0.448 1 1 1s1-0.448 1-1zM13 21v-9c0-0.552-0.448-1-1-1s-1 0.448-1 1v9c0 0.552 0.448 1 1 1s1-0.448 1-1zM21 12v-9c0-0.552-0.448-1-1-1s-1 0.448-1 1v9c0 0.552 0.448 1 1 1s1-0.448 1-1zM1 15h2v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 9h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM17 17h2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-smartphone\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7 1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-16c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM7 3h10c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v16c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM12 19c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-smile\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM7.2 14.6c0 0 0.131 0.173 0.331 0.383 0.145 0.153 0.338 0.341 0.577 0.54 0.337 0.281 0.772 0.59 1.297 0.853 0.705 0.352 1.579 0.624 2.595 0.624s1.89-0.272 2.595-0.624c0.525-0.263 0.96-0.572 1.297-0.853 0.239-0.199 0.432-0.387 0.577-0.54 0.2-0.21 0.331-0.383 0.331-0.383 0.331-0.442 0.242-1.069-0.2-1.4s-1.069-0.242-1.4 0.2c-0.041 0.050-0.181 0.206-0.181 0.206-0.1 0.105-0.237 0.239-0.408 0.382-0.243 0.203-0.549 0.419-0.91 0.6-0.48 0.239-1.050 0.412-1.701 0.412s-1.221-0.173-1.701-0.413c-0.36-0.18-0.667-0.397-0.91-0.6-0.171-0.143-0.308-0.277-0.408-0.382-0.14-0.155-0.181-0.205-0.181-0.205-0.331-0.442-0.958-0.531-1.4-0.2s-0.531 0.958-0.2 1.4zM9 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1zM15 10c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-speaker\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6 1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-16c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM6 3h12c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v16c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM17 14c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM15 14c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM12 7c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-star\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12.897 1.557c-0.092-0.189-0.248-0.352-0.454-0.454-0.495-0.244-1.095-0.041-1.339 0.454l-2.858 5.789-6.391 0.935c-0.208 0.029-0.411 0.127-0.571 0.291-0.386 0.396-0.377 1.029 0.018 1.414l4.623 4.503-1.091 6.362c-0.036 0.207-0.006 0.431 0.101 0.634 0.257 0.489 0.862 0.677 1.351 0.42l5.714-3.005 5.715 3.005c0.186 0.099 0.408 0.139 0.634 0.101 0.544-0.093 0.91-0.61 0.817-1.155l-1.091-6.362 4.623-4.503c0.151-0.146 0.259-0.344 0.292-0.572 0.080-0.546-0.298-1.054-0.845-1.134l-6.39-0.934zM12 4.259l2.193 4.444c0.151 0.305 0.436 0.499 0.752 0.547l4.906 0.717-3.549 3.457c-0.244 0.238-0.341 0.569-0.288 0.885l0.837 4.883-4.386-2.307c-0.301-0.158-0.647-0.148-0.931 0l-4.386 2.307 0.837-4.883c0.058-0.336-0.059-0.661-0.288-0.885l-3.549-3.457 4.907-0.718c0.336-0.049 0.609-0.26 0.752-0.546z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-stop-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM9 8c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1zM10 10h4v4h-4z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-sun\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 12c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757 3.158-0.673 4.243-1.757 1.757-2.586 1.757-4.243zM16 12c0 1.105-0.447 2.103-1.172 2.828s-1.723 1.172-2.828 1.172-2.103-0.447-2.828-1.172-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828zM11 1v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 21v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM3.513 4.927l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM17.653 19.067l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM1 13h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM21 13h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM4.927 20.487l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM19.067 6.347l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-sunrise\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 18c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243c0 0.552 0.448 1 1 1s1-0.448 1-1c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828c0 0.552 0.448 1 1 1s1-0.448 1-1zM3.513 10.927l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM1 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM21 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM19.067 12.347l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM23 21h-22c-0.552 0-1 0.448-1 1s0.448 1 1 1h22c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8.707 6.707l2.293-2.293v4.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-4.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.092-0.092-0.202-0.166-0.324-0.217-0.245-0.101-0.521-0.101-0.766 0-0.118 0.049-0.228 0.121-0.324 0.217l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-sunset\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 18c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243c0 0.552 0.448 1 1 1s1-0.448 1-1c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828c0 0.552 0.448 1 1 1s1-0.448 1-1zM3.513 10.927l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM1 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM21 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM19.067 12.347l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM23 21h-22c-0.552 0-1 0.448-1 1s0.448 1 1 1h22c0.552 0 1-0.448 1-1s-0.448-1-1-1zM15.293 4.293l-2.293 2.293v-4.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v4.586l-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4 4c0.096 0.096 0.206 0.168 0.324 0.217s0.247 0.076 0.383 0.076 0.265-0.027 0.383-0.076c0.118-0.049 0.228-0.121 0.324-0.217l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-tablet\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M6 1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v16c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h12c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-16c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM6 3h12c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v16c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-16c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM12 19c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-tag\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21.297 14.117c0.583-0.586 0.874-1.352 0.874-2.115 0.001-0.764-0.29-1.532-0.874-2.12l-8.59-8.59c-0.181-0.18-0.431-0.292-0.707-0.292h-10c-0.552 0-1 0.448-1 1v10c0 0.256 0.098 0.512 0.293 0.708l8.592 8.582c0.586 0.585 1.356 0.878 2.122 0.877s1.536-0.294 2.12-0.879zM19.883 12.703l-7.17 7.17c-0.196 0.196-0.45 0.294-0.707 0.294s-0.512-0.097-0.707-0.292l-8.299-8.29v-8.585h8.586l8.297 8.297c0.192 0.193 0.289 0.447 0.289 0.704s-0.097 0.509-0.289 0.702zM7 8c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-target\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM19 12c0-1.933-0.785-3.684-2.050-4.95s-3.017-2.050-4.95-2.050-3.684 0.785-4.95 2.050-2.050 3.017-2.050 4.95 0.785 3.684 2.050 4.95 3.017 2.050 4.95 2.050 3.684-0.785 4.95-2.050 2.050-3.017 2.050-4.95zM17 12c0 1.381-0.559 2.63-1.464 3.536s-2.155 1.464-3.536 1.464-2.63-0.559-3.536-1.464-1.464-2.155-1.464-3.536 0.559-2.63 1.464-3.536 2.155-1.464 3.536-1.464 2.63 0.559 3.536 1.464 1.464 2.155 1.464 3.536zM15 12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121 0.337 1.58 0.879 2.121 1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121zM13 12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707 0.111-0.525 0.293-0.707 0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-terminal\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M4.707 17.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM12 20h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-thermometer\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13 14.76c0.002 0.329 0.161 0.646 0.453 0.837 0.349 0.228 0.686 0.554 0.958 0.96 0.537 0.804 0.698 1.747 0.523 2.627s-0.684 1.69-1.488 2.227-1.747 0.698-2.627 0.523-1.69-0.684-2.227-1.488-0.698-1.747-0.523-2.627 0.684-1.69 1.488-2.227c0.268-0.182 0.443-0.487 0.443-0.832v-11.26c0-0.414 0.167-0.788 0.439-1.061s0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061zM15 14.256v-10.756c0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025-1.843 0.393-2.475 1.025-1.025 1.509-1.025 2.475v10.759c-1.007 0.829-1.654 1.96-1.894 3.17-0.274 1.379-0.022 2.866 0.821 4.129s2.121 2.064 3.5 2.339 2.866 0.022 4.129-0.821 2.064-2.121 2.339-3.5 0.022-2.866-0.821-4.129c-0.307-0.459-0.673-0.86-1.073-1.19z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-thumbs-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 15c0-0.552-0.448-1-1-1h-5.679c-0.065-0.002-0.153-0.011-0.153-0.011-0.273-0.041-0.502-0.188-0.655-0.396s-0.225-0.47-0.184-0.742l1.38-8.998c0.037-0.239 0.156-0.448 0.325-0.6 0.179-0.161 0.415-0.256 0.686-0.253h10.28v9.788l-3.608 8.118c-0.307-0.098-0.582-0.268-0.806-0.492-0.363-0.363-0.586-0.861-0.586-1.414zM9 16v3c0 1.104 0.449 2.106 1.172 2.828s1.724 1.172 2.828 1.172c0.405 0 0.754-0.241 0.914-0.594l4-9c0.060-0.134 0.087-0.275 0.086-0.406v-11c0-0.552-0.448-1-1-1h-11.28c-0.767-0.009-1.482 0.281-2.021 0.763-0.505 0.452-0.857 1.076-0.967 1.783l-1.38 9.002c-0.125 0.82 0.096 1.614 0.55 2.231s1.147 1.063 1.965 1.187c0.165 0.025 0.333 0.037 0.492 0.034zM17 3h2.67c0.361-0.006 0.674 0.119 0.912 0.332 0.213 0.191 0.364 0.45 0.418 0.746v6.787c-0.037 0.34-0.208 0.63-0.455 0.833-0.235 0.194-0.537 0.306-0.861 0.301l-2.684 0.001c-0.552 0-1 0.448-1 1s0.448 1 1 1h2.656c0.81 0.012 1.569-0.27 2.16-0.756 0.622-0.511 1.059-1.251 1.176-2.11 0.005-0.040 0.008-0.087 0.008-0.134v-7c0-0.042-0.003-0.089-0.009-0.137-0.111-0.803-0.505-1.51-1.075-2.020-0.6-0.537-1.397-0.858-2.246-0.842h-2.67c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-thumbs-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13 9c0 0.552 0.448 1 1 1h5.679c0.065 0.002 0.153 0.011 0.153 0.011 0.273 0.041 0.502 0.188 0.655 0.396s0.225 0.47 0.184 0.742l-1.38 8.998c-0.037 0.239-0.156 0.448-0.325 0.6-0.18 0.161-0.415 0.256-0.686 0.253h-10.28v-9.788l3.608-8.118c0.307 0.098 0.582 0.268 0.806 0.492 0.363 0.363 0.586 0.861 0.586 1.414zM15 8v-3c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172c-0.405 0-0.754 0.241-0.914 0.594l-4 9c-0.060 0.134-0.087 0.275-0.086 0.406v11c0 0.552 0.448 1 1 1h11.28c0.767 0.009 1.482-0.281 2.021-0.763 0.505-0.452 0.857-1.076 0.967-1.783l1.38-9.002c0.125-0.82-0.096-1.614-0.55-2.231s-1.147-1.063-1.965-1.187c-0.165-0.025-0.333-0.037-0.492-0.034zM7 21h-3c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h3c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-toggle-left\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 4c-2.209 0-4.21 0.897-5.657 2.343s-2.343 3.448-2.343 5.657 0.897 4.21 2.343 5.657 3.448 2.343 5.657 2.343h8c2.209 0 4.21-0.897 5.657-2.343s2.343-3.448 2.343-5.657-0.897-4.21-2.343-5.657-3.448-2.343-5.657-2.343zM8 6h8c1.657 0 3.156 0.67 4.243 1.757s1.757 2.586 1.757 4.243-0.67 3.156-1.757 4.243-2.586 1.757-4.243 1.757h-8c-1.657 0-3.156-0.67-4.243-1.757s-1.757-2.586-1.757-4.243 0.67-3.156 1.757-4.243 2.586-1.757 4.243-1.757zM12 12c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM10 12c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-toggle-right\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M8 4c-2.209 0-4.21 0.897-5.657 2.343s-2.343 3.448-2.343 5.657 0.897 4.21 2.343 5.657 3.448 2.343 5.657 2.343h8c2.209 0 4.21-0.897 5.657-2.343s2.343-3.448 2.343-5.657-0.897-4.21-2.343-5.657-3.448-2.343-5.657-2.343zM8 6h8c1.657 0 3.156 0.67 4.243 1.757s1.757 2.586 1.757 4.243-0.67 3.156-1.757 4.243-2.586 1.757-4.243 1.757h-8c-1.657 0-3.156-0.67-4.243-1.757s-1.757-2.586-1.757-4.243 0.67-3.156 1.757-4.243 2.586-1.757 4.243-1.757zM20 12c0-1.104-0.449-2.106-1.172-2.828s-1.724-1.172-2.828-1.172-2.106 0.449-2.828 1.172-1.172 1.724-1.172 2.828 0.449 2.106 1.172 2.828 1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828zM18 12c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414 0.223-1.051 0.586-1.414 0.861-0.586 1.414-0.586 1.051 0.223 1.414 0.586 0.586 0.861 0.586 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-tool\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15.407 6.993l3.77-3.756c0.081-0.079 0.152-0.18 0.205-0.296 0.227-0.504 0.002-1.096-0.501-1.322-0.263-0.118-0.532-0.22-0.807-0.306-1.582-0.492-3.34-0.428-4.963 0.307-1.761 0.797-3.033 2.234-3.664 3.909-0.554 1.467-0.617 3.124-0.087 4.697l-6.447 6.447c-0.609 0.609-0.914 1.41-0.914 2.207s0.305 1.598 0.914 2.207 1.41 0.914 2.207 0.914 1.598-0.305 2.207-0.914l6.448-6.448c0.050 0.017 0.1 0.033 0.151 0.049 1.582 0.492 3.34 0.428 4.963-0.307 1.761-0.797 3.033-2.234 3.664-3.909s0.624-3.594-0.173-5.355c-0.045-0.103-0.114-0.205-0.204-0.295-0.391-0.391-1.024-0.391-1.414 0l-3.756 3.77zM13.986 5.6c-0.383 0.39-0.573 0.9-0.572 1.406 0.002 0.502 0.192 1.007 0.571 1.394l1.607 1.608c0.398 0.39 0.907 0.58 1.413 0.579 0.502-0.002 1.007-0.192 1.394-0.571l2.574-2.574c0.090 0.796-0.015 1.593-0.291 2.326-0.452 1.199-1.359 2.222-2.617 2.792-1.16 0.525-2.412 0.571-3.545 0.219-0.197-0.061-0.391-0.135-0.579-0.22-0.387-0.174-0.827-0.082-1.118 0.205l-6.91 6.91c-0.219 0.219-0.504 0.328-0.793 0.328s-0.574-0.109-0.793-0.328-0.328-0.504-0.328-0.793 0.109-0.574 0.328-0.793l6.91-6.91c0.301-0.301 0.37-0.746 0.204-1.119-0.569-1.258-0.575-2.626-0.123-3.825s1.359-2.222 2.617-2.792c0.852-0.386 1.755-0.513 2.623-0.413z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-trash\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-trash-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-trello\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM7 6c-0.552 0-1 0.448-1 1v9c0 0.552 0.448 1 1 1h3c0.552 0 1-0.448 1-1v-9c0-0.552-0.448-1-1-1zM8 8h1v7h-1zM14 6c-0.552 0-1 0.448-1 1v5c0 0.552 0.448 1 1 1h3c0.552 0 1-0.448 1-1v-5c0-0.552-0.448-1-1-1zM15 8h1v3h-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-trending-down\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 19h6c0.136 0 0.265-0.027 0.383-0.076s0.228-0.121 0.324-0.217 0.168-0.206 0.217-0.324c0.049-0.118 0.076-0.247 0.076-0.383v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v3.586l-7.793-7.793c-0.391-0.391-1.024-0.391-1.414 0l-4.293 4.293-6.793-6.793c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l7.5 7.5c0.391 0.391 1.024 0.391 1.414 0l4.293-4.293 7.086 7.086h-3.586c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-trending-up\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 7h3.586l-7.086 7.086-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0l-7.5 7.5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l6.793-6.793 4.293 4.293c0.391 0.391 1.024 0.391 1.414 0l7.793-7.793v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-triangle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.148 4.374c0.073-0.123 0.185-0.242 0.334-0.332 0.236-0.143 0.506-0.178 0.756-0.116s0.474 0.216 0.614 0.448l8.466 14.133c0.070 0.12 0.119 0.268 0.128 0.434-0.015 0.368-0.119 0.591-0.283 0.759-0.18 0.184-0.427 0.298-0.693 0.301l-16.937-0.001c-0.152-0.001-0.321-0.041-0.481-0.134-0.239-0.138-0.399-0.359-0.466-0.607s-0.038-0.519 0.092-0.745zM9.432 3.346l-8.47 14.14c-0.422 0.731-0.506 1.55-0.308 2.29s0.68 1.408 1.398 1.822c0.464 0.268 0.976 0.4 1.475 0.402h16.943c0.839-0.009 1.587-0.354 2.123-0.902s0.864-1.303 0.855-2.131c-0.006-0.536-0.153-1.044-0.406-1.474l-8.474-14.147c-0.432-0.713-1.11-1.181-1.854-1.363s-1.561-0.081-2.269 0.349c-0.429 0.26-0.775 0.615-1.012 1.014z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-truck\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15 15h-13v-11h13v4zM17 9h2.586l2.414 2.414v3.586h-5zM7 18.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061zM22 18.5c0-0.537-0.121-1.045-0.337-1.5h1.337c0.552 0 1-0.448 1-1v-5c0-0.256-0.098-0.512-0.293-0.707l-3-3c-0.181-0.181-0.431-0.293-0.707-0.293h-3v-4c0-0.552-0.448-1-1-1h-15c-0.552 0-1 0.448-1 1v13c0 0.552 0.448 1 1 1h1.337c-0.216 0.455-0.337 0.963-0.337 1.5 0 0.966 0.393 1.843 1.025 2.475s1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475c0-0.537-0.121-1.045-0.337-1.5h6.674c-0.216 0.455-0.337 0.963-0.337 1.5 0 0.966 0.393 1.843 1.025 2.475s1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475zM20 18.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-tv\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M12 8h8c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v11c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-16c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-11c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h8zM16.293 1.293l-4.293 4.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3.293 3.293h-5.586c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h16c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-5.586l3.293-3.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-twitch\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 3v10.586l-3.414 3.414h-4.586c-0.256 0-0.512 0.098-0.707 0.293l-2.293 2.293v-1.586c0-0.552-0.448-1-1-1h-4v-14zM21 1h-18c-0.552 0-1 0.448-1 1v16c0 0.552 0.448 1 1 1h4v3c0 0.552 0.448 1 1 1 0.276 0 0.526-0.112 0.707-0.293l3.707-3.707h4.586c0.276 0 0.526-0.112 0.707-0.293l4-4c0.195-0.195 0.293-0.451 0.293-0.707v-12c0-0.552-0.448-1-1-1zM12 11v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.552 0.448 1 1 1s1-0.448 1-1zM17 11v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.552 0.448 1 1 1s1-0.448 1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-twitter\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20.833 5.262c-0.186 0.242-0.391 0.475-0.616 0.696-0.233 0.232-0.347 0.567-0.278 0.908 0.037 0.182 0.060 0.404 0.061 0.634 0 5.256-2.429 8.971-5.81 10.898-2.647 1.509-5.938 1.955-9.222 1.12 1.245-0.361 2.46-0.921 3.593-1.69 0.147-0.099 0.273-0.243 0.352-0.421 0.224-0.505-0.003-1.096-0.508-1.32-2.774-1.233-4.13-2.931-4.769-4.593-0.417-1.084-0.546-2.198-0.52-3.227 0.021-0.811 0.138-1.56 0.278-2.182 0.394 0.343 0.803 0.706 1.235 1.038 2.051 1.577 4.624 2.479 7.395 2.407 0.543-0.015 0.976-0.457 0.976-1v-1.011c-0.002-0.179 0.009-0.357 0.034-0.533 0.113-0.806 0.504-1.569 1.162-2.141 0.725-0.631 1.636-0.908 2.526-0.846s1.753 0.463 2.384 1.188c0.252 0.286 0.649 0.416 1.033 0.304 0.231-0.067 0.463-0.143 0.695-0.228zM22.424 2.183c-0.74 0.522-1.523 0.926-2.287 1.205-0.931-0.836-2.091-1.302-3.276-1.385-1.398-0.097-2.836 0.339-3.977 1.332-1.036 0.901-1.652 2.108-1.83 3.372-0.037 0.265-0.055 0.532-0.054 0.8-1.922-0.142-3.693-0.85-5.15-1.97-0.775-0.596-1.462-1.309-2.034-2.116-0.32-0.45-0.944-0.557-1.394-0.237-0.154 0.109-0.267 0.253-0.335 0.409 0 0-0.132 0.299-0.285 0.76-0.112 0.337-0.241 0.775-0.357 1.29-0.163 0.722-0.302 1.602-0.326 2.571-0.031 1.227 0.12 2.612 0.652 3.996 0.683 1.775 1.966 3.478 4.147 4.823-1.569 0.726-3.245 1.039-4.873 0.967-0.552-0.024-1.019 0.403-1.043 0.955-0.017 0.389 0.19 0.736 0.513 0.918 4.905 2.725 10.426 2.678 14.666 0.261 4.040-2.301 6.819-6.7 6.819-12.634-0.001-0.167-0.008-0.33-0.023-0.489 1.006-1.115 1.676-2.429 1.996-3.781 0.127-0.537-0.206-1.076-0.743-1.203-0.29-0.069-0.58-0.003-0.807 0.156z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-type\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 5v14h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-14h6v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-3c0-0.552-0.448-1-1-1h-16c-0.552 0-1 0.448-1 1v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-2z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-umbrella\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21.84 11h-19.674c0.387-1.824 1.259-3.474 2.485-4.796 1.617-1.744 3.848-2.915 6.394-3.158 2.763-0.264 5.369 0.616 7.354 2.255 1.717 1.418 2.965 3.401 3.441 5.7zM23.995 11.905c-0.316-3.312-1.946-6.184-4.323-8.147s-5.505-3.020-8.817-2.704c-3.052 0.291-5.731 1.699-7.67 3.789-1.759 1.897-2.909 4.357-3.18 7.057-0.055 0.55 0.346 1.040 0.895 1.095 0.035 0.004 0.070 0.005 0.1 0.005h22c0.531 0 0.966-0.414 0.998-0.937-0.001-0.137-0.002-0.148-0.003-0.158zM17 19c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1v7c0 1.104 0.449 2.106 1.172 2.828s1.724 1.172 2.828 1.172 2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828c0-0.552-0.448-1-1-1s-1 0.448-1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-underline\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 3v7c0 1.933 0.785 3.684 2.050 4.95s3.017 2.050 4.95 2.050 3.684-0.785 4.95-2.050 2.050-3.017 2.050-4.95v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1v7c0 1.381-0.559 2.63-1.464 3.536s-2.155 1.464-3.536 1.464-2.63-0.559-3.536-1.464-1.464-2.155-1.464-3.536v-7c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4 22h16c0.552 0 1-0.448 1-1s-0.448-1-1-1h-16c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-unlock\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 10v-3c-0.001-1.106 0.445-2.105 1.169-2.831 0.723-0.724 1.719-1.172 2.821-1.174 1.030 0.003 1.948 0.378 2.652 1 0.638 0.565 1.097 1.332 1.28 2.209 0.113 0.541 0.642 0.888 1.183 0.775s0.888-0.642 0.775-1.183c-0.272-1.307-0.958-2.454-1.912-3.299-1.060-0.938-2.452-1.504-3.973-1.502-1.657 0.002-3.157 0.676-4.241 1.762s-1.756 2.587-1.754 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-upload\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M20 15v4c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 5.414v9.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-9.586l3.293 3.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5-5c-0.092-0.092-0.202-0.166-0.324-0.217-0.245-0.101-0.521-0.101-0.766 0-0.118 0.049-0.228 0.121-0.324 0.217l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-upload-cloud\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 14.414v6.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076c-0.256 0-0.512 0.098-0.707 0.293l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM20.869 19.268c1.454-0.793 2.451-2.102 2.884-3.574s0.305-3.112-0.488-4.566c-0.679-1.245-1.737-2.155-2.959-2.663-0.724-0.301-1.505-0.46-2.299-0.465h-0.527c-0.725-2.057-2.144-3.708-3.917-4.752-1.983-1.168-4.415-1.581-6.821-0.959s-4.333 2.162-5.502 4.145-1.581 4.415-0.959 6.821c0.372 1.437 1.073 2.709 1.975 3.713 0.369 0.411 1.002 0.444 1.412 0.075s0.444-1.002 0.075-1.412c-0.688-0.765-1.235-1.75-1.526-2.877-0.484-1.872-0.164-3.761 0.746-5.305s2.407-2.74 4.279-3.224 3.761-0.164 5.305 0.746 2.74 2.407 3.224 4.279c0.116 0.435 0.506 0.75 0.969 0.75h1.253c0.536 0.004 1.061 0.111 1.545 0.312 0.815 0.339 1.517 0.943 1.97 1.773 0.529 0.97 0.615 2.061 0.325 3.044s-0.953 1.854-1.923 2.382c-0.485 0.264-0.664 0.872-0.399 1.357s0.872 0.664 1.357 0.399z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-user\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-8c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h8c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM17 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM15 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-user-check\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM16.293 11.707l2 2c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-user-minus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM23 10h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-user-plus\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM23 10h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-user-x\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM22.293 7.293l-1.793 1.793-1.793-1.793c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l1.793 1.793-1.793 1.793c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l1.793-1.793 1.793 1.793c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.793-1.793 1.793-1.793c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-users\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M18 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-8c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h8c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM14 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM12 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM24 21v-2c-0.001-1.245-0.457-2.385-1.215-3.261-0.652-0.753-1.528-1.311-2.529-1.576-0.534-0.141-1.081 0.177-1.222 0.711s0.177 1.081 0.711 1.222c0.607 0.161 1.136 0.498 1.528 0.952 0.454 0.526 0.726 1.206 0.727 1.952v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM15.752 4.099c0.803 0.206 1.445 0.715 1.837 1.377s0.531 1.47 0.325 2.273c-0.176 0.688-0.575 1.256-1.105 1.652-0.314 0.235-0.675 0.409-1.063 0.511-0.534 0.14-0.854 0.687-0.713 1.221s0.687 0.854 1.221 0.713c0.637-0.167 1.232-0.455 1.752-0.844 0.884-0.66 1.552-1.613 1.845-2.758 0.342-1.337 0.11-2.689-0.542-3.788s-1.725-1.953-3.062-2.296c-0.535-0.137-1.080 0.186-1.217 0.721s0.186 1.080 0.721 1.217z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-video\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M22 8.943v6.114l-4.28-3.057zM3 4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h11c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3.057l5.419 3.871c0.449 0.321 1.074 0.217 1.395-0.232 0.126-0.178 0.187-0.383 0.186-0.582v-10c0-0.552-0.448-1-1-1-0.218 0-0.42 0.070-0.581 0.186l-5.419 3.871v-3.057c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM3 6h11c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-11c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-video-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10.66 6h3.34c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v3.34c0 0.276 0.112 0.526 0.293 0.707l1 1c0.351 0.351 0.898 0.387 1.293 0.103l4.414-3.192v8.042c0 0.552 0.448 1 1 1s1-0.448 1-1v-10c0.001-0.201-0.061-0.408-0.19-0.586-0.324-0.447-0.949-0.548-1.396-0.224l-5.309 3.841-0.105-0.105v-2.926c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3.34c-0.552 0-1 0.448-1 1s0.448 1 1 1zM4.586 6l10.414 10.414v0.586c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-11c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM0.293 1.707l2.318 2.318c-0.673 0.087-1.277 0.398-1.732 0.854-0.542 0.541-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h11c0.828 0 1.58-0.337 2.121-0.879 0.269-0.269 0.488-0.59 0.64-0.946l5.532 5.532c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-22-22c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-voicemail\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M9 11.5c0 0.967-0.391 1.84-1.025 2.475s-1.508 1.025-2.475 1.025-1.84-0.391-2.475-1.025-1.025-1.508-1.025-2.475 0.391-1.84 1.025-2.475 1.508-1.025 2.475-1.025 1.84 0.391 2.475 1.025 1.025 1.508 1.025 2.475zM22 11.5c0 0.967-0.391 1.84-1.025 2.475s-1.508 1.025-2.475 1.025-1.84-0.391-2.475-1.025-1.025-1.508-1.025-2.475 0.391-1.84 1.025-2.475 1.508-1.025 2.475-1.025 1.84 0.391 2.475 1.025 1.025 1.508 1.025 2.475zM5.5 17h13c1.519 0 2.895-0.617 3.889-1.611s1.611-2.37 1.611-3.889-0.617-2.895-1.611-3.889-2.37-1.611-3.889-1.611-2.895 0.617-3.889 1.611-1.611 2.37-1.611 3.889c0 1.329 0.473 2.55 1.257 3.5h-4.514c0.784-0.95 1.257-2.171 1.257-3.5 0-1.519-0.617-2.895-1.611-3.889s-2.37-1.611-3.889-1.611-2.895 0.617-3.889 1.611-1.611 2.37-1.611 3.889 0.617 2.895 1.611 3.889 2.37 1.611 3.889 1.611z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-volume\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10 7.081v9.839l-3.375-2.7c-0.17-0.137-0.388-0.22-0.625-0.22h-3v-4h3c0.218 0.001 0.439-0.071 0.625-0.219zM10.375 4.219l-4.726 3.781h-3.649c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h3.649l4.726 3.781c0.431 0.345 1.061 0.275 1.406-0.156 0.148-0.185 0.22-0.407 0.219-0.625v-14c0-0.552-0.448-1-1-1-0.237 0-0.455 0.083-0.625 0.219z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-volume-1\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10 7.081v9.839l-3.375-2.7c-0.17-0.137-0.388-0.22-0.625-0.22h-3v-4h3c0.218 0.001 0.439-0.071 0.625-0.219zM10.375 4.219l-4.726 3.781h-3.649c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h3.649l4.726 3.781c0.431 0.345 1.061 0.275 1.406-0.156 0.148-0.185 0.22-0.407 0.219-0.625v-14c0-0.552-0.448-1-1-1-0.237 0-0.455 0.083-0.625 0.219zM14.833 9.167c0.781 0.781 1.171 1.803 1.171 2.828s-0.39 2.047-1.171 2.828c-0.39 0.391-0.39 1.024 0 1.414s1.024 0.39 1.414 0c1.171-1.171 1.757-2.708 1.757-4.242s-0.586-3.071-1.757-4.242c-0.39-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-volume-2\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10 7.081v9.839l-3.375-2.7c-0.17-0.137-0.388-0.22-0.625-0.22h-3v-4h3c0.218 0.001 0.439-0.071 0.625-0.219zM10.375 4.219l-4.726 3.781h-3.649c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h3.649l4.726 3.781c0.431 0.345 1.061 0.275 1.406-0.156 0.148-0.185 0.22-0.407 0.219-0.625v-14c0-0.552-0.448-1-1-1-0.237 0-0.455 0.083-0.625 0.219zM18.363 5.637c1.757 1.758 2.635 4.059 2.635 6.364 0 2.304-0.878 4.605-2.635 6.362-0.39 0.391-0.39 1.024 0 1.414s1.024 0.39 1.414 0c2.147-2.147 3.22-4.963 3.221-7.776s-1.074-5.63-3.221-7.778c-0.39-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM14.833 9.167c0.781 0.781 1.171 1.803 1.171 2.828s-0.39 2.047-1.171 2.828c-0.39 0.391-0.39 1.024 0 1.414s1.024 0.39 1.414 0c1.171-1.171 1.757-2.708 1.757-4.242s-0.586-3.071-1.757-4.242c-0.39-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-volume-x\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10 7.081v9.839l-3.375-2.7c-0.17-0.137-0.388-0.22-0.625-0.22h-3v-4h3c0.218 0.001 0.439-0.071 0.625-0.219zM10.375 4.219l-4.726 3.781h-3.649c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h3.649l4.726 3.781c0.431 0.345 1.061 0.275 1.406-0.156 0.148-0.185 0.22-0.407 0.219-0.625v-14c0-0.552-0.448-1-1-1-0.237 0-0.455 0.083-0.625 0.219zM16.293 9.707l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-watch\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11 9v3c0 0.276 0.112 0.526 0.293 0.707l1.5 1.5c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.207-1.207v-2.586c0-0.552-0.448-1-1-1s-1 0.448-1 1zM15.33 19.276l-0.166 1.813c-0.024 0.266-0.147 0.495-0.333 0.658-0.18 0.159-0.415 0.253-0.67 0.253h-4.331c-0.27 0.001-0.509-0.1-0.69-0.269-0.175-0.164-0.291-0.389-0.315-0.643l-0.165-1.817c1.016 0.468 2.148 0.729 3.34 0.729 1.188 0 2.316-0.259 3.33-0.724zM8.187 7.367c1.037-0.855 2.364-1.367 3.813-1.367 1.657 0 3.156 0.67 4.243 1.757s1.757 2.586 1.757 4.243-0.67 3.156-1.757 4.243c-0.104 0.104-0.211 0.204-0.323 0.3-0.035 0.031-0.071 0.061-0.107 0.090-1.037 0.855-2.364 1.367-3.813 1.367-1.657 0-3.156-0.67-4.243-1.757s-1.757-2.586-1.757-4.243 0.67-3.156 1.757-4.243c0.104-0.104 0.211-0.204 0.323-0.3 0.035-0.031 0.071-0.061 0.107-0.090zM17.491 6.182l-0.315-3.455c-0.070-0.756-0.418-1.43-0.938-1.917-0.539-0.505-1.266-0.813-2.058-0.81h-4.354c-0.755 0.003-1.454 0.286-1.985 0.757-0.551 0.488-0.925 1.182-0.997 1.972l-0.314 3.433c-0.063 0.059-0.126 0.12-0.187 0.181-1.446 1.447-2.343 3.448-2.343 5.657s0.897 4.21 2.343 5.657c0.058 0.058 0.117 0.115 0.176 0.171l0.315 3.445c0.070 0.756 0.418 1.43 0.938 1.917 0.539 0.505 1.266 0.813 2.058 0.81h4.329c0.759 0.001 1.463-0.282 1.997-0.754 0.553-0.489 0.929-1.184 1-1.975l0.314-3.433c0.063-0.059 0.126-0.12 0.187-0.181 1.446-1.447 2.343-3.448 2.343-5.657s-0.897-4.21-2.343-5.657c-0.054-0.054-0.11-0.108-0.165-0.161zM8.67 4.724l0.166-1.813c0.024-0.265 0.147-0.494 0.331-0.657 0.179-0.159 0.412-0.253 0.667-0.254h4.346c0.27-0.001 0.509 0.1 0.69 0.269 0.175 0.164 0.291 0.389 0.315 0.643l0.166 1.821c-1.020-0.47-2.155-0.733-3.351-0.733-1.188 0-2.316 0.259-3.33 0.724z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-wifi\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.64 13.318c1.962-1.634 4.361-2.389 6.733-2.305 2.167 0.077 4.31 0.855 6.071 2.308 0.426 0.351 1.056 0.291 1.408-0.135s0.291-1.056-0.135-1.408c-2.107-1.738-4.674-2.671-7.272-2.763-2.846-0.101-5.731 0.806-8.084 2.767-0.424 0.353-0.482 0.984-0.128 1.408s0.984 0.482 1.408 0.128zM2.081 9.75c2.937-2.589 6.6-3.82 10.236-3.737 3.443 0.079 6.859 1.337 9.604 3.739 0.416 0.364 1.047 0.322 1.411-0.094s0.322-1.047-0.094-1.411c-3.108-2.72-6.977-4.145-10.876-4.234-4.119-0.094-8.275 1.303-11.603 4.237-0.415 0.365-0.454 0.997-0.089 1.411s0.997 0.454 1.411 0.089zM9.109 16.925c0.99-0.704 2.146-0.995 3.274-0.906 0.891 0.070 1.765 0.378 2.523 0.909 0.452 0.317 1.076 0.207 1.393-0.245s0.207-1.076-0.245-1.393c-1.053-0.738-2.269-1.167-3.513-1.265-1.58-0.125-3.204 0.285-4.59 1.269-0.45 0.32-0.556 0.944-0.236 1.394s0.944 0.556 1.394 0.236zM12 21c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-wifi-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.281 11.959c0.789 0.385 1.498 0.857 2.064 1.347 0.418 0.361 1.049 0.316 1.411-0.102s0.316-1.049-0.102-1.411c-0.703-0.609-1.559-1.175-2.496-1.633-0.496-0.242-1.095-0.036-1.337 0.46s-0.036 1.095 0.46 1.337zM10.79 6.047c4.020-0.324 7.796 0.968 10.696 3.337 0.146 0.12 0.29 0.242 0.432 0.367 0.414 0.365 1.046 0.325 1.411-0.089s0.325-1.046-0.089-1.411c-0.16-0.141-0.324-0.28-0.489-0.415-3.284-2.683-7.566-4.149-12.122-3.781-0.55 0.043-0.96 0.525-0.916 1.075s0.527 0.961 1.077 0.916zM9.109 16.925c0.99-0.704 2.146-0.995 3.274-0.906 0.891 0.070 1.765 0.378 2.523 0.909 0.233 0.163 0.512 0.213 0.77 0.162l6.617 6.617c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-12.75-12.75c-0.050-0.063-0.106-0.12-0.169-0.169l-9.081-9.081c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l4.088 4.088c-1.257 0.629-2.49 1.453-3.623 2.455-0.414 0.366-0.453 0.998-0.087 1.412s0.998 0.453 1.412 0.087c1.191-1.053 2.499-1.877 3.802-2.451l2.323 2.323c-1.358 0.457-2.671 1.177-3.849 2.161-0.424 0.354-0.48 0.985-0.126 1.409s0.985 0.48 1.409 0.126c1.27-1.062 2.724-1.75 4.188-2.074l2.789 2.789c-0.026-0.002-0.052-0.005-0.078-0.007-1.58-0.125-3.204 0.285-4.59 1.269-0.45 0.32-0.556 0.944-0.236 1.394s0.944 0.556 1.394 0.236zM12 21c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-wind\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M10.299 5.295c0.195-0.196 0.449-0.294 0.706-0.295s0.512 0.096 0.708 0.291 0.294 0.449 0.295 0.706-0.096 0.512-0.291 0.708c-0.192 0.194-0.442 0.292-0.697 0.295h-9.020c-0.552 0-1 0.448-1 1s0.448 1 1 1h9.043c0.758-0.009 1.516-0.304 2.093-0.885 0.584-0.587 0.875-1.358 0.872-2.124s-0.298-1.535-0.885-2.119-1.357-0.874-2.123-0.872-1.535 0.298-2.119 0.885c-0.39 0.392-0.388 1.025 0.004 1.414s1.025 0.387 1.414-0.004zM11.881 20.115c0.584 0.587 1.352 0.883 2.119 0.885s1.537-0.289 2.124-0.872 0.883-1.352 0.885-2.119-0.289-1.537-0.872-2.124c-0.577-0.581-1.335-0.876-2.093-0.885h-12.044c-0.552 0-1 0.448-1 1s0.448 1 1 1h12.020c0.255 0.003 0.505 0.101 0.698 0.295 0.195 0.196 0.292 0.451 0.291 0.708s-0.099 0.511-0.295 0.706-0.451 0.292-0.708 0.291-0.511-0.099-0.706-0.295c-0.389-0.392-1.023-0.394-1.414-0.004s-0.394 1.023-0.004 1.414zM18.436 8.438c0.294-0.293 0.676-0.438 1.061-0.438s0.767 0.147 1.060 0.441 0.438 0.676 0.438 1.061-0.147 0.767-0.441 1.060c-0.292 0.292-0.673 0.437-1.057 0.438h-17.497c-0.552 0-1 0.448-1 1s0.448 1 1 1h17.502c0.891-0.002 1.784-0.342 2.466-1.022 0.684-0.682 1.027-1.579 1.028-2.474s-0.34-1.792-1.022-2.476-1.58-1.027-2.474-1.028-1.792 0.34-2.476 1.022c-0.391 0.39-0.392 1.023-0.002 1.414s1.023 0.392 1.414 0.002z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-x\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-x-circle\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8.293 9.707l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-x-octagon\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M7.86 1c-0.256 0-0.512 0.098-0.707 0.293l-5.86 5.86c-0.181 0.181-0.293 0.431-0.293 0.707v8.28c0 0.256 0.098 0.512 0.293 0.707l5.86 5.86c0.181 0.181 0.431 0.293 0.707 0.293h8.28c0.256 0 0.512-0.098 0.707-0.293l5.86-5.86c0.181-0.181 0.293-0.431 0.293-0.707v-8.28c0-0.256-0.098-0.512-0.293-0.707l-5.86-5.86c-0.181-0.181-0.431-0.293-0.707-0.293zM8.274 3h7.452l5.274 5.274v7.452l-5.274 5.274h-7.452l-5.274-5.274v-7.452zM8.293 9.707l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-x-square\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM14.293 8.293l-2.293 2.293-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293-2.293 2.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293 2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.293-2.293 2.293-2.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-youtube\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M21.563 6.637c0.287 1.529 0.448 3.295 0.437 5.125 0.019 1.528-0.123 3.267-0.437 5.021-0.057 0.208-0.15 0.403-0.272 0.575-0.227 0.321-0.558 0.565-0.949 0.675-0.604 0.161-2.156 0.275-3.877 0.341-2.23 0.086-4.465 0.086-4.465 0.086s-2.235 0-4.465-0.085c-1.721-0.066-3.273-0.179-3.866-0.338-0.205-0.057-0.396-0.149-0.566-0.268-0.311-0.22-0.55-0.536-0.67-0.923-0.285-1.526-0.444-3.286-0.433-5.11-0.021-1.54 0.121-3.292 0.437-5.060 0.057-0.208 0.15-0.403 0.272-0.575 0.227-0.321 0.558-0.565 0.949-0.675 0.604-0.161 2.156-0.275 3.877-0.341 2.23-0.085 4.465-0.085 4.465-0.085s2.235 0 4.466 0.078c1.719 0.060 3.282 0.163 3.856 0.303 0.219 0.063 0.421 0.165 0.598 0.299 0.307 0.232 0.538 0.561 0.643 0.958zM23.51 6.177c-0.217-0.866-0.718-1.59-1.383-2.093-0.373-0.282-0.796-0.494-1.249-0.625-0.898-0.22-2.696-0.323-4.342-0.38-2.267-0.079-4.536-0.079-4.536-0.079s-2.272 0-4.541 0.087c-1.642 0.063-3.45 0.175-4.317 0.407-0.874 0.247-1.581 0.77-2.064 1.45-0.27 0.381-0.469 0.811-0.587 1.268-0.006 0.024-0.011 0.049-0.015 0.071-0.343 1.898-0.499 3.793-0.476 5.481-0.012 1.924 0.161 3.831 0.477 5.502 0.006 0.031 0.013 0.062 0.021 0.088 0.245 0.86 0.77 1.567 1.451 2.048 0.357 0.252 0.757 0.443 1.182 0.561 0.879 0.235 2.686 0.347 4.328 0.41 2.269 0.087 4.541 0.087 4.541 0.087s2.272 0 4.541-0.087c1.642-0.063 3.449-0.175 4.317-0.407 0.873-0.247 1.581-0.77 2.063-1.45 0.27-0.381 0.47-0.811 0.587-1.267 0.006-0.025 0.012-0.050 0.015-0.071 0.34-1.884 0.496-3.765 0.476-5.44 0.012-1.925-0.161-3.833-0.477-5.504-0.004-0.020-0.008-0.040-0.012-0.057zM10.75 13.301v-3.102l2.727 1.551zM10.244 15.889l5.75-3.27c0.48-0.273 0.648-0.884 0.375-1.364-0.093-0.164-0.226-0.292-0.375-0.375l-5.75-3.27c-0.48-0.273-1.091-0.105-1.364 0.375-0.090 0.158-0.132 0.33-0.131 0.494v6.54c0 0.552 0.448 1 1 1 0.182 0 0.352-0.049 0.494-0.131z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-zap\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M11.585 5.26l-0.577 4.616c0.033 0.716 0.465 1.124 0.992 1.124h6.865l-6.45 7.74 0.577-4.616c-0.033-0.716-0.465-1.124-0.992-1.124h-6.865zM12.232 1.36l-10 12c-0.354 0.424-0.296 1.055 0.128 1.408 0.187 0.157 0.415 0.233 0.64 0.232h7.867l-0.859 6.876c-0.069 0.548 0.32 1.048 0.868 1.116 0.349 0.044 0.678-0.098 0.892-0.352l10-12c0.354-0.424 0.296-1.055-0.128-1.408-0.187-0.157-0.415-0.233-0.64-0.232h-7.867l0.859-6.876c0.069-0.548-0.32-1.048-0.868-1.116-0.349-0.044-0.678 0.098-0.892 0.352z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-zap-off\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M13.402 6.873l0.59-4.75c0.068-0.548-0.321-1.048-0.869-1.116-0.349-0.043-0.678 0.099-0.892 0.353l-2.43 2.92c-0.353 0.425-0.295 1.055 0.129 1.409s1.055 0.296 1.408-0.129l0.249-0.299-0.17 1.366c-0.068 0.548 0.321 1.048 0.869 1.116s1.048-0.321 1.116-0.869zM19.338 13.551l2.43-2.91c0.354-0.424 0.297-1.055-0.127-1.409-0.188-0.156-0.416-0.233-0.641-0.232h-5.34c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.202l-1.060 1.269c-0.354 0.424-0.297 1.055 0.127 1.409s1.055 0.297 1.409-0.127zM12.961 14.375l1.686 1.686-2.232 2.678zM8.067 9.481l3.519 3.519h-6.451zM0.293 1.707l6.354 6.354-4.415 5.299c-0.354 0.424-0.296 1.055 0.128 1.408 0.187 0.157 0.415 0.233 0.64 0.232h7.867l-0.859 6.876c-0.069 0.548 0.32 1.048 0.868 1.116 0.349 0.044 0.678-0.098 0.892-0.352l4.299-5.159 6.226 6.226c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-22-22c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-zoom-in\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414zM8 12h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-zoom-out\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414zM8 12h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-translate\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M15.891 17.016h3.234l-1.641-4.359zM18.516 9.984l4.5 12h-2.016l-1.125-3h-4.734l-1.125 3h-2.016l4.5-12h2.016zM12.891 15.047l-0.797 2.063-3.094-3.094-5.016 4.969-1.406-1.406 5.109-5.016q-1.875-2.063-3-4.547h2.016q0.984 1.875 2.297 3.328 2.156-2.391 3.188-5.344h-11.203v-2.016h7.031v-1.969h1.969v1.969h7.031v2.016h-2.953q-0.469 1.5-1.547 3.398t-2.156 3.117l-0.047 0.047z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-ticket\" viewBox=\"0 0 24 24\">\n" +
    "<path d=\"M14.0048 7.87368L12.9442 8.93433L14.9947 10.9849L16.0554 9.92426L14.0048 7.87368Z\"></path>\n" +
    "<path d=\"M23.6 7.70001L21.8 5.90001C21.5 5.60001 21 5.60001 20.6 5.80001C20.4 5.90001 19.1 6.90001 18.1 5.90001C17.1 4.90001 18.1 3.60001 18.2 3.40001C18.5 3.00001 18.4 2.50001 18.1 2.20001L16.3 0.400006C16.1 0.200006 15.9 0.100006 15.7 0.100006C15.5 0.100006 15.2 0.200006 15.1 0.400006L0.399976 15C0.199976 15.2 0.0999756 15.4 0.0999756 15.6C0.0999756 15.8 0.199976 16.1 0.399976 16.2L2.19998 18C2.59998 18.4 3.09998 18.4 3.49998 18C3.69998 17.8 4.79998 16.9 5.89998 18C6.99998 19.1 6.19998 20.1 5.89998 20.4C5.69998 20.6 5.59998 20.8 5.59998 21C5.59998 21.2 5.69998 21.5 5.89998 21.6L7.69998 23.4C7.89998 23.6 8.09998 23.7 8.29998 23.7C8.49998 23.7 8.79997 23.6 8.89997 23.4L23.6 9.00001C24 8.60001 24 8.00001 23.6 7.70001ZM18.1 12L17 10.9L15.9 12L17 13.1L8.29998 21.8L7.69998 21.2C7.79998 21 7.99998 20.7 8.09998 20.4C8.49998 19.2 8.19998 17.9 7.19998 17C5.69998 15.5 4.09998 15.8 2.99998 16.4L2.39998 15.8L10.9 7.00001L12 8.10001L13.1 7.00001L12 5.90001L15.7 2.20001L16.4 3.00001C15.8 4.10001 15.5 5.80001 16.9 7.20001C18.3 8.60001 20 8.30001 21.1 7.70001L21.8 8.40001L18.1 12Z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"icon-seat\" viewBox=\"0 0 370 370\">\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M31 261H339V300C339 329.823 314.823 354 285 354H85C55.1766 354 31 329.823 31 300V261ZM73.372 321C65.9937 316.906 61 309.036 61 300V291H309V300C309 309.036 304.006 316.906 296.628 321C293.183 322.911 289.219 324 285 324H85C80.7813 324 76.8167 322.911 73.372 321Z\"></path>\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M339 291H249V227C249 202.147 269.147 182 294 182C318.853 182 339 202.147 339 227V291ZM309 227C309 218.716 302.284 212 294 212C285.716 212 279 218.716 279 227V261H309V227Z\"></path>\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M339 291H309H61H31V261V168C31 82.9482 99.9482 14 185 14C270.052 14 339 82.9482 339 168V261V291ZM185 44C116.517 44 61 99.5167 61 168V231V261H91H279H309V231V168C309 99.5167 253.483 44 185 44Z\"></path>\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M214.19 96.3579C214.275 88.1468 220.958 81.5169 229.189 81.5169C237.473 81.517 244.189 88.2327 244.189 96.517L229.569 96.5169C244.189 96.5171 244.189 96.5256 244.189 96.5343L244.189 96.5525L244.189 96.5918L244.188 96.6815C244.188 96.7462 244.187 96.8208 244.185 96.9049C244.182 97.073 244.177 97.2796 244.167 97.522C244.149 98.0065 244.115 98.6372 244.053 99.3939C243.929 100.902 243.692 102.941 243.233 105.34C242.326 110.079 240.49 116.569 236.685 123.198C228.513 137.44 212.538 149.948 185.081 149.948C157.623 149.948 141.649 137.44 133.476 123.198C129.672 116.569 127.836 110.079 126.929 105.34C126.47 102.941 126.233 100.902 126.109 99.3939C126.047 98.6372 126.013 98.0065 125.994 97.522C125.985 97.2796 125.98 97.073 125.977 96.9049C125.975 96.8208 125.974 96.7462 125.974 96.6815L125.973 96.5918L125.973 96.5525L125.973 96.5343C125.973 96.5256 125.973 96.5171 140.593 96.5169L125.973 96.517C125.973 88.2327 132.688 81.517 140.973 81.5169C149.204 81.5169 155.887 88.1469 155.972 96.358C155.972 96.3628 155.972 96.3685 155.973 96.375C155.976 96.4535 155.985 96.6484 156.009 96.9426C156.057 97.5363 156.165 98.4996 156.395 99.7035C156.867 102.171 157.787 105.288 159.496 108.266C162.351 113.24 168.43 119.948 185.081 119.948C201.731 119.948 207.811 113.24 210.665 108.266C212.375 105.288 213.295 102.171 213.767 99.7035C213.997 98.4996 214.104 97.5363 214.153 96.9426C214.177 96.6484 214.186 96.4536 214.189 96.375C214.189 96.3685 214.19 96.3627 214.19 96.3579Z\"></path>\n" +
    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M121 291H31V227C31 202.147 51.1472 182 76 182C100.853 182 121 202.147 121 227V291ZM91 227C91 218.716 84.2843 212 76 212C67.7157 212 61 218.716 61 227V261H91V227Z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-sl\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#fff\" d=\"M-62 0H962v512H-62z\"/>\n" +
    "<path fill=\"#d50000\" d=\"M-62 341.3H962V512H-62z\"/>\n" +
    "<path fill=\"#0000bf\" d=\"M-62 170.7H962v170.6H-62z\"/>\n" +
    "<path fill=\"#d50000\" d=\"M228.4 93c-4 61.6-6.4 95.4-15.7 111-10.2 16.8-20 29.1-59.7 44-39.6-14.9-49.4-27.2-59.6-44-9.4-15.6-11.7-49.4-15.7-111l5.8-2c11.8-3.6 20.6-6.5 27.1-7.8 9.3-2 17.3-4.2 42.3-4.7 25 .4 33 2.8 42.3 4.8 6.4 1.4 15.6 4 27.3 7.7l5.9 2z\"/>\n" +
    "<path fill=\"#0000bf\" d=\"M222.6 91c-3.8 61.5-7 89.7-12 103.2-9.6 23.2-24.8 35.9-57.6 48-32.8-12.1-48-24.8-57.7-48-5-13.6-8-41.7-11.8-103.3 11.6-3.6 20.6-6.4 27.1-7.7 9.3-2 17.3-4.3 42.3-4.7 25 .4 33 2.7 42.3 4.7a284 284 0 0 1 27.4 7.7z\"/>\n" +
    "<path fill=\"#ffdf00\" d=\"m153 109.8 1.5 3.7 7 1-4.5 2.7 4.3 2.9-6.3 1-2 3.4-2-3.5-6-.8 4-3-4.2-2.7 6.7-1 1.5-3.7z\"/>\n" +
    "<path fill=\"#fff\" d=\"m208.3 179.6-3.9-3-2.7-4.6-5.4-4.7-2.9-4.7-5.4-4.9-2.6-4.7-3-2.3-1.8-1.9-5 4.3-2.6 4.7-3.3 3-3.7-2.9-2.7-4.8-10.3-18.3-10.3 18.3-2.7 4.8-3.7 2.9-3.3-3-2.7-4.7-4.9-4.3-1.9 1.8-2.9 2.4-2.6 4.7-5.4 4.9-2.9 4.7-5.4 4.7-2.7 4.6-3.9 3a65.8 65.8 0 0 0 18.6 36.3 107 107 0 0 0 36.6 20.5 104.1 104.1 0 0 0 36.8-20.5c5.8-6 16.6-19.3 18.6-36.3z\"/>\n" +
    "<path fill=\"#ffdf00\" d=\"m169.4 83.9 1.6 3.7 7 1-4.6 2.7 4.4 2.9-6.3 1-2 3.4-2-3.5-6-.8 4-3-4.2-2.7 6.6-1 1.6-3.7zm-33 0 1.6 3.7 7 .9-4.5 2.7 4.3 2.9-6.3 1-2 3.4-2-3.4-6-.9 4-3-4.2-2.7 6.7-1 1.5-3.7z\"/>\n" +
    "<path fill=\"#0000bf\" d=\"M199.7 203h-7.4l-7-.5-8.3-4h-9.4l-8.1 4-6.5.6-6.4-.6-8.1-4H129l-8.4 4-6.9.6-7.6-.1-3.6-6.2.1-.2 11.2 1.9 6.9-.5 8.3-4.1h9.4l8.2 4 6.4.6 6.5-.6 8.1-4h9.4l8.4 4 6.9.6 10.8-2 .2.4-3.7 6.1zm-86.4 9.5 7.4-.5 8.3-4h9.4l8.2 4 6.4.5 6.4-.5 8.2-4h9.4l8.3 4 7.5.5 4.8-6h-.1l-5.2 1.4-6.9-.5-8.3-4h-9.4l-8.2 4-6.4.6-6.5-.6-8.1-4H129l-8.4 4-6.9.6-5-1.3v.2l4.5 5.6z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-de\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#ffce00\" d=\"M0 320h640v160H0z\"/>\n" +
    "<path d=\"M0 0h640v160H0z\"/>\n" +
    "<path fill=\"#d00\" d=\"M0 160h640v160H0z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-fr\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#fff\" d=\"M0 0h640v480H0z\"/>\n" +
    "<path fill=\"#002654\" d=\"M0 0h213.3v480H0z\"/>\n" +
    "<path fill=\"#ce1126\" d=\"M426.7 0H640v480H426.7z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-it\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#fff\" d=\"M0 0h640v480H0z\"/>\n" +
    "<path fill=\"#009246\" d=\"M0 0h213.3v480H0z\"/>\n" +
    "<path fill=\"#ce2b37\" d=\"M426.7 0H640v480H426.7z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-hr\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#171796\" d=\"M0 0h640v480H0z\"/>\n" +
    "<path fill=\"#fff\" d=\"M0 0h640v320H0z\"/>\n" +
    "<path fill=\"red\" d=\"M0 0h640v160H0zm320 364.1c51.3 0 93.3-42 93.3-93.3V160H226.7v110.8c0 51.4 42 93.4 93.3 93.4z\"/>\n" +
    "<path fill=\"#fff\" d=\"M320 362.6a91.8 91.8 0 0 0 91.6-91.5V161.8H228.5V271a91.8 91.8 0 0 0 91.5 91.5z\"/>\n" +
    "<g fill=\"red\">\n" +
    "<path d=\"M267.1 165.2H232v38.7h35.2zm0 77.4h35.3v-38.7H267zM232 270.9c0 3.5.2 7 .6 10.4h34.6v-38.7H232v28.3zm105.7-28.3h-35.2v38.7h35.2zm0 77.4h35.2v-38.7h-35.2zm35.2 21.2A89.2 89.2 0 0 0 393 320h-20v21.2zM267.1 320h35.3v-38.7H267zm-20.1 0a89.2 89.2 0 0 0 20.1 21.2V320H247zm79.1 38.7c4-.3 7.7-.8 11.5-1.6V320h-35.2v37.1a87 87 0 0 0 11.4 1.6c4.1.3 8.2.2 12.3 0z\"/>\n" +
    "<path d=\"M407.4 281.3c.4-3.4.6-6.9.6-10.4v-28.3h-35.2v38.7h34.6zm-69.8-38.7h35.2v-38.7h-35.2zm0-77.4h-35.2v38.7h35.2zm70.4 38.7v-38.7h-35.2v38.7z\"/>\n" +
    "</g>\n" +
    "<path fill=\"#fff\" d=\"m410 158.8 21.8-49.5-16.6-26.8-27.6 10.2-19.4-22.2-25.4 14.7L320 66.5l-22.7 18.6-25.5-14.6-19.4 22.2-27.6-10.3-16.6 27 21.8 49.4a217.8 217.8 0 0 1 90-19.3c32 0 62.5 6.9 90 19.3z\"/>\n" +
    "<path fill=\"#0093dd\" d=\"m253 94.8-27.4-10-15.3 24.7 5.9 13.3 14.8 33.7a219.7 219.7 0 0 1 34.6-12L253 94.8z\"/>\n" +
    "<path fill=\"#fff\" stroke=\"#000\" stroke-width=\".3\" d=\"M251.4 119.3a13.3 13.3 0 0 1 1.6 6.2c0 7.3-6 13.3-13.4 13.3a13.4 13.4 0 0 1-13.1-10.8 13.4 13.4 0 0 0 11.7 6.9 13.4 13.4 0 0 0 13.2-15.6z\"/>\n" +
    "<path d=\"m227.6 114 1-4.9-3.8-3.2-.1-.1.2-.1 4.6-1.6 1-4.8v-.2l.2.1 3.7 3.2 4.6-1.6h.2v.2l-1 4.8 3.7 3.2.2.2h-.3l-4.6 1.6-1 4.8v.2l-.1-.1-3.7-3.2-4.6 1.6h-.3z\"/>\n" +
    "<path fill=\"#f7db17\" d=\"m233.6 107.6 3.5 3 4.3-1.5zm0-.2 7.8 1.6-3.4-3zm-8.3-1.6 7.8 1.5-3.5-3zm7.8 1.7-7.8-1.5 3.4 3zm.4-.3 5.2-6-4.3 1.5zm-5.6 6.4 5.2-6-4.3 1.5zm5.3-5.9-5.2 6 4.3-1.5zm5.6-6.4-5.2 6 4.3-1.5zm-5.6 6-2.6-7.6-.9 4.5zm2.7 8-2.5-7.5-.9 4.5zm-2.4-7.6 2.6 7.5.9-4.5zm-2.7-8 2.5 7.5 1-4.5z\"/>\n" +
    "<path fill=\"#171796\" d=\"M297.5 87.4 272.1 73 253 94.9l12.6 49.6a219.8 219.8 0 0 1 36.1-6l-4.2-51.1z\"/>\n" +
    "<path fill=\"red\" d=\"M262.5 132.2a232.3 232.3 0 0 1 38.2-6.4l-1-12.9a245.6 245.6 0 0 0-40.4 6.7l3.2 12.6zm-6.3-25a258 258 0 0 1 42.4-7l-1.1-12.7a270.7 270.7 0 0 0-44.5 7.4l3.2 12.3z\"/>\n" +
    "<g transform=\"translate(-160) scale(.00237)\">\n" +
    "<path fill=\"#0093dd\" d=\"m212105 36890-23 13-9517-7794-9497 7778 1788 21560c2543-210 5113-322 7709-322 2608 0 5190 113 7744 325l1795-21560z\"/>\n" +
    "<g id=\"a\">\n" +
    "<path d=\"M202545 46585c-18-2-44 10-69 45-186 250-359 469-545 720-195 61-242 180-167 348-261-26-291 193-302 432-250-379-522-482-814-307-11-230-187-338-439-392-180-10-319-65-436-145-60-42-110-64-170-106-126-88-226-5-172 74 267 434 535 868 802 1302-14 80 6 151 88 204 47 133 93 265 140 397-11 38-21 75-32 113-221-105-443-118-664-133-170-8-287-50-361-137-54-63-91-26-92 82-3 534 162 1014 599 1492-231 4-462 11-694 21-79 6-95 39-73 104 126 304 339 579 822 766-208 112-327 285-357 520-9 224-75 382-212 455-60 32-81 65-24 106 253 185 565 193 895 112-157 270-226 553-198 850 208 56 412 15 614-52-29 61-44 175-52 309-7 115-41 229-104 343-32 33-65 84 4 102 336 91 648 52 915-47 0 243 2 487 76 727 18 58 70 102 125 26 155-214 322-396 527-517 31 90 75 168 156 215 96 55 147 170 153 343 0 30-2 60 35 90 149 7 514-380 589-597 206 121 284 246 439 461 55 76 99 29 128-25 62-243 67-481 66-724 267 99 579 138 915 47 69-19 36-70 4-102-62-114-105-250-113-365-9-133-14-226-43-287 202 68 405 108 614 52 29-297-53-579-211-850 330 80 655 73 908-112 57-41 35-74-24-106-136-73-203-231-212-455-30-235-149-409-357-520 483-187 696-463 822-766 22-66 6-99-73-104-231-10-480-24-711-27 437-478 606-961 604-1495-1-108-38-146-92-82-74 87-179 137-348 146-222 15-435 24-656 128-11-38-21-75-32-113 46-132 106-260 153-393 82-53 102-123 88-204 267-434 513-868 781-1302 54-79-46-162-171-74-60 42-110 64-170 106-117 80-257 134-437 145-251 54-417 167-428 397-293-175-564-73-814 307-11-239-41-457-302-432 75-168 17-291-178-352-186-250-458-470-644-720-31-35-51-47-69-45z\"/>\n" +
    "<g fill=\"#f7db17\">\n" +
    "<path d=\"M205075 47978c-51-26-124 17-162 95s-33 170 19 196c40 20 84-6 119-56l22-36c2-3 4-6 5-9 38-78 49-163-2-188zm-5008 0c52-26 124 17 162 95s39 165-13 191-103-24-141-102-60-158-9-184zm4539 905c-32 0-59 27-59 59s26 59 59 59 59-26 59-59c0-32-26-59-59-59zm-4032 0a59.1 59.1 0 1 0 .2 118.2 59.1 59.1 0 0 0-.2-118.2zm4294-304c-754-91-1506-133-2260-133s-1509 41-2269 115c-26 8-21 90 14 86 756-73 1507-113 2256-113 743 0 1485 40 2228 129 39 4 54-80 32-84z\"/>\n" +
    "<path d=\"M200319 48495c768-75 1530-117 2289-116 754 0 1507 42 2261 133l111-184c-32 10-62 9-90-5-76-38-92-161-36-274 56-114 164-175 240-138 39 19 62 62 68 114l446-739c-204 130-328 214-581 252-281 41-409 139-368 307 38 156-57 133-201 54-314-171-541 71-652 353-73 186-159 181-168-13-4-70 0-131-7-200-21-223-89-286-216-224-161 78-175 25-137-58 28-60 86-128 66-221-9-67-66-92-151-98-182-244-467-483-649-727-182 244-374 483-556 727-86 5-142 30-152 98-20 93 52 157 80 217 38 82 23 135-137 57-127-61-186-3-207 220-7 69-10 139-13 209-9 194-95 199-168 13-111-282-352-524-667-353-145 79-203 102-182-54 23-172-107-266-388-307-253-37-377-122-581-252l419 682c12-25 29-45 53-57 76-38 184 24 240 138 56 113 40 237-36 274-10 5-21 8-32 10l100 163zm4389 911c-7 3-7 4-24 11-46 19-80 66-134 124-57 60-128 125-211 188-12 10-25 19-44-6s-7-35 6-44c80-62 149-124 204-182 30-32 56-63 77-92-95-11-190-21-284-30-79 24-157 55-222 95-59 35-107 77-137 125-8 14-16 27-44 11-27-16-19-30-11-44 35-58 91-107 158-147 33-20 69-38 106-54-107-9-214-18-321-25-22 13-42 29-61 47-20 19-39 42-56 67-9 13-18 26-44 8s-18-31-8-44c19-29 41-54 64-77l9-9c-80-5-161-10-241-14-2 2-5 5-8 7a340.4 340.4 0 0 0-93 126c-6 15-12 29-41 18-29-12-23-26-17-41 12-29 27-55 45-81 8-11 18-22 27-33-115-5-230-9-344-12-4 5-9 8-14 11-25 15-47 32-66 51s-35 40-48 63c-8 14-16 28-43 12-28-16-20-29-12-43 16-28 35-54 59-77 7-7 14-13 21-19-122-2-244-4-365-4-120 0-240 1-360 3 8 7 15 13 22 20 23 23 42 49 59 77 8 14 16 27-12 43s-35 2-44-12c-13-23-29-44-48-63s-41-36-66-51c-6-3-12-7-15-12-115 2-230 6-345 11 11 11 20 23 29 35 19 25 33 52 45 81 6 15 12 29-17 41s-35-3-41-18c-9-24-22-46-38-67-15-21-34-41-55-59-4-3-7-6-10-10-81 4-162 8-243 13 4 4 9 8 13 12 24 23 45 48 64 77 9 13 18 26-8 44s-35 5-44-8c-18-26-36-48-56-67s-41-35-64-49c-1-1-3-2-5-3-110 7-220 14-330 23 43 18 85 38 122 61 67 40 124 89 158 147 8 14 16 27-11 44-27 16-35 3-44-11-29-48-78-90-137-125-72-44-159-77-246-102h-2c-90 7-179 15-268 24 22 33 51 68 86 106 55 58 124 120 204 182 13 9 25 19 6 44s-32 15-44 6c-83-64-155-128-211-188-37-38-99-111-135-140-196-90-354-127-575-147-153-14-318-9-458-79 36 85 75 164 126 229 53 68 120 121 209 147 8 2 21 16 22 25 28 157 84 286 169 386 52 60 114 110 188 149-75-81-132-166-172-251-67-142-90-286-77-420 1-16 3-32 34-29 32 3 30 19 29 35-11 123 9 256 72 387 56 118 159 237 291 346 24 19 0 63-29 55-154-44-290-123-383-231-89-104-149-237-180-397-94-32-165-90-222-164-47-60-85-131-118-205 28 428 182 801 456 1137 61 75 165 182 255 216 92 35 95 100-20 101-34 1-69 1-105 1 84 31 164 66 233 105 127 73 217 162 224 273 1 16 2 32-29 34-32 2-33-14-34-29-6-86-82-160-192-223-113-65-259-117-402-160-154 0-312-1-459 3 39 28 80 57 131 84 82 44 188 86 343 122 89 21 166 52 233 91 71 42 130 93 177 150 10 12 20 25-5 45s-34 8-45-5c-42-52-95-98-159-135-61-36-133-64-216-84-161-38-272-81-358-128-75-40-131-82-184-123 180 393 450 573 835 689 23 7 43 13 61 19 3 1 6 1 9 2 86 21 175 40 266 55 92 15 166 28 261 37 16 1 32 3 29 34-3 32-19 30-34 29-99-9-174-22-266-38-58-10-115-21-171-33-26 6-64 9-107 12-232 14-420 225-435 494 0 5 0 11-1 16 88-80 179-157 273-212 117-68 239-103 364-69 15 4 31 8 22 39-8 31-23 27-39 22-106-28-212 3-316 63-108 63-213 158-315 253-24 147-82 285-205 377 61 34 104 65 163 45 86-39 172-78 261-108 91-31 184-52 282-57 16-1 32-1 33 31s-14 32-31 33c-91 4-179 24-264 53-75 26-149 58-222 91 221 47 460-1 667-79 60-22 105-42 133-41 51-30 112-53 172-79 66-28 132-51 182-57 16-2 32-4 35 28 4 32-12 33-28 35-112 13-127 21-222 79 0 21-66 57-126 96-36 24-70 52-87 67-95 86-144 181-188 287-29 70-52 145-68 224 55-108 121-211 201-303 94-108 208-201 345-265 14-7 29-13 42 15 13 29-1 35-15 42-129 60-236 147-324 250-90 103-161 222-219 345-31 64-8 1-42 86 110-122 212-224 323-307 132-100 283-157 418-133 15 3 31 6 26 37s-21 28-37 26c-116-21-250 32-369 121-121 92-244 223-366 361 184 26 366-26 542-85 91-30 183-135 239-152 19-24 38-46 57-67 33-37 67-71 102-100 12-10 24-20 45 4s8 34-4 45c-33 28-65 60-96 94-32 35-62 73-92 113-6 8-13 17-24 16-60 70-151 162-172 240-57 210-25 370-122 576 71-38 128-81 175-134 53-60 94-135 128-230 37-104 95-195 167-270 75-77 165-136 261-172 15-5 30-11 41 19s-4 35-19 41c-87 32-169 86-238 157-66 68-119 151-153 247-37 102-81 183-141 250-44 50-95 91-156 127 52-3 78-10 121-7 79-6 211-66 279-119 66-51 116-120 154-206 6-15 13-29 42-16s23 27 16 42c-42 96-99 174-173 231-56 43-121 75-196 93 161-5 311-42 467-100 65-24 87-168 127-208 32-58 66-112 105-158 47-56 101-101 164-127 15-6 29-12 41 18 12 29-3 35-17 41-52 21-98 60-139 108-36 42-68 93-98 147 10 73-51 228-53 305-7 205-2 409 53 612 53-71 107-134 162-192 0-5 0-10 1-15 18-106 33-219 40-332 7-112 7-223-6-329-2-16-4-32 27-35 32-4 34 12 35 28 14 111 14 226 7 340-6 90-16 180-30 269 54-51 53-51 77-103 37-80 59-159 67-237 9-80 5-157-13-230-4-15-7-31 24-38s35 8 38 24c19 80 25 165 14 252-8 65-24 132-49 199 56-42 114-82 178-122-4-75-5-153-3-227 2-68 7-134 18-190 4-20 7-40 47-33s37 27 33 48c-9 50-14 111-16 177-2 78 0 162 4 243 5 82 49 185 125 230 103 62 158 163 186 274 16-145 17-280 3-400-17-143-55-267-114-368-8-14-16-27 12-44 27-16 35-2 43 12 63 110 104 241 122 393 17 146 13 310-13 488 102-82 381-258 352-594-7-27-16-52-28-75-7-14-14-28 14-42s35 0 42 14c17 33 30 69 39 110 5 24 8 49 11 76 13-7 45-43 51-39 24 16 58 38 80 54-21-60-35-120-42-178-10-87-5-172 14-252 4-15 7-31 38-24s27 23 24 38c-18 73-22 151-13 230 9 77 31 157 67 237 4 8 8 16 5 25 24 21 47 42 70 65-13-84-22-170-28-255-8-115-7-230 7-341 2-16 4-32 35-28s29 20 27 35c-13 106-13 217-6 329 7 113 22 225 40 332 1 2 1 5 1 7 54 59 95 120 152 196 55-203 73-407 66-612-2-76-69-227-65-302-30-55-63-107-100-151-41-49-87-87-139-108-15-6-29-12-18-41 12-29 27-24 41-18 62 26 117 71 164 127 38 45 72 98 103 154 57 7 78 179 143 212 154 57 298 94 453 100-75-19-140-50-195-93-74-57-131-135-173-231-6-15-13-29 16-42s35 2 42 16c38 86 88 156 154 206 85 66 289 124 400 127-61-37-113-78-157-128-59-67-104-148-141-250-34-95-87-179-153-247a642 642 0 0 0-238-157c-15-6-29-11-19-41 11-29 26-24 41-19 96 36 186 94 261 172 72 74 130 166 167 270 34 95 75 169 128 230 47 54 105 98 177 135-98-207-66-367-122-577-35-129-232-277-193-320 45-51 133 88 248 127 175 59 357 111 540 85-122-138-244-269-366-361-119-90-237-140-352-120-16 3-31 6-37-26-5-31 10-34 26-37 135-24 269 32 401 132 111 84 201 175 311 298-18-47 0-14-30-77-59-123-130-241-220-345-89-102-196-189-324-250-14-7-28-13-15-42 13-28 28-22 42-15 137 65 251 157 345 265 81 93 147 198 203 307-15-81-39-157-68-227-44-106-93-201-188-287-62-56-209-140-208-179-29-15-33-11-63-24-61-26-121-46-164-52-16-2-32-4-28-35 4-32 19-30 35-28 50 6 115 28 182 56 33 14 66 43 98 60 53 4 139 47 208 74 206 78 446 126 666 79-73-33-147-65-223-91-85-29-172-49-264-53-16-1-32-1-31-33s17-31 33-31c98 4 191 26 282 57 89 30 175 69 261 108 59 27 101-7 163-45-123-92-181-230-205-376l-2-2c-102-95-207-190-315-253-104-60-210-91-316-63-15 4-31 8-39-22-8-31 7-35 22-39 125-33 247 1 364 69 94 55 186 132 274 213 0-6-1-11-1-17-15-270-203-480-435-494-78-5-189 21-186-32 4-59 97-44 234-86 385-116 655-296 836-690-54 41-110 83-186 124-86 47-198 91-358 128-82 19-154 48-216 84-64 38-117 84-159 135-10 12-20 25-45 5s-14-32-5-45c47-57 106-108 177-150 67-39 145-70 233-91 155-36 261-78 343-122 51-27 92-55 131-84-148-4-305-3-459-3-143 44-289 96-402 160-110 63-186 136-192 223-1 16-2 32-34 29-32-2-31-18-29-34 8-111 97-200 224-273 69-39 149-74 233-105-35 0-70 0-104-1-116-2-112-66-20-101 90-34 190-141 251-216 271-334 412-714 456-1130-33 72-69 140-115 198-57 73-128 131-222 164-31 160-91 293-180 397-92 108-216 185-369 230-29 8-52-35-29-55 132-109 221-226 278-344 62-131 83-264 72-387-1-16-3-32 29-35 31-3 33 13 34 29 12 134-10 278-78 420-40 85-97 170-172 251 73-39 136-89 187-149 85-100 141-229 170-386 1-8 14-22 22-25 89-27 155-79 209-147 51-65 90-143 126-228-140 69-304 64-457 78-213 19-369 68-554 152z\"/>\n" +
    "<path d=\"M204649 49231c-680-88-1359-113-2041-114-684 0-1369 40-2058 112-20 6-15 33-14 46 2 28 37 35 121 27 643-60 1285-93 1932-93 674 0 1351 21 2038 102 33 9 77-85 22-81z\"/>\n" +
    "<path fill-rule=\"evenodd\" d=\"M200570 49160c683-71 1362-110 2038-110 675 0 1349 40 2025 127l31-127c-17 9-37 15-58 15a123 123 0 1 1 113-171l60-170c-724-84-1446-122-2171-122-729 0-1459 38-2193 107l58 164c22-32 59-54 101-54a123 123 0 1 1 0 246c-12 0-25-2-36-6l33 94-2 7zm3067-416a123 123 0 1 0 0 246 123 123 0 1 0 0-246zm0 64a59.1 59.1 0 0 0 0 118c32 0 59-27 59-59s-26-59-59-59zm-1082-91a123 123 0 1 0 123 123c0-68-55-123-123-123zm0 64a59.1 59.1 0 1 0 .2 118.2 59.1 59.1 0 0 0-.2-118.2zm-1064-40a123 123 0 1 0-.2 245.8 123 123 0 0 0 .2-245.8zm0 64c-33 0-59 26-59 59s26 59 59 59a59.1 59.1 0 0 0 0-118z\"/>\n" +
    "</g>\n" +
    "<path d=\"M202601 47974c-14-68-49-129-100-175-51-47-116-78-187-88-33-4-39-58-7-68 60-20 114-67 157-133 45-69 79-157 95-256 5-34 64-35 69-1 15 84 51 153 97 208 55 66 125 112 193 138 31 12 25 63-8 68-59 9-105 42-141 87-50 62-81 145-100 221-8 33-62 31-69-2zm33-118c20-52 47-103 81-146 28-34 60-64 99-84-51-30-100-70-143-120-28-34-53-73-73-116-19 59-45 112-75 158-31 47-67 86-108 116 50 19 95 47 134 82 34 31 63 68 85 110zm799 5115-515 206c-17 7-35 14-48-21-14-34 4-41 21-48l515-206c17-7 35-14 48 21 14 34-4 41-21 48zm59-326-604 328c-16 9-33 18-51-15s-1-42 15-51l604-328c16-9 33-18 51 15s1 42-15 51zm-1826-65 604 328c16 9 33 18 15 51s-34 24-51 15l-604-328c-16-9-33-18-15-51s34-24 51-15zm51 322 515 206c18 7 35 14 21 48-14 35-31 28-49 21l-515-206c-17-7-34-14-21-48 14-35 31-28 48-21zm224 434c137 33 261 48 358 31 88-16 155-60 191-146v-493c-107-1-212-15-303-41-109-31-170-98-201-178-41-107-27-235-4-329 5-18 9-36 45-27s32 27 27 45c-20 82-33 194 1 284 23 60 69 110 152 133 91 25 198 38 307 38 107 0 214-13 304-40 82-24 148-69 192-123s65-117 57-176c-5-36-24-62-49-80-34-24-82-35-128-37-47-2-94 7-142 16-25 5-50 9-77 13-19 2-37 5-42-32s14-40 32-42c23-3 48-8 73-12 52-10 105-20 159-18 60 2 121 18 168 51 42 29 72 72 80 131 11 80-16 163-73 233-53 65-131 119-229 147-83 24-178 38-274 42v483c3 5 3 11 2 16 37 82 102 125 188 141 97 18 221 2 358-31 18-5 36-9 45 27 8 37-9 41-28 45-146 35-279 51-388 32-92-17-165-58-215-132-49 74-124 115-215 132-109 20-242 4-388-32-18-4-37-8-28-45 8-36 27-32 45-27zm356 210 402-9c19 0 38-1 38 37 1 38-18 38-37 38l-402 9c-19 0-37 1-38-37s18-38 37-38zm593-3082c151-125 293-227 423-297 133-72 254-111 359-106 19 1 37 1 36 39-1 37-20 37-39 36-92-4-200 32-322 97-125 67-263 166-410 289-14 12-29 24-53-5s-9-41 5-53zm-605 56c-141-130-298-240-445-314-139-71-268-108-363-100-19 2-37 4-40-34-4-37 15-39 34-40 110-10 252 31 404 107 152 77 315 191 461 325 14 13 28 25 2 53-25 27-39 15-53 2zm-213 1004c37-83 83-155 136-219 53-63 112-119 174-170 14-12 29-24 52 5 24 29 9 41-5 53-59 48-114 101-164 160-49 59-91 125-125 201-8 17-15 34-49 19s-27-32-19-49zm371-1734c49 66 88 139 114 223 26 82 40 175 39 279 5 80 6 165-7 249-13 86-42 170-97 246-43 60-101 97-165 113-53 13-109 10-164-7 29 100 51 208 6 308-8 18-33 27-51 18-43-22-86-43-128-62s-84-36-127-51l-1-1c-95-37-173-73-236-112-65-39-115-80-150-124l1 2c-44-49-72-106-88-170-14-55-20-114-22-174-72-39-138-78-194-116-64-43-118-87-161-131-13-14-26-27 1-53s40-12 53 1c39 40 89 80 150 121 60 40 128 81 204 121 124 13 247 51 370 109 106 50 211 115 317 192 13 7 19 16 27 20 8 6 16 13 25 19 51 22 104 28 152 16 47-11 90-39 122-84 48-66 72-139 84-214 12-77 11-157 6-234v-2c1-97-12-183-35-258-24-76-58-142-102-201-11-15-22-30 7-52s41-7 52 7zm-375 1047c-104-77-207-141-311-190-105-49-210-83-314-98 2 48 8 93 18 135 13 52 35 99 71 138l1 1c30 37 73 72 130 107 60 36 134 71 225 106l-1-1c45 16 89 34 133 54 31 14 61 28 93 44 19-83-10-179-37-267-2-8-5-15-9-29zm776-1003c-44 59-79 125-102 201-24 76-36 161-35 258v2c-5 77-6 158 6 234 12 75 37 148 84 214 32 45 75 72 122 84 48 12 101 6 152-16l25-19c6-4 13-12 27-20 105-77 211-143 317-192 123-58 246-95 370-109 75-40 144-80 204-121s111-81 149-121c13-13 26-27 53-1s14 39 0 53c-43 44-97 88-161 131-57 38-122 77-194 116-2 61-8 119-22 174-16 63-44 121-88 170l1-2c-35 44-85 85-150 124-63 38-141 75-237 112l-1 1c-43 15-85 32-127 51-43 19-85 40-128 62-18 9-43 0-51-18-45-100-23-208 6-308-55 18-111 20-164 7-64-15-122-53-165-113-55-76-84-160-97-246-13-85-12-169-7-249-1-104 13-196 39-279 26-84 65-158 114-223 11-15 22-30 52-7 30 22 19 37 7 52zm940 715c-105 15-209 49-314 98-104 49-207 113-311 190-4 13-6 21-8 29-27 88-56 184-37 267 31-15 62-30 93-44 44-20 87-38 133-54l-1 1c91-35 165-70 225-106 58-34 100-70 131-107l1-1c35-39 57-86 71-138 11-42 16-87 19-135z\"/>\n" +
    "<path fill-rule=\"evenodd\" d=\"M203459 50602a216.4 216.4 0 0 0 0 433 216.6 216.6 0 0 0 0-433zm0 69c-81 0-147 66-147 147s66 147 147 147 147-66 147-147-66-147-147-147zm0 60a87 87 0 1 0 .1 174.1 87 87 0 0 0-.1-174.1zm-1697-124c119 0 217 97 217 216s-97 217-217 217a216.6 216.6 0 0 1 0-433zm0 69c81 0 147 66 147 147s-66 147-147 147-147-66-147-147 66-147 147-147zm0 60a87 87 0 1 1-.1 174.1 87 87 0 0 1 .1-174.1z\"/>\n" +
    "</g>\n" +
    "<use xlink:href=\"#a\" width=\"100%\" height=\"100%\" transform=\"rotate(-2.2 -55532.8 156275.8)\"/>\n" +
    "<use xlink:href=\"#a\" width=\"100%\" height=\"100%\" transform=\"rotate(2.2 459865.8 156275.8)\"/>\n" +
    "</g>\n" +
    "<path fill=\"#171796\" d=\"m387.2 94.9-19.3-22-25.2 14.5-4.3 51.1a219.7 219.7 0 0 1 36.2 6L387.2 95z\"/>\n" +
    "<path d=\"M347.7 98c.8-.2 1.7-.2 2.6.3.3.1.6.3.8.6.4-.3.7-.6 1.2-.8a4 4 0 0 1 1.8-1c.9-.5 1.8-.8 2.7-.9h2.8c.8 0 1.6.2 2.3.6l2 1c.8.4 1.5.8 2.2 1a9.1 9.1 0 0 0 4.5.5c.4-.2.7.1.2.4-3.3 2-5.9.2-8.1-.6a16.2 16.2 0 0 1 2.1 1.7c.8.8 1.8 1.6 3.5 2.4a8.4 8.4 0 0 0 5 .7l.4.1-.1.5a4.8 4.8 0 0 1-2.6.7 10 10 0 0 1-5.2-1.3c-1.4-.7-2.3-1.6-3.3-2.4a7.5 7.5 0 0 0-3-1.4 6 6 0 0 0-2.9 0c.3.1.5.2.6.4.5.3 1 .4 2 .5.4 0 .2.3-.5.7a2 2 0 0 1-1.6.8c-1 .6-1.3.2-1.7-.2 0 .3 0 .5-.2.8a.6.6 0 0 1 0 .4l.2.7c0 .2 0 .3.2.4.2.2.3.4.3.7 0 .2.1.3.3.4l.6.6c.6.2.8.7 1 1.2.4.2.6.5.7.9.2 0 .4.2.6.4l2.6.1c.8.1 1.4.6 2 1.2h1.2a4 4 0 0 1 1.3-.3h2.3c.5.2.9.4 1.2.8.5.5 1.2.4 1.8.2a2.7 2.7 0 0 1 2.4 0 2.3 2.3 0 0 1 1-.2c.4-.3.7-.4 1-.4.6 0 1 0 .9.8 0 .2-.2.4-.3.4-.3.6-.7.7-1.3.7-.1.4-.3.7-.5.8.3.9 0 1.3-.7 1.2 0 .3-.3.4-.6.4a1.4 1.4 0 0 1-1 .5l.4.6c.4.7-.2 1-.8 1v1.2c.7.4.8.8.2 1.2.4.7.3 1.3-.5 1.6 0 .4 0 .8-.3 1-.2.2-.5.3-.3.6.3.5.2 1.1-.2 1.2l-.2.1-.2.2a9.6 9.6 0 0 0-1.5 1c-.1 0-.2.1-.2 0a9.6 9.6 0 0 1-1.8 2.4c0 .5-.4 1-1 1.1a.4.4 0 0 1-.3.4c.3.3.5.6.2 1a3 3 0 0 1-1.3.8c-1 .3-1.7.2-2-.2-.4-.3-.3-.6 0-.7-.7 0-.8-.2-.8-.7 0-.2.1-.2.3-.1.4 0 .7-.2 1-.3l.5-.6c0-.7.5-1 1.1-1.3.5-.2 1-.6 1.4-1.2l.9-1.5a1.2 1.2 0 0 1-.3-.7 1.5 1.5 0 0 1-.5-.6c-.5 0-.7-.2-.7-.5a1.1 1.1 0 0 1-.3 0c-.3.1-.5.3-.7.2a6.9 6.9 0 0 1-1.1 1c-.2.3-.4.5-.7.5-1 .1-1.5 1.2-2 1.7-.2.1-.3.4-.4.7 0 .6-.1 1-.4 1h-.4a1.2 1.2 0 0 0-.4 0c.3.3.3.6 0 .9-.1.3-.4.4-.8.4a3.6 3.6 0 0 1-1.6-.2c-.4-.2-.5-.5-.5-.7-.3-.2-.4-.3-.3-.5 0-.2.2-.3.4-.2l.6-.2a5.2 5.2 0 0 1 1.8-1.4 3 3 0 0 1 .7-.7c0-.5.5-1 1-1.4l.1-.6v-.3c-.2-.3-.3-.7-.1-1a1.3 1.3 0 0 1 0-.6c-1.1.6-1.5.4-1.6-.1-.4.3-.8.5-1 0-.4.1-.8.3-1.2.1l-.8.2-.4.7c0 .5-.2 1-.5 1.5a9.3 9.3 0 0 1-.7 1.5 1 1 0 0 1-.1.5c0 .6-.2.9-.5 1a2.4 2.4 0 0 1-.4.8v.2c.1.3.1.7-.2 1l-1 .6h-1c-.4-.3-.4-.4-.3-.6a.6.6 0 0 1-.5 0l-.4-.3c-.1-.2-.1-.4.1-.5l.9-.6c0-.2.2-.3.4-.4.2-.4.4-.6.6-.7l.7-1.5c.1-.1.2-.3.1-.4l.1-.3s.2-.1 0-.2a1.4 1.4 0 0 1 .2-1.2c.3-.4.6-1.4.3-2v-.8h-.3c-.2-.2-.4 0-.6.2l-.4.6c-.1.8-.5 1.5-1 1.6v1.2c0 .4 0 .7-.2.7s-.4.2-.5.5a1 1 0 0 0-.1.3c.3.3.2.7-.1 1-.6.6-1.4.5-2.2.3-.6-.3-.8-.5-.7-.8-.8 0-.7-.7 0-.9.8-.2 1.4-.7 1.9-1.4 0-.8.2-1.3.7-1.4 0-.5.2-1 .4-1.4.2-.4.3-.8.2-1.3-.4-.3-.4-.6 0-1 .1 0 .1 0 0-.2-.3 0-.3-.3-.3-.5s0-.2-.2-.2c-.6-.1-.5-.4-.2-.7.1 0 .2-.3 0-.4l-.1-.4c-.4-.3-.2-.6 0-.9l-.4-.8c-.7 0-1-.4-.6-.9a3.4 3.4 0 0 1 .7-.6c.1-.3.3-.6.2-.8-.2-.6.5-1 1-1.4a.9.9 0 0 1-.1-.4c-.3-.3-.2-.6.1-.8a1 1 0 0 1-.1-.5c-.8.2-.8-.3-.4-1-.5-.3-.4-.8.5-1.5a1 1 0 0 1 0-.4 2 2 0 0 0-1 .3c-.3.3-.6.2-.9.1a1.5 1.5 0 0 0-.4-.4.6.6 0 0 1-.2-.6c-1 0-1.1-.7-.6-1 .3-.3.6-.6.7-.9.2-.6.7-1 1.3-1.5v-.5a1.6 1.6 0 0 0-.7-.3 1.2 1.2 0 0 0-.6-.7c-.1 0-.2-.2 0-.4-.6-.4-.5-.7-.3-1z\"/>\n" +
    "<g fill=\"#f7db17\">\n" +
    "<path d=\"M364.5 122a1.4 1.4 0 0 1-.2 0 8.4 8.4 0 0 1-.8.7c-.2-.3-.5 0-.2.1l-.2.2c0 .3-.2.4-.5.4h-.1a3 3 0 0 1 0-.3 3.5 3.5 0 0 1 0-.4 3.9 3.9 0 0 0-.1.4 2.8 2.8 0 0 0 0 .4c-.8.3-1.3 1.1-1.9 1.7l-.4.8c0 .2 0 .9-.3.9h-.2c0-.1-.2-.1-.4 0h-1c-.2.2.4.2.7.3.1.1.2.3.1.5-.2.7-1.8.5-2.3.2-.2-.1-.2-.3-.2-.5h.3c.2 0 .4 0 .5-.2 0 0 .1 0 0-.1 0-.1 0-.1 0 0a1.3 1.3 0 0 1-.5 0 2.6 2.6 0 0 1-.5 0h-.2c0-.1.2 0 .2 0l.7-.3a5.3 5.3 0 0 1 1.9-1.4l.8-.7c0-.7.4-1 .8-1.5l.3-.7v-.3c-.2-.4-.3-.7-.1-1a1.5 1.5 0 0 1 0-.8.3.3 0 0 0 0-.1 6.2 6.2 0 0 1 .8-.6v.8a1.3 1.3 0 0 0-.2.3.5.5 0 0 0 0 .2v.1a.4.4 0 0 1 0-.3l.3-.2.7-.4.7-.6v1l-.6.7v.1h.1a2.3 2.3 0 0 1 .5-.7 3.2 3.2 0 0 1 1-.6v1a1.5 1.5 0 0 0 .5.9z\"/>\n" +
    "<path d=\"m349 113 .2-.2.4-.6a4 4 0 0 1 .5-.6 4 4 0 0 0-.4.7 5.8 5.8 0 0 0-.4.5v.2c.1.3.1.5.3.7l.3-.4a1.6 1.6 0 0 1 .4-.4 1.8 1.8 0 0 0 .5-.6h.1l-.2.4a2 2 0 0 1-.3.3l-.4.3a1.3 1.3 0 0 0-.2.4v.3c-.2.3-.5.5 0 .7a.6.6 0 0 0 .1.5l-.1.7c-.3.2 0 .2.1.2l.4-.4a4.3 4.3 0 0 1 .3-.4l.4-.5.1-.5h.1a1.4 1.4 0 0 1-.1.6 2 2 0 0 1-.5.5 3.8 3.8 0 0 0-.2.4 2.6 2.6 0 0 0-.3.4c.2.1.2.4.2.7h.1l.2-.2.2-.4h.1l-.2.4-.2.3c.2.1.2.3 0 .5-.4.3-.3.4 0 .7v1.2l.1.3h-.1v-.3c-.4.7-.6 1.1-.7 1.8-.6.1-.5.8-.6 1.3a3.9 3.9 0 0 1-1.9 1.5c-.1 0-.5.1-.5.3 0 .1.2.3.4.2.4-.5.7-.2.2.2v.3c.5.4 1.6.5 2.2.2.3-.3.5-.5.2-.9 0-.5.2-1 .8-1.2v-.4l.1-1.3.2-.1c.2 0 .6-.7.7-1.3v-.4c.1-.2.2-.2.3 0 0-.2 0-.3.2-.4.2-.3.5-.6.8-.4a3 3 0 0 1-.1-.8 2.7 2.7 0 0 1 0-1l.2-.2.3-.7.3-.7h.1l-.3.7-.3.8v.1a2.5 2.5 0 0 0-.1 1l.2.9.2.4v.6c.4.6 0 1.7-.3 2.2a1 1 0 0 0-.1.8c.2.2 0 .4-.1.6v.1c0 .2 0 .4-.2.5l-.7 1.6c-.4.1-.5.3-.6.7-.3.1-.3.2-.4.4a2.7 2.7 0 0 1-.9.6c-.3.1 0 .2.2.4.2.1.4-.2.6-.4.2-.3.3-.2.2 0a2 2 0 0 0-.2.7l.7.3c.4 0 .9-.4 1.2-.6.3-.2.2-.5.1-.8a2 2 0 0 1-.5 0 3.4 3.4 0 0 1-.5-.3 2.8 2.8 0 0 0 1 .2v-.3a2.7 2.7 0 0 0 .5-.8c.4-.2.4-.4.4-.9l.1-.5a10 10 0 0 0 .7-1.6c.4-.4.5-.9.5-1.4 0-.2.1-.3.3-.3a3.8 3.8 0 0 0 .3-.5l.1-.4a.8.8 0 0 1 .2-.2 1 1 0 0 0 0-.5 1.1 1.1 0 0 0-.1-.4.5.5 0 0 1-.1-.2v-.2h.1c.1 0 0 0 0 0v.1a.5.5 0 0 0 0 .2c.2.2.2.3.2.5a1 1 0 0 1 0 .5.7.7 0 0 0-.2.2 1.7 1.7 0 0 0 0 .3l.6-.1.4-.5.2-.6c.1 0 0 0 0 0a2 2 0 0 1-.1.7l-.3.3c.4.2.7 0 1 0V119l.4-.7c.1 0 .1 0 0 0l-.2.8v1c.1.4.2.5.5.3l.4-.2v-.1a18.2 18.2 0 0 1 1.8-1.6c.1.1 0 .1 0 .1a6.5 6.5 0 0 0-.8.7l-.8.7v.3c0 .3.1.5.6.3l.6-.2a1.3 1.3 0 0 1 .3-.2 8 8 0 0 1 .5-.3l.5-.3a3 3 0 0 1 .1-.6l.7-1.3a2.3 2.3 0 0 0 1.1-1.1h.1l-.4.7a2.5 2.5 0 0 1-.7.5l-.7 1.2a2.7 2.7 0 0 0-.1.5v.1a2.8 2.8 0 0 0 0 .8c.2 0 .4 0 .7-.3l.7-.7a1.7 1.7 0 0 1 .2-.5 1 1 0 0 1 .4-.4h.1v.1a.9.9 0 0 0-.4.3 1.7 1.7 0 0 0-.2.5v1.1l1-.5v1c0 .3.2.6.4.8a2.8 2.8 0 0 1 .5-.6l.3-.3.2-.2.3-.2-.2.3-.2.2-.3.2v.5h.6c0 .5 0 .6.5.6a3.2 3.2 0 0 1 0-.5l.1-.5h.1a1.9 1.9 0 0 0-.1.5 3.1 3.1 0 0 0 0 .5c.2.3.3.4.7.6l.2-.5a1.4 1.4 0 0 0 0-.4h.1v.5l-.3.5v.5a3 3 0 0 1 .2-.3l.3-.4c.1 0 .1 0 0 0 0 .2 0 .3-.2.4a4 4 0 0 0-.2.4l.2.2c-.6 1-1.3 2.5-2.5 3-.6.2-.9.5-1 1.2a1 1 0 0 0-.5.6l-1.2.3c0 .3 0 .4.3.4l.7-.3c.1 0 0 .5-.5.8v.1c.4.6 1.4.4 1.9.3.4 0 1-.5 1.2-.9.1-.2 0-.4-.2-.6-.8.1-.6-.6 0-.3.2 0 .3 0 .3-.3.6-.2.9-.5 1-1 .6-.7 1.2-1.4 1.6-2.1.1-.2.2-.4.1-.5a1 1 0 0 0 .2-.5l.1-.4h.1v.5a4.5 4.5 0 0 1-.2.3c0 .1 0 .2.2.2l1.5-1c0-.3.2-.4.4-.4l.2-.1c.1-.4 0-.6-.2-.8-.1-.4.1-.5.4-.7.2-.2.2-.7.2-1v-.2a2.6 2.6 0 0 0 0-.3l.1.3v.1c.3-.1.6-.3.7-.6 0-.3-.1-.6-.3-.8a9.6 9.6 0 0 1-.6.2 10.2 10.2 0 0 0 .7-.4 1.3 1.3 0 0 0 .3-.2c.2-.3-.3-.5-.5-.6l-.7-.7v-.1l.7.6v-1.1l-.2-.4a1.1 1.1 0 0 1-.5-.4 1 1 0 0 1-.1-.5l.2.4.4.4h1c.3-.3-.2-.7-.3-.9l-.1-.5h.1a1 1 0 0 0-.2-.2.6.6 0 0 0-.1 0v-.2a.7.7 0 0 1 .2.1l.2.2a.9.9 0 0 0 .1 0c.3 0 .5-.2.7-.5a3.6 3.6 0 0 0-.3-.4 10 10 0 0 0-.5-.3v-.1h.1a4 4 0 0 1 .8.8c.4 0 .4 0 .6-.3a1.5 1.5 0 0 0-.2-.4 2.5 2.5 0 0 0-.3-.4c0-.1 0 0 0 0 .2 0 .3.2.4.3l.2.5.4-.1c.3-.2 0-.8 0-1a2.8 2.8 0 0 0-.1 0l-.2-.2c0-.1 0 0 0 0h.2l.2.1.4-.6c0-.4 0-.2.5-.3.4 0 .6 0 .9-.6.1 0 .2 0 .2-.3s0-.4-.3-.4c-.5 0-.8 0-1 .3v.3c0 .1 0 0 0 0l-.2-.2c-.4 0-.7 0-1.1.2h-.2l.2.3.1.4a1 1 0 0 0-.2-.4 1.8 1.8 0 0 0-.3-.4 2.6 2.6 0 0 0-1-.2l.2.1.2.2v.1a7.7 7.7 0 0 1-.2-.2 6.5 6.5 0 0 1-.2-.2 2.7 2.7 0 0 0-.9.2l-.6.2.4.5.2.6a2.1 2.1 0 0 0-.3-.6 1.9 1.9 0 0 0-.4-.4 1.8 1.8 0 0 1-.5 0l.2.3-.3-.4a1.4 1.4 0 0 1-.5-.2 8.3 8.3 0 0 1 .2 1.5 7.8 7.8 0 0 0-.2-.9 4.7 4.7 0 0 0-.1-.7 1.7 1.7 0 0 1-.2-.2 2.1 2.1 0 0 0-.6-.4 1 1 0 0 1-.2.7c-.1 0 0 0 0 0a.8.8 0 0 0 .1-.8 3.1 3.1 0 0 0-1-.2 5.3 5.3 0 0 1 .5.8l.3.5v.5a2 2 0 0 0-.1-.5.7.7 0 0 0-.3-.4 5.6 5.6 0 0 0-.3-.5 4.6 4.6 0 0 0-.3-.4h-.4.1a.6.6 0 0 1 0 .3.5.5 0 0 0 0-.2.7.7 0 0 0-.2-.1h-.8a5 5 0 0 1 1 2.3 4.8 4.8 0 0 0-.4-1.2 5.1 5.1 0 0 0-.7-1h-.6a1.7 1.7 0 0 1 .4.4c0 .1 0 .1 0 0a1.6 1.6 0 0 0-.3-.1 2.4 2.4 0 0 0-.3-.2 5 5 0 0 0-.3 0l-.1.1a4.7 4.7 0 0 1 1 1.1c0 .1 0 0 0 0a3.8 3.8 0 0 0-.6-.6 4.7 4.7 0 0 0-.6-.4h-.6a5 5 0 0 1 .5 1.7h-.1a3.5 3.5 0 0 0-.2-.8 6.2 6.2 0 0 0-.3-.9 8 8 0 0 1-.4 0 9.1 9.1 0 0 1 .3 1.6v.1a9.3 9.3 0 0 0-.2-1 9.3 9.3 0 0 0-.3-.8 3.9 3.9 0 0 0-1.3-1 1.7 1.7 0 0 1 .4 1.1v.1a1.6 1.6 0 0 0-.2-.7 1.7 1.7 0 0 0-.4-.6 2 2 0 0 0-.3 0 15.6 15.6 0 0 0-1 0c.2.1.4.4.4.6 0-.2-.3-.5-.6-.7h-.6l.3.3.2.5.2.6.4.4s.1 0 0 0c0 .1 0 .1 0 0a1.1 1.1 0 0 1-.5-.3 1.5 1.5 0 0 1-.2-.7 1.3 1.3 0 0 0-.2-.4 2.7 2.7 0 0 0-.3-.4h-.7l.2.8.1 1h-.1a7.1 7.1 0 0 0 0-1 4.5 4.5 0 0 0-.3-.8 1 1 0 0 0-.6-.5.6.6 0 0 1 0 .3h-.1a.5.5 0 0 0 0-.3c-.2-.5-.3-.7-.6-.8v.4l-.2.4h-.1l.1-.5v-.4c0-.6-.2-1-.8-1.2v.2l-.1.5h-.1v-.5a1.9 1.9 0 0 0 0-.3l-.5-.5a2.3 2.3 0 0 1 0 .7 3 3 0 0 1-.4.8h-.1a3 3 0 0 0 .3-.8 2.2 2.2 0 0 0 .1-.8 1 1 0 0 1-.2-.3v.2h-.1v-.2l.1-.1v-.1a.7.7 0 0 0-.3-.5 1.5 1.5 0 0 1-.2.5h-.1c-.1 0 0 0 0 0l.1-.3.1-.3a1 1 0 0 1-.1-.2.8.8 0 0 1-.1.2 1.2 1.2 0 0 1-.2.2c-.1-.1 0-.1 0-.1l.1-.2a.7.7 0 0 0 .1-.2v-.2c0-.3 0-.4-.2-.7a.9.9 0 0 0-.3 0 2.8 2.8 0 0 0-.5.4v-.1a3.2 3.2 0 0 1 .4-.3.9.9 0 0 1 .4-.1.4.4 0 0 0 0-.2l-1 .3a1.6 1.6 0 0 1-.9-.2h.8c.3 0 .7 0 1.1-.2l.2-.6a1.7 1.7 0 0 1-.5 0l.6-.1v-.2c0-.2.3-.2.4 0 .2 0 .3.2.4.3.3.2.6 0 .9-.2h-.2v-.1h.3c.6 0 1 0 1.4-.5a7 7 0 0 1-1 0c-.2 0-.4 0-.6-.2l.7.1h1l.5-.3a5.4 5.4 0 0 1-2-.6 1.4 1.4 0 0 0-.6-.3c-.5 0-1 0-1.4.3l-.3-.3-.4-.2h-.6s-.1 0 0 0h1.2a4.5 4.5 0 0 1 1.7-.3 5.7 5.7 0 0 1 1.7-.2v-.2c.3-.3.4-.6.3-.9-.1-.2-.4-.5-.8-.7h-1.3a4 4 0 0 0-.8.1l.6.4.4 1v.1h-.2a2 2 0 0 0-.4-1c-.1-.2-.6-.3-.7-.4l-1.3.2-.7.4c.3-.1.6 0 .8 0 .3.2.5.4.6.8v.1h-.2a1 1 0 0 0-.5-.7c-.4-.2-1.2 0-1.6.3a4.2 4.2 0 0 0-.6.6h-.2v-.2l.7-.6.7-.4a2 2 0 0 1 1-.5l1.3-.2a1 1 0 0 0-.5-.5 1.4 1.4 0 0 0-.8 0c-.5.1-1 .4-1.5.7h.5l.1.2h-.5a1.4 1.4 0 0 0-.4 0l-1.5 1.2c-.5 0-.8 0-1 .2l-.1.6-.2.7c-.5.5-1 .9-1.3 1.5a1.4 1.4 0 0 1-.3.5.5.5 0 0 1 .3.1v-.2l.2-.4h.1a1.2 1.2 0 0 0-.1.4v.5h-.2a.3.3 0 0 0-.1-.2.5.5 0 0 0-.3 0l-.3.2-.2.3c0 .3.2.3.5.3.6 0 .1.4.4.7l.5.4h.5c0-.4 0-.6.2-.6a.8.8 0 0 1 .2-.4.8.8 0 0 0 0 .2.8.8 0 0 0-.1.2v.4a2.4 2.4 0 0 1 1-.2c.7-.8 1-.6.4 0l-.1.2a1.4 1.4 0 0 0-.2.6c-.2.1-1 .8-.7 1 .2 0 .4 0 .3.2-.1.2-.4.6-.3.9h.3a6.2 6.2 0 0 0 .7-.6 3.8 3.8 0 0 0 .5-.8h.1a9 9 0 0 1 .3-.8c0-.2.1-.5.3-.7l.3.3a.4.4 0 0 0 .2 0 .4.4 0 0 0 .3 0l.2-.3h.1a1.2 1.2 0 0 1-.3.4.5.5 0 0 1-.3 0 .5.5 0 0 1-.2 0 1.1 1.1 0 0 1-.3-.3 12 12 0 0 0-.5 1.4v.1a5.6 5.6 0 0 1-1.2 1.4l.2.5 1-1 .8-1a6 6 0 0 1-.3.6v1.1h-.1v-.9l-.3.3a11.6 11.6 0 0 1-1 1c-.3.3-.6.3-.2.7l.3-.3.4-.3h.1v.1l-.4.3-.4.3a.6.6 0 0 0 .1.3.5.5 0 0 1 .1 0l.8-.6c.1 0 0 .1 0 .1l-.7.6a.7.7 0 0 1-.1 0c-.3.3-1.2.8-1 1.2l.6-.2.6-.5c.1 0 0 0 0 .1a2.5 2.5 0 0 1-.6.5v.2-.1a3.6 3.6 0 0 1-.7.1c.1.4 0 .7-.3 1 0 .1-1 .9-.6 1a1 1 0 0 0 .3.2z\"/>\n" +
    "<path d=\"M349.4 100.1a2.2 2.2 0 0 0-.6-.3 1.4 1.4 0 0 0-.5-.5c-.2-.2-.2-.1-.1-.3l.2-.1a.9.9 0 0 1 .3 0 .4.4 0 0 1 .2.2h.1c.1 0 0 0 0 0a.5.5 0 0 0-.2-.2 1 1 0 0 0-.4-.1.7.7 0 0 0-.4 0l-.2-.5.4.1.2.1a.7.7 0 0 0-.2-.2 2 2 0 0 0-.2 0 2.9 2.9 0 0 1 2.1.2c.4.1.6.3.8.6l-.2.2c-.5 0-.8 0-1 .2-.2.1-.2.4-.2.6z\"/>\n" +
    "</g>\n" +
    "<path d=\"m365 121.8-.4.2c0-.3.2-.4.3-.6v.2l.1.2zm2 4.2a2.3 2.3 0 0 1-.4.4 4 4 0 0 1-.5.4v-.1l.4-.4.4-.4zm1.3-1.6-.2.3h-.1l.2-.3zm-.7 0a1.1 1.1 0 0 1-.2.3 1 1 0 0 1-.5.4v-.1a1 1 0 0 0 .4-.3 1 1 0 0 0 .1-.4h.1zm1.2-1.6a1 1 0 0 0-.1.2 1.1 1.1 0 0 0-.1.2h-.1a1.1 1.1 0 0 1 .3-.5zm1 0v.5l-.3.5c-.1 0 0 0 0 0l.1-.5.2-.5zm-.4-6c.3.5.4 1 .4 1.5a7.3 7.3 0 0 1 .1-.6 1.4 1.4 0 0 0 .3-1.1c0-.1.1 0 .1 0v.6a1.7 1.7 0 0 1-.3.6l-.2 1h-.1v-.1c0-.6 0-1.2-.4-1.8v-.1zm-.8 1v.3h-.1v-.4h.1zm-.2 1.4a6.2 6.2 0 0 1 .2 1.4 1 1 0 0 1 .1-.1l.3-.3h.1a1 1 0 0 0-.3.3.7.7 0 0 0-.2.4 5 5 0 0 0-.1-.9 5.9 5.9 0 0 0-.2-.8zm1 .5a3.6 3.6 0 0 1 .1 1.2v-.6a3.6 3.6 0 0 0-.1-.6zm1-.2v.6a1.5 1.5 0 0 1 0 .5 1.2 1.2 0 0 0 0 .6l.1.6a2.5 2.5 0 0 1-.3-.6 1.3 1.3 0 0 1 0-.6 1.4 1.4 0 0 0 .2-.5 2.3 2.3 0 0 0 0-.6zm.5-1.5-.1.3v.2h-.1v-.6h.1zm-.5-2.6v.2c.1 0 .1 0 0 0 0 .1 0 0 0 0v-.2s-.1 0 0 0c0-.1 0 0 0 0zm.2-2v.8a.8.8 0 0 0-.2.3 1.4 1.4 0 0 0 0 .6h-.1a1.4 1.4 0 0 1 0-.6.9.9 0 0 1 .3-.4v-.7zm-2-.7c.4.2.6.4.8.7.2.2.3.5.3.9l-.6-.2v1.8c-.2.5-.5.8-1 1a3.8 3.8 0 0 0 0-1.8h.1a3.6 3.6 0 0 1 0 1.6 1.5 1.5 0 0 0 .7-.8 3.7 3.7 0 0 0 .1-1.9l.6.2c0-.3-.1-.5-.3-.8a2.5 2.5 0 0 0-.7-.6v-.1zm5.2-1v.2h-.1v-.2s0-.1 0 0h.1zm-1.2 0 .3.1a.8.8 0 0 1 .1.2v.1a.8.8 0 0 0-.2-.2.6.6 0 0 0-.2-.2zm-1.8.5.3.5v.6c-.1 0-.1 0 0 0l-.1-.6a1 1 0 0 0-.3-.5h.1zm-6 .5v.4l-.1.1v-.5zm1-.6.2.4v.1h-.1v-.1l-.1-.3zm2.4 1.6v.1a1.1 1.1 0 0 1 0 .2.8.8 0 0 0 0-.2.6.6 0 0 0-.1 0v-.1zm.8-1.8v.2a.2.2 0 0 1 0 .2.1.1 0 0 0 0-.2c-.1-.1-.1-.1 0-.1zm-5.5.3a1 1 0 0 0 .2.7c.2.1.2.3.3.4v.4h-.1v-.4a.9.9 0 0 0-.2-.3 1 1 0 0 1-.2-.4 1.1 1.1 0 0 1-.1-.4zm2.2 1.5.2.7v.7c0 .3 0 .6.2.8l.6.7a2.9 2.9 0 0 1-.1-1l.3-1c.2 0 .2-.2.3-.3v-.4h.1v.4a1.5 1.5 0 0 1-.3.5 1.6 1.6 0 0 0-.3.9c0 .3 0 .6.2 1h-.1c-.4-.2-.6-.5-.8-.8a1.3 1.3 0 0 1-.2-.8v-.7a1.8 1.8 0 0 0-.2-.6c0-.1.1 0 .1 0zm-.9 1.4c0 .2 0 .5-.2.7a3.4 3.4 0 0 1-.4.6h.3a2.2 2.2 0 0 0 .7-.6l.3-.3c.1 0 0 0 0 0a3.6 3.6 0 0 1-.2.4 2.5 2.5 0 0 1-.3.2 24.5 24.5 0 0 1 0 .4v-.2a1.5 1.5 0 0 0-.1-.1 2.2 2.2 0 0 1-.4.2l-.4.2v-.1l.4-.7.2-.7h.1zm-1 0v.1h-.1c-.1 0 0 0 0 0v-.2z\"/>\n" +
    "<path d=\"M363 113.7c.2.3.2.6.2 1a1.9 1.9 0 0 1-.4.8 1.9 1.9 0 0 0-.5.6 2.6 2.6 0 0 0-.2.6l.2-.3.5-.3a4.6 4.6 0 0 0 1.1-.9h.1c.1 0 0 0 0 0a4 4 0 0 1-1.2 1 1 1 0 0 0-.4.3 2.3 2.3 0 0 0-.4.5c0-.4 0-.7.2-1l.5-.6.4-.8c0-.3 0-.6-.2-.9h.1zm2.3 3.5.1.4.1.1c.2.3.3.5.3.8l-.1 1h-.1a1.8 1.8 0 0 0-.4-1 3.4 3.4 0 0 0-.8-.6v-.1c.4.2.7.4.9.7l.3.6a3.4 3.4 0 0 0 0-.6 1.3 1.3 0 0 0-.1-.7l-.1-.2c-.2-.2-.3-.3-.2-.4zm1 0 .1.2c0 .1 0 0 0 0h-.1l-.2-.2h.1zm1 .3-.2.7-.2.7.2-.7.2-.7zm.7 4v.1a.3.3 0 0 1 0-.2zm-.7-1.2v.3l-.2.4v-.4l.1-.4h.1zm-1 0h.1v.1h-.1v-.1zm-1.1-.6a7.3 7.3 0 0 1-.1.2v.2h-.1a5 5 0 0 1 0-.2 5 5 0 0 1 0-.2h.1c.1 0 0 0 0 0zm-1.7 1.8a.7.7 0 0 0-.1.2 1.3 1.3 0 0 0 0 .2s-.1.1-.2 0v-.2a.8.8 0 0 1 .2-.3h.1zm-4.8 4.6a.7.7 0 0 1 0 .2 1.1 1.1 0 0 1-.2.1c-.1 0-.1 0 0 0a.8.8 0 0 0 .1-.3h.1zm.8-.4a.3.3 0 0 1-.1.2.6.6 0 0 1-.2 0 .4.4 0 0 0 .1-.1.3.3 0 0 0 0-.1h.2zm1-.6a.5.5 0 0 1 0 .1.5.5 0 0 1-.2.1.4.4 0 0 0 0-.2h.2zm1.5-3.8-.1.4a1.4 1.4 0 0 0 0 .4h-.1a1.4 1.4 0 0 1 0-.4v-.5h.1zm1-10.3a.9.9 0 0 1-.1.3 1.4 1.4 0 0 1-.2.3h-.1l.2-.3a.8.8 0 0 0 0-.3l.1-.1zm-1-1a1.9 1.9 0 0 1 .1 1 1.8 1.8 0 0 0 0-.5 1.5 1.5 0 0 0-.2-.4c0-.1 0 0 0 0zm-1.4 1.7a1.5 1.5 0 0 1-.4-.4.7.7 0 0 1-.1-.4l.2.4.3.4zm1.5 2.6v.2h-.1v-.2zm-2-2 .6 1 .1.8c.2 0 .3-.1.4-.3v-.9a1.9 1.9 0 0 0 .3-.6 3.5 3.5 0 0 0 .1-.5h.1l.4.8.3.9h-.1a2.9 2.9 0 0 0-.3-.9 3.9 3.9 0 0 0-.3-.6 2.9 2.9 0 0 1 0 .4 2 2 0 0 1-.3.5l-.1 1-.4.3v.4h-.1c0-.4 0-.8-.2-1.2a2 2 0 0 0-.5-1zm1.2 5v.3l-.1.4h-.1v-.8h.1c.1 0 .1 0 0 0zm-2.2.9v.3l-.1-.3c0-.1.1 0 .1 0zm1.9-2.5a2.3 2.3 0 0 1-.2.6l-.3.5a1.1 1.1 0 0 0-.3.6 1.8 1.8 0 0 0 0 .7c0 .1 0 0 0 0a1.9 1.9 0 0 1-.1-.7c0-.2.1-.5.3-.7a2.1 2.1 0 0 0 .3-.5 2.1 2.1 0 0 0 .2-.6c.1 0 0 0 0 0zm-.5-.8v.6a2.2 2.2 0 0 1-.5.6 1.8 1.8 0 0 0-.4.5l-.2.5h-.1l.2-.6.5-.5a2 2 0 0 0 .3-.5 1 1 0 0 0 .1-.6h.1zm-2.4 1.2c0 .4 0 .7-.2 1-.1.3-.3.6-.6.8h-.1v-.1c.3-.2.5-.5.6-.8.2-.2.2-.6.2-1zm-3 1.7v.2l.1.1v.1h-.1l-.1-.2v-.2s-.1 0 0 0zm-1.3 0a2.7 2.7 0 0 0 0 .7l.4.6.1.5v.4l.4-.5a1.4 1.4 0 0 0 .2-.6 1.6 1.6 0 0 1 0 .6l-.5.6h-.1a3.3 3.3 0 0 0 0-.5 1.8 1.8 0 0 0-.2-.4 2 2 0 0 1-.3-.7 2.7 2.7 0 0 1-.1-.7zm.2 4.2a2.6 2.6 0 0 1 .1-.8h.1a2.5 2.5 0 0 0-.1.8h-.1zm-.2 1.1v-.4s0-.1.1 0v.4zm-.8 2 .2-.3.2-.3h.1a4 4 0 0 1-.2.4l-.2.2c-.1 0-.1 0 0 0zm-1.1-6.6v.2h-.1v-.2zm-2 4.5a2.9 2.9 0 0 0 0-.1v-.2h.1v.3zm5-8-.3 1c0 .3.1.6.3.7.3.2.4.4.5.7v-.4c.1-.1.1-.3 0-.4h.1a2.7 2.7 0 0 1 0 1h-.1a6 6 0 0 1 0-.2l-.5-.6c-.3-.2-.4-.4-.4-.8l.2-1h.1zm-.4-1.3a2.5 2.5 0 0 1 0 .8 4 4 0 0 1-.3.7 2.4 2.4 0 0 0-.2 1c0 .4.1.7.3 1v.1a2.5 2.5 0 0 1-.2-2.1 3.8 3.8 0 0 0 .2-.7c0-.3.1-.5 0-.8h.1c.1 0 0 0 0 0zm-2.3 3.3a.8.8 0 0 0 0 .4l.1.5c0 .1 0 0 0 0a1.5 1.5 0 0 1-.3-.5.9.9 0 0 1 .1-.5h.1zm-1-.4v.3a.9.9 0 0 1 0 .3.4.4 0 0 0-.1.3l.1.2v.1a.8.8 0 0 1-.2-.3.5.5 0 0 1 0-.4.8.8 0 0 0 .1-.2v-.3h.1zm5.8-8.6a2.3 2.3 0 0 0 .3 1.5 2.6 2.6 0 0 1-.4-.7 2.3 2.3 0 0 1 0-.8h.1zm-.7.7a4 4 0 0 1 .5 1.7h-.1a3.8 3.8 0 0 0-.5-1.6v-.1zm-3.6.1c-.4.5-.5 1-.6 1.3l.2.9.2.8a2.6 2.6 0 0 1-.2.8c-.1 0 0 0 0 0v-.8a2.3 2.3 0 0 0 0-.8 1.7 1.7 0 0 1-.3-1c0-.3.2-.7.6-1.2.1 0 0 0 0 0zm3.3-1.4v.5l-.4.4a.8.8 0 0 0-.3.4v.7c0 .1 0 0 0 0a1.9 1.9 0 0 1 0-.7 1 1 0 0 1 .3-.5 1 1 0 0 0 .3-.4.6.6 0 0 0 0-.4h.1zm-3.5.3v.7c0 .2-.2.4-.4.6a1.2 1.2 0 0 0-.4.6 2.9 2.9 0 0 0-.1.7h-.1a3 3 0 0 1 .1-.8c0-.2.2-.4.4-.6l.4-.6a1 1 0 0 0 0-.6zm2 .1a.8.8 0 0 0 0 .2.5.5 0 0 0 .1.3.6.6 0 0 1-.2-.2.8.8 0 0 1 0-.3h.1zm0-.5a.8.8 0 0 0-.5.4l-.2.7.2.5v.7a2.4 2.4 0 0 0 0-.7l-.3-.4a2 2 0 0 0-.5 1.2c0 .5.1 1 .5 1.5h-.1a2.7 2.7 0 0 1-.5-1.5c0-.5.2-.9.6-1.3 0-.3 0-.6.2-.8a1 1 0 0 1 .5-.4zm-.7-.8v.1c0 .3 0 .6-.2.7a.8.8 0 0 0-.2.3 1.6 1.6 0 0 0-.1.4h-.1a1.7 1.7 0 0 1 0-.4 1 1 0 0 1 .3-.4c.2-.1.2-.4.2-.6a2.7 2.7 0 0 0 0-.1h.1zm5.7 6 .1.5v.4a1.4 1.4 0 0 0 0-.4 1.9 1.9 0 0 0-.2-.4h.1zm0 2v.6l-.2.6-.3.6.2-.6a2.1 2.1 0 0 0 .2-.6 1.6 1.6 0 0 0 0-.7h.1zm-1.2-1.8a2.5 2.5 0 0 1 .7 2.5h-.1a2.4 2.4 0 0 0-.6-2.4v-.1c0-.1 0 0 0 0zm0 2a5.3 5.3 0 0 1-1 1.4 2.5 2.5 0 0 0-.5 1 1.4 1.4 0 0 0-.1-.6 1.9 1.9 0 0 0-.2-.4 1.4 1.4 0 0 1-.3-.9l.3-.8.3-.6a2.4 2.4 0 0 0 0-.6h.1c.1 0 0 0 0 0a2.6 2.6 0 0 1-.3 1.3 1 1 0 0 0-.3.7c0 .3 0 .6.2.8a2 2 0 0 1 .3.8 2.6 2.6 0 0 1 .5-.8 5 5 0 0 0 .5-.6l.3-.7h.1zm-3.2-1a2.8 2.8 0 0 0 .4 1.4v.1h-.1a2.3 2.3 0 0 1-.3-.7 3 3 0 0 1 0-.7zm-1.7 1v.3h-.1v-.3zm.6-1.6-.1.5a1.4 1.4 0 0 1-.3.5c-.1 0 0 0 0 0l.2-.5a1.4 1.4 0 0 0 0-.5h.1zm-1.6 3.1a3.3 3.3 0 0 1-.3-1.7c0-.5.3-.8.6-1l.4-.7c.1-.2.2-.5.1-1s.1 0 .1 0v1l-.6.7a1.9 1.9 0 0 0-.5 1c0 .5 0 1 .3 1.7h-.1zm-1-1.1a.7.7 0 0 0 0 .3l.1.4a1 1 0 0 1-.2-.4.8.8 0 0 1 0-.4h.1zm4.6-3.2c.1.2.3.5.3.8 0 .3 0 .6-.2.9h-.1c-.1 0 0 0 0 0l.2-.9a1.5 1.5 0 0 0-.3-.8zm1.4-1.1a2.4 2.4 0 0 1 0 1.7 1.8 1.8 0 0 0-.2-.8 1.5 1.5 0 0 0-.5-.5c0-.1 0-.1.1 0a1.6 1.6 0 0 1 .6 1v-.6a2.3 2.3 0 0 0-.1-.8zm.8-1.2.4.8v1a2 2 0 0 0 0 .5 1 1 0 0 0 .2.4 1 1 0 0 1-.2-.4 2.3 2.3 0 0 1 0-.5 3.5 3.5 0 0 0-.1-1 1.5 1.5 0 0 0-.4-.7c0-.1 0 0 .1 0zm-2.2-.2a1 1 0 0 0-.3.5v.7a2 2 0 0 1 0-.7c0-.2 0-.4.2-.5.1 0 .1 0 0 0zm-4.4 3a2 2 0 0 1-.3 1 2.5 2.5 0 0 1-.8.7c-.1 0 0 0 0 0l.7-.7c.2-.3.3-.6.3-1l.1-.1zm0-1.6v.5a2.2 2.2 0 0 1-.3.5l.1-.5v-.5h.1zm2.9-.2v1h-.1v-1zm.7-1.3c-.2.3-.3.5-.3.8l.2.7.3 1.2c0 .4-.2.7-.4 1.1l.3-1.1a1.9 1.9 0 0 0-.3-1.2l-.2-.7c0-.3 0-.6.3-.8.1 0 0 0 0 0zm-4.6-8.1a2 2 0 0 1 1-.5c.4 0 .8 0 1.2.3h.8-.8c-.4.5-.8.7-1.1.7a1 1 0 0 1-.9-.2c0-.1 0-.1 0 0a1 1 0 0 0 .9 0c.2 0 .6-.1 1-.5a1.9 1.9 0 0 0-1-.1 2 2 0 0 0-1 .4c-.1 0 0 0 0-.1z\"/>\n" +
    "<path d=\"M351.6 101a.3.3 0 0 1 .3.3.3.3 0 0 1-.3.2.3.3 0 0 1-.2-.2.3.3 0 0 1 .2-.3zm1.8 1.6a2.2 2.2 0 0 0 .8-.7c.1 0 0 0 0 .1a2.3 2.3 0 0 1-.2.3l-.5.4c-.1-.1 0-.1 0-.1zm3.7-1.6a.5.5 0 0 1 .3 0 .8.8 0 0 1 .3.2.7.7 0 0 0-.3 0 .5.5 0 0 0-.2 0l-.1-.1zm-2 .1a.8.8 0 0 1 .3-.4l.7-.1v.1a1 1 0 0 0-.7 0 .7.7 0 0 0-.3.5c-.1 0-.1 0 0 0zm.2.4a.4.4 0 0 1 0-.3.6.6 0 0 1 .3-.1h.1a.5.5 0 0 0-.3.2.3.3 0 0 0 0 .2h-.1zm-3.6 1.1-.1.3a.8.8 0 0 0 0 .3l-.1.1a1 1 0 0 1 0-.4c0-.1 0-.2.2-.3zm1 .5v.2-.2zm-.6-1.1a1 1 0 0 0 .3 0h.3a1.4 1.4 0 0 1-.3.1 1 1 0 0 1-.3 0s-.1 0 0-.1zm.6-2a.3.3 0 0 0-.2.1.4.4 0 0 0-.1.2h-.1a.5.5 0 0 1 .2-.3.4.4 0 0 1 .2 0h.1zm-1 .2a.8.8 0 0 0-.2 0 .3.3 0 0 0 0 .2h-.1c-.1 0 0 0 0 0a.4.4 0 0 1 0-.2.9.9 0 0 1 .3-.1zm-.7 0a.8.8 0 0 0-.1.1.7.7 0 0 0-.1.2h-.1a.7.7 0 0 1 .1-.2.9.9 0 0 1 .2-.2v.1zm-.8.7a1.7 1.7 0 0 0-.4.4v-.1a2 2 0 0 1 .4-.4zm0 .9v.1l-.2.2c-.1 0-.1 0 0 0v-.2l.2-.2c.1 0 .1 0 0 0zm-.7.2v.3l-.1.1c-.1 0 0 0 0 0v-.4zm1 1.4v.6h-.1v-.6h.1zm-.6-.4v.3h-.1v-.3h.1zm-.6-4.5a.7.7 0 0 1 .5.4v.1h-.1a.7.7 0 0 0-.2-.3.7.7 0 0 0-.2-.1v-.1zm5.2 6.7a1.6 1.6 0 0 1 0 1.4h-.1a1.6 1.6 0 0 0 0-1.3v-.1zm-1.7 2c0-.3.2-.5.3-.7l.4-.6c.2-.2.3-.4.3-.7a1.8 1.8 0 0 0 0-.7h.1a2 2 0 0 1-.3 1.5 6.3 6.3 0 0 0-.4.5l-.3.7h-.1zm-2.2-.6a.7.7 0 0 1 .2-.3.9.9 0 0 1 .3-.1.8.8 0 0 0-.2.2.6.6 0 0 0-.2.2zm-.4-.2.3-.3.3-.2v.1a1 1 0 0 0-.3.2 2 2 0 0 0-.2.3c-.1 0-.1 0 0 0zm2.3-2.2h.2a.8.8 0 0 0 .3 0v.1a.8.8 0 0 1-.6 0c0-.1 0-.1 0 0zm-1.2-.1.1-.1c.1 0 .1 0 0 0v.1c-.1 0 0 0 0 0zm24.2 7a1.1 1.1 0 0 1 .2.3h-.1a.8.8 0 0 0 0-.1.8.8 0 0 0-.2-.2c0-.1 0 0 0 0zm-26.8 12.5.3.3a1 1 0 0 0 .5 0v.1a1 1 0 0 1-.5 0 1.7 1.7 0 0 1-.4-.3c0-.1 0-.1 0 0z\"/>\n" +
    "<g fill=\"red\">\n" +
    "<path d=\"M368.9 99.6a8.2 8.2 0 0 0 1.7 0c-.6.3-1.2.6-2 .7a.8.8 0 0 0 .3-.4.4.4 0 0 0 0-.3zm-1.4-.1h1.2v.4s0 .2-.2.3c0 0-.1 0 0 .1a5.6 5.6 0 0 1-1.3 0 1 1 0 0 0 .3-.5.6.6 0 0 0 0-.4zm-10.5-3c.7-.2 1.3-.2 2-.2a1 1 0 0 1 .5.4c.1.2.2.5.1.8l.1.1h.1l-.1-1a1 1 0 0 0-.3-.2h.2a5 5 0 0 1 2.1.6c.2.2.3.3.2.5l-.3.5v.2h.2l.3-.7a.7.7 0 0 0 0-.3l1.7.8a.5.5 0 0 1 0 .5 1 1 0 0 1-.5.3v.1l.1.1c.3 0 .5-.2.6-.4a.6.6 0 0 0 0-.4l1.2.6v.3c0 .2-.1.3-.3.4 0 0-.1 0 0 .1 0 .1 0 0 0 0 .3 0 .5-.2.6-.4a.5.5 0 0 0 0-.3l.4.1a8.1 8.1 0 0 0 1.3.4.5.5 0 0 1 .1.4.7.7 0 0 1-.2.3v.2c-1.4-.1-2.7-.9-4.1-1.4l-.5-.2-1.6-.6-.1-.1a8.5 8.5 0 0 0-1.5-.4 6.1 6.1 0 0 0-1.6 0h-.1l-.1-.8a1.3 1.3 0 0 0-.5-.4z\"/>\n" +
    "<path d=\"M354.6 97a8.7 8.7 0 0 1 2-.5c.4.1.6.3.7.5v.6a4.2 4.2 0 0 0-1.7.2 1.2 1.2 0 0 0-.7-.6 1.2 1.2 0 0 0-.3-.1zm7.4 3.9a9.4 9.4 0 0 0-.5-.4 7 7 0 0 0-3-.8c.3-.4.4-.8.3-1.1a1.7 1.7 0 0 0-.7-.8h1a8 8 0 0 1 2 .6c0 .3.1.6 0 .8 0 .3-.2.5-.5.7 0 0-.1 0 0 .1 0 .1 0 .1 0 0 .4-.1.6-.4.7-.7v-.8l1 .6 1 .8c0 .4 0 .6-.3.8h-.9v.2z\"/>\n" +
    "<path d=\"m364 102.4-1.8-1.4c.4 0 .7 0 1-.2.1-.1.3-.4.3-.8l1.1 1 .6.5v.4a.5.5 0 0 1 0 .2.6.6 0 0 1-.4.2h-.7z\"/>\n" +
    "<path d=\"M366.2 103.8a11.8 11.8 0 0 1-2-1.3h.7a.8.8 0 0 0 .4-.2l.1-.4a1 1 0 0 0 0-.2 10.5 10.5 0 0 0 2.1 1.4c0 .3 0 .4-.3.5a3 3 0 0 1-1 .1z\"/>\n" +
    "<path d=\"M368.4 104.7a11.9 11.9 0 0 1-2-.8c.4 0 .7 0 1-.2.2 0 .3-.2.3-.5a10.8 10.8 0 0 0 1.3.6v.4l-.5.4s-.1 0 0 0z\"/>\n" +
    "<path d=\"M373.2 104.2s.4-.1.2 0c-1.4 1-3.1 1-4.8.5.3-.1.5-.2.6-.4a.6.6 0 0 0 0-.5l1.7.4a.4.4 0 0 1-.1.3l-.5.3s-.1 0 0 .1c0 .1 0 0 0 0 .3 0 .5-.2.6-.3a.6.6 0 0 0 .2-.4 9 9 0 0 0 2 0zm-9.7 24-.2.4-1.2.3c0 .3 0 .4.3.4l.7-.3c.1 0 0 .5-.5.8v.1c.4.6 1.4.4 1.9.3a3 3 0 0 0 1.3-1l-.3-.6c-.4.1-.6 0-.5-.2a3.9 3.9 0 0 0-1.5-.2zm-15.1-4.8c-.3.3-.7.5-1 .6-.2 0-.6.1-.6.3 0 .1.2.3.4.2.4-.5.7-.2.2.2v.3c.5.4 1.6.5 2.2.2.3-.2.6-.5.2-.9a1.7 1.7 0 0 1 0-.2h-.6l-.4-.3-.4-.4zm10 3.5h-.1c-.2.2.3.2.6.3.2.1.2.3.2.5-.3.7-1.9.7-2.4.2-.2-.1-.2-.3-.2-.5h.3c.2 0 .4 0 .6-.2v-.2h-.2a1.3 1.3 0 0 1-.4.2 2.6 2.6 0 0 1-.5 0l-.2-.2h.2l.7-.2.1-.1c.5 0 1 0 1.3.2zm-7.2-.4-.2.3a2.7 2.7 0 0 1-.9.6c-.2.1 0 .2.2.4.2.1.5-.2.6-.4.2-.3.3-.2.2 0l-.2.7.7.3c.4 0 1-.4 1.2-.6.3-.2.2-.5.1-.8a2 2 0 0 1-.5 0 3.4 3.4 0 0 1-.5-.3l-.7-.2zm2.8-26.4h.3l.6.1a4.5 4.5 0 0 1 1.7-.3 5.7 5.7 0 0 1 1.7-.2v-.2c.3-.3.4-.6.3-.9-.1-.2-.4-.5-.8-.7h-1.3a4 4 0 0 0-.8.1l.6.4.4 1c-.2.1-.2 0-.2 0 0-.4-.2-.6-.3-.9l-.8-.4a9 9 0 0 0-1.3.2c-.3 0-.5.2-.7.3l.8.1c.3.1.5.4.6.8-.1.1-.1 0-.1 0a1 1 0 0 0-.5-.6c-.4-.2-1.3 0-1.7.2a4.2 4.2 0 0 0-.6.6l2 .4zm-2.3-.4v-.1l.7-.6.7-.4a2 2 0 0 1 1-.5l1.3-.2a1 1 0 0 0-.5-.5l-.8-.1-1.5.8h.5l.1.2h-.4a1.4 1.4 0 0 0-.4 0h-.1l-1.3 1c.3.1.6.2.7.4z\"/>\n" +
    "</g>\n" +
    "<path fill=\"#0093dd\" d=\"m409 156.5 20.8-47-15.3-24.7-27.3 10-12.7 49.8a219.4 219.4 0 0 1 34.5 11.9z\"/>\n" +
    "<path fill=\"#fff\" d=\"M382.6 113a251.7 251.7 0 0 1 39.6 13.7l-8 18.2a232 232 0 0 0-36.5-12.7z\"/>\n" +
    "<path fill=\"red\" d=\"m415.4 142 5.4-12.2a248.6 248.6 0 0 0-39-13.5l-3.2 12.4a235.9 235.9 0 0 1 37 12.8l-.1.4z\"/>\n" +
    "<path d=\"M385.6 125.8c.3-.3.7-.2 1.1-.1.3-.2.7-.2 1-.2l.6-.2c.2 0 .2-.2 0-.3a.6.6 0 0 1 0-.3c-.7-.4-1-1-1.2-1.5-.3 0-.5-.2-.5-.3h-.5c-.8 0-1-.3-1.3-.5a1 1 0 0 1-.6-.4l-.3-.3c-.2-.3-.1-.7.2-.7h.7a2 2 0 0 1 .9-.1c.3 0 .5-.3.9-.6v-.4s0-.2.2-.1a1 1 0 0 1 .8.5c.5 0 1 .3 1.2.7.7 0 1.1.3 1.2.5 0 .2-.2.4-.5.6v.2l.4.4 1 .7c1-.1 2.6.6 4.8 2a18.6 18.6 0 0 1 4.1 1.2h.9c2.4-.4 4.7 0 6.8 1.5.8.1 1.5.4 2.2.7.5.2 1 .3 1.6.3a8 8 0 0 1 2.6.7c1 .2 1.9.7 2.4 1.2.4.5.3 1-.2 1.2-.3.6-.9.6-1.8.3-.6.1-1.3-.4-2-.9-.8-.2-1.6-.8-2.4-1.3l-1.3-.6h-.8v.2c.2.2.4.4.4.8v1c0 .4.3.6.7.9l1 .4c.2 0 .3.1.3.3l.4 1.7.4.3c.6.5.2 1-.3 1a3.1 3.1 0 0 1-1.3.8c-.4.2-.6 0-.7-.2a.5.5 0 0 1-.4-.2c-.5-.4-.1-1 1-.7l.2-.2a1.5 1.5 0 0 1 0-.9l-.3-.2a2.8 2.8 0 0 1-1-.6c-.6-.5-1.5-1-2.4-1.4-.7 0-1.2-.4-1.8-.7h-.8c-.2 0-.4 0-.5.2-.2.3-.5.2-.8.2h-1.6c-.4 0-.7 0-1 .3-.2.2-.4.2-.7 0a1 1 0 0 1-.3-.2c-.3 0-.5 0-.5-.2-.5-.1-.6-.2-.6-.4-.6-.1-.3-.6 0-.6l1.4.1c.4.1 1 0 1.2-.2l.5-.5a4 4 0 0 1-1.8-.5c-1.1-.7-2-.9-2.8-.3-.2.2-.3.2-.6.1a1 1 0 0 0-.5 0c-.5.1-.9 0-1.3-.1a4 4 0 0 1-1.8 0c-.6.3-1 .4-1.2.2a8.6 8.6 0 0 1-.6-.4c-.4-.1-.5-.2-.5-.3-.4 0-.5-.2-.5-.4-.2-.2 0-.3 0-.4.4-.2.7-.2 1 0 .3 0 .5.2.6.3h.6c.1-.2.5-.2 1-.2l.7-.2v-.2c-.4 0-.6-.4-.9-.7a3 3 0 0 1-1.5-.5c-.4 0-.7-.1-1-.3h-.7a2.5 2.5 0 0 1-1.4 0h-.8a1 1 0 0 1-1 .2 1.5 1.5 0 0 0-.8-.5c-.3-.1-.4-.2-.4-.4-.4-.2-.3-.4 0-.5.3-.1.5-.2 1 0l.5.2z\"/>\n" +
    "<path fill=\"#fff\" d=\"M401.2 130.5s0-.2-.3 0c-.8 0-1.6 0-2.2-.4-.7-.4-1.3-.8-2-.8l.7-.4h1.5c.7 0 1.4.2 2 .4.4.2.8.5 1 .8a3.4 3.4 0 0 1 .8.7 2.5 2.5 0 0 1-.7 0 2.9 2.9 0 0 1-.8-.3z\"/>\n" +
    "<path d=\"M403 94.7v.2l.9 4.9-3.7 3.2-.2.1.2.1 4.7 1.6 1 4.9v.2l.2-.1 3.7-3.3 4.6 1.6h.3v-.1l-1-4.9 3.7-3.2.2-.2h-.3l-4.6-1.6-1-4.9V93l-.2.1-3.7 3.3-4.7-1.6z\"/>\n" +
    "<path fill=\"#f7db17\" d=\"m400.6 103 3.5-3 4.4 1.4zm8.5-1.7 3.4-3 4.4 1.5zm7.8-1.3-3.4 3-4.4-1.5zm-8.4 1.6-3.5 3-4.3-1.5zm-5-6.4 4.3 1.4.8 4.6zm5.5 6.4 4.4 1.5.9 4.5zm5.1 6.1-4.3-1.5-.9-4.5zm-5.6-6.4-4.3-1.5-.9-4.5zm3-7.7 1 4.6-3.5 3zm-2.7 8.1.8 4.6-3.4 3zm-2.8 7.5-.9-4.5 3.5-3zm2.8-8-.9-4.6 3.5-3z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-en\" viewBox=\"0 0 640 480\">\n" +
    "<path fill=\"#012169\" d=\"M0 0h640v480H0z\"/>\n" +
    "<path fill=\"#FFF\" d=\"m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z\"/>\n" +
    "<path fill=\"#C8102E\" d=\"m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z\"/>\n" +
    "<path fill=\"#FFF\" d=\"M241 0v480h160V0H241zM0 160v160h640V160H0z\"/>\n" +
    "<path fill=\"#C8102E\" d=\"M0 193v96h640v-96H0zM273 0v480h96V0h-96z\"/>\n" +
    "</symbol>\n" +
    "<symbol id=\"flag-us\" viewBox=\"0 0 640 480\">\n" +
    "<g stroke-width=\"1pt\">\n" +
    "<path fill=\"#bd3d44\" d=\"M0 0h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8V197H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8V512H0z\"/>\n" +
    "<path fill=\"#fff\" d=\"M0 39.4h972.8v39.4H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0z\"/>\n" +
    "</g>\n" +
    "<path fill=\"#192f5d\" d=\"M0 0h389.1v275.7H0z\"/>\n" +
    "<path fill=\"#fff\" d=\"M32.4 11.8 36 22.7h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7H29zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7h11.4zm64.8 0 3.6 10.9H177l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7h11.5zm64.9 0 3.5 10.9H242l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.2-6.7h11.4zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.5zM64.9 39.4l3.5 10.9h11.5L70.6 57 74 67.9l-9-6.7-9.3 6.7L59 57l-9-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.3 6.7 3.6 10.9-9.3-6.7-9.3 6.7L124 57l-9.3-6.7h11.5zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 10.9-9.2-6.7-9.3 6.7 3.5-10.9-9.2-6.7H191zm64.8 0 3.6 10.9h11.4l-9.3 6.7 3.6 10.9-9.3-6.7-9.2 6.7 3.5-10.9-9.3-6.7H256zm64.9 0 3.5 10.9h11.5L330 57l3.5 10.9-9.2-6.7-9.3 6.7 3.5-10.9-9.2-6.7h11.4zM32.4 66.9 36 78h11.4l-9.2 6.7 3.5 10.9-9.3-6.8-9.2 6.8 3.5-11-9.3-6.7H29zm64.9 0 3.5 11h11.5l-9.3 6.7 3.5 10.9-9.2-6.8-9.3 6.8 3.5-11-9.2-6.7h11.4zm64.8 0 3.6 11H177l-9.2 6.7 3.5 10.9-9.3-6.8-9.2 6.8 3.5-11-9.3-6.7h11.5zm64.9 0 3.5 11H242l-9.3 6.7 3.6 10.9-9.3-6.8-9.3 6.8 3.6-11-9.3-6.7h11.4zm64.8 0 3.6 11h11.4l-9.2 6.7 3.5 10.9-9.3-6.8-9.2 6.8 3.5-11-9.2-6.7h11.4zm64.9 0 3.5 11h11.5l-9.3 6.7 3.6 10.9-9.3-6.8-9.3 6.8 3.6-11-9.3-6.7h11.5zM64.9 94.5l3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.5zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7H191zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7H256zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7h11.4zM32.4 122.1 36 133h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7H29zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 10.9-9.2-6.7-9.3 6.7 3.5-10.9-9.2-6.7h11.4zm64.8 0 3.6 10.9H177l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7h11.5zm64.9 0 3.5 10.9H242l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.2-6.7h11.4zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.5zM64.9 149.7l3.5 10.9h11.5l-9.3 6.7 3.5 10.9-9.2-6.8-9.3 6.8 3.5-11-9.2-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.3 6.7 3.6 10.9-9.3-6.8-9.3 6.8 3.6-11-9.3-6.7h11.5zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 10.9-9.2-6.8-9.3 6.8 3.5-11-9.2-6.7H191zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 10.9-9.3-6.8-9.2 6.8 3.5-11-9.3-6.7H256zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 10.9-9.2-6.8-9.3 6.8 3.5-11-9.2-6.7h11.4zM32.4 177.2l3.6 11h11.4l-9.2 6.7 3.5 10.8-9.3-6.7-9.2 6.7 3.5-10.9-9.3-6.7H29zm64.9 0 3.5 11h11.5l-9.3 6.7 3.6 10.8-9.3-6.7-9.3 6.7 3.6-10.9-9.3-6.7h11.4zm64.8 0 3.6 11H177l-9.2 6.7 3.5 10.8-9.3-6.7-9.2 6.7 3.5-10.9-9.3-6.7h11.5zm64.9 0 3.5 11H242l-9.3 6.7 3.6 10.8-9.3-6.7-9.3 6.7 3.6-10.9-9.3-6.7h11.4zm64.8 0 3.6 11h11.4l-9.2 6.7 3.5 10.8-9.3-6.7-9.2 6.7 3.5-10.9-9.2-6.7h11.4zm64.9 0 3.5 11h11.5l-9.3 6.7 3.6 10.8-9.3-6.7-9.3 6.7 3.6-10.9-9.3-6.7h11.5zM64.9 204.8l3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.3 6.7 3.6 11-9.3-6.8-9.3 6.7 3.6-10.9-9.3-6.7h11.5zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7H191zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7H256zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.5 11-9.2-6.8-9.3 6.7 3.5-10.9-9.2-6.7h11.4zM32.4 232.4l3.6 10.9h11.4l-9.2 6.7 3.5 10.9-9.3-6.7-9.2 6.7 3.5-11-9.3-6.7H29zm64.9 0 3.5 10.9h11.5L103 250l3.6 10.9-9.3-6.7-9.3 6.7 3.6-11-9.3-6.7h11.4zm64.8 0 3.6 10.9H177l-9 6.7 3.5 10.9-9.3-6.7-9.2 6.7 3.5-11-9.3-6.7h11.5zm64.9 0 3.5 10.9H242l-9.3 6.7 3.6 10.9-9.3-6.7-9.3 6.7 3.6-11-9.3-6.7h11.4zm64.8 0 3.6 10.9h11.4l-9.2 6.7 3.5 10.9-9.3-6.7-9.2 6.7 3.5-11-9.2-6.7h11.4zm64.9 0 3.5 10.9h11.5l-9.3 6.7 3.6 10.9-9.3-6.7-9.3 6.7 3.6-11-9.3-6.7h11.5z\"/>\n" +
    "</symbol>\n" +
    "<g ng-transclude></g>\n" +
    "</svg>"
  );


  $templateCache.put('src/components/nice-time-picker/nice-time-picker.html',
    "<div class=\"nice-component nice-time-picker\" ng-form=\"forma\" ng-class=\"{ 'margin-bottom-0': noMargin, 'nice-component-inline': isInline }\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "<div class=\"input-group\" ng-class=\"{\n" +
    "                    'has-warning': !isDisabled && forma.$invalid && forma.$dirty,\n" +
    "                    'disabled': isDisabled\n" +
    "                }\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"modelString\" ng-keyup=\"$event.keyCode == 13 && validateDate()\" ng-blur=\"validateDate()\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default btn-right\" ng-click=\"open = !open\">\n" +
    "<nice-icon icon=\"icon-clock\"></nice-icon>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"nice-time-picker-dropdown\" ng-if=\"open\">\n" +
    "<div>\n" +
    "<button type=\"button\" class=\"btn btn-sm btn-block btn-default\" ng-click=\"changeHour(true)\">\n" +
    "<nice-icon icon=\"icon-chevron-up\"></nice-icon>\n" +
    "</button>\n" +
    "<div class=\"numbers\">{{ hours }}</div>\n" +
    "<button type=\"button\" class=\"btn btn-sm btn-block btn-default\" ng-click=\"changeHour(false)\">\n" +
    "<nice-icon icon=\"icon-chevron-down\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div>\n" +
    "<button type=\"button\" class=\"btn btn-sm btn-block btn-default\" ng-click=\"changeMinutes(true)\">\n" +
    "<nice-icon icon=\"icon-chevron-up\"></nice-icon>\n" +
    "</button>\n" +
    "<div class=\"numbers\">{{ minutes }}</div>\n" +
    "<button type=\"button\" class=\"btn btn-sm btn-block btn-default\" ng-click=\"changeMinutes(false)\">\n" +
    "<nice-icon icon=\"icon-chevron-down\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"nice-background\" ng-click=\"close()\" ng-if=\"open\"></div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-title/nice-title.html',
    "<div class=\"nice-title col-xs-12\" ng-class=\"[labelWidth ? labelWidth : 'col-sm-4', {'nice-title-empty': !text && !help} ]\" ng-if=\"text\">\n" +
    "<div class=\"nice-title-text\">{{ text }}<span class=\"nice-title-required\" ng-if=\"required\">*</span></div>\n" +
    "<nice-help class=\"nice-title-help\" ng-if=\"help\" text=\"{{ help }}\"></nice-help>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-toast/nice-toast.html',
    "<div class=\"nice-toasts\" ng-class=\"position\">\n" +
    "<div class=\"nice-toast\" ng-class=\"toast.type\" ng-repeat=\"toast in toasts\">{{ toast.message }}</div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-upload/nice-upload.html',
    "<ng-form class=\"nice-component nice-upload\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" name=\"form\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"nice-upload-area\">\n" +
    "<div class=\"input-area\" ng-class=\"{ 'dragging': dragging || draggingGlobal }\">\n" +
    "<div class=\"middle-text\" ng-if=\"!imageSource && !loading\">\n" +
    "<nice-icon icon=\"icon-upload\"></nice-icon>\n" +
    "<div class=\"text text-placeholder\" ng-if=\"!dragging\">{{ text }}</div>\n" +
    "<div class=\"text text-placeholder\" ng-if=\"dragging\" translate translate-group=\"Nice\">Drop file here</div>\n" +
    "<div class=\"error\" ng-if=\"error\">{{ error }}</div>\n" +
    "</div>\n" +
    "<img ng-if=\"imageSource\" data-ng-src=\"{{ imageSource }}\">\n" +
    "</div>\n" +
    "<input class=\"input-file\" type=\"file\" accept=\"{{ accept }}\" ng-model=\"file\" ng-disabled=\"isDisabled || loading\">\n" +
    "<nice-loader fulldiv=\"true\" ng-if=\"loading\"></nice-loader>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('src/components/nice-wrapper/nice-wrapper.html',
    "<div class=\"nice-wrapper\" ng-class=\"{ 'collapsable': collapsable, 'has-header': hasHeader, 'has-footer': hasFooter, 'nice-wrapper-sticky-footer': stickyFooter, 'nice-wrapper-sticky-header': stickyHeader }\">\n" +
    "<div class=\"nice-wrapper-header\" ng-if=\"hasHeader\" ng-click=\"toggle()\">\n" +
    "<div class=\"nice-wrapper-info\">\n" +
    "<div class=\"nice-wrapper-title\" ng-transclude=\"title\">{{ title }}</div>\n" +
    "<div class=\"nice-wrapper-subtitle\" ng-transclude=\"subtitle\">{{ subtitle }}</div>\n" +
    "</div>\n" +
    "<button class=\"nice-wrapper-toggle btn btn-icon btn-default-naked\" ng-if=\"collapsable\" ng-class=\"{ 'is-open': isOpen }\">\n" +
    "<nice-icon icon=\"icon-chevron-down\"></nice-icon>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"nice-wrapper-body\" ng-class=\" {'no-padding': noPadding }\" ng-transclude ng-if=\"isOpen\"></div>\n" +
    "<div class=\"nice-wrapper-footer\" ng-if=\"isOpen && hasFooter\" ng-transclude=\"footer\"></div>\n" +
    "</div>"
  );


  $templateCache.put('src/components/nice-yesno/nice-yesno.html',
    "<div class=\"nice-component nice-yesno\" ng-class=\"{ 'margin-bottom-0' : noMargin, 'nice-component-inline': isInline }\" ng-form=\"formYesno\">\n" +
    "<div class=\"row\">\n" +
    "<nice-title text=\"title\" help=\"help\" required=\"required\" label-width=\"labelWidth\"></nice-title>\n" +
    "<div class=\"nice-field col-xs-12\" ng-class=\"[fieldWidth ? fieldWidth : 'col-sm-8', { 'nice-disabled': isDisabled }]\">\n" +
    "<div class=\"yesno-wrapper noselect\">\n" +
    "<button class=\"yesno-yes-bg\" ng-click=\"switch()\" tabindex=\"-1\" type=\"button\" ng-disabled=\"isDisabled\">{{ yes }}</button>\n" +
    "<button class=\"yesno-no-bg\" ng-click=\"switch()\" tabindex=\"-1\" type=\"button\" ng-disabled=\"isDisabled\">{{ no }}</button>\n" +
    "<button class=\"yesno-button btn btn-primary\" ng-class=\"buttonClass\" ng-click=\"switch()\" ng-disabled=\"isDisabled\" type=\"button\">{{ state }}</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('src/modals/nice-multilangual-modal/nice-multilangual-modal.html',
    "<div class=\"nice-multilangual-modal\">\n" +
    "<div class=\"dialog-title\" ng-if=\"!model\">\n" +
    "<translate translate-context=\"Nice\">Translations</translate>\n" +
    "</div>\n" +
    "<div class=\"dialog-title\" ng-if=\"model\">\n" +
    "<div translate class=\"sub-title\" translate-context=\"Nice\">Translations for</div>\n" +
    "<span class=\"title\">{{ model }}</span>\n" +
    "</div>\n" +
    "<div class=\"dialog-body\" ng-form=\"forma\">\n" +
    "<div class=\"nice-multilangual-languages\">\n" +
    "<div class=\"nice-multilangual-language\" ng-repeat=\"(key, field) in fields\">\n" +
    "<nice-input title=\"{{ languagesMap[key] }}\" class=\"flex-grow\" model=\"fields[key]\" is-inline=\"false\" no-margin=\"true\" on-clear=\"removeLanguage(key)\" class=\"flex-grow\"></nice-input>\n" +
    "</div>\n" +
    "</div>\n" +
    "<nice-dropdown ng-if=\"!hide\" title=\"{{ 'Add language' | translate:null:'Nice' }}\" is-inline=\"false\" model=\"selector.newLanguage\" list=\"languages\" add-button-function=\"addLanguage\" filter-function=\"filterLanguages\" no-margin=\"true\"></nice-dropdown>\n" +
    "</div>\n" +
    "<div class=\"dialog-footer\">\n" +
    "<div class=\"view-actions\">\n" +
    "<button type=\"button\" class=\"btn btn-danger btn-navigation\" ng-click=\"close()\" translate-context=\"Nice\" translate>Cancel</button>\n" +
    "<button class=\"btn btn-success btn-navigation\" ng-click=\"save()\" translate-context=\"Nice\" translate>Save</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );

}]);
