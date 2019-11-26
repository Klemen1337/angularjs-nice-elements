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
        showError: '@',
        noMargin: '@',
        step: '@',
        decimals: '@',
        allowNegative: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      link: function (scope, element, attrs) {
        // Set default value
        if (!attrs.defaultValue) {
          attrs.defaultValue = 0;
        } else {
          attrs.defaultValue = parseInt(attrs.defaultValue);
        }

        // Link form object with valid object
        if(angular.isDefined(attrs.valid)) {
          scope.valid = scope.form;
        }

        // Check if number is defined
        if (!angular.isDefined(attrs.model)){
          scope.model = attrs.defaultValue;
        } else {
          if(parseFloat(scope.model)){
            scope.model = parseFloat(scope.model);
          } else {
            scope.model = attrs.defaultValue;
          }
        }
      },

      controller: function($scope) {
        $scope.canAdd = true;
        $scope.canSubstract = true;

        // Fix min
        if(!$scope.min) $scope.min = 0;
        else $scope.min = parseFloat($scope.min);

        // Allow negative
        if ($scope.allowNegative) $scope.min = -Infinity;

        // Fix max
        if($scope.max) $scope.max = parseFloat($scope.max);

        // Fix decimals
        if(!$scope.decimals) $scope.decimals = 0;
        else $scope.decimals = parseInt($scope.decimals);

        // Fix step
        if(!$scope.step) $scope.step = 1;
        else $scope.step = parseFloat($scope.step);

        // Check canAdd or canSubtract
        $scope.check = function(){
          if($scope.min && parseFloat($scope.model) <= $scope.min) {
            $scope.canSubstract = false;
            $scope.model = $scope.min;
          } else {
            $scope.canSubstract = true;
          }

          if($scope.max && parseFloat($scope.model) >= $scope.max) {
            $scope.canAdd = false;
            $scope.model = $scope.max;
          } else {
            $scope.canAdd = true;
          }

          if ($scope.onChange) $scope.onChange({ model: $scope.model });
        };


        // Check when load
        $scope.check();


        // On input change
        $scope.inputChanged = function(){
          $scope.check();
        };


        // Add to the value
        $scope.add = function(){
          var result = new Decimal($scope.model).plus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if($scope.max){
            if(result <= parseFloat($scope.max)) {
              $scope.model = result;
              $scope.form.$setDirty();
            }
          } else {
            $scope.model = result;
            $scope.form.$setDirty();
          }
          $scope.check();
        };


        // Subtract to the value
        $scope.subtract = function(){
          var result = new Decimal($scope.model).minus($scope.step).toNumber(); //.toFixed($scope.decimals);
          if(result >= Number($scope.min)){
            $scope.model = result;
            $scope.form.$setDirty();
          }
          $scope.check();
        };
      }
    };
  });
