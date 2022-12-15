/**
 * @ngdoc date
 * @name niceElements.filter:niceHighlight
 * @function
 * @description
 * # niceHighlight
 * Filter in the niceElements.
 */
angular.module('niceElements').filter('niceHighlight', function () {
  return function (value, highlightedText) {
    if (!value) return "";
    var regex = new RegExp(highlightedText, 'gmi');
    var newValue = String(value).replace(regex, "<span class='nice-highligh'>$&</span>");
    return newValue;
  };
});
