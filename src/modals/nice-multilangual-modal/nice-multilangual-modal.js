angular.module('niceElements')
  .directive('niceMultilangualModal', function () {
    return {
      templateUrl: 'src/modals/nice-multilangual-modal/nice-multilangual-modal.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        callback: '=',
        dialog: '=',
        multilanguage: '=', // Multiple languages object
        multilanguageField: '@', // Multiple languages field name
      },

      controller: function ($scope, $timeout) {
        $scope.selector = {
          newLanguage: null
        };

        // $scope.fields = {};
        $scope.fields = angular.copy($scope.multilanguage[$scope.multilanguageField]);

        $scope.languages = [
          { id: 'sl', value: "Slovenščina" },
          { id: 'en', value: "English" },
          { id: 'de', value: "Deutsch" },
          { id: 'it', value: "Italiano" },
          { id: 'fr', value: "Français" },
        ];
        $scope.languagesMap = {};
        angular.forEach($scope.languages, function (l) { $scope.languagesMap[l.id] = l.value; })


        $scope.filterLanguages = function (list) {
          return _.filter(list, function (l) { return !Object.keys($scope.fields).includes(l.id); })
        };

        $scope.addLanguage = function () {
          if (!$scope.selector.newLanguage) return;
          $scope.fields[$scope.selector.newLanguage.id] = "";
          $scope.selector.newLanguage = null;
          $scope.hide = true;
          $timeout(function () {
            $scope.hide = false;
          })
        }

        $scope.removeLanguage = function (key) {
          delete $scope.fields[key];
          $scope.hide = true;
          $timeout(function () {
            $scope.hide = false;
          })
        }

        $scope.save = function () {
          $scope.callback($scope.fields);
          $scope.dialog.close();
        }

        $scope.close = function () {
          $scope.dialog.close();
        }
      }
    };
  });
