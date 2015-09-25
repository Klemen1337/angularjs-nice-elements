'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTimePicker
 * @description
 * # niceTimePicker
 */
angular.module('niceElements')

.directive('niceTimePicker', function($window, $compile) {

  return {
    scope: {
      model: '=', // binding model
      format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
      modelFormat: '@', // default: ''
      //minDate: '@', // default: undefined
      //maxDate: '@', // default: undefined
      title: '@', // default: ''
      noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
      fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
      labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
    },
    restrict: 'E',
    templateUrl: 'views/nice-time-picker.html',
    link: function($scope, $element, $attrs) {

      // default parameters
      var params = {
        //title: '',
        //noMargin: false,
        //fieldWidth: 'col-sm-8',
        //labelWidth: 'col-sm-4',
        format: 'HH:mm',
        modelFormat: 'HH:mm:ss'
      };

      if (angular.isDefined($scope.format) && $scope.format)
        params.format = $scope.format;

      if (angular.isDefined($scope.modelFormat) && $scope.modelFormat)
        params.modelFormat = $scope.modelFormat;

      // console.log(params);
      // functions are defined in a variable 'var that', not in $scope
      var that = {
        init: function () {
          $scope.showDtp = false;
          that.initDates();
          that.initHours();
        },

        initDates: function () {
          if (typeof($scope.model) === 'undefined' || $scope.model === null){
            $scope.currentDate = moment().seconds(0);
          }else{
            $scope.currentDate = moment($scope.model, params.modelFormat);
          }

          that.setDateModel();
          that.setElementValue();
        },
        initHours: function () {
          $scope.currentView = 1;
          $scope.hours = [];
          $scope.minutes = [];

          //var w = params.width;

          //var ml = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          //var mr = $($element).find('.dtp-picker-clock').css('marginRight').replace('px', '');

          //var pl = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          //var pr = $($element).find('.dtp-picker').css('paddingRight').replace('px', '');

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
        },
        animateHands: function () {
          var h = $scope.currentDate.hour();
          var m = $scope.currentDate.minute();

          that.rotateElement($($element).find('.dtp-hour-hand'), (360 / 12) * h);
          that.rotateElement($($element).find('.dtp-minute-hand'), ((360 / 60) * (5 * Math.round(m / 5))));
        },
        //isAfterMinDate: function (date, checkHour, checkMinute) {
        //  var _return = true;
        //
        //  if (typeof($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
        //    var _minDate = moment($scope.minDate);
        //    var _date = moment(date);
        //
        //    if (!checkHour && !checkMinute) {
        //      _minDate.hour(0);
        //      _minDate.minute(0);
        //
        //      _date.hour(0);
        //      _date.minute(0);
        //    }
        //
        //    _minDate.second(0);
        //    _date.second(0);
        //    _minDate.millisecond(0);
        //    _date.millisecond(0);
        //
        //    if (!checkMinute) {
        //      _date.minute(0);
        //      _minDate.minute(0);
        //
        //      _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
        //    }
        //    else {
        //      _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
        //    }
        //  }
        //
        //  return _return;
        //},
        //isBeforeMaxDate: function (date, checkTime, checkMinute) {
        //  var _return = true;
        //
        //  if (typeof($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
        //    var _maxDate = moment($scope.maxDate);
        //    var _date = moment(date);
        //
        //    if (!checkTime && !checkMinute) {
        //      _maxDate.hour(0);
        //      _maxDate.minute(0);
        //
        //      _date.hour(0);
        //      _date.minute(0);
        //    }
        //
        //    _maxDate.second(0);
        //    _date.second(0);
        //    _maxDate.millisecond(0);
        //    _date.millisecond(0);
        //
        //    if (!checkMinute) {
        //      _date.minute(0);
        //      _maxDate.minute(0);
        //
        //      _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
        //    }
        //    else {
        //      _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
        //    }
        //  }
        //
        //  return _return;
        //},
        rotateElement: function (el, deg) {
          $(el).css
          ({
            WebkitTransform: 'rotate(' + deg + 'deg)',
            '-moz-transform': 'rotate(' + deg + 'deg)'
          });
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
        setElementValue: function (date) {
          $scope.value = moment($scope.currentDate).format(params.format);
        },
        setDateModel: function() {
          $scope.model = moment($scope.currentDate).format(params.modelFormat);
        },
        toggleTime: function (isHours) {
          if (isHours) {
            angular.forEach($scope.hours, function(hour, hourKey){
              var _date = moment($scope.currentDate);
              _date.hour(hour.h).minute(0).second(0);
              hour.disabled = false;
            });
          }
          else {
            angular.forEach($scope.minutes, function(minute, minuteKey){
              var _minute = minute.m;
              var _date = moment($scope.currentDate);
              _date.minute(_minute).second(0);

              minute.disabled = false;
            });
          }
        },
        _onClick: function () {
          $scope.currentView = 1;
          that.initDates();
          that.show();
          $scope.showTime = true;
          that.initHours();
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
        _onSelectHour: function (hourSelected) {

          if (!hourSelected.disabled){
            // remove selected from all dates in $scope.weeks
            angular.forEach($scope.hours, function(hour, hourKey){
              $scope.hours[hourKey].selected = false;
            });
            hourSelected.selected = true;

            var dataHour = parseInt(hourSelected.h);

            $scope.currentDate.hour(dataHour);
            that.showTime($scope.currentDate);

            that.animateHands();
            that._onOKClick();
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
            that._onOKClick();
          }
        },

        setDate: function (date) {
          params.currentDate = date;
          that.initDates();
        },
        show: function () {
          $scope.showDtp = true;
        },
        hide: function () {
          $scope.showDtp = false;
        }
      };

      $scope.onClick = that._onClick;
      $scope.onCloseClick = that._onCloseClick;
      $scope.onSelectHour = that._onSelectHour;
      $scope.onSelectMinute = that._onSelectMinute;

      $scope.initHours = that.initHours;
      $scope.initMinutes = that.initMinutes;

      that.init();

      $scope.$watch('model', function(newDate){
        $scope.currentDate = moment(newDate, params.modelFormat);
        that.setElementValue();
        that.setDateModel();
      });
    }
  };

});