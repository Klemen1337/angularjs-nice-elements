'use strict';

angular.module('niceElementsDemo').controller('ExampleCtrl', function ($rootScope, $scope, $http, $q, NiceNotification, $timeout) {
  $scope.emptyList = [];
  $scope.inputNumber = null;
  $scope.dropdownLoading = true;
  $scope.isInline = false;
  $scope.toggleInline = function () { $scope.isInline = !$scope.isInline }
  $scope.filters = {
    search: ""
  }
  $scope.model = {
    niceDateInputStart: moment().add("days", 1).hours(19).minutes(0).seconds(0),
    niceDateInputEnd: moment().add("days", 2).hours(3).minutes(0).seconds(0)
  };

  $scope.showLoading = false;
  $scope.toggleLoading = function () {
    $scope.showLoading = !$scope.showLoading;
  }

  $scope.selectIcon = function (icon) {
    $scope.selectedIcon = icon;
    $scope.copyText(icon);
  }

  $scope.copyText = function (text) {
    try {
      navigator.clipboard.writeText(text);
      var message = `Copied '${text}'`
      console.log(message)
      $rootScope.$broadcast('toast', message);
    } catch (error) {
      console.error(error);
    }
  }

  $scope.copyClass = function (event) { }

  $scope.mockData = [];
  $http.get('http://5c9dcf843be4e30014a7d40a.mockapi.io/users').then(function (response) {
    $scope.mockData = response.data;
  });


  $scope.searchPeople = function (search) {
    return $http.get('http://5c9dcf843be4e30014a7d40a.mockapi.io/users?search=' + search).then(function (response) {
      return response.data;
    });
  };

  $scope.searchFunction = function (search) {
    return $q(function (resolve, reject) {
      $timeout(function () {
        var data = $scope.mockData.filter(function (d) {
          return d.name.includes(search)
        })
        resolve(data);
      }, 500);
    });
  };

  $scope.testFunction = function (test) {
    console.log("test", test);
  }

  $scope.handleChange = function () {
    console.log("Value:", ...arguments);
  }


  $scope.changeDate = function (add) {
    if (add) $scope.data.niceDate2.add(1, "day");
    else $scope.data.niceDate2.subtract(1, "day");
  };


  $scope.data = {
    disabled: false,
    dropdownCountryKey: "US",
    dropdownListObj2: [
      { 'iso': 'AF', 'name': 'Afghanistan' },
      { 'iso': 'AL', 'name': 'Albania' }
    ],
    dropdownPerson2: 2
  };


  $scope.setSlovenia = function () {
    $scope.data.dropdownCountryKey = "SI";
  }

  $scope.emptyList = [];

  $scope.addToList = function () {
    $scope.emptyList.push({ id: 0, iso: "SI", value: "Slovenia" });
  }

  $scope.listObjs = [
    { id: 0, iso: "SI", value: "Slovenia Slovenia Slovenia Slovenia Slovenia Slovenia Slovenia" },
    { id: 1, iso: "ZA", value: "South Africa" },
    { id: 2, iso: "BR", value: "Brazil" },
    { id: 3, iso: "AF", value: "Afganistan" },
    { id: 4, iso: "CA", value: "Canada" },
    { id: 5, iso: "US", value: "United States" }
  ];

  $scope.simpleListData = "ODPIS";
  $scope.simpleList = [
    {
      "text": "SERVIS"
    }, {
      "text": "NOV APARAT"
    }, {
      "text": "ODPIS"
    }, {
      "text": "PREGLED"
    }, {
      "text": "TLAČNI PREIZKUS G"
    }, {
      "text": "TLAČNI PREIZKUS H"
    }, {
      "text": "PREGLED HIDRANTA"
    }
  ]

  //$scope.listStrings = ["String 1", "String 2", "String 3"];
  $timeout(function () {
    $scope.niceNumber2 = 1.99887;
    $scope.dropdownLoading = false;
  }, 5000);

  $scope.niceNumber2 = 0.1;
  $scope.test = moment().subtract(10, "years");

  $scope.testRange = {
    startDate: moment(),
    endDate: moment().add(1, 'days')
  };

  $scope.eeeey = "2019-05-01T13:00:00.000Z";

  $scope.dtp2 = {
    startDate: moment(),
    endDate: moment().add(1, 'days')
  };

  $scope.minDate = moment().subtract(3, 'days');
  $scope.maxDate = moment().add(3, 'days');

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
    $scope.listObjs = [{ id: 4, value: "CD" }, { id: 5, value: "DVD" }, { id: 6, value: "Cassete" }];
  };

  $scope.change_hour = function () {
    $scope.dtTime = moment().add(2, "hours");
  };

  $scope.calendarChange = function (date) {
    console.log(date.startDate)
    console.log(date.endDate)
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
    NiceNotification.error({ title: "Error", message: "This is a test error", delay: 20000 });
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
    NiceNotification({ message: 'Primary notification', title: 'Primary notification' });
  };

  $scope.errorTime = function () {
    NiceNotification.error({ message: 'Error notification 1s', delay: 1000 });
  };

  $scope.successTime = function () {
    NiceNotification.success({ message: 'Success notification 20s', delay: 20000 });
  };

  $scope.errorHtml = function () {
    NiceNotification.error({ message: '<b>Error</b> <s>notification</s>', title: 'Html', delay: 20000 });
  };

  $scope.successHtml = function () {
    NiceNotification.success({
      message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">',
      title: 'Html content'
    });
  };


  $scope.getAddresses = function (address) {
    var deferred = $q.defer();

    var params = { address: address, sensor: false };
    $http.get('http://maps.googleapis.com/maps/api/geocode/json', { params: params }).then(function (response) {
      $scope.results = response.data.results;
      console.log($scope.results);
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
    let dest = document.getElementById(destination)
    window.scrollTo({
      top: dest.offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  };

  $scope.countrySelected = function (country) {
    console.log(country);
  }

  $scope.searchCountry = function (search) {
    if (!search) search = "";
    return new Promise(function (resolve, reject) {
      var countries = $scope.countries.filter(function (d) {
        let lowercaseName = (d.name).toLowerCase();
        let lowercaseSearch = search.toLowerCase();
        return lowercaseName.includes(lowercaseSearch);
      })
      $timeout(function () {
        resolve(countries);
      }, 200);
    });
  }

  $scope.niceUploadCallback = function (response) { $scope.niceUpload = response }
  $scope.niceUploadCallbackFile = function (file) { $scope.niceUploadFile = file }
  $scope.niceUpload = null;

  $scope.selectedIcon = "icon-activity";
  $scope.icons = [
    "olaii-logo",
    "icon-activity",
    "icon-airplay",
    "icon-alert-circle",
    "icon-alert-octagon",
    "icon-alert-triangle",
    "icon-align-center",
    "icon-align-justify",
    "icon-align-left",
    "icon-align-right",
    "icon-anchor",
    "icon-aperture",
    "icon-archive",
    "icon-arrow-down",
    "icon-arrow-down-circle",
    "icon-arrow-down-left",
    "icon-arrow-down-right",
    "icon-arrow-left",
    "icon-arrow-left-circle",
    "icon-arrow-right",
    "icon-arrow-right-circle",
    "icon-arrow-up",
    "icon-arrow-up-circle",
    "icon-arrow-up-left",
    "icon-arrow-up-right",
    "icon-at-sign",
    "icon-award",
    "icon-bar-chart",
    "icon-bar-chart-2",
    "icon-battery",
    "icon-battery-charging",
    "icon-bell",
    "icon-bell-off",
    "icon-bluetooth",
    "icon-bold",
    "icon-book",
    "icon-book-open",
    "icon-bookmark",
    "icon-box",
    "icon-briefcase",
    "icon-calendar",
    "icon-camera",
    "icon-camera-off",
    "icon-cast",
    "icon-check",
    "icon-check-circle",
    "icon-check-square",
    "icon-chevron-down",
    "icon-chevron-left",
    "icon-chevron-right",
    "icon-chevron-up",
    "icon-chevrons-down",
    "icon-chevrons-left",
    "icon-chevrons-right",
    "icon-chevrons-up",
    "icon-chrome",
    "icon-circle",
    "icon-clipboard",
    "icon-clock",
    "icon-cloud",
    "icon-cloud-drizzle",
    "icon-cloud-lightning",
    "icon-cloud-off",
    "icon-cloud-rain",
    "icon-cloud-snow",
    "icon-code",
    "icon-codepen",
    "icon-codesandbox",
    "icon-coffee",
    "icon-columns",
    "icon-command",
    "icon-compass",
    "icon-copy",
    "icon-corner-down-left",
    "icon-corner-down-right",
    "icon-corner-left-down",
    "icon-corner-left-up",
    "icon-corner-right-down",
    "icon-corner-right-up",
    "icon-corner-up-left",
    "icon-corner-up-right",
    "icon-cpu",
    "icon-credit-card",
    "icon-crop",
    "icon-crosshair",
    "icon-database",
    "icon-delete",
    "icon-disc",
    "icon-dollar-sign",
    "icon-download",
    "icon-download-cloud",
    "icon-droplet",
    "icon-edit",
    "icon-edit-2",
    "icon-edit-3",
    "icon-external-link",
    "icon-eye",
    "icon-eye-off",
    "icon-facebook",
    "icon-fast-forward",
    "icon-feather",
    "icon-figma",
    "icon-file",
    "icon-file-minus",
    "icon-file-plus",
    "icon-file-text",
    "icon-film",
    "icon-filter",
    "icon-flag",
    "icon-folder",
    "icon-folder-minus",
    "icon-folder-plus",
    "icon-framer",
    "icon-frown",
    "icon-gift",
    "icon-git-branch",
    "icon-git-commit",
    "icon-git-merge",
    "icon-git-pull-request",
    "icon-github",
    "icon-gitlab",
    "icon-globe",
    "icon-grid",
    "icon-hard-drive",
    "icon-hash",
    "icon-headphones",
    "icon-heart",
    "icon-help-circle",
    "icon-hexagon",
    "icon-home",
    "icon-image",
    "icon-inbox",
    "icon-info",
    "icon-instagram",
    "icon-italic",
    "icon-key",
    "icon-layers",
    "icon-layout",
    "icon-life-buoy",
    "icon-link",
    "icon-link-2",
    "icon-linkedin",
    "icon-list",
    "icon-loader",
    "icon-lock",
    "icon-log-in",
    "icon-log-out",
    "icon-mail",
    "icon-map",
    "icon-map-pin",
    "icon-maximize",
    "icon-maximize-2",
    "icon-meh",
    "icon-menu",
    "icon-message-circle",
    "icon-message-square",
    "icon-mic",
    "icon-mic-off",
    "icon-minimize",
    "icon-minimize-2",
    "icon-minus",
    "icon-minus-circle",
    "icon-minus-square",
    "icon-monitor",
    "icon-moon",
    "icon-more-horizontal",
    "icon-more-vertical",
    "icon-mouse-pointer",
    "icon-move",
    "icon-music",
    "icon-navigation",
    "icon-navigation-2",
    "icon-octagon",
    "icon-package",
    "icon-paperclip",
    "icon-pause",
    "icon-pause-circle",
    "icon-pen-tool",
    "icon-percent",
    "icon-phone",
    "icon-phone-call",
    "icon-phone-forwarded",
    "icon-phone-incoming",
    "icon-phone-missed",
    "icon-phone-off",
    "icon-phone-outgoing",
    "icon-pie-chart",
    "icon-play",
    "icon-play-circle",
    "icon-plus",
    "icon-plus-circle",
    "icon-plus-square",
    "icon-pocket",
    "icon-power",
    "icon-printer",
    "icon-radio",
    "icon-refresh-ccw",
    "icon-refresh-cw",
    "icon-repeat",
    "icon-rewind",
    "icon-rotate-ccw",
    "icon-rotate-cw",
    "icon-rss",
    "icon-save",
    "icon-scissors",
    "icon-search",
    "icon-send",
    "icon-server",
    "icon-settings",
    "icon-share",
    "icon-share-2",
    "icon-shield",
    "icon-shield-off",
    "icon-shopping-bag",
    "icon-shopping-cart",
    "icon-shuffle",
    "icon-sidebar",
    "icon-skip-back",
    "icon-skip-forward",
    "icon-slack",
    "icon-slash",
    "icon-sliders",
    "icon-smartphone",
    "icon-smile",
    "icon-speaker",
    "icon-square",
    "icon-star",
    "icon-stop-circle",
    "icon-sun",
    "icon-sunrise",
    "icon-sunset",
    "icon-tablet",
    "icon-tag",
    "icon-target",
    "icon-terminal",
    "icon-thermometer",
    "icon-thumbs-down",
    "icon-thumbs-up",
    "icon-toggle-left",
    "icon-toggle-right",
    "icon-tool",
    "icon-trash",
    "icon-trash-2",
    "icon-trello",
    "icon-trending-down",
    "icon-trending-up",
    "icon-triangle",
    "icon-truck",
    "icon-tv",
    "icon-twitch",
    "icon-twitter",
    "icon-type",
    "icon-umbrella",
    "icon-underline",
    "icon-unlock",
    "icon-upload",
    "icon-upload-cloud",
    "icon-user",
    "icon-user-check",
    "icon-user-minus",
    "icon-user-plus",
    "icon-user-x",
    "icon-users",
    "icon-video",
    "icon-video-off",
    "icon-voicemail",
    "icon-volume",
    "icon-volume-1",
    "icon-volume-2",
    "icon-volume-x",
    "icon-watch",
    "icon-wifi",
    "icon-wifi-off",
    "icon-wind",
    "icon-x",
    "icon-x-circle",
    "icon-x-octagon",
    "icon-x-square",
    "icon-youtube",
    "icon-zap",
    "icon-zap-off",
    "icon-zoom-in",
    "icon-zoom-out",
    "icon-ticket",
    "icon-seat"
  ];

  $scope.countries = [
    { 'iso': 'AF', 'name': 'Afghanistan' },
    { 'iso': 'AX', 'name': 'Aland Islands' },
    { 'iso': 'AL', 'name': 'Albania' },
    { 'iso': 'DZ', 'name': 'Algeria' },
    { 'iso': 'AS', 'name': 'American Samoa' },
    { 'iso': 'AD', 'name': 'Andorra' },
    { 'iso': 'AO', 'name': 'Angola' },
    { 'iso': 'AI', 'name': 'Anguilla' },
    { 'iso': 'AQ', 'name': 'Antarctica' },
    { 'iso': 'AG', 'name': 'Antigua And Barbuda' },
    { 'iso': 'AR', 'name': 'Argentina' },
    { 'iso': 'AM', 'name': 'Armenia' },
    { 'iso': 'AW', 'name': 'Aruba' },
    { 'iso': 'AU', 'name': 'Australia' },
    { 'iso': 'AT', 'name': 'Austria' },
    { 'iso': 'AZ', 'name': 'Azerbaijan' },
    { 'iso': 'BS', 'name': 'Bahamas' },
    { 'iso': 'BH', 'name': 'Bahrain' },
    { 'iso': 'BD', 'name': 'Bangladesh' },
    { 'iso': 'BB', 'name': 'Barbados' },
    { 'iso': 'BY', 'name': 'Belarus' },
    { 'iso': 'BE', 'name': 'Belgium' },
    { 'iso': 'BZ', 'name': 'Belize' },
    { 'iso': 'BJ', 'name': 'Benin' },
    { 'iso': 'BM', 'name': 'Bermuda' },
    { 'iso': 'BT', 'name': 'Bhutan' },
    { 'iso': 'BO', 'name': 'Bolivia' },
    { 'iso': 'BA', 'name': 'Bosnia And Herzegovina' },
    { 'iso': 'BW', 'name': 'Botswana' },
    { 'iso': 'BV', 'name': 'Bouvet Island' },
    { 'iso': 'BR', 'name': 'Brazil' },
    { 'iso': 'IO', 'name': 'British Indian Ocean Territory' },
    { 'iso': 'BN', 'name': 'Brunei Darussalam' },
    { 'iso': 'BG', 'name': 'Bulgaria' },
    { 'iso': 'BF', 'name': 'Burkina Faso' },
    { 'iso': 'BI', 'name': 'Burundi' },
    { 'iso': 'KH', 'name': 'Cambodia' },
    { 'iso': 'CM', 'name': 'Cameroon' },
    { 'iso': 'CA', 'name': 'Canada' },
    { 'iso': 'CV', 'name': 'Cape Verde' },
    { 'iso': 'KY', 'name': 'Cayman Islands' },
    { 'iso': 'CF', 'name': 'Central African Republic' },
    { 'iso': 'TD', 'name': 'Chad' },
    { 'iso': 'CL', 'name': 'Chile' },
    { 'iso': 'CN', 'name': 'China' },
    { 'iso': 'CX', 'name': 'Christmas Island' },
    { 'iso': 'CC', 'name': 'Cocos (Keeling) Islands' },
    { 'iso': 'CO', 'name': 'Colombia' },
    { 'iso': 'KM', 'name': 'Comoros' },
    { 'iso': 'CG', 'name': 'Congo' },
    { 'iso': 'CD', 'name': 'Congo, Democratic Republic' },
    { 'iso': 'CK', 'name': 'Cook Islands' },
    { 'iso': 'CR', 'name': 'Costa Rica' },
    { 'iso': 'CI', 'name': 'Cote D\'Ivoire' },
    { 'iso': 'HR', 'name': 'Croatia' },
    { 'iso': 'CU', 'name': 'Cuba' },
    { 'iso': 'CY', 'name': 'Cyprus' },
    { 'iso': 'CZ', 'name': 'Czech Republic' },
    { 'iso': 'DK', 'name': 'Denmark' },
    { 'iso': 'DJ', 'name': 'Djibouti' },
    { 'iso': 'DM', 'name': 'Dominica' },
    { 'iso': 'DO', 'name': 'Dominican Republic' },
    { 'iso': 'EC', 'name': 'Ecuador' },
    { 'iso': 'EG', 'name': 'Egypt' },
    { 'iso': 'SV', 'name': 'El Salvador' },
    { 'iso': 'GQ', 'name': 'Equatorial Guinea' },
    { 'iso': 'ER', 'name': 'Eritrea' },
    { 'iso': 'EE', 'name': 'Estonia' },
    { 'iso': 'ET', 'name': 'Ethiopia' },
    { 'iso': 'FK', 'name': 'Falkland Islands (Malvinas)' },
    { 'iso': 'FO', 'name': 'Faroe Islands' },
    { 'iso': 'FJ', 'name': 'Fiji' },
    { 'iso': 'FI', 'name': 'Finland' },
    { 'iso': 'FR', 'name': 'France' },
    { 'iso': 'GF', 'name': 'French Guiana' },
    { 'iso': 'PF', 'name': 'French Polynesia' },
    { 'iso': 'TF', 'name': 'French Southern Territories' },
    { 'iso': 'GA', 'name': 'Gabon' },
    { 'iso': 'GM', 'name': 'Gambia' },
    { 'iso': 'GE', 'name': 'Georgia' },
    { 'iso': 'DE', 'name': 'Germany' },
    { 'iso': 'GH', 'name': 'Ghana' },
    { 'iso': 'GI', 'name': 'Gibraltar' },
    { 'iso': 'GR', 'name': 'Greece' },
    { 'iso': 'GL', 'name': 'Greenland' },
    { 'iso': 'GD', 'name': 'Grenada' },
    { 'iso': 'GP', 'name': 'Guadeloupe' },
    { 'iso': 'GU', 'name': 'Guam' },
    { 'iso': 'GT', 'name': 'Guatemala' },
    { 'iso': 'GG', 'name': 'Guernsey' },
    { 'iso': 'GN', 'name': 'Guinea' },
    { 'iso': 'GW', 'name': 'Guinea-Bissau' },
    { 'iso': 'GY', 'name': 'Guyana' },
    { 'iso': 'HT', 'name': 'Haiti' },
    { 'iso': 'HM', 'name': 'Heard Island & Mcdonald Islands' },
    { 'iso': 'VA', 'name': 'Holy See (Vatican City State)' },
    { 'iso': 'HN', 'name': 'Honduras' },
    { 'iso': 'HK', 'name': 'Hong Kong' },
    { 'iso': 'HU', 'name': 'Hungary' },
    { 'iso': 'IS', 'name': 'Iceland' },
    { 'iso': 'IN', 'name': 'India' },
    { 'iso': 'ID', 'name': 'Indonesia' },
    { 'iso': 'IR', 'name': 'Iran, Islamic Republic Of' },
    { 'iso': 'IQ', 'name': 'Iraq' },
    { 'iso': 'IE', 'name': 'Ireland' },
    { 'iso': 'IM', 'name': 'Isle Of Man' },
    { 'iso': 'IL', 'name': 'Israel' },
    { 'iso': 'IT', 'name': 'Italy' },
    { 'iso': 'JM', 'name': 'Jamaica' },
    { 'iso': 'JP', 'name': 'Japan' },
    { 'iso': 'JE', 'name': 'Jersey' },
    { 'iso': 'JO', 'name': 'Jordan' },
    { 'iso': 'KZ', 'name': 'Kazakhstan' },
    { 'iso': 'KE', 'name': 'Kenya' },
    { 'iso': 'KI', 'name': 'Kiribati' },
    { 'iso': 'KR', 'name': 'Korea' },
    { 'iso': 'KW', 'name': 'Kuwait' },
    { 'iso': 'KG', 'name': 'Kyrgyzstan' },
    { 'iso': 'LA', 'name': 'Lao People\'s Democratic Republic' },
    { 'iso': 'LV', 'name': 'Latvia' },
    { 'iso': 'LB', 'name': 'Lebanon' },
    { 'iso': 'LS', 'name': 'Lesotho' },
    { 'iso': 'LR', 'name': 'Liberia' },
    { 'iso': 'LY', 'name': 'Libyan Arab Jamahiriya' },
    { 'iso': 'LI', 'name': 'Liechtenstein' },
    { 'iso': 'LT', 'name': 'Lithuania' },
    { 'iso': 'LU', 'name': 'Luxembourg' },
    { 'iso': 'MO', 'name': 'Macao' },
    { 'iso': 'MK', 'name': 'Macedonia' },
    { 'iso': 'MG', 'name': 'Madagascar' },
    { 'iso': 'MW', 'name': 'Malawi' },
    { 'iso': 'MY', 'name': 'Malaysia' },
    { 'iso': 'MV', 'name': 'Maldives' },
    { 'iso': 'ML', 'name': 'Mali' },
    { 'iso': 'MT', 'name': 'Malta' },
    { 'iso': 'MH', 'name': 'Marshall Islands' },
    { 'iso': 'MQ', 'name': 'Martinique' },
    { 'iso': 'MR', 'name': 'Mauritania' },
    { 'iso': 'MU', 'name': 'Mauritius' },
    { 'iso': 'YT', 'name': 'Mayotte' },
    { 'iso': 'MX', 'name': 'Mexico' },
    { 'iso': 'FM', 'name': 'Micronesia, Federated States Of' },
    { 'iso': 'MD', 'name': 'Moldova' },
    { 'iso': 'MC', 'name': 'Monaco' },
    { 'iso': 'MN', 'name': 'Mongolia' },
    { 'iso': 'ME', 'name': 'Montenegro' },
    { 'iso': 'MS', 'name': 'Montserrat' },
    { 'iso': 'MA', 'name': 'Morocco' },
    { 'iso': 'MZ', 'name': 'Mozambique' },
    { 'iso': 'MM', 'name': 'Myanmar' },
    { 'iso': 'NA', 'name': 'Namibia' },
    { 'iso': 'NR', 'name': 'Nauru' },
    { 'iso': 'NP', 'name': 'Nepal' },
    { 'iso': 'NL', 'name': 'Netherlands' },
    { 'iso': 'AN', 'name': 'Netherlands Antilles' },
    { 'iso': 'NC', 'name': 'New Caledonia' },
    { 'iso': 'NZ', 'name': 'New Zealand' },
    { 'iso': 'NI', 'name': 'Nicaragua' },
    { 'iso': 'NE', 'name': 'Niger' },
    { 'iso': 'NG', 'name': 'Nigeria' },
    { 'iso': 'NU', 'name': 'Niue' },
    { 'iso': 'NF', 'name': 'Norfolk Island' },
    { 'iso': 'MP', 'name': 'Northern Mariana Islands' },
    { 'iso': 'NO', 'name': 'Norway' },
    { 'iso': 'OM', 'name': 'Oman' },
    { 'iso': 'PK', 'name': 'Pakistan' },
    { 'iso': 'PW', 'name': 'Palau' },
    { 'iso': 'PS', 'name': 'Palestinian Territory, Occupied' },
    { 'iso': 'PA', 'name': 'Panama' },
    { 'iso': 'PG', 'name': 'Papua New Guinea' },
    { 'iso': 'PY', 'name': 'Paraguay' },
    { 'iso': 'PE', 'name': 'Peru' },
    { 'iso': 'PH', 'name': 'Philippines' },
    { 'iso': 'PN', 'name': 'Pitcairn' },
    { 'iso': 'PL', 'name': 'Poland' },
    { 'iso': 'PT', 'name': 'Portugal' },
    { 'iso': 'PR', 'name': 'Puerto Rico' },
    { 'iso': 'QA', 'name': 'Qatar' },
    { 'iso': 'RE', 'name': 'Reunion' },
    { 'iso': 'RO', 'name': 'Romania' },
    { 'iso': 'RU', 'name': 'Russian Federation' },
    { 'iso': 'RW', 'name': 'Rwanda' },
    { 'iso': 'BL', 'name': 'Saint Barthelemy' },
    { 'iso': 'SH', 'name': 'Saint Helena' },
    { 'iso': 'KN', 'name': 'Saint Kitts And Nevis' },
    { 'iso': 'LC', 'name': 'Saint Lucia' },
    { 'iso': 'MF', 'name': 'Saint Martin' },
    { 'iso': 'PM', 'name': 'Saint Pierre And Miquelon' },
    { 'iso': 'VC', 'name': 'Saint Vincent And Grenadines' },
    { 'iso': 'WS', 'name': 'Samoa' },
    { 'iso': 'SM', 'name': 'San Marino' },
    { 'iso': 'ST', 'name': 'Sao Tome And Principe' },
    { 'iso': 'SA', 'name': 'Saudi Arabia' },
    { 'iso': 'SN', 'name': 'Senegal' },
    { 'iso': 'RS', 'name': 'Serbia' },
    { 'iso': 'SC', 'name': 'Seychelles' },
    { 'iso': 'SL', 'name': 'Sierra Leone' },
    { 'iso': 'SG', 'name': 'Singapore' },
    { 'iso': 'SK', 'name': 'Slovakia' },
    { 'iso': 'SI', 'name': 'Slovenia' },
    { 'iso': 'SB', 'name': 'Solomon Islands' },
    { 'iso': 'SO', 'name': 'Somalia' },
    { 'iso': 'ZA', 'name': 'South Africa' },
    { 'iso': 'GS', 'name': 'South Georgia And Sandwich Isl.' },
    { 'iso': 'ES', 'name': 'Spain' },
    { 'iso': 'LK', 'name': 'Sri Lanka' },
    { 'iso': 'SD', 'name': 'Sudan' },
    { 'iso': 'SR', 'name': 'Suriname' },
    { 'iso': 'SJ', 'name': 'Svalbard And Jan Mayen' },
    { 'iso': 'SZ', 'name': 'Swaziland' },
    { 'iso': 'SE', 'name': 'Sweden' },
    { 'iso': 'CH', 'name': 'Switzerland' },
    { 'iso': 'SY', 'name': 'Syrian Arab Republic' },
    { 'iso': 'TW', 'name': 'Taiwan' },
    { 'iso': 'TJ', 'name': 'Tajikistan' },
    { 'iso': 'TZ', 'name': 'Tanzania' },
    { 'iso': 'TH', 'name': 'Thailand' },
    { 'iso': 'TL', 'name': 'Timor-Leste' },
    { 'iso': 'TG', 'name': 'Togo' },
    { 'iso': 'TK', 'name': 'Tokelau' },
    { 'iso': 'TO', 'name': 'Tonga' },
    { 'iso': 'TT', 'name': 'Trinidad And Tobago' },
    { 'iso': 'TN', 'name': 'Tunisia' },
    { 'iso': 'TR', 'name': 'Turkey' },
    { 'iso': 'TM', 'name': 'Turkmenistan' },
    { 'iso': 'TC', 'name': 'Turks And Caicos Islands' },
    { 'iso': 'TV', 'name': 'Tuvalu' },
    { 'iso': 'UG', 'name': 'Uganda' },
    { 'iso': 'UA', 'name': 'Ukraine' },
    { 'iso': 'AE', 'name': 'United Arab Emirates' },
    { 'iso': 'GB', 'name': 'United Kingdom' },
    { 'iso': 'US', 'name': 'United States' },
    { 'iso': 'UM', 'name': 'United States Outlying Islands' },
    { 'iso': 'UY', 'name': 'Uruguay' },
    { 'iso': 'UZ', 'name': 'Uzbekistan' },
    { 'iso': 'VU', 'name': 'Vanuatu' },
    { 'iso': 'VE', 'name': 'Venezuela' },
    { 'iso': 'VN', 'name': 'Viet Nam' },
    { 'iso': 'VG', 'name': 'Virgin Islands, British' },
    { 'iso': 'VI', 'name': 'Virgin Islands, U.S.' },
    { 'iso': 'WF', 'name': 'Wallis And Futuna' },
    { 'iso': 'EH', 'name': 'Western Sahara' },
    { 'iso': 'YE', 'name': 'Yemen' },
    { 'iso': 'ZM', 'name': 'Zambia' },
    { 'iso': 'ZW', 'name': 'Zimbabwe' }
  ]
});
