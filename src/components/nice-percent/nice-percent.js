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
      templateUrl: 'src/components/nice-percent/nice-percent.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        title: '@?',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        placeholder: '@',
        noMargin: '@',
        help: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
      },

      controller: function($rootScope, $scope) {
        // Link form object with valid object
        if (angular.isDefined($scope.valid)){
          $scope.valid = $scope.form;
        }

        var roundN = function(number, decimals){
          return Number(new Decimal(String(number)).toFixed(decimals, 4));
        };

        if (angular.isDefined($scope.model)){
          $scope.internalModel = roundN((angular.copy($scope.model) * 100), 6);
        } else {
          $scope.internalModel = "0";
          $scope.model = 0;
        }

        $scope.change = function(){
          if($scope.internalModel){
            $scope.internalModel = String($scope.internalModel).replace(',', '.');
            if(parseFloat($scope.internalModel) > 100) $scope.internalModel = 100;
            $scope.model = roundN(parseFloat($scope.internalModel) / 100, 6);
          } else {
            $scope.model = 0;
          }
        };

        $scope.keypress = function(event) {
          if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
            if($scope.internalModel.indexOf(".") >= 0){
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
            $scope.internalModel = roundN(angular.copy($scope.model) * 100, 6);
          }
        });

        $scope.$watch('internalModel', function (value_new, value_old) {
          if(!$scope.internalModel){
            $scope.internalModel = "0";
          }
        });
      }
    };
  });
