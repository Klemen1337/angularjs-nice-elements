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
      format: '@', // default: 'DD.MM.YYYY HH:mm', format for input label string
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
      help: '@'
    },
    controller: function ($scope) {
        $scope.date = $scope.date == 'true' || $scope.date == true;
        $scope.time = $scope.time == 'true' || $scope.time == true;
        $scope.noMargin === 'true' || $scope.noMargin === true;
        $scope.enableOkButtons === 'true' || $scope.enableOkButtons === true;
        $scope.lang = $scope.lang || 'en';
        $scope.okText = $scope.okText || 'OK';
        $scope.cancelText = $scope.cancelText || 'Cancel';
        $scope.weekStart = parseInt($scope.weekStart) || 1;
        $scope.width = parseInt($scope.width) || 300;
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
        });

        $scope.$watch('model', function (newModel, oldModel) {
          $scope.value = moment(newModel).format($scope.format);
        });
      }
    }
});