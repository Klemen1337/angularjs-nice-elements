'use strict';

angular.module('niceElements', ['ngMessages']);

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

angular.module('niceElements').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/nice-button-toggle.html',
    "<div class=\"nice-button-toggle row\">\n" +
    "    <div class=\"col-xs-offset-4 col-xs-8\">\n" +
    "            <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"model = !model\">\n" +
    "                {{ label }}\n" +
    "                <span ng-show=\"!model\" class=\"glyphicon glyphicon-menu-down\"></span>\n" +
    "                <span ng-show=\"model\" class=\"glyphicon glyphicon-menu-up\"></span>\n" +
    "            </button>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-choice.html',
    "<div class=\"nice-choice\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <ul class=\"list-unstyled\" ng-class=\"{'disabled': isDisabled}\">\n" +
    "                <li ng-repeat=\"item in internalList\" ng-class=\"{ 'selected' : isItemSelected(item) }\" ng-click=\"toggle(item)\">\n" +
    "                    <div class=\"choice-checkbox\" ng-class=\"{'circle' : !multiple }\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></div>\n" +
    "                    <div class=\"choice-label\">{{ getLabel(item) }}</div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formChoice\">\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-comment.html',
    "<div class=\"nice-comment\">\n" +
    "    <div class=\"row\" ng-class=\"noMarginBottom ? '':'margin-bottom-20'\">\n" +
    "        <div ng-show=\"!editing\" ng-class=\"labelWidth ? labelWidth : 'col-sm-6'\">\n" +
    "            <span ng-if=\"model=='' && !editing\"><a ng-click=\"edit()\">{{noTextLabel}} <i class=\"fa fa-pencil\"></i></a></span>\n" +
    "            <span ng-if=\"model!='' && !editing\"><a ng-click=\"edit()\">{{model}} <i class=\"fa fa-pencil\"></i></a></span>\n" +
    "        </div>\n" +
    "        <div ng-show=\"editing\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-6'\">\n" +
    "            <div class=\"relative\">\n" +
    "                <textarea\n" +
    "                    class=\"form-control\"\n" +
    "                    ng-model=\"model\"\n" +
    "                    title=\"{{ help }}\"\n" +
    "                    placeholder=\"{{placeholder}}\"\n" +
    "                    rows=\"{{rows}}\"\n" +
    "                    ng-blur=\"save()\"\n" +
    "                ></textarea>\n" +
    "                <!--<nice-input  placeholder=\"{{placeholder}}\" model=\"model\" name=\"{{'This text is placed at the end of the document.'|translate}}\" field-width=\"col-sm-12\" text-area></nice-input>-->\n" +
    "                <!--<div class=\"btn btn-sm btn-success btn-comment-save\" ng-click=\"save()\"><i class=\"fa fa-check\"></i></div>-->\n" +
    "                <!--<div class=\"btn btn-sm btn-danger btn-comment-cancel\" ng-click=\"cancel()\"><i class=\"fa fa-times\"></i></div>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-date-range.html',
    "<ng-form class=\"nice-date-range\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input date-range-picker class=\"form-control date-picker\" type=\"text\" options=\"opts\" ng-model=\"model\" />\n" +
    "            <span date-range-picker  options=\"opts\" ng-model=\"model\" class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-date.html',
    "<ng-form class=\"nice-date\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input\n" +
    "              type=\"text\"\n" +
    "              class=\"form-control\"\n" +
    "              datepicker-popup=\"{{ format }}\"\n" +
    "              ng-model=\"model\"\n" +
    "              is-open=\"opened\"\n" +
    "              min-date=\"{{ min }}\"\n" +
    "              max-date=\"max\"\n" +
    "              datepicker-options=\"dateOptions\"\n" +
    "              ng-required=\"true\"\n" +
    "              close-text=\"Close\"\n" +
    "              ng-click=\"open($event)\" />\n" +
    "\n" +
    "          <span class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-datetime-picker.html',
    "<div class=\"nice-datetime-picker\" name=\"form\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\" ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"dropdown\">\n" +
    "            <a class=\"dropdown-toggle\" id=\"dropdown{{randNum}}\" role=\"button\" data-toggle=\"dropdown\" data-target=\"#\" href>\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"labelValue\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-calendar\"></i></span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n" +
    "                <datetimepicker ng-if=\"opts.startView=='year' && opts.minView=='year'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'year', minView: 'year'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='year' && opts.minView=='day'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'year', minView: 'day'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='day' && opts.minView=='day'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'day', minView: 'day'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='day' && opts.minView=='minute'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'day', minView: 'minute'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='hour' && opts.minView=='minute'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'hour', minView: 'minute'}\" ></datetimepicker>\n" +
    "\n" +
    "                <datetimepicker ng-if=\"opts.startView=='hour' && opts.minView=='hour'\"\n" +
    "                                ng-model=\"dateObj\" on-set-time=\"callback(newDate)\"\n" +
    "                                datetimepicker-config=\"{dropdownSelector: '#dropdown{{randNum}}', startView: 'hour', minView: 'hour'}\" ></datetimepicker>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('views/nice-dropdown.html',
    "<div class=\"nice-dropdown\" ng-class=\"{ 'margin-bottom-0': noMargin }\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-4'\">\n" +
    "            <div ng-class=\"addButtonEnable && !isDisabled ? 'input-group': ''\">\n" +
    "                <div class=\"btn-group\" dropdown is-open=\"status.isopen\" ng-class=\"{ 'disabled': isDisabled || emptyList }\">\n" +
    "                    <button\n" +
    "                        type=\"button\"\n" +
    "                        class=\"btn btn-block btn-dropdown dropdown-toggle\"\n" +
    "                        title=\"{{ getLabel(internalSelected) }}\"\n" +
    "                        dropdown-toggle\n" +
    "                        ng-disabled=\"isDisabled || emptyList\">\n" +
    "\n" +
    "                        <span ng-if=\"internalSelected.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': internalSelected.color_hex_code}\"></span>\n" +
    "                        <span ng-if=\"!multiple\">{{ getLabel(internalSelected) }}</span>\n" +
    "\n" +
    "                        <span ng-if=\"multiple\">\n" +
    "                            <!--<span ng-repeat=\"item in internalSelected\"><span ng-if=\"$index > 0\">, </span>{{ getLabel(item) }}</span>-->\n" +
    "                            <span ng-if=\"internalSelected.length  > 1\">{{ internalSelected.length }} <translate>selected</translate></span>\n" +
    "                            <span ng-if=\"internalSelected.length  == 1\">{{ getLabel(internalSelected[0]) }}</span>\n" +
    "                            <span ng-if=\"internalSelected.length == 0\" translate>None</span>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <span ng-if=\"showTax && internalSelected.value\">{{ internalSelected.value * 100 }}%</span>\n" +
    "                        <span class=\"caret\"></span>\n" +
    "                    </button>\n" +
    "\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li ng-repeat=\"item in internalList\" ng-click=\"clicked(item)\">\n" +
    "                            <a href>\n" +
    "                                <span class=\"choice-checkbox\" ng-if=\"multiple\" ng-class=\"{ 'selected' : isItemSelected(item) }\"><i class=\"fa fa-check\"></i></span>\n" +
    "                                <span ng-if=\"item.color_hex_code\" class=\"dropdown-color\" ng-style=\"{'background': item.color_hex_code}\"></span>\n" +
    "                                <span ng-class=\"{'multiple-item': multiple}\">{{ getLabel(item) }}</span>\n" +
    "                                <span ng-if=\"showTax && item.value\">{{ item.value * 100 }}%</span>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <span class=\"input-group-btn\" ng-if=\"addButtonEnable && !isDisabled\">\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"addButtonFunction()\" type=\"button\">+</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formDropdown\"></div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/nice-input.html',
    "<ng-form class=\"nice-input\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"form-group\"\n" +
    "             ng-class=\"{\n" +
    "                'has-feedback': showValid && !hideValid,\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\n" +
    "                'symbol': symbol,\n" +
    "                'disabled': isDisabled\n" +
    "        }\">\n" +
    "            <input ng-show=\"!area\"\n" +
    "                class=\"form-control\"\n" +
    "                type=\"{{ internalType }}\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                name=\"{{ name }}\"\n" +
    "                id=\"{{ id }}\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                ng-minlength=\"minlength\"\n" +
    "                ng-maxlength=\"maxlength\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-keypress=\"keypress($event)\"\n" +
    "                ng-pattern=\"regexexp\"\n" +
    "                ng-disabled=\"isDisabled\"\n" +
    "                maxlength=\"{{maxLength}}\"\n" +
    "            >\n" +
    "            <textarea ng-show=\"area\"\n" +
    "                class=\"form-control\"\n" +
    "                ng-model=\"model\"\n" +
    "                title=\"{{ help }}\"\n" +
    "                id=\"{{ id }}\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                rows=\"{{textAreaLines}}\"\n" +
    "                ng-minlength=\"minlength\"\n" +
    "                ng-maxlength=\"maxlength\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-pattern=\"regexexp\"\n" +
    "                ng-disabled=\"isDisabled\"\n" +
    "            ></textarea>\n" +
    "\n" +
    "            <span class=\"input-group-addon\" ng-if=\"symbol\">{{ symbol }}</span>\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-messages=\"form.$error\" ng-if=\"form.$dirty\">\n" +
    "            <div class=\"error-message\" ng-message=\"email\" ng-if=\"form.$dirty\" translate>Email is not valid.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"form.$dirty\" translate>This field requires a specific pattern.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"minlength\"><translate>Your input is too short. It must contain at least</translate> {{ minlength }} <translate>characters</translate>.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"maxlength\" translate>Your input is too long</div>\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"form.$dirty\" translate>This field is required.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"unique\" translate>This field must be unique.</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>\n"
  );


  $templateCache.put('views/nice-label.html',
    "<div class=\"nice-label\">\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-xs-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}</label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-xs-8'\">\n" +
    "        <p class=\"value\">{{ value }}</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('views/nice-number.html',
    "<ng-form class=\"nice-number\" name=\"form\">\n" +
    "    <div ng-class=\"{'row' : !disableRow}\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}</label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\"\n" +
    "                ng-class=\"{'has-warning': !disabled && form.$invalid && form.$dirty}\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canSubstract\" ng-click=\"subtract()\">-</button>\n" +
    "                </span>\n" +
    "\n" +
    "                <input type=\"number\" class=\"form-control\" max=\"{{ max }}\" min=\"{{ min }}\" ng-model=\"model\">\n" +
    "\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-disabled=\"!canAdd\" ng-click=\"add()\">+</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div ng-messages=\"form.$error\" ng-if=\"showError\">\n" +
    "                <div class=\"error-message\" ng-message=\"number\" ng-if=\"form.$dirty\" translate>This field requires a number</div>\n" +
    "                <div class=\"error-message\" ng-message=\"min\"><translate>Min value is</translate> {{ min }}</div>\n" +
    "                <div class=\"error-message\" ng-message=\"max\"><translate>Max value is</translate> {{ max }}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-percent.html',
    "<ng-form class=\"nice-input\" name=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "        <div class=\"form-group has-feedback symbol\"\n" +
    "             ng-class=\"{\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty && !hideValid,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty && showValid,\n" +
    "                'disabled': isDisabled\n" +
    "        }\">\n" +
    "            <input\n" +
    "                class=\"form-control\"\n" +
    "                type=\"text\"\n" +
    "                max=\"100\"\n" +
    "                min=\"0\"\n" +
    "                ng-model=\"internalModel\"\n" +
    "                placeholder=\"{{ placeholder }}\"\n" +
    "                ng-required=\"required\"\n" +
    "                ng-keypress=\"keypress($event)\"\n" +
    "                ng-change=\"change()\"\n" +
    "                ng-disabled=\"isDisabled\">\n" +
    "\n" +
    "            <span class=\"input-group-addon\">%</span>\n" +
    "            <!--<span ng-if=\"!disabled && showValid && form.$valid && form.$dirty\" class=\"glyphicon glyphicon-ok form-control-feedback feedback-valid\" aria-hidden=\"true\"></span>-->\n" +
    "            <!--<span ng-if=\"!disabled && !hideValid && form.$invalid && form.$dirty\" class=\"glyphicon glyphicon-remove form-control-feedback feedback-invalid\" aria-hidden=\"true\"></span>-->\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-messages=\"form.$error\">\n" +
    "            <div class=\"error-message\" ng-message=\"email\" ng-if=\"form.$dirty\">Email is not valid.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"pattern\" ng-if=\"form.$dirty\">This field requires a specific pattern.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"required\" ng-if=\"form.$dirty\">This field is required.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"minlength\">Your field is too short. It must contain at least {{ minlength }} characters.</div>\n" +
    "            <div class=\"error-message\" ng-message=\"maxlength\">Your field is too long</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-search.html',
    "<ng-form class=\"nice-input nice-search\" ng-class=\"{'margin-bottom-0' : noMargin}\" name=\"form\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "            <label class=\"nice\">{{ title }}<span ng-if=\"required\">*</span></label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"input-group\" ng-class=\"{\n" +
    "                'disabled': isDisabled,\n" +
    "                'has-warning': !isDisabled && form.$invalid && form.$dirty,\n" +
    "                'has-success': !isDisabled && form.$valid && form.$dirty}\">\n" +
    "                <input\n" +
    "                    class=\"form-control\"\n" +
    "                    type=\"text\"\n" +
    "                    id=\"{{ id }}\"\n" +
    "                    ng-model=\"modelString\"\n" +
    "                    ng-keypress=\"keypress($event)\"\n" +
    "                    ng-model-options=\"modelOptions\"\n" +
    "                    placeholder=\"{{ placeholder }}\"\n" +
    "                    ng-disabled=\"isDisabled\"\n" +
    "                    ng-change=\"updateSearch()\"\n" +
    "                    ng-required=\"required\"\n" +
    "                >\n" +
    "\n" +
    "                <span class=\"input-group-addon clickable\" ng-click=\"search()\">\n" +
    "                    <i ng-show=\"!loading\" class=\"fa fa-search\" ></i>\n" +
    "                    <i ng-show=\"loading\" class=\"fa fa-refresh fa-spin\"></i>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\"></div>\n" +
    "        <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-8'\">\n" +
    "            <div class=\"nice-dropdown-empty\" ng-if=\"noResults\">\n" +
    "                <div class=\"nice-search-row\" translate>No results found.</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "  <!--Here is injected dropdown html if passed and results present and open.-->\n" +
    "  <!--<div ng-transclude></div>-->\n" +
    "</ng-form>"
  );


  $templateCache.put('views/nice-yesno.html',
    "<div class=\"row nice-yesno\">\n" +
    "    <div ng-class=\"labelWidth ? labelWidth : 'col-sm-4'\" ng-if=\"title\">\n" +
    "        <label class=\"nice\">{{ title }}</label>\n" +
    "    </div>\n" +
    "    <div ng-class=\"fieldWidth ? fieldWidth : 'col-sm-4'\">\n" +
    "        <div class=\"yesno-wrapper noselect\" ng-class=\"{ 'disabled': isDisabled }\">\n" +
    "            <div class=\"yesno-yes-bg\" ng-click=\"switch()\">{{ yes }}</div>\n" +
    "            <div class=\"yesno-no-bg\" ng-click=\"switch()\">{{ no }}</div>\n" +
    "            <div class=\"yesno-button\" ng-click=\"switch()\">{{ state }}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--Needed for intercepting form changes ($dirty)!-->\n" +
    "    <div ng-form=\"formYesno\">\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
