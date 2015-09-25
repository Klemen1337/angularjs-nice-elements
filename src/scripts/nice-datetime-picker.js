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


        var initCurrentDate = function () {
          if (typeof($scope.model) === 'undefined' || $scope.model === null) {
            $scope.currentDate = moment();
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

              $scope.currentDate = _time;


            } else {
              // all other combinations
              if (typeof($scope.model) === 'string') {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.currentDate = moment($scope.model, params.modelFormat).locale(params.lang);
                else
                  $scope.currentDate = moment.utc($scope.model, params.modelFormat).local().locale(params.lang);
              }
              else {
                if (params.modelFormat.indexOf('Z')>=0)
                  $scope.currentDate = moment($scope.model).locale(params.lang);
                else
                  $scope.currentDate = moment.utc($scope.model).local().locale(params.lang);
              }
            }
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

        initCurrentDate();

        $scope.opened = false;

        $scope.openDtp = function () {
          $scope.$broadcast('dtp-open-click');
          $scope.opened = true;
        };

        $scope.closeDtp = function(response) {
          $scope.$broadcast('dtp-close-click');
          $scope.opened = false;
        };

        $scope.$on('dateSelected', function () {
          $scope.formDatetimePicker.$setDirty();
          //console.log('date selected');
        });

        $scope.$watch('currentDate', function (newDate) {
          $scope.value = moment(newDate).locale(params.lang).format(params.format);
          if (!params.date && params.time){
            var _date = moment(newDate, params.modelFormat).locale(params.lang).format(params.modelFormat);
          }else{
            var _date = moment(newDate, params.modelFormat).utc().locale(params.lang).format(params.modelFormat);
          }
          //$scope.model = moment(newDate).locale(params.lang).format(params.modelFormat);
          $scope.model = _date;

        });

        $scope.$watch('model', function(){
          initCurrentDate();
        });

      }
    }
  };

});
