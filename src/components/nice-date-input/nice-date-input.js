'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDatetimePicker
 * @description
 * # niceDatetimePicker
 */
angular.module('niceElements')
  .directive('niceDateInput', function () {
    return {
      restrict: 'E',
      transclude: false,
      templateUrl: 'src/components/nice-date-input/nice-date-input.html',
      scope: {
        model: '=', // binding model
        date: '=?', // default: true, is date picker enabled?
        time: '=?', // default: false, is time picker enabled?
        minDate: '@', // default: undefined
        maxDate: '@', // default: undefined
        title: '@', // default: ''
        noMargin: '@', // default: false, if noMargin==true then entire directive can be injected inside other divs
        fieldWidth: '@', // default: 'col-sm-8', bootstrap classes that defines width of field
        labelWidth: '@', // default: 'col-sm-4', bootstrap classes that defines width of label
        isDisabled: '=',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },
      controller: function ($scope, $timeout) {
        $scope.formatDate = "DD.MM.YYYY";
        $scope.formatTime = "HH:mm";
        if ($scope.date === undefined) $scope.date = true;
        if ($scope.time === undefined) $scope.time = true;
        $scope.model = moment($scope.model) || moment().set({ 'second': 0, 'millisecond': 0 });
        $scope.inner = {
          timeModel: angular.copy($scope.model),
          dateModel: angular.copy($scope.model)
        };

        $scope.dateChanged = function () {
          $timeout(function () {
            $scope.modelDate = $scope.inner.dateModel.format($scope.formatDate);
            $scope.handleChange();
          });
        }

        $scope.timeChanged = function () {
          $timeout(function () {
            $scope.modelTime = $scope.inner.timeModel.format($scope.formatTime);
            $scope.handleChange();
          });
        }

        // -------------------- On date change --------------------
        $scope.handleChange = function () {
          var newModel = moment($scope.modelDate + " " + $scope.modelTime, $scope.formatDate + " " + $scope.formatTime).seconds(0).milliseconds(0);
          if (newModel.isValid()) {
            $scope.model = newModel;
            $scope.niceDateInputForm.$setValidity('validDate', true);
          } else {
            $scope.model = null;
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
          if ($scope.onChange) $scope.onChange({ model: $scope.model });
          $scope.niceDateInputForm.$setDirty();
        }

        // -------------------- Format model --------------------
        $scope.formatModel = function () {
          $scope.modelDate = $scope.model.format($scope.formatDate);
          $scope.modelTime = $scope.model.format($scope.formatTime);
        }
        $scope.formatModel();

        // -------------------- Date --------------------
        $scope.dateBlur = function () {
          var newDate = moment($scope.modelDate, $scope.formatDate);
          if (newDate.isValid()) {
            $scope.niceDateInputForm.$setValidity('validDate', true);
            $scope.handleChange();
          } else {
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
        };

        // -------------------- Time --------------------
        $scope.timeBlur = function () {
          var newTime = moment($scope.modelTime, $scope.formatTime);
          if (newTime.isValid()) {
            $scope.niceDateInputForm.$setValidity('validDate', true);
            $scope.handleChange();
          } else {
            $scope.niceDateInputForm.$setValidity('validDate', false);
          }
        };

        // -------------------- Watch model --------------------
        $scope.$watch('model', function () {
          $scope.formatModel();
          $scope.inner = {
            timeModel: angular.copy($scope.model),
            dateModel: angular.copy($scope.model)
          };

        });
      }
    }
  }
  );