angular.module('niceElements')
  .directive('niceInput', function () {
    return {
      templateUrl: 'src/components/nice-input/nice-input.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        type: '@',
        title: '@?',
        regex: '@?',
        regexRaw: '@?',
        regexError: '@?',
        placeholder: '@',
        min: '@?',
        max: '@?',
        minlength: '@?',
        maxlength: '@?',
        required: '=',
        fieldWidth: '@',
        labelWidth: '@',
        hideValid: '@',
        showValid: '@',
        textArea: '@',
        textAreaLines: '@',
        symbol: '@',
        help: '@',
        name: '@',
        noMargin: '@',
        minDecimalsCutZeros: '@', // Use this field to tell how much decimal places must always be, even if number is ceil.
        tabIndex: '@',
        isFocused: '@',
        isInline: '=',
        onChange: '&?',
        onClear: '&?',
        numbersOnly: '=', // Allow only numbers in the input
        multilanguage: '=?', // Multiple languages object
        multilanguageField: '@?', // Multiple languages field name
      },

      link: function (scope, element, attrs) {
        if (!attrs.type) { attrs.type = 'text'; }
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.regex) { attrs.regex = null; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.minlength) { attrs.minlength = 1; }
        if (!attrs.maxlength) { attrs.maxlength = 100; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.textAreaLines) { attrs.textAreaLines = 3; }
        if (!attrs.symbol) { attrs.symbol = ''; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.name) { attrs.name = ''; }
        if (!attrs.minDecimalsCutZeros) { attrs.minDecimalsCutZeros = 0; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        attrs.showValid = angular.isDefined(attrs.showValid);
        attrs.textArea = angular.isDefined(attrs.textArea);
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        attrs.required = attrs.required === 'true';
        //attrs.required = angular.isDefined(attrs.required);

        if (!scope.textArea) {
          scope.elementType = "input";
        } else {
          scope.elementType = "textarea";
        }

        if (scope.isFocused) {
          var input = element[0].getElementsByTagName(scope.elementType)[0];
          if (input) input.focus();
        }

        // Set internal type
        scope.internalType = attrs.type;
        if (attrs.type == "percent") {
          scope.internalType = "percent";
          attrs.symbol = '%';
        } else if (attrs.type == "number") {
          scope.internalType = "number";
          if (scope.model) {
            scope.model = Number(scope.model);
          } else {
            scope.model = null;
          }
        } else if (attrs.type == "integer") {
          scope.internalType = "text";
          scope.model = Number(scope.model);
        } else if (attrs.type == "email") {
          // TODO: get rid of the errors
          scope.regexexp = new RegExp('^[_a-zA-Z0-9]+(.[_a-zA-Z0-9]+)*@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)+(.[a-zA-Z]{2,4})');
        }

        if (angular.isDefined(attrs.valid)) {
          scope.valid = scope.form;
        }

        if (angular.isDefined(attrs.minDecimalsCutZeros) && attrs.type == 'number') {
          scope.model = Number(scope.model);
          if (scope.model.toString().split('.').length < 2 || scope.model.toString().split('.')[1].length < parseInt(attrs.minDecimalsCutZeros)) {
            scope.model = Number((Number(scope.model)).toFixed(parseInt(attrs.minDecimalsCutZeros)));
          }
        }

        if (angular.isDefined(scope.regex) && scope.regex != '') {
          scope.regexexp = new RegExp(scope.regex);
        }

        if (angular.isDefined(scope.regexRaw) && scope.regexRaw != '') {
          scope.regexexp = regexRaw;
        }

        scope.$watch('model', function (value_new, value_old) {
          scope.internalModel = scope.model;
        });

        scope.$watch('internalModel', function (value_new, value_old) {
          if (attrs.type == "number" && value_new) {
            if (typeof value_new != "number") {
              scope.internalModel = value_new.replace(',', '.');
              scope.model = scope.internalModel;
              if (scope.onChange) scope.onChange({ model: scope.model });
            }
          } else {
            scope.model = scope.internalModel;
            if (scope.onChange) scope.onChange({ model: scope.model });
          }
        });
      },

      controller: function ($scope, $rootScope, ngDialog) {
        $scope.id = Math.random().toString(36).substring(7);

        // Handle multiple language field if empty
        if ($scope.multilanguageField && !$scope.multilanguage) {
          $scope.multilanguage = {};
        }
        if ($scope.multilanguage && $scope.multilanguageField && !$scope.multilanguage[$scope.multilanguageField]) {
          $scope.multilanguage[$scope.multilanguageField] = {};
          $scope.numberOfLanguages = 0;
        }

        // Watch for multilanguage change
        $scope.$watch('multilanguage', function () {
          if ($scope.multilanguage && $scope.multilanguageField) {
            $scope.numberOfLanguages = Object.keys($scope.multilanguage[$scope.multilanguageField]).length;
          }
        });

        // Open multilanguage modal
        $scope.openMultilanguage = function () {
          var scope = $rootScope.$new(true);
          var dialog = ngDialog.open({
            template: '<nice-multilangual-modal model="model" multilanguage="multilanguage" multilanguage-field="{{ multilanguageField }}" callback="callback" dialog="dialog"></nice-multilangual-modal>',
            plain: true,
            scope: scope,
            className: 'ngdialog ngdialog-theme-default nice-ngdialog-theme',
            showClose: false,
          });
          scope.dialog = dialog;
          scope.model = angular.copy($scope.model);
          scope.multilanguage = angular.copy($scope.multilanguage);
          scope.multilanguageField = $scope.multilanguageField;
          scope.callback = function (newFields) {
            var filteredFields = {};
            angular.forEach(newFields, function (value, key) {
              if (value != '') filteredFields[key] = value;
            })
            if (!$scope.multilanguage) $scope.multilanguage = {};
            if (!$scope.multilanguage[$scope.multilanguageField]) $scope.multilanguage[$scope.multilanguageField] = {};
            $scope.multilanguage[$scope.multilanguageField] = filteredFields;
            $scope.numberOfLanguages = Object.keys($scope.multilanguage[$scope.multilanguageField]).length;
          };
        }

        $scope.keypress = function (event) {
          if ($scope.numbersOnly) {
            if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
              return true;
            } else { // Prevent everything else
              event.preventDefault();
              return false;
            }
          }

          if ($scope.type == "number" || $scope.type == "integer") {
            if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
              if ($scope.type == "number") {
                if (String($scope.model).indexOf(".") >= 0) {
                  event.preventDefault();
                  return false;
                }
              } else {
                event.preventDefault();
                return false;
              }
            } else if (event.charCode == 45) {
              if (String($scope.model).indexOf("-") >= 0) {
                event.preventDefault();
                return false;
              }
            } else if ((event.charCode >= 48 && event.charCode <= 58) || event.charCode == 0) { // Allow only numbers
              return true;
            } else { // Prevent everything else
              event.preventDefault();
              return false;
            }
          }
        };
      }
    };
  });
