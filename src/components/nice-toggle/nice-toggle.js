'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceToggle
 * @description
 * # niceToggle
 */
angular.module('niceElements')
  .directive('niceToggle', function () {
    return {
      templateUrl: 'src/components/nice-toggle/nice-toggle.html',
      restrict: 'E',
      scope: {
        model: '=',
        title: '@',
        isDisabled: '=',
        fieldWidth: '@',
        labelWidth: '@',
        defaultFalse: '@',
        noMargin: '@',
        onChange: '&?',
        isInline: '=',
        help: '@'
      },
      controller: function ($scope) {
        if (!$scope.title) { $scope.title = ''; }
        if (!$scope.fieldWidth) { $scope.fieldWidth = 'col-sm-8'; }
        if (!$scope.labelWidth) { $scope.labelWidth = 'col-sm-4'; }

        // ------------------------- Set overlay button position based on passed state in $scope.model -------------------------
        $scope.setButtonPosition = function (state) {
          if (state) {
            $scope.buttonClass = "yesno-button-yes";
          } else {
            $scope.buttonClass = "yesno-button-no";
          }
        };

        // ------------------------- Watch for changes from outside -------------------------
        $scope.$watch('model', function (value_new, value_old) {
          if (angular.isDefined($scope.model)) {
            $scope.setButtonLabel($scope.model);
            $scope.setButtonPosition($scope.model);
          }
        });

        // ------------------------- Watch for model value -------------------------
        $scope.$watch('modelValue', function (value_new, value_old) {
          if ($scope.options) {
            $scope.model = $scope.modelValue == $scope.options[0];
          }
        });

        // ------------------------- Set button label -------------------------
        $scope.setButtonLabel = function (state) {
          if (state) {
            $scope.state = $scope.yes;
          } else {
            $scope.state = $scope.no;
          }
        };

        // ------------------------- Set width -------------------------
        $scope.setWidth = function (width, el) {
          el.style.width = width;
        };


        // ------------------------- Switch -------------------------
        $scope.switch = function () {
          if (!$scope.isDisabled) {
            $scope.model = !$scope.model;

            if ($scope.options) {
              if ($scope.model) {
                $scope.modelValue = $scope.options[0];
              } else {
                $scope.modelValue = $scope.options[1];
              }
            }

            if ($scope.onChange) $scope.onChange({ model: $scope.model });
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
