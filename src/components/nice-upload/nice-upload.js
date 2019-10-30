'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceUpload
 * @description
 * # niceUpload
 */
 angular.module('niceElements')
   .directive('niceUpload', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'src/components/nice-upload/nice-upload.html',
      scope: {
        model: '=',
        title: '@',
        text: '@',
        fieldWidth: '@',
        labelWidth: '@',
        noMargin: '@',
        accept: '@',
        uploadFunction: '=',
        callbackFunction: '=',
        callbackFile: '=',
        callbackUrl: '=',
        isDisabled: '=',
        help: '@'
      },

      link: function(scope, element, attrs, ctrl){
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.text) { attrs.text = 'Click to upload file'; }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        var maxImageSize = 1000000; // 1MB

        element.bind("change", function (changeEvent) {

          if (scope.callbackUrl != undefined) {
            scope.callbackUrl(URL.createObjectURL(changeEvent.target.files[0]));
          }

          $timeout(function () {
            var inputObj = changeEvent.target;

            scope.loading = true;
            scope.error = null;
            var reader = new FileReader();

            if (inputObj.files) {
              try {
                var fileSize = inputObj.files[0].size; // in bytes

                reader.onload = function (event) {
                  $timeout(function(){
                    // file size must be smaller than 1MB.
                    if (fileSize <= maxImageSize) {
                      if (scope.callbackFunction != undefined) {
                        scope.loading = false;
                        scope.imageSource = null;
                        scope.callbackFunction(event.target.result);
                        scope.text = inputObj.files[0].name;
                        scope.form.$setDirty();
                      }

                      if(scope.callbackFile != undefined){
                        scope.loading = false;
                        scope.text = inputObj.files[0].name;
                        scope.callbackFile(inputObj.files[0]);
                        scope.form.$setDirty();
                      }

                      if (scope.uploadFunction != undefined) {
                        scope.uploadFunction(inputObj.files[0]).then(function (response) {
                          scope.loading = false;
                          scope.imageSource = event.target.result;
                          scope.model = response.data.url;
                          scope.form.$setDirty();
                        }, function (error) {
                          // Handle upload function error
                          scope.error = error;
                          scope.loading = false;
                          scope.imageSource = null;
                        });
                      } else {
                        // console.error("No upload function set!");
                      }
                    } else {
                      // Handle file too big error
                      scope.error = "File must be smaller than 1MB";
                      scope.loading = false;
                      scope.imageSource = null;
                    }
                  });
                };

              } catch (err) {
                // Handle try catch
                scope.error = "Something went wrong";
                scope.loading = false;
                scope.imageSource = null;
              }

              // when the file is read it triggers the onload event above.
              reader.readAsDataURL(inputObj.files[0]);

            }
          });

        });
      },

      controller: function($scope) {
        $scope.$watch("model", function(value){
          $scope.imageSource = angular.copy($scope.model);
        });
      }

    };
  });
