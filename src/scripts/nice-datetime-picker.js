'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimePicker
 * @description
 * # niceDatetimePicker
 */
angular.module('niceElements')

.directive('niceDatetimePicker', ['$window', '$timeout', function($window, $timeout) {

  return {
    scope: {
      //onChange: '&', // function called on date changed
      model: '=', // binding model
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
      labelWidth: '@' // default: 'col-sm-4', bootstrap classes that defines width of label
    },
    templateUrl: 'views/nice-datetime-picker.html',
    link: function($scope, $element, $attrs) {
      // default parameters
      var params = {
        title: '',
        noMargin: false,
        fieldWidth: 'col-sm-8',
        labelWidth: 'col-sm-4',
        format: 'DD.MM.YYYY HH:mm',
        minDate : null, maxDate : null, lang : 'en',
        weekStart : 1, shortTime : false,
        cancelText : 'Cancel', okText : 'OK',
        date: true, time: false, width: 300, enableOkButtons: false
      };

      // prepare attributes
      params.date = $scope.date === 'true';
      params.time = $scope.time === 'true';
      if ($scope.format)
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
      if ($scope.shortTime)
        params.shortTime = $scope.shortTime;
      if ($scope.noMargin)
        params.noMargin = $scope.noMargin === 'true';

      $scope.date = params.date;
      $scope.time = params.time;

      if ($scope.width){
        params.width = parseInt($scope.width);
      }else{
        $scope.width = params.width;
      }
      $scope.dtp_content_style = {width: params.width + 'px'};

      // copy attributes back to scope - for template usage
      angular.extend($scope, params);

      //console.log($scope.date, $scope.time, params.date, params.time)
      //// if minDate value is 'today', set today's date
      //if (params.minDate) {
      //  if (params.minDate === 'today') {
      //    $scope.minDate = $window.moment();
      //  }
      //}
      //// if maxDate value is 'today', set today's date
      //if (params.maxDate) {
      //  if (params.maxDate === 'today') {
      //    $scope.maxDate = $window.moment();
      //  }
      //}

      if ($scope.model) {
        $scope.currentDate = $scope.model;
      }

      // functions are defined in a variable 'var that', not in $scope
      var that = {
        init: function () {
          //console.log('init');

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
        initDates: function () {
          //console.log('initDates');
          if ($scope.model) {
            $scope.currentDate = moment($scope.model).locale(params.lang);
          }
          else {
            if (typeof(params.currentDate) !== 'undefined' && params.currentDate !== null) {
              if (typeof(params.currentDate) === 'string') {
                $scope.currentDate = moment($scope.currentDate, params.format).locale(params.lang);
              }
              else {
                if (typeof(params.currentDate.isValid) === 'undefined' || typeof(params.currentDate.isValid) !== 'function') {
                  var x = params.currentDate.getTime();
                  $scope.currentDate = moment(x, "x").locale(params.lang);
                }
                else {
                  $scope.currentDate = params.currentDate;
                }
              }
            }
            else {
              $scope.currentDate = moment();
            }

            that.setDateModel();
            that.setElementValue();

          }

          // Parse minDate
          if (typeof($scope.minDate) !== 'undefined' && $scope.minDate !== null) {
            if (typeof($scope.minDate) === 'string') {
              $scope.minDate = moment($scope.minDate).locale(params.lang);
            }
            else {
              if (typeof($scope.minDate.isValid) === 'undefined' || typeof($scope.minDate.isValid) !== 'function') {
                var x = $scope.minDate.getTime();
                $scope.minDate = moment(x, "x").locale(params.lang);
              }
            }
          }

          // Parse maxDate
          if (typeof($scope.maxDate) !== 'undefined' && $scope.maxDate !== null) {
            if (typeof($scope.maxDate) === 'string') {
              $scope.maxDate = moment($scope.maxDate).locale(params.lang);
            }
            else {
              if (typeof($scope.maxDate.isValid) === 'undefined' || typeof($scope.maxDate.isValid) !== 'function') {
                var x = $scope.maxDate.getTime();
                $scope.maxDate = moment(x, "x").locale(params.lang);
              }
            }
          }

          // Fix currentDate if violates minDate and maxDate constraints
          if (!that.isAfterMinDate($scope.currentDate)) {
            $scope.currentDate = moment($scope.minDate);
          }
          if (!that.isBeforeMaxDate($scope.currentDate)) {
            $scope.currentDate = moment($scope.maxDate);
          }
        },
        initDate: function () {
          //console.log('initDate');
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
          //console.log('initHours');
          $scope.currentView = 1;
          $scope.hours = [];
          $scope.minutes = [];

          var w = params.width;

          var ml = $($element).find('.dtp-picker-clock').css('marginLeft').replace('px', '');
          var mr = $($element).find('.dtp-picker-clock').css('marginRight').replace('px', '');

          var pl = $($element).find('.dtp-picker').css('paddingLeft').replace('px', '');
          var pr = $($element).find('.dtp-picker').css('paddingRight').replace('px', '');

          $($element).find('.dtp-picker-clock').innerWidth(w - (parseInt(ml) + parseInt(mr) + parseInt(pl) + parseInt(pr)));

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
            var cH = (($scope.currentDate.format('hh') == 24) ? 0 : $scope.currentDate.format('hh'));
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
            var cH = (($scope.currentDate.format('hh') == 24) ? 0 : $scope.currentDate.format('hh'));
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
          //console.log('initMinutes');
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

            //var minuteLink = $('<a>', {
            //  href: 'javascript:void(0);',
            //  class: 'dtp-select-minute'
            //}).data('minute', m).text();
            //if (m == 5 * Math.round(this.currentDate.minute() / 5)) {
            //  minuteLink.addClass('selected');
            //  this.currentDate.minute(m);
            //}

            _minutes.push(_minute);
          }

          $scope.minutes = _minutes;

          that.toggleTime(false);

          $($element).find('.dtp-picker-clock').css('height', ($($element).find('.dtp-picker-clock').width()) + (parseInt(pT) + parseInt(mT)) + 'px');

          that.initHands(false);
          that._centerBox();
        },
        initHands: function (t) {
          //console.log('initHands');
          //this.$dtpElement.find('.dtp-picker-clock').append
          //(
          //    '<div class="dtp-hand dtp-hour-hand"></div>' +
          //    '<div class="dtp-hand dtp-minute-hand"></div>' +
          //    '<div class="dtp-clock-center"></div>'
          //);

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
            //this.$element.trigger('dateSelected', this.currentDate);
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
          if (typeof(date) !== 'undefined'){
            $scope.currentDate = moment(date).locale(params.lang);
          }

          $scope.value = moment($scope.currentDate).locale(params.lang).format(params.format);
        },
        setDateModel: function() {
          $scope.model = angular.copy($scope.currentDate);
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
                that.hide();
              }
              break;
            case 1:
              that.initMinutes();
              break;
            case 2:
              that.setElementValue();
              that.setDateModel();
              that.hide();
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
            console.log('hour disabled');
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
        _onSelectAM: function (e) {
          $scope.isPM = false;

          //$('.dtp-actual-meridien').find('a').removeClass('selected');
          //$(e.currentTarget).addClass('selected');

          if ($scope.currentDate.hour() >= 12) {
            if ($scope.currentDate.subtract(12, 'hours'))
              that.showTime($scope.currentDate);
          }
          that.toggleTime(($scope.currentView === 1));
        },
        _onSelectPM: function (e) {
          $scope.isPM = true;
          //$(e.currentTarget).addClass('selected');

          if ($scope.currentDate.hour() < 12) {
            if ($scope.currentDate.add(12, 'hours'))
              that.showTime($scope.currentDate);
          }
          that.toggleTime(($scope.currentView === 1));
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
        //destroy: function () {
        //  this._detachEvents();
        //  this.$dtpElement.remove();
        //},
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
        },
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

      $scope.$watch('model', function(newDate){
        ////console.log('detected new date, updating label')
        that.setElementValue(newDate);
      });

      that.init();
    }
  };

}]);
