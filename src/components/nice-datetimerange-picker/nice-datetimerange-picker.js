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