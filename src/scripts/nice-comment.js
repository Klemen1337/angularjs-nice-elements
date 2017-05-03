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
        title: '@?',
        placeholder: '@',
        noTextLabel: '@',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        help: '@',
        rows: '@'
      },
      link: function postLink(scope, element, attrs) {
        if (scope.model==null) { scope.model =  ''; }
        if (!attrs.placeholder) { attrs.placeholder = ''; }
        if (!attrs.noTextLabel) { angular.isDefined(attrs.noTextLabel); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.help) { attrs.help = ''; }
        if (!attrs.rows) { attrs.rows = 3; }

        var textareas = element.find('textarea');

        scope.edit = function(){
          scope.editing=true;
          $timeout(function(){
            textareas[0].focus();
          });
        };

        textareas[0].addEventListener('keydown', autosize);
        autosize();

        function autosize() {
          var el = textareas[0];
          setTimeout(function () {
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            if(el.scrollHeight + 14 < 50){
              el.style.cssText = 'height:' + (el.scrollHeight) + 'px';
            } else {
              el.style.cssText = 'height:' + (el.scrollHeight + 14) + 'px';
            }
          }, 0);
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
