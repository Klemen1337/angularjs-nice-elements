
/**
 * @ngdoc directive
 * @name niceElements.directive:niceButton
 * @description
 * # niceButton
 */
angular.module('niceElements')
  .directive('niceButton', function ($q) {
    return {
      templateUrl: 'views/nice-button.html',
      restrict: 'E',
      transclude: true,
      scope: {
        //loading: "=?",
        //disabled: '@',
        title: "@",
        noMargin: "=",
        fieldWidth: '@',
        labelWidth: '@',
        niceClick: '&'
      },
      link: function postLink(scope, element, attrs) {
        scope.loading = false;

        scope.click = function(){

          if (scope.loading===false){
            scope.loading = true;

            $q.when(scope.niceClick()).finally(function(){
              scope.loading = false;
            });
          }
        }
      }
    };
  });
