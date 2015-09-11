'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceSearch
 * @description
 * # niceSearch
 */
angular.module('niceElements')
  .directive('niceSearch', function ($document) {
    return {
      transclude: true,
      templateUrl: 'views/nice-search.html',
      restrict: 'E',
      scope: {
        model: '=',
//        modelString: '=',
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
        setText: '@'
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
        transcludeFn(scope, function(clone, scope) {
          var el = element.find('.nice-search');
          el.append(clone);
        });

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
        $document.bind('click', function(event){
          var isClickedElementChildOfPopup = element.find(event.target).length > 0;

          if (isClickedElementChildOfPopup) return;

          scope.results = [];
          scope.noResults = false;
          scope.$apply();
        });

        // Keyboard up/down on search results
        element.bind('keydown', function(event) {
          if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 && scope.showDropdown){
            event.preventDefault();

            if(event.keyCode == 27){ // Escape
              scope.modelString = "";
              scope.clear();
            }

            if(event.keyCode == 13){ // Enter
              scope.selectRow(scope.results[scope.selectedIndex]);
            }

            if(event.keyCode == 40 && scope.selectedIndex+1 < scope.results.length){ // Down
              scope.selectedIndex += 1;
            }

            if(event.keyCode == 38 && scope.selectedIndex-1 >= 0){ // Up
              scope.selectedIndex -= 1;
            }

            // TODO: What to do when hover?

            scope.$apply();
          }
        });

      },
      controller: function($scope, $timeout) {
        $scope.id = Math.random().toString(36).substring(7);
        
        $scope.loading = false;
        $scope.noResults = false;

        $scope.results = [];
        var updateList = function(results){
          if(results){
            $scope.noResults = results.length == 0;
            $scope.results = results;

            if(!$scope.noResults){
              $scope.selectedIndex = 0;
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
            $scope.refreshFunction($scope.modelString).then(updateList);
            $scope.model = $scope.modelString;
          }, 300);


        };

        // If search button is clicked set focus or make request
        $scope.search = function(){
          if (!$scope.isDisabled){
            if($scope.showDropdown) {
              $scope.updateSearch();
            }
            $("#"+$scope.id).focus();
          }
        };
      }
    }
  });
