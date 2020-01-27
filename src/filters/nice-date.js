/**
 * @ngdoc date
 * @name niceElements.filter:niceDate
 * @function
 * @description
 * # niceDate
 * Filter in the niceElements.
 */
angular.module('niceElements').filter('niceDate', function () {
  return function(object, addDate) {
    var formatString = "D.M.YYYY";
    if (addDate) formatString = "D.M.YYYY • H:mm";
    return moment(object).format(formatString);
  };
});