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
      link: function(scope, iElement, iAttrs, ctrl){

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

        // Default startView value
        if (!angular.isDefined(scope.startView))
          scope.startView = 'day';

        // Default minView value
        if (!angular.isDefined(scope.minView))
          scope.minView = 'day';

        // Default dateTimeFormat value
        if (!angular.isDefined(scope.dateTimeFormat))
          scope.dateTimeFormat = 'dd.MM.yyyy | HH:mm';


        scope.opts = {
          startView: scope.startView,
          minView: scope.minView,
          minuteStep: scope.minuteStep,
          dropdownSelector: '#dropdown' + scope.randNum
        };

      }

    };
  });
