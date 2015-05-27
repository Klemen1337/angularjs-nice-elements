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
      replace: true,
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
        refreshDelay: '@',
        showDropdown: '@?',
        clearInput: '@',
        resetSearchInput: '@?',
        keyForInputLabel: '@?',
        disableRow: '@?',
        noMargin: '@',
        setText: '@'
      },
      link: function (scope, element, attrs, ctrl, transcludeFn) {

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
          if(angular.isDefined(scope.required)){
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

          if (angular.isDefined(scope.resetSearchInput)){
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

          if(angular.isDefined(scope.clearInput)){
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

        // Set default refresh delay
        if (angular.isDefined($scope.currency)){
          $scope.currency = '';
        }

        $scope.modelOptions = {
          debounce: 500 // Delay input for 0.5s
        };

        // Set default refresh delay
        if (angular.isDefined($scope.refreshDelay)){
          $scope.modelOptions.debounce = $scope.refreshDelay;
        }

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
          $scope.refreshFunction($scope.modelString).then(updateList);
          $scope.model = $scope.modelString;
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


// Stupid animation fix
angular.module('niceElements')
  .directive('ngShow', function($compile, $animate) {
    return {
      priority: 1000,
      link: function(scope, element, attrs) {

        if (element.hasClass('fa-refresh')) {
          // we could add no-animate and $compile per
          // http://stackoverflow.com/questions/23879654/angularjs-exclude-certain-elements-from-animations?rq=1
          // or we can just include that no-animate directive's code here
          $animate.enabled(false, element);
          scope.$watch(function() {
            $animate.enabled(false, element)
          })

        }
      }
    }
  });
