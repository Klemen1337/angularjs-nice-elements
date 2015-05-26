'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:nicePercent
 * @description
 * # nicePercent
 */
angular.module('niceElements')
  .directive('nicePercent', function () {
    return {
      templateUrl: 'views/nice-percent.html',
      restrict: 'E',
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        title: '@?',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@'
      },

      link: function (scope, element, attrs) {


      },

      controller: function($rootScope, $scope, MathService) {
        // Link form object with valid object
        if (angular.isDefined($scope.valid)){
          $scope.valid = $scope.form;
        }

        if (angular.isDefined($scope.model)){
          $scope.internalModel = MathService.roundN(angular.copy($scope.model) * 100, 6);
        } else {
          $scope.internalModel = "0";
          $scope.model = 0;
        }

        $scope.change = function(){
          if($scope.internalModel){
            $scope.internalModel = $scope.internalModel.replace(',', '.');
            if(parseFloat($scope.internalModel) > 100) $scope.internalModel = 100;
            $scope.model = MathService.roundN(parseFloat($scope.internalModel) / 100, 6);
          } else {
            $scope.model = 0;
          }
        };

        $scope.keypress = function(event) {
          if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
            if(String($scope.internalModel).indexOf(".") >= 0){
              event.preventDefault();
              return false;
            }
          } else if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
            return true;
          } else { // Prevent everything else
            event.preventDefault();
            return false;

          }
        };

        $scope.$watch('model', function (value_new, value_old) {
          if (value_new){
            $scope.internalModel = MathService.roundN(angular.copy($scope.model) * 100, 6);
          }
        });

      }
    };
  });
