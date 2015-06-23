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
