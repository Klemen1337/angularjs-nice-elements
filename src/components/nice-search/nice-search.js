'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSearch
 * @description
 * # niceSearch
 */
angular.module('niceElements')
  .directive('niceSearch', function () {
    return {
      transclude: true,
      templateUrl: 'src/components/nice-search/nice-search.html',
      restrict: 'E',
      scope: {
        model: '=',
        isDisabled: '=',
        title: '@?',
        placeholder: '@',
        required: '@',
        fieldWidth: '@',
        labelWidth: '@',
        hideValid: '@',
        refreshFunction: '=',
        refreshSelectedCallback: '=',
        showDropdown: '@?',
        clearInput: '@',
        resetSearchInput: '@?',
        keyForInputLabel: '@?',
        disableRow: '@?',
        noMargin: '@',
        setText: '@',
        tabIndex: '@',
        isFocused: '@'
      },
      link: function (scope, element, attrs, ctrl, transcludeFn) {

        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        attrs.required = angular.isDefined(attrs.required);
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.hideValid = angular.isDefined(attrs.hideValid);
        attrs.showDropdown = angular.isDefined(attrs.showDropdown);
        attrs.clearInput = angular.isDefined(attrs.clearInput);
        attrs.resetSearchInput = angular.isDefined(attrs.resetSearchInput);
        attrs.disableRow = angular.isDefined(attrs.disableRow);
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        if (!attrs.setText) { attrs.setText = ''; }

        // This is used for connecting directive's scope to transcluded html.
        // transcludeFn(scope, function(clone, scope) {
        //   var el = element.find('.nice-search');
        //   el.append(clone);
        // });

        // Set default text
        scope.$watch("setText", function(){
          scope.modelString = scope.setText;
        });

        // Check if object is defined
        if(angular.isDefined(scope.model)){
          if (angular.isDefined(scope.keyForInputLabel))
            scope.modelString = scope.model[scope.keyForInputLabel];
          else
            scope.modelString = scope.model;
        }

        var setValid = function(isValid){
          if(scope.required){
            scope.form.$setValidity('objectSelected', isValid);
          }
        };

        scope.$watch('model', function(newValue){
          if(scope.model && scope.model.id){
            setValid(true);
          } else {
            setValid(false);
          }
        });

        scope.selectRow = function(obj){
          if (angular.isDefined(scope.refreshSelectedCallback)){
            scope.refreshSelectedCallback(obj);
          }

          if (scope.resetSearchInput){
            scope.model = null;
          } else {
            scope.model = obj;
          }

          if (angular.isDefined(scope.keyForInputLabel))
            scope.modelString = obj[scope.keyForInputLabel];
          else
            scope.modelString = obj;

          scope.clear();

        };

        scope.clear = function(){
          scope.results = [];

          if(scope.clearInput){
            scope.modelString = "";
          }

          //scope.$apply();
        };

        // Close the dropdown if clicked outside
        var onClick = function(event){
          var isClickedElementChildOfPopup = element.find(event.target).length > 0;

          if (isClickedElementChildOfPopup) return;

          scope.results = [];
          scope.noResults = false;
          scope.$apply();
        };

        angular.element(element).on('click', onClick);

        // Keyboard up/down on search results
        var onKeyDown = function(event) {
          if((event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27) && scope.results && scope.results.length>0){
            event.preventDefault();

            if(event.keyCode == 27){ // Escape
              scope.modelString = "";
              scope.clear();
            }

            if(event.keyCode == 13){ // Enter
              scope.selectRow(scope.results[scope.selectedIndex]);
            }

            if(event.keyCode == 40 && scope.results && scope.selectedIndex+1 < scope.results.length){ // Down
              scope.selectedIndex += 1;
            }

            if(event.keyCode == 38 && scope.results && scope.selectedIndex-1 >= 0){ // Up
              scope.selectedIndex -= 1;
            }

            // TODO: What to do when hover?

            scope.$apply();
          }
        };

        angular.element(element).on('keydown', onKeyDown);

        scope.$on('$destroy', function () {
          angular.element(element).off('click', onClick);
          angular.element(element).off('keydown', onKeyDown);
        });

      },
      controller: function($scope, $timeout, $element) {
        $scope.id = Math.random().toString(36).substring(7);
        $scope.loading = false;
        $scope.noResults = false;
        $scope.requests = 0;

        $scope.focus = function() {
          var input = $element[0].getElementsByTagName('input')[0];
          if (input) {
            input.focus();
          }
        };

        // Is focused
        if ($scope.isFocused) {
          $scope.focus();
        }

        $scope.results = [];
        var updateList = function(results, requestNumber){

          if(results){
            if ($scope.requests == requestNumber){
              $scope.noResults = results.length == 0;
              $scope.results = results;

              if(!$scope.noResults){
                $scope.selectedIndex = 0;
              }
            }
          }
          $scope.loading = false;
        };

        // ng-change function
        $scope.updateSearch = function () {
          $scope.loading = true;

          if ($scope.timer_promise)
            $timeout.cancel($scope.timer_promise);

          $scope.timer_promise = $timeout(function(){
            $scope.requests = $scope.requests + 1;
            var requestNumber = angular.copy($scope.requests);
            $scope.refreshFunction($scope.modelString).then(function(response){
              updateList(response, requestNumber);
            }, function(error){
              $scope.loading = false;
            });
            // Why was this here?
            // $scope.model = $scope.modelString;
          }, 200);

        };

        // If search button is clicked set focus or make request
        $scope.search = function(){
          if (!$scope.isDisabled){
            if($scope.showDropdown) {
              $scope.updateSearch();
            }
            $scope.focus();
          }
        };

        // Clear model
        $scope.remove = function(){
          $scope.model = null;
          $scope.modelString = null;
        }
      }
    }
  });
