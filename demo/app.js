
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
  var staticPath = '/';
  var appPathRoute = '/';
  var pagesPath = staticPath + 'demo/';

  $routeProvider.otherwise({ redirectTo: appPathRoute + 'home' });
  $routeProvider.when(appPathRoute + 'home', { templateUrl: pagesPath + 'home/home.html' });

  $routeProvider.when(appPathRoute + 'nice-input', { templateUrl: pagesPath + 'examples/nice-input.html' });
  $routeProvider.when(appPathRoute + 'nice-dropdown', { templateUrl: pagesPath + 'examples/nice-dropdown.html' });
  $routeProvider.when(appPathRoute + 'nice-search', { templateUrl: pagesPath + 'examples/nice-search.html' });
  $routeProvider.when(appPathRoute + 'nice-datetime-picker', { templateUrl: pagesPath + 'examples/nice-datetime-picker.html' });
  $routeProvider.when(appPathRoute + 'nice-date-range', { templateUrl: pagesPath + 'examples/nice-date-range.html' });
  $routeProvider.when(appPathRoute + 'nice-time-picker', { templateUrl: pagesPath + 'examples/nice-time-picker.html' });
  $routeProvider.when(appPathRoute + 'nice-choice', { templateUrl: pagesPath + 'examples/nice-choice.html' });
  $routeProvider.when(appPathRoute + 'nice-yesno', { templateUrl: pagesPath + 'examples/nice-yesno.html' });
  $routeProvider.when(appPathRoute + 'nice-percent', { templateUrl: pagesPath + 'examples/nice-percent.html' });
  $routeProvider.when(appPathRoute + 'nice-notifications', { templateUrl: pagesPath + 'examples/nice-notifications.html' });
  $routeProvider.when(appPathRoute + 'nice-number', { templateUrl: pagesPath + 'examples/nice-number.html' });
  $routeProvider.when(appPathRoute + 'nice-checkbox', { templateUrl: pagesPath + 'examples/nice-checkbox.html' });
  $routeProvider.when(appPathRoute + 'nice-button', { templateUrl: pagesPath + 'examples/nice-button.html' });
  $routeProvider.when(appPathRoute + 'nice-calendar', { templateUrl: pagesPath + 'examples/nice-calendar.html' });
  $routeProvider.when(appPathRoute + 'nice-popup', { templateUrl: pagesPath + 'examples/nice-popup.html' });
  $routeProvider.when(appPathRoute + 'nice-icon', { templateUrl: pagesPath + 'examples/nice-icon.html' });
  $routeProvider.when(appPathRoute + 'nice-upload', { templateUrl: pagesPath + 'examples/nice-upload.html' });
  $routeProvider.when(appPathRoute + 'nice-date-input', { templateUrl: pagesPath + 'examples/nice-date-input.html' });
  $routeProvider.when(appPathRoute + 'nice-filters', { templateUrl: pagesPath + 'examples/nice-filters.html' });
}]);