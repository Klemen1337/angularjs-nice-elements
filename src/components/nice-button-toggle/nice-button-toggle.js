
/**
 * @ngdoc directive
 * @name niceElements.directive:niceButtonToggle
 * @description
 * # niceButtonToggle
 */
angular.module('niceElements')
  .directive('niceButtonToggle', function () {
    return {
      templateUrl: 'src/components/nice-button-toggle/nice-button-toggle.html',
      restrict: 'E',
      scope: {
        model: "=?",
        label: "@"
      },
      link: function postLink(scope, element, attrs) {
        if(angular.isDefined(scope.model)){
          scope.model = false;
        }
      }
    };
  });
