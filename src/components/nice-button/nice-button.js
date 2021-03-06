
/**
 * @ngdoc directive
 * @name niceElements.directive:niceButton
 * @description
 * # niceButton
 */
angular.module('niceElements')
  .directive('niceButton', function ($q) {
    return {
      templateUrl: 'src/components/nice-button/nice-button.html',
      restrict: 'E',
      transclude: true,
      scope: {
        niceDisabled: '=',
        title: '@',
        noMargin: '=',
        fieldWidth: '@',
        labelWidth: '@',
        niceClick: '&',
        addClass: '@',
        isInline: '=',
        type: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.loading = false;
        if (!scope.type) scope.type = "button";

        scope.click = function(){
          if (scope.loading===false && scope.niceDisabled!==true){
            scope.loading = true;

            $q.when(scope.niceClick()).finally(function(){
              scope.loading = false;
            });
          }
        };
      }
    };
  });
