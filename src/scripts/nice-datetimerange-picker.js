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
          modelFormat: 'YYYY-MM-DDTHH:mmZZ',
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
            $scope.dateStart = moment();
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
                $scope.dateStart = moment($scope.modelStart, params.modelFormat).locale(params.lang);
              }
              else {
                $scope.dateStart = moment($scope.modelStart).locale(params.lang);
              }
            }
          }

          // initialize dateEnd
          if (typeof($scope.modelEnd) === 'undefined' || $scope.modelEnd === null) {
            $scope.dateEnd = moment();
            $scope.dateEnd.add(7, 'days');
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
                $scope.dateEnd = moment($scope.modelEnd, params.modelFormat).locale(params.lang);
              }
              else {
                $scope.dateEnd = moment($scope.modelEnd).locale(params.lang);
              }
            }
          }

          // fix dateEnd if it's before dateStart
          if ($scope.dateStart > $scope.dateEnd){
            $scope.dateEnd = moment($scope.dateStart).add(7, 'days');
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
          $scope.modelStart = angular.copy($scope.internalStart);
          $scope.modelEnd = angular.copy($scope.internalEnd);
          $scope.showDtpRange = false;
        };

        $scope.cancelClick = function(){
          $scope.showDtpRange = false;
          $scope.internalStart = angular.copy($scope.modelStart);
          $scope.internalEnd = angular.copy($scope.modelEnd);
          setLabelValue();
        };

        //$scope.$on('dateSelected', function () {
        //  $scope.formDatetimePicker.$setDirty();
        //  console.log('date selected');
        //});
        $scope.$watchGroup(['dateStart', 'dateEnd'], function (newValues) {
          if (newValues[0]>newValues[1]){
            // switch values
            $scope.dateStart = newValues[1];
            $scope.dateEnd = newValues[0];
          }else{
            $scope.internalStart = moment(newValues[0]).locale(params.lang).format(params.modelFormat);
            $scope.internalEnd = moment(newValues[1]).locale(params.lang).format(params.modelFormat);
            setLabelValue();
          }

        });

        $scope.$watchGroup(['modelStart', 'modelEnd'], function(){
          initCurrentDates();
        });

      }
    }
  };

}]);
