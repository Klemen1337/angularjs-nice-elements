'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceNumber
 * @description
 * # niceNumber
 */
angular.module('niceElements')
  .directive('niceNumber', function () {
    return {
      templateUrl: 'src/components/nice-number/nice-number.html',
      restrict: 'E',
      scope: {
        model: '=',
        valid: '=',
        disabled: '=',
        title: '@?',
        min: '@',
        max: '@',
        defaultValue: '@',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        hideError: '@',
        preventZero: "@",
        noMargin: '@',
        step: '@',
        decimals: '@',
        allowNegative: '@',
        floatingError: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      controller: function($scope, $timeout) {
        $scope.canAdd = true;
        $scope.canSubstract = true;
        $scope.preventZero = $scope.preventZero == "true";

        // Link form object with valid object
        if ($scope.valid) {
          $scope.valid = $scope.forma;
        }

        // Fix min
        if (!$scope.min) $scope.min = 0;
        else $scope.min = parseFloat($scope.min);

        // Allow negative
        if ($scope.allowNegative) $scope.min = -Infinity;

        // Fix max
        if ($scope.max) $scope.max = parseFloat($scope.max);

        // Set default value
        if (!$scope.defaultValue) {
          if ($scope.min != 0 && $scope.min != -Infinity) $scope.defaultValue = $scope.min;
          else $scope.defaultValue = 0;
        } else {
          $scope.defaultValue = parseInt($scope.defaultValue);
        }

        // Fix decimals
        if (!$scope.decimals) $scope.decimals = 0;
        else $scope.decimals = parseInt($scope.decimals);

        // Fix step
        if (!$scope.step) $scope.step = 1;
        else $scope.step = parseFloat($scope.step);


        // Check if number is defined
        if (!$scope.model) {
          $scope.model = $scope.defaultValue;
        } else {
          if(parseFloat($scope.model)) {
            $scope.model = parseFloat($scope.model);
          } else {
            $scope.model = $scope.defaultValue;
          }
        }

        // Check canAdd or canSubtract
        $scope.check = function() {
          if ($scope.required && ($scope.model == undefined || $scope.model == null)) {
            $scope.niceNumberForm.$setValidity("no-value", false);
          } else {
            $scope.niceNumberForm.$setValidity("no-value", null);
          }

          if ($scope.min && parseFloat($scope.model) <= $scope.min) {
            $scope.canSubstract = false;
            // $scope.model = $scope.min;
          } else {
            $scope.canSubstract = true;
          }

          if ($scope.max && parseFloat($scope.model) >= $scope.max) {
            $scope.canAdd = false;
            // $scope.model = $scope.max;
          } else {
            $scope.canAdd = true;
          }

          if ($scope.preventZero && parseFloat($scope.model) == 0) {
            $scope.niceNumberForm.$setValidity("zero", false);
          } else {
            $scope.niceNumberForm.$setValidity("zero", null);
          }

          if ($scope.onChange) $scope.onChange({ model: $scope.model });
        };


        // Check when load
        $timeout(function() {
          $scope.check();
        });


        // On input change
        $scope.inputChanged = function() {
          $scope.check();
        };
        

        // Watch for model change
        $scope.$watch("model", function() {
          $scope.check();
        });


        // Add to the value
        $scope.add = function() {
          var result = new Decimal($scope.model != undefined ? $scope.model : $scope.defaultValue).plus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if ($scope.max) {
            if (result <= parseFloat($scope.max)) {
              $scope.model = result;
              $scope.niceNumberForm.$setDirty();
            }
          } else {
            $scope.model = result;
            $scope.niceNumberForm.$setDirty();
          }
          $scope.check();
        };


        // Subtract to the value
        $scope.subtract = function() {
          var result = new Decimal($scope.model != undefined ? $scope.model : $scope.defaultValue).minus($scope.step).toNumber();
          if (result >= Number($scope.min)) {
            $scope.model = result;
            $scope.niceNumberForm.$setDirty();
          }
          $scope.check();
        };
      }
    };
  });
