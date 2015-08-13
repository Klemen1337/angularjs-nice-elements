'use strict';

angular.module('niceElements', [
    'ngMessages',
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
          if (!angular.equals(value_new, value_old) || $scope.checkIfFirstTime()){
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
        placeholder: '@',
        noTextLabel: '@',
        noMarginBottom: '@',
        fieldWidth: '@',
        labelWidth: '@',
        help: '@',
        rows: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (scope.model==null) { scope.model =  ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.noTextLabel) { angular.isDefined(attrs.noTextLabel); }
        if (!attrs.noMarginBottom) { angular.isDefined(attrs.noMarginBottom); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.rows) { attrs.rows = 3; }

        var textareas = element.find('textarea');

        scope.edit = function(){
          scope.editing=true;
          $timeout(function(){
            textareas[0].focus();
          });
        };
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

  .directive('niceDatetimePicker', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/nice-datetime-picker.html',
      scope: {
        model: '=',
        title: '@',
        startView: '@', // default day (possible: year, month, day, hour, minute)
        minView: '@', // default: day
        dateTimeFormat: '@', // default: 'dd.MM.yyyy | HH:mm'
        hourWithMinutes: '@', // If the input is 12:00:00
        fieldWidth: '@',
        labelWidth: '@',
        utc: '@',
        noMargin: '@'
      },
      controller: function($scope, $filter) {

        $scope.$watch('dateObj', function(newValue, oldValue) {

          if ($scope.hourWithMinutes){
            $scope.labelValue = $filter('date')(moment(newValue).format(), $scope.dateTimeFormat);
            $scope.model = $scope.labelValue;
          }else{
            $scope.model = moment(newValue).format();
            $scope.labelValue = $filter('date')($scope.model, $scope.dateTimeFormat);
          }
        });

        $scope.$watch('model', function(newValue, oldValue) {
          if (newValue && newValue!=oldValue){
            if ($scope.hourWithMinutes){
              var parts = newValue.split(':');
              $scope.dateObj = new Date();
              $scope.dateObj.setHours(parts[0], parts[1], 0, 0);
            } else {
              $scope.dateObj = new Date(Date.parse(newValue));
            }
          }
        });

        $scope.callback = function(new_value){
          if ($scope.utc) // Underlying directive does not handle UTC properly, so we need to fix selected time to UTC
            $scope.dateObj = moment(new_value).format().split('+')[0] + '+00:00';
          else
            $scope.dateObj = new_value;
        };

      },
      link: function(scope, iElement, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.startView) { attrs.startView = 'day'; }
        if (!attrs.minView) { attrs.minView = 'day'; }
        if (!attrs.dateTimeFormat) { attrs.dateTimeFormat = 'dd.MM.yyyy | HH:mm'; }
        attrs.hourWithMinutes = angular.isDefined(attrs.hourWithMinutes);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.utc = angular.isDefined(attrs.utc);
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        // This random string is appended to dropdown id
        scope.randNum = Math.random().toString(36).substring(7);

        if (scope.model != null){
          if (scope.hourWithMinutes){
            var parts = scope.model.split(':');
            scope.dateObj = new Date();
            scope.dateObj.setHours(parts[0], parts[1], 0, 0);
          } else {
            scope.dateObj = new Date(Date.parse(scope.model));
          }
        }else{
          if (scope.utc) { // Underlying directive does not handle UTC properly, so we need to fix selected time to UTC
            var offsetMinutes = new Date().getTimezoneOffset();
            scope.dateObj = moment(new Date().setHours(0, 0, 0, 0)).minutes(-offsetMinutes);

          }else
            scope.dateObj = new Date().setHours(0, 0, 0, 0);
        }

        scope.opts = {
          startView: attrs.startView,
          minView: attrs.minView,
          //minuteStep: scope.minuteStep,
          dropdownSelector: '#dropdown' + scope.randNum
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
        listIsObj: '@',           // True - list has objects, False - list has strings
        selectedIsObj: '@',       // Optional parameter.
        nullable: '@',            // No selection is possible
        required: '@',            // Model cannot be NULL
        showTax: '@',             // Shows tax rate
        noMargin: '@',            // margin-bottom: 0px
        multiple: '@',            // Can select multiple items
        help: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.objValue) { attrs.objValue = 'value'; }
        if (!attrs.objKey) { attrs.objKey = 'id'; }
        attrs.listIsObj = angular.isDefined(attrs.listIsObj);
        attrs.selectedIsObj = angular.isDefined(attrs.selectedIsObj);
        attrs.nullable = angular.isDefined(attrs.nullable);
        attrs.required = angular.isDefined(attrs.required);
        attrs.showTax = angular.isDefined(attrs.showTax);
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        attrs.multiple = angular.isDefined(attrs.multiple);
        if (!attrs.help) { attrs.help = ''; }

        scope.valid = scope.formDropdown;

        if(scope.multiple) { scope.internalSelected = []; }

        if(!attrs.addButtonFunction) { scope.addButtonFunction = null; }
      },

      controller: function($rootScope, $scope) {
        $scope.internalSelected = null;

        var getFilter = function(item){
          // Create filter for finding object by objValue with _.where()
          var filter = {};
          if (item.hasOwnProperty($scope.objKey))
            filter[$scope.objKey] = item[$scope.objKey];
          else
            filter[$scope.objKey] = item;
          return filter;
        };

        var setSelected = function(selected){
          if(selected && _.find($scope.internalList, selected))
            $scope.internalSelected = selected;
          else
            $scope.internalSelected = $scope.internalList[0];
        };

        var setMultipleSelected = function(item){
          if(!$scope.internalSelected) $scope.internalSelected = [];

          if(!_.find($scope.internalSelected, getFilter(item))){
            $scope.internalSelected.push(item);
          } else {
            $scope.internalSelected = _.reject($scope.internalSelected, {'id':item.id});
          }
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

        var bootstrap = function(list) {
          // Set internalList
          if ($scope.listIsObj) {
            $scope.internalList = angular.copy(list);
          } else {
            $scope.internalList = _.map(list, function (val) {
              var obj = {};
              obj[$scope.objKey] = val;
              obj[$scope.objValue] = val;
              return obj;
            });
          }


          if(!$scope.multiple) {
            // Add null object if nullable
            if ($scope.nullable) {
              var nullObj = {};
              nullObj[$scope.objKey] = null;
              nullObj[$scope.objValue] = '-';
              $scope.internalList = [nullObj].concat($scope.internalList);
            }
          }


          // Set internalSelected
          if(angular.isDefined($scope.internalList) && $scope.internalList.length>0){
            $scope.emptyList = false;

            if(!$scope.multiple) {
              if($scope.model){
                // Initial select if internal list is defined
                var obj = {};
                if ($scope.selectedIsObj){
                  obj[$scope.objKey] = $scope.model[$scope.objKey];
                }else{
                  obj[$scope.objKey] = $scope.model;
                }

                if($scope.objKey) setSelected(obj);
                else setSelected({ id: $scope.model.id });
              } else {
                // Select first element from internal list
                setSelected($scope.internalList[0]);
              }

              if($scope.formDropdown && $scope.required){
                $scope.formDropdown.$setValidity('required', true);
              }
            } else {
              //$scope.internalSelected = angular.copy($scope.list);
              $scope.internalSelected = $scope.model;
            }
          } else {
            // Disable dropdown button if list of items is empty
            $scope.emptyList = true;
            var sel = {};
            sel[$scope.objKey] = null;
            sel[$scope.objValue] = "No options";
            $scope.internalList = [sel];

            if($scope.formDropdown && $scope.required){
              $scope.formDropdown.$setValidity('required', false); // Form is not valid because dropdown is empty and required
            }
            setSelected(sel);
          }
        };

        bootstrap($scope.list);

        $scope.clicked = function(item){
          $scope.formDropdown.$setDirty();

          if($scope.multiple){
            setMultipleSelected(item);
          } else {
            setSelected(item);
          }

        };

        $scope.getLabel = function(item){
          if (item)
            return item[$scope.objValue];
          else
            return '-';
        };

        $scope.getAfterLabel = function(item){
          return item[$scope.afterLabel];
        };

        $scope.$watch('internalSelected', function (value_new, value_old) {
          // Update $scope.selected based on settings
          if(!$scope.multiple){

            if (value_new[$scope.objKey]==null){
              $scope.model = null;
            } else {
              if ($scope.selectedIsObj){
                $scope.model = value_new;
              } else {
                $scope.model = value_new[$scope.objKey];
              }
            }

          } else {
            if ($scope.selectedIsObj){
              $scope.model = value_new;
            } else {
              $scope.model = value_new[$scope.objKey];
            }
          }
        });

        $scope.$watch('list', function (value_new, value_old) {
          bootstrap(value_new);
        }, true);

        $scope.$watch('model', function (value_new, value_old) {
          if(!$scope.multiple) {
            // Update internalSelected if changed from parent scope
            if (value_new) {
              // Initial select if internal list is defined
              var obj = {};
              if ($scope.selectedIsObj) {
                obj[$scope.objKey] = value_new[$scope.objKey];
              } else {
                obj[$scope.objKey] = value_new;
              }
              setSelected(_.findWhere($scope.internalList, obj));
            } else {
              // Select first element from internal list
              setSelected($scope.internalList[0]);
            }
          } else {
            //setMultipleSelected(value_new);
          }
        });


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
        minlength: '@',
        maxlength: '@',
        required: '@',
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
        maxLength: '@?'
      },

      link: function (scope, element, attrs) {
        if (!attrs.type) { attrs.type = 'text'; }
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.regex) { attrs.regex = null; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.minlength) { attrs.minlength = 1; }
        if (!attrs.maxlength) { attrs.maxlength = 100; }
        attrs.required = angular.isDefined(attrs.required);
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
        if (!attrs.maxLength) { attrs.maxLength = 42; }

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
        if (!attrs.defaultValue) { attrs.defaultValue = 0; }
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
  .directive('niceSearch', function ($document) {
    return {
      transclude: true,
      templateUrl: 'views/nice-search.html',
      restrict: 'E',
      scope: {
        model: '=',
//        modelString: '=',
        isDisabled: '=',
        title: '@?',
        placeholder: '@',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        hideValid: '@',
        refreshFunction: '=',
        refreshSelectedCallback: '=',
        refreshDelay: '@',
        showDropdown: '@?',
        clearInput: '@',
        resetSearchInput: '@?',
        keyForInputLabel: '@?',
        disableRow: '@?',
        noMargin: '@',
        setText: '@'
      },
      link: function (scope, element, attrs, ctrl, transcludeFn) {

        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        if (!attrs.refreshDelay) { attrs.refreshDelay = 500; } // milliseconds
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
        $document.bind('click', function(event){
          var isClickedElementChildOfPopup = element.find(event.target).length > 0;

          if (isClickedElementChildOfPopup) return;

          scope.results = [];
          scope.noResults = false;
          scope.$apply();
        });

        // Keyboard up/down on search results
        element.bind('keydown', function(event) {
          if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 && scope.showDropdown){
            event.preventDefault();

            if(event.keyCode == 27){ // Escape
              scope.modelString = "";
              scope.clear();
            }

            if(event.keyCode == 13){ // Enter
              scope.selectRow(scope.results[scope.selectedIndex]);
            }

            if(event.keyCode == 40 && scope.selectedIndex+1 < scope.results.length){ // Down
              scope.selectedIndex += 1;
            }

            if(event.keyCode == 38 && scope.selectedIndex-1 >= 0){ // Up
              scope.selectedIndex -= 1;
            }

            // TODO: What to do when hover?

            scope.$apply();
          }
        });

      },
      controller: function($scope, $timeout) {
        $scope.id = Math.random().toString(36).substring(7);

        $scope.modelOptions = {
          debounce: $scope.refreshDelay
        };

        // Set default refresh delay
        if (angular.isDefined($scope.refreshDelay)){
          $scope.modelOptions.debounce = $scope.refreshDelay;
        }

        $scope.loading = false;
        $scope.noResults = false;

        $scope.results = [];
        var updateList = function(results){
          if(results){
            $scope.noResults = results.length == 0;
            $scope.results = results;

            if(!$scope.noResults){
              $scope.selectedIndex = 0;
            }
          }

          $scope.loading = false;
        };

        // ng-change function
        $scope.updateSearch = function () {
          $scope.loading = true;
          $scope.refreshFunction($scope.modelString).then(updateList);
          $scope.model = $scope.modelString;
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
      }
    }
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


  $templateCache.put('views/nice-choice.html',
    "<div class=\"nice-choice\" ng-class=\"{'margin-bottom-0' : noMargin}\">\n" +
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
    "\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formChoice\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-comment.html',
    "<div class=\"nice-comment\">\n" +
    "    <div class=\"row\" ng-class=\"noMarginBottom ? '':'margin-bottom-20'\">\n" +
    "        <div ng-show=\"!editing\" ng-class=\"labelWidth ? labelWidth : 'col-sm-6'\">\n" +
    "            <span ng-if=\"model=='' && !editing\"><a ng-click=\"edit()\">{{noTextLabel}} <i class=\"fa fa-pencil\"></i></a></span>\n" +
    "            <span ng-if=\"model!='' && !editing\"><a ng-click=\"edit()\">{{model}} <i class=\"fa fa-pencil\"></i></a></span>\n" +
    "        </div>\n" +
    "        <div ng-show=\"editing\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-6'\">\n" +
    "            <div class=\"relative\">\n" +
    "                <textarea\n" +
    "                    class=\"form-control\"\n" +
    "                    ng-model=\"model\"\n" +
    "                    title=\"{{ help }}\"\n" +
    "                    placeholder=\"{{placeholder}}\"\n" +
    "                    rows=\"{{rows}}\"\n" +
    "                    ng-blur=\"save()\"\n" +
    "                ></textarea>\n" +
    "                <!--<nice-input  placeholder=\"{{placeholder}}\" model=\"model\" name=\"{{'This text is placed at the end of the document.'|translate}}\" field-width=\"col-sm-12\" text-area></nice-input>-->\n" +
    "                <!--<div class=\"btn btn-sm btn-success btn-comment-save\" ng-click=\"save()\"><i class=\"fa fa-check\"></i></div>-->\n" +
    "                <!--<div class=\"btn btn-sm btn-danger btn-comment-cancel\" ng-click=\"cancel()\"><i class=\"fa fa-times\"></i></div>-->\n" +
    "            </div>\n" +
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
    "<ng-form class=\"nice-date\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input\n" +
    "              type=\"text\"\n" +
    "              class=\"form-control\"\n" +
    "              datepicker-popup=\"{{ format }}\"\n" +
    "              ng-model=\"model\"\n" +
    "              is-open=\"opened\"\n" +
    "              min-date=\"{{ min }}\"\n" +
    "              max-date=\"max\"\n" +
    "              datepicker-options=\"dateOptions\"\n" +
    "              ng-required=\"true\"\n" +
    "              close-text=\"Close\"\n" +
    "              ng-click=\"open($event)\" />\n" +
    "\n" +
    "          <span class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-datetime-picker.html',
    "<div class=\"nice-datetime-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"dropdown\">\n" +
    "            <a class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" data-toggle=\"dropdown\" data-target=\"#\" href>\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"labelValue\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n" +
    "                <datetimepicker ng-if=\"opts.startView=='year' && opts.minView=='year'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'year', minView: 'year'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='year' && opts.minView=='day'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'year', minView: 'day'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='day' && opts.minView=='day'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'day', minView: 'day'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='day' && opts.minView=='minute'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'day', minView: 'minute'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='hour' && opts.minView=='minute'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'hour', minView: 'minute'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='hour' && opts.minView=='hour'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'hour', minView: 'hour'}\" ></datetimepicker>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
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
    "                        <!--<span ng-if=\"internalSelected.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': internalSelected.color_hex_code}\"></span>-->\n" +
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
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li ng-repeat=\"item in internalList\" ng-click=\"clicked(item)\">\n" +
    "                            <a href>\n" +
    "                                <span class=\"choice-checkbox\" ng-if=\"multiple\" ng-class=\"{ 'selected' : isItemSelected(item) }\"><i class=\"fa fa-check\"></i></span>\n" +
    "                                <!--<span ng-if=\"item.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': item.color_hex_code}\"></span>-->\n" +
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


  $templateCache.put('views/nice-input.html',
    "<ng-form class=\"nice-input\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"form-group\"\n" +
    "             ng-class=\"{\n" +
    "                'has-feedback': showValid && !hideValid,\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\n" +
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
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                ng-minlength=\"minlength\"\n" +
    "                ng-maxlength=\"maxlength\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-keypress=\"keypress($event)\"\n" +
    "                ng-pattern=\"regexexp\"\n" +
    "                ng-disabled=\"isDisabled\"\n" +
    "                maxlength=\"{{maxLength}}\"\n" +
    "            >\n" +
    "            <textarea ng-show=\"textArea\"\n" +
    "                class=\"form-control\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                id=\"{{ id }}\"\n" +
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
    "        <div ng-messages=\"form.$error\" ng-if=\"form.$dirty\">\n" +
    "            <div class=\"error-message\" ng-message=\"email\" ng-if=\"form.$dirty\" translate>Email is not valid.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"form.$dirty\" translate>This field requires a specific pattern.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"minlength\"><translate>Your input is too short. It must contain at least</translate> {{ minlength }} <translate>characters</translate>.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"maxlength\" translate>Your input is too long</div>\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"form.$dirty\" translate>This field is required.</div>\n" +
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
    "  <svg version=\"1.1\" id=\"loader-1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "     width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n" +
    "  <path fill=\"#000\" d=\"M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z\">\n" +
    "    <animateTransform attributeType=\"xml\"\n" +
    "      attributeName=\"transform\"\n" +
    "      type=\"rotate\"\n" +
    "      from=\"0 25 25\"\n" +
    "      to=\"360 25 25\"\n" +
    "      dur=\"0.6s\"\n" +
    "      repeatCount=\"indefinite\"/>\n" +
    "    </path>\n" +
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
    "                    ng-model-options=\"modelOptions\"\n" +
    "                    placeholder=\"{{ placeholder }}\"\n" +
    "                    ng-disabled=\"isDisabled\"\n" +
    "                    ng-change=\"updateSearch()\"\n" +
    "                    ng-required=\"required\"\n" +
    "                >\n" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"search()\">\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-search\" ></i>\n" +
    "                    <i ng-show=\"loading\" class=\"fa fa-refresh fa-spin\"></i>\n" +
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
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "  <!--Here is injected dropdown html if passed and results present and open.-->\n" +
    "  <!--<div ng-transclude></div>-->\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-yesno.html',
    "<div class=\"row nice-yesno\" ng-class=\"{'margin-bottom-0' : noMargin}\">\n" +
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
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formYesno\"></div>\n" +
    "</div>"
  );

}]);
