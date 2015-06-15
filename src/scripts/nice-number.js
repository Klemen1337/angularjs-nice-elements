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
      templateUrl: 'views/nice-number.html',
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
        noMargin: '@'
      },

      link: function (scope, element, attrs) {
        // Link form object with valid object
        if(angular.isDefined(attrs.valid)) scope.valid = scope.form;
        if(!angular.isDefined(attrs.showError)) scope.showError = false;
        if(!angular.isDefined(scope.min)) scope.min = scope.defaultMin;


        var setDefault = function(){
          if(angular.isDefined(scope.defaultValue)) scope.model = scope.defaultValue;
          else if(angular.isDefined(attrs.min)) scope.model = parseInt(scope.min);
          else scope.model = 0;
        };


        // Check if number is defined
        if (!angular.isDefined(attrs.model)){
          setDefault();
        } else {
          if(parseFloat(scope.model)){
            scope.model = parseFloat(scope.model);
          } else {
            setDefault();
          }
        }

        scope.check();
      },

      controller: function($rootScope, $scope) {
        $scope.defaultMin = 0;
        $scope.canAdd = true;
        $scope.canSubstract = true;

        // Check canAdd or canSubstract
        $scope.check = function(){
          if($scope.min && parseFloat($scope.model) <= $scope.min) $scope.canSubstract = false;
          else $scope.canSubstract = true;

          if($scope.max && parseFloat($scope.model) >= $scope.max) $scope.canAdd = false;
          else $scope.canAdd = true;
        };


        // Add to the value
        $scope.add = function(){
          if(angular.isDefined($scope.max)){
            if(parseInt($scope.model) < $scope.max) {
              $scope.model = parseInt($scope.model) + 1;
              $scope.form.$setDirty();
            }
          } else {
            $scope.model = parseInt($scope.model) + 1;
            $scope.form.$setDirty();
          }
          $scope.check();
        };


        // Substract to the value
        $scope.subtract = function(){
          if(parseInt($scope.model) > $scope.min){
            $scope.model = parseInt($scope.model) - 1;
            $scope.form.$setDirty();
          }
          $scope.check();
        };
      }
    };
  });
