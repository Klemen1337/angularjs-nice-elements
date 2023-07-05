
'use strict';
angular.module('niceElementsDemo', [
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngAnimate',
  'gettext',
  'ngDialog',
  'niceElements'
]).config(['$routeProvider', '$locationProvider', '$compileProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false);
  var staticPath = '/';
  var appPathRoute = '/';
  var pagesPath = staticPath + 'demo/';

  $routeProvider.otherwise({ redirectTo: appPathRoute + 'home' });
  $routeProvider.when(appPathRoute + 'home', { templateUrl: pagesPath + 'home/home.html', meta: { name: "Home" } });

  $routeProvider.when(appPathRoute + 'nice-input', { templateUrl: pagesPath + 'examples/nice-input.html', meta: { name: "Input" } });
  $routeProvider.when(appPathRoute + 'nice-dropdown', { templateUrl: pagesPath + 'examples/nice-dropdown.html', meta: { name: "Dropdown" } });
  $routeProvider.when(appPathRoute + 'nice-search', { templateUrl: pagesPath + 'examples/nice-search.html', meta: { name: "Search" } });
  $routeProvider.when(appPathRoute + 'nice-datetime-picker', { templateUrl: pagesPath + 'examples/nice-datetime-picker.html', meta: { name: "Datetime picker" } });
  $routeProvider.when(appPathRoute + 'nice-date-range', { templateUrl: pagesPath + 'examples/nice-date-range.html', meta: { name: "Date range" } });
  $routeProvider.when(appPathRoute + 'nice-time-picker', { templateUrl: pagesPath + 'examples/nice-time-picker.html', meta: { name: "Time picker" } });
  $routeProvider.when(appPathRoute + 'nice-choice', { templateUrl: pagesPath + 'examples/nice-choice.html', meta: { name: "Choice" } });
  $routeProvider.when(appPathRoute + 'nice-yesno', { templateUrl: pagesPath + 'examples/nice-yesno.html', meta: { name: "Yesno" } });
  $routeProvider.when(appPathRoute + 'nice-percent', { templateUrl: pagesPath + 'examples/nice-percent.html', meta: { name: "Percent" } });
  $routeProvider.when(appPathRoute + 'nice-notifications', { templateUrl: pagesPath + 'examples/nice-notifications.html', meta: { name: "TesNotificationst" } });
  $routeProvider.when(appPathRoute + 'nice-number', { templateUrl: pagesPath + 'examples/nice-number.html', meta: { name: "Number" } });
  $routeProvider.when(appPathRoute + 'nice-checkbox', { templateUrl: pagesPath + 'examples/nice-checkbox.html', meta: { name: "Checkbox" } });
  $routeProvider.when(appPathRoute + 'nice-button', { templateUrl: pagesPath + 'examples/nice-button.html', meta: { name: "Button" } });
  $routeProvider.when(appPathRoute + 'nice-calendar', { templateUrl: pagesPath + 'examples/nice-calendar.html', meta: { name: "Calendar" } });
  $routeProvider.when(appPathRoute + 'nice-popup', { templateUrl: pagesPath + 'examples/nice-popup.html', meta: { name: "Popup" } });
  $routeProvider.when(appPathRoute + 'nice-icon', { templateUrl: pagesPath + 'examples/nice-icon.html', meta: { name: "Icon" } });
  $routeProvider.when(appPathRoute + 'nice-upload', { templateUrl: pagesPath + 'examples/nice-upload.html', meta: { name: "Upload" } });
  $routeProvider.when(appPathRoute + 'nice-date-input', { templateUrl: pagesPath + 'examples/nice-date-input.html', meta: { name: "Date input" } });
  $routeProvider.when(appPathRoute + 'nice-filters', { templateUrl: pagesPath + 'examples/nice-filters.html', meta: { name: "Filters" } });
  $routeProvider.when(appPathRoute + 'nice-quantity', { templateUrl: pagesPath + 'examples/nice-quantity.html', meta: { name: "Quantity" } });
  $routeProvider.when(appPathRoute + 'nice-loader', { templateUrl: pagesPath + 'examples/nice-loader.html', meta: { name: "Loader" } });
  $routeProvider.when(appPathRoute + 'nice-wrapper', { templateUrl: pagesPath + 'examples/nice-wrapper.html', meta: { name: "Wrapper" } });
}]);