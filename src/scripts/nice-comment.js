'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceComment
 * @description
 * # niceComment
 */
angular.module('niceElements')
  .directive('niceComment', function ($timeout) {
    return {
      templateUrl: 'views/nice-comment.html',
      restrict: 'E',
      scope: {
        model: '=',
        placeholder: '@',
        noTextLabel: '@',
        noMarginBottom: '@',
        fieldWidth: '@',
        labelWidth: '@',
        help: '@',
        rows: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (scope.model==null)
          scope.model =  '';

        if (!scope.rows)
          scope.rows = 3;

        var textareas = element.find('textarea');

        scope.edit = function(){
          scope.editing=true;
          $timeout(function(){
            textareas[0].focus();
          });
        };
      },
      controller: function($scope){
        $scope.editing = false;

        $scope.save = function(){
          $scope.editing = false;
        };
      }
    };
  });
