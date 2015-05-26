'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDate
 * @description
 * # niceDate
 */
angular.module('niceElements')

  .directive('niceDate', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/nice-date.html',
      scope: {
        model: '=',
        title: '@',
        fieldWidth: '@',
        labelWidth: '@',
        format: '@',
        min: '@',
        max: '@',
        startDate: '=',
        endDate: '='
      },

      link: function(scope, iElement, iAttrs, ctrl){
        if(!angular.isDefined(scope.format)) scope.format = "dd.MM.yyyy";

        scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };
      },

      controller: function($scope, gettextCatalog) {
        if(!angular.isDefined($scope.model)) $scope.model = moment().format();

        $scope.today = function() {
          $scope.model = new Date();
        };

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
        };

      }

    };
  });
