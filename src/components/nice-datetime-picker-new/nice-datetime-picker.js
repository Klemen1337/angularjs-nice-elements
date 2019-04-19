'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimePicker
 * @description
 * # niceDatetimePicker
 */
angular.module('niceElements').directive('niceDatetimePickerNew', function () {
  return {
    restrict: 'E',
    transclude: false,
    templateUrl: 'src/components/nice-datetime-picker/nice-datetime-picker.html',
    scope: {
      model: '=', // binding model
      format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
      date: '@', // default: true, is date picker enabled?
      time: '@', // default: false, is time picker enabled?
      minDate: '@', // default: undefined
      maxDate: '@', // default: undefined
      title: '@', // default: ''
      noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
      fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
      labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
    },
    controller: function ($scope) {
        $scope.date = $scope.date == 'true' || $scope.date == true;
        $scope.time = $scope.time == 'true' || $scope.time == true;
        $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.isOpen = false;
        $scope.internalDate = moment($scope.model) || moment();

        if (!$scope.format) {
          if ($scope.date && !$scope.time) {
            $scope.format = 'DD.MM.YYYY';
          } else if (!$scope.date && $scope.time) {
            $scope.format = 'HH:mm';
          } else {
            $scope.format = 'DD.MM.YYYY HH:mm';
          }
        }


        $scope.years = [];
        var year = $scope.internalDate.year()-200;
        for(var i=0; i<200; i++) {
          $scope.years.push(year + i);
        }

        $scope.months = [];
        angular.forEach(moment.months(), function(month, index) {
          $scope.months.push({ value: index, name: month });
        });
        $scope.weekdays = [];
        angular.forEach(moment.weekdays(), function(weekday, index) {
          $scope.weekdays.push({ value: index, name: weekday });
        });


        $scope.$watch('internalDate', function (newDate) {
          $scope.model = moment(newDate);
          $scope.value = moment(newDate).format($scope.format);
        });

        $scope.$watch('model', function (newModel, oldModel) {
          $scope.value = moment(newModel).format($scope.format);
        });
      }
    }
});