'use strict';

/**
 * @ngdoc directive
 * @name niceElements.directive:niceUpload
 * @description
 * # niceUpload
 */
angular.module('niceElements')
  .directive('niceUpload', function ($timeout, gettextCatalog) {
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
        isInline: '=',
        help: '@'
      },

      link: function (scope, element, attrs) {
        if (!attrs.title) { attrs.title = ''; }
        if (!attrs.text) { attrs.text = gettextCatalog.getString('Click to upload file', null, 'Nice'); }
        if (!attrs.fieldWidth) { attrs.fieldWidth = 'col-sm-8'; }
        if (!attrs.labelWidth) { attrs.labelWidth = 'col-sm-4'; }
        attrs.noMargin = angular.isDefined(attrs.noMargin);
        var maxImageSize = 1000000; // 1MB

        scope.startDragging = function () { $timeout(function () { scope.dragging = true; }); }
        scope.endDragging = function () { $timeout(function () { scope.dragging = false; }); }
        scope.startDraggingGlobal = function () { $timeout(function () { scope.draggingGlobal = true; }); }
        scope.endDraggingGlobal = function () { $timeout(function () { scope.dragging = false; scope.draggingGlobal = false; }); }

        scope.dragging = false;
        scope.draggingGlobal = false;
        var inputElement = element[0].querySelector(".input-file");
        // document.addEventListener("dragenter", scope.startDraggingGlobal);
        // document.addEventListener("drop", scope.endDraggingGlobal);
        // document.addEventListener("dragend", scope.endDraggingGlobal);
        // document.addEventListener("mouseleave", scope.endDraggingGlobal);
        // document.addEventListener("dragleave", scope.endDragging);
        inputElement.addEventListener("dragenter", scope.startDragging);
        inputElement.addEventListener("dragleave", scope.endDragging);
        inputElement.addEventListener("dragend", scope.endDraggingGlobal);
        inputElement.addEventListener("drop", scope.endDraggingGlobal);

        scope.$on('$destroy', function () {
          // document.removeEventListener("dragenter", scope.startDraggingGlobal);
          // document.removeEventListener("drop", scope.endDraggingGlobal);
          // document.removeEventListener("dragend", scope.endDraggingGlobal);
          // document.removeEventListener("mouseleave", scope.endDraggingGlobal);
          // document.removeEventListener("dragleave", scope.endDraggingGlobal);
          inputElement.removeEventListener("dragenter", scope.startDragging);
          inputElement.removeEventListener("dragleave", scope.endDragging);
          inputElement.removeEventListener("dragend", scope.endDraggingGlobal);
          inputElement.removeEventListener("drop", scope.endDraggingGlobal);
        });


        element.bind("change", function (changeEvent) {
          if (scope.callbackUrl != undefined) {
            scope.callbackUrl(URL.createObjectURL(changeEvent.target.files[0]));
          }

          $timeout(function () {
            scope.loading = true;
            scope.error = null;
            var inputObj = changeEvent.target;
            var reader = new FileReader();

            if (inputObj.files) {
              try {
                var fileSize = inputObj.files[0].size; // in bytes

                reader.onload = function (event) {
                  $timeout(function () {
                    // file size must be smaller than 1MB.
                    if (fileSize > maxImageSize) {
                      scope.error = gettextCatalog.getString("File must be smaller than 1MB", null, "Nice");
                      scope.loading = false;
                      scope.imageSource = null;
                      return;
                    }

                    if (scope.callbackFunction != undefined) {
                      scope.loading = false;
                      scope.imageSource = null;
                      scope.callbackFunction(event.target.result);
                      scope.text = inputObj.files[0].name;
                      scope.form.$setDirty();
                    }

                    if (scope.callbackFile != undefined) {
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
                      if (event.target.result.substring(0, 10) == "data:image") {
                        scope.imageSource = event.target.result;
                      }
                    }
                  });
                };

              } catch (err) {
                // Handle try catch
                scope.error = gettextCatalog.getString("Something went wrong", null, "Nice");
                scope.loading = false;
                scope.imageSource = null;
              }

              // when the file is read it triggers the onload event above.
              reader.readAsDataURL(inputObj.files[0]);

            }
          });

        });
      },

      controller: function ($scope) {
        $scope.$watch("model", function (value) {
          $scope.imageSource = angular.copy($scope.model);
        });
      }

    };
  });
