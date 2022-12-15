/**
 * @ngdoc date
 * @name niceElements.filter:niceDate
 * @function
 * @description
 * # niceDate
 * Filter in the niceElements.
 */
angular.module('niceElements').filter('niceDate', function () {
  return function (object, addTime, addSeconds) {
    var formatString = "D.M.YYYY";
    if (addTime) {
      formatString = "D.M.YYYY • H:mm";
      if (addSeconds) formatString += ":ss";
    }
    return moment(object).format(formatString);
  };
});