/**
 * @ngdoc date
 * @name niceElements.service:NiceService
 * @function
 * @description
 * # NiceService
 * Service in the niceElements.
 */
angular.module('niceElements')
  .service('NiceService', function () {
    var service = {
      name: "Nice elements",
      version: "1.7.11",
      getHeader: function () {
        return {};
      }
    };

    return service;
  })