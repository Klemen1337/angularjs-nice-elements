
/**
 * @ngdoc directive
 * @name niceElements.directive:niceButton
 * @description
 * # niceButton
 */
angular.module('niceElements')
  .directive('niceButton', function () {
    return {
      templateUrl: 'views/nice-button.html',
      restrict: 'E',
      scope: {
        loading: "=?",
        disabled: '@',
        title: "@",
        noMargin: "=",
        fieldWidth: '@',
        labelWidth: '@'
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
