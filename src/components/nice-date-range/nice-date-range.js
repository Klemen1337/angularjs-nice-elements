'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceDateRange
 * @description
 * # niceDateRange
 */
angular.module('niceElements')

  .directive('niceDateRange', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'src/components/nice-date-range/nice-date-range.html',
      scope: {
        model: '=',
        title: '@',
        fieldWidth: '@',
        format: '@',
        min: '@',
        max: '@',
        noMargin: '@',
        labelWidth: '@',
        startOfTheYear: '@',
        help: '@',
        isInline: '=',
        onChange: '&?'
      },

      link: function(scope, attrs){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.format) { attrs.format = 'dd.MM.yyyy'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if(!angular.isDefined(scope.model)) {
          var model = null;
          if(!angular.isDefined(scope.startOfTheYear)){
            model = {
              startDate: moment().format(),
              endDate: moment().format()
            };
          } else {
            model = {
              startDate: moment([moment().year()]).format(),
              endDate: moment().format()
            };
          }
          scope.model = model;
          if (scope.onChange) scope.onChange(scope.model);
        }
      },

      controller: function($scope) {
        $scope.opts = {
          locale: {
            applyClass: 'btn-green',
            firstDay: 1
          },
          ranges: {},
          min: $scope.min,
          max: $scope.max
        };

        $scope.opts.ranges[gettextCatalog.getString("Today", null, "Nice")] = [moment(), moment()];
        $scope.opts.ranges[gettextCatalog.getString("Last 7 days", null, "Nice")] = [moment().subtract(7, 'days'), moment()];
        $scope.opts.ranges[gettextCatalog.getString("Last 30 days", null, "Nice")] = [moment().subtract(30, 'days'), moment()];
        $scope.opts.ranges[gettextCatalog.getString("This month", null, "Nice")] = [moment().startOf('month'), moment().endOf('month')];

        if(angular.isDefined($scope.format)) $scope.opts.format = format;
      }

    };
  });
