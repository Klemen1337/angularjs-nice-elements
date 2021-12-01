
'use strict';
angular.module('niceElementsDemo', [
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngAnimate',
  'gettext',
  'niceElements'
]).config(['$routeProvider', '$locationProvider', '$compileProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false);
  var staticPath;
  staticPath = '/';
  var appPathRoute = '/';
  var pagesPath = staticPath + 'demo/';

  $routeProvider.when(appPathRoute + 'home', { templateUrl: pagesPath + 'home/home.html' });
  $routeProvider.otherwise({ redirectTo: appPathRoute + 'home' });
}]);