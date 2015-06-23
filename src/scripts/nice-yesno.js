'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceYesno
 * @description
 * # niceYesno
 */
angular.module('niceElements')
  .directive('niceYesno', function ($animate, $compile) {

    var setButtonLabel = function(scope, state){
      if (state)
          scope.state = scope.yes;
        else
          scope.state = scope.no;
    };

    var setWidth = function(width, el){
       el.style.width = width;
    };

     var setWidthBootstrap = function(bootstrapClass, el){
       $animate.addClass(el, bootstrapClass);
    };


    return {
      templateUrl: 'views/nice-yesno.html',
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

      link: function postLink(scope, element, attrs) {
        if (!attrs.yes) { attrs.yes = 'Yes'; }
        if (!attrs.no) { attrs.no = 'No'; }
        if (!attrs.title) { attrs.title = ''; }
        attr.isDisabled = angular.isDefined(attrs.isDisabled);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attr.defaultFalse = angular.isDefined(attrs.defaultFalse);
        attr.noMargin = angular.isDefined(attrs.noMargin);

        if(!angular.isDefined(scope.model) && !angular.isDefined(scope.options)){
          scope.model = !angular.isDefined(scope.defaultFalse);
        }

        if(!angular.isDefined(scope.modelValue) && angular.isDefined(scope.options)){
          scope.modelValue = scope.options[0];
        }

        // Set label based on state passed in scope.model
        setButtonLabel(scope, scope.model);

        // Set overlay button position based on passed state in scope.model
        var setButtonPosition = function(state) {
          var el = element[0].querySelector('.yesno-button');
          if(state) {
            $animate.removeClass(el, 'yesno-button-no');
            $animate.addClass(el, 'yesno-button-yes');
          } else {
            $animate.addClass(el, 'yesno-button-no');
            $animate.removeClass(el, 'yesno-button-yes');
          }
        };

        // Save reference to function on scope
        scope.setButtonPosition = setButtonPosition;

        // Call it first time
        setButtonPosition(scope.model);

        // Watch for changes from outside
        scope.$watch('model', function(value_new, value_old){
          if(angular.isDefined(scope.model)){
            setButtonLabel(scope, scope.model);
            scope.setButtonPosition(scope.model);
          }
        });

        scope.$watch('modelValue', function(value_new, value_old){
          if(scope.options){
            scope.model = scope.modelValue == scope.options[0];
          }
        });
      },

      controller: function($rootScope, $scope) {
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
      }
    };
  });
