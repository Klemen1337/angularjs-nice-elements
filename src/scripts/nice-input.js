angular.module('niceElements')
  .directive('niceInput', function () {
    return {
      templateUrl: 'views/nice-input.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        valid: '=',
        isDisabled: '=',
        type: '@',
        title: '@?',
        regex: '@?',
        placeholder: '@',
        minlength: '@',
        maxlength: '@',
        required: '@',
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
        maxLength: '@?'
      },

      link: function (scope, element, attrs) {
        if (!angular.isDefined(attrs.showValid)){
          scope.showValid = false;
        }

        // If type not defined, set to text
        if (!angular.isDefined(attrs.type)){
          scope.type = "text";
          scope.internalType = "text";
        }

        if (angular.isDefined(attrs.valid)){
          scope.valid = scope.form;
        }

        if (!angular.isDefined(attrs.maxLength)){
          scope.maxLength = 100;
        }

        if (angular.isDefined(attrs.minDecimalsCutZeros)){
          scope.model = parseFloat(scope.model);
          if (scope.model.toString().split('.').length < 2 || scope.model.toString().split('.')[1].length < parseInt(attrs.minDecimalsCutZeros))
            scope.model = (parseFloat(scope.model)).toFixed(parseInt(attrs.minDecimalsCutZeros));
        }

        if(angular.isDefined(scope.type)){
          scope.internalType = scope.type;
          if(scope.type == "percent"){
            scope.internalType = "percent";
            scope.symbol = '%';
          }
          else if(scope.type == "number"){
            scope.internalType = "text";
            scope.model = parseFloat(scope.model);
          }
          else if(scope.type == "integer"){
            scope.internalType = "text";
            scope.model = Number(scope.model);
          }
        }

        scope.area = angular.isDefined(attrs.textArea);

        if (!angular.isDefined(attrs.textAreaLines))
          scope.textAreaLines = 3;

        if (angular.isDefined(scope.type)){
          if(scope.type == "email"){
            // TODO: get rid of the errors
            scope.regexexp = new RegExp('^[_a-zA-Z0-9]+(.[_a-zA-Z0-9]+)*@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)+(.[a-zA-Z]{2,4})');
          }else{
            scope.regexexp = null;
          }
        }

        if (angular.isDefined(scope.regex) && scope.regex!=''){
          scope.regexexp = new RegExp(scope.regex);
        }

        scope.$watch('model', function (value_new, value_old) {
          scope.internalModel = scope.model;
        });

        scope.$watch('internalModel', function (value_new, value_old) {
          if(scope.type == "number" && value_new) {
            if(typeof value_new != "number") {
              scope.internalModel = value_new.replace(',', '.');
              scope.model = scope.internalModel;
            }
          }
        });
      },

      controller: function($rootScope, $scope) {
        $scope.id = Math.random().toString(36).substring(7);



        $scope.keypress = function(event) {
          if($scope.type == "number" || $scope.type == "integer") {
            if (event.charCode == 46 || event.charCode == 44) { // Handle "." and "," key (only one allowed)
              if($scope.type == "number"){
                if(String($scope.model).indexOf(".") >= 0){
                  event.preventDefault();
                  return false;
                }
              } else {
                event.preventDefault();
                return false;
              }
            } else if (event.charCode == 45){
              if(String($scope.model).indexOf("-") >= 0){
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
        }

      }
    };
  });
