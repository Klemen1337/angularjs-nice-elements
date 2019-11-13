'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceTimePicker
 * @description
 * # niceTimePicker
 */
angular.module('niceElements')
  .directive('niceTimePicker', function() {
    return {
      scope: {
        model: '=',
        title: '@',
        isDisabled: '=',
        noMargin: '@',
        fieldWidth: '@',
        labelWidth: '@',
        onChange: '&?',
        help: '@'
      },
      restrict: 'E',
      templateUrl: 'src/components/nice-time-picker/nice-time-picker.html',
      link: function($scope, $element, $attrs) {
        if(!$scope.model) $scope.model = moment();
        $scope.open = false;


        $scope.close = function(){
          $scope.open = false;
        };


        $scope.validateDate = function(){
          $scope.checkDate($scope.modelString);
        };


        $scope.checkDate = function(date){
          var parsedDate = moment(date, "HH:mm");
          if(parsedDate.isValid()){
            $scope.forma.$setValidity("valid-time", true);
            $scope.model = parsedDate;
            $scope.refreshTime();
            if ($scope.onChange) $scope.onChange({ model: $scope.model });
          } else {
            $scope.forma.$setValidity("valid-time", false);
            $scope.modelString = "";
          }
        };


        $scope.refreshTime = function(){
          $scope.hours = $scope.model.format("HH");
          $scope.minutes = $scope.model.format("mm");
          $scope.modelString = $scope.model.format("HH:mm");
        };


        $scope.changeHour = function(add){
          if(add) $scope.model.add(1, 'hour');
          else $scope.model.subtract(1, 'hour');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };

        $scope.changeMinutes = function(add){
          if(add) $scope.model.add(1, 'minutes');
          else $scope.model.subtract(1, 'minutes');
          $scope.refreshTime();
          $scope.forma.$setDirty();
        };


        $scope.$watch("model", function(value, oldValue){
          $scope.refreshTime();
          if(!value.isSame(oldValue)){
            $scope.checkDate(value);
          }
        })
      }
    };
  });