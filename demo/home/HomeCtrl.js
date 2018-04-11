'use strict';

angular.module('myApp').controller('HomeCtrl', function ($scope, $http, $q, NiceNotification, $timeout) {
  $scope.emptyList = [];

  $scope.listObjs = [
    {id: 0, value: "Afganistan"},
    {id: 1, value: "Azerbajdzan"},
    {id: 2, value: "Belgija"},
    {id: 3, value: "Belorusija"},
    {id: 4, value: "Bolgarija"},
    {id: 5, value: "Burundi"}
  ];

  //$scope.listStrings = ["String 1", "String 2", "String 3"];
  $timeout(function () {
    $scope.niceNumber2 = 1.99887;
  }, 5000);

  $scope.niceNumber2 = 0.1;
  $scope.test = moment().subtract(10, "years");

  $scope.testRange = {
    startDate: moment(),
    endDate: moment().add(1, 'days')
  };


  $scope.dtp2 = {
    startDate: moment(),
    endDate: moment().add(1, 'days')
  };

  $scope.minRange = moment();
  $scope.maxRange = moment().add(1, 'months');

  $scope.changeTestRange = function () {
    // $scope.testRange = {
    //   startDate: $scope.testRange.startDate.add(1, 'day'),
    //   endDate: $scope.testRange.endDate.add(1, 'day')
    // };
    $scope.test = moment($scope.test).subtract(1, "years");
    $scope.minRange = moment($scope.minRange).add(1, 'day');
  };

  $scope.dt = '2015-12-12T16:00:00.000';
  $scope.dtTime = moment();

  $scope.choiceDemo2 = {
    "id": 2,
    "value": "Belgija"
  };

  // $scope.choiceDemo2 = 2;
  // $scope.choiceDemo2 = {id:3, value:"Orange"};
  $scope.dropdownMulti = [];

  $scope.change_options = function () {
    $scope.listObjs = [{id: 4, value: "CD"}, {id: 5, value: "DVD"}, {id: 6, value: "Cassete"}];
  };

  $scope.change_hour = function () {
    $scope.dtTime = moment().add(2, "hours");
  };
  // $timeout(function(){
  //    $scope.choiceDemo2 = 2;
  //    console.log('setting dropdown value')
  // }, 6000);
  // $scope.dtStart = '2015-12-10T16:00:00.000';
  // $scope.dtEnd = '2015-12-14T20:00:00.000';

  $scope.percentage = 0.22000000;

  $scope.disbled = false;
  $scope.doSomethingLong = function () {
    console.log('doing sth');
    var deferred = $q.defer();

    setTimeout(function () {
      var r = Math.random() * 100;
      $scope.disbled = true;
      if (r > 50) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    }, Math.random() * 5000);

    return deferred.promise;
  };

  // Notification tests
  $scope.primary = function () {
    NiceNotification('Primary notification');
  };

  $scope.error = function () {
    NiceNotification.error({message: 'Error notification', delay: 20000});
  };

  $scope.success = function () {
    NiceNotification.success('Success notification');
  };

  $scope.info = function () {
    NiceNotification.info('Information notification');
  };

  $scope.warning = function () {
    NiceNotification.warning('Warning notification');
  };

  $scope.primaryTitle = function () {
    NiceNotification({message: 'Primary notification', title: 'Primary notification'});
  };

  $scope.errorTime = function () {
    NiceNotification.error({message: 'Error notification 1s', delay: 1000});
  };

  $scope.successTime = function () {
    NiceNotification.success({message: 'Success notification 20s', delay: 20000});
  };

  $scope.errorHtml = function () {
    NiceNotification.error({message: '<b>Error</b> <s>notification</s>', title: 'Html', delay: 20000});
  };

  $scope.successHtml = function () {
    NiceNotification.success({
      message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">',
      title: 'Html content'
    });
  };


  $scope.getAddresses = function (address) {
    var deferred = $q.defer();

    var params = {address: address, sensor: false};
    $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function (response) {
      $scope.results = response.data.results;
      deferred.resolve(response.data.results);
    }, function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  };


  $scope.resolve = function () {
    return $q.resolve();
  };


  $scope.scrollTo = function (destination) {
    $('html, body').animate({
      scrollTop: $("#" + destination).offset().top - 50
    }, 300);
  };
});
