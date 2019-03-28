'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceYesno
 * @description
 * # niceYesno
 */
angular.module('niceElements')
  .directive('niceYesno', function () {
    return {
      templateUrl: 'src/components/nice-yesno/nice-yesno.html',
      restrict: 'E',
      scope: {
        model: '=',
        modelValue: '=',
        yes: '@',
        no: '@',
        title: '@',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        options: '=',
        defaultFalse: '@',
        noMargin: '@'
      },
      controller: function($scope, $attrs) {
        if (!$attrs.yes) { $attrs.yes = 'Yes'; }
        if (!$attrs.no) { $attrs.no = 'No'; }
        if (!$attrs.title) { $attrs.title = ''; }
        if (!$attrs.fieldWidth) { $attrs.fieldWidth = 'col-sm-8'; }
        if (!$attrs.labelWidth) { $attrs.labelWidth = 'col-sm-4'; }
        if(!angular.isDefined($scope.model) && !angular.isDefined($scope.options)) $scope.model = !angular.isDefined($scope.defaultFalse);
        if(!angular.isDefined($scope.modelValue) && angular.isDefined($scope.options)) $scope.modelValue = $scope.options[0];

        $attrs.defaultFalse = angular.isDefined($attrs.defaultFalse);
        $attrs.noMargin = angular.isDefined($attrs.noMargin);
        $attrs.isDisabled = angular.isDefined($attrs.isDisabled);

        $scope.buttonClass = "";
        

        // ------------------------- Set overlay button position based on passed state in $scope.model -------------------------
        $scope.setButtonPosition = function(state) {
          if(state) {
            $scope.buttonClass = "yesno-button-yes";
          } else {
            $scope.buttonClass = "yesno-button-no";
          }
        };

        // ------------------------- Watch for changes from outside -------------------------
        $scope.$watch('model', function(value_new, value_old){
          if(angular.isDefined($scope.model)){
            $scope.setButtonLabel($scope.model);
            $scope.setButtonPosition($scope.model);
          }
        });

        // ------------------------- Watch for model value -------------------------
        $scope.$watch('modelValue', function(value_new, value_old){
          if($scope.options){
            $scope.model = $scope.modelValue == $scope.options[0];
          }
        });

        // ------------------------- Set button label -------------------------
        $scope.setButtonLabel = function(state){
          if (state) {
            $scope.state = $scope.yes;
          } else {
            $scope.state = $scope.no;
          }
        };
        
        // ------------------------- Set width -------------------------
        $scope.setWidth = function(width, el){
          el.style.width = width;
        };
  

        // ------------------------- Switch -------------------------
        $scope.switch = function(){
          if(!$scope.isDisabled){
            $scope.model = !$scope.model;

            if($scope.options){
              if($scope.model){
                $scope.modelValue = $scope.options[0];
              } else {
                $scope.modelValue = $scope.options[1];
              }
            }

            $scope.formYesno.$setDirty();
          }
        };

        // Call it first time
        $scope.setButtonPosition($scope.model);

        // Set label based on state passed in $scope.model
        $scope.setButtonLabel($scope.model);
      }
    };
  });
