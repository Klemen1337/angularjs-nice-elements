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
        help: '@'
      },

      link: function(scope, iElement, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        if (!attrs.format) { attrs.format = 'dd.MM.yyyy'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);

        if(!angular.isDefined(scope.model)) {
          if(!angular.isDefined(scope.startOfTheYear)){
            scope.model = {
              startDate: moment().format(),
              endDate: moment().format()
            }
          } else {
            scope.model = {
              startDate: moment([moment().year()]).format(),
              endDate: moment().format()
            }
          }
        }
      },

      controller: function($scope, $filter) { //gettextCatalog
        $scope.opts = {
          //format: 'DD.MM.YYYY',
          locale: {
            applyClass: 'btn-green',
            //applyLabel: gettextCatalog.getString("Apply"),
            //fromLabel: gettextCatalog.getString("From"),
            //toLabel: gettextCatalog.getString("To"),
            //cancelLabel: gettextCatalog.getString("Cancel"),
            //customRangeLabel: gettextCatalog.getString("Custom range"),
            firstDay: 1
            //daysOfWeek: [
            //  gettextCatalog.getString("Sun"),
            //  gettextCatalog.getString("Mon"),
            //  gettextCatalog.getString("Tue"),
            //  gettextCatalog.getString("Wed"),
            //  gettextCatalog.getString("Thu"),
            //  gettextCatalog.getString("Fri"),
            //  gettextCatalog.getString("Sat")
            //],
            //monthNames: [
            //  gettextCatalog.getString("January"),
            //  gettextCatalog.getString("February"),
            //  gettextCatalog.getString("March"),
            //  gettextCatalog.getString("April"),
            //  gettextCatalog.getString("May"),
            //  gettextCatalog.getString("June"),
            //  gettextCatalog.getString("July"),
            //  gettextCatalog.getString("August"),
            //  gettextCatalog.getString("September"),
            //  gettextCatalog.getString("October"),
            //  gettextCatalog.getString("November"),
            //  gettextCatalog.getString("December")
            //]
          },
          ranges: {},
          min: $scope.min,
          max: $scope.max
        };

        //$scope.opts.ranges[gettextCatalog.getString("Today")] = [moment(), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("Last 7 days")] = [moment().subtract(7, 'days'), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("Last 30 days")] = [moment().subtract(30, 'days'), moment()];
        //$scope.opts.ranges[gettextCatalog.getString("This month")] = [moment().startOf('month'), moment().endOf('month')];

        $scope.opts.ranges["Today"] = [moment(), moment()];
        $scope.opts.ranges["Last 7 days"] = [moment().subtract(7, 'days'), moment()];
        $scope.opts.ranges["Last 30 days"] = [moment().subtract(30, 'days'), moment()];
        $scope.opts.ranges["This month"] = [moment().startOf('month'), moment().endOf('month')];

        if(angular.isDefined($scope.format)) $scope.opts.format = format;
      }

    };
  });
