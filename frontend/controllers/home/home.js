/**
 * Created by chamilp on 1/13/18.
 */
(function () {
  function mainControllerFn ($scope, FileService, toastr) {
    $scope.fileGridConfig = {
      limit: 10,
      page: 1
    };

    var socket = io.connect('http://localhost:8000');

    socket.on('connect', function () {
      console.log('connection established');
      socket.emit('data', $scope.fileGridConfig);
    });

    socket.on('files', function (files) {
      $scope.$apply(function () {
        if(!$scope.fileListResponse){
          $scope.fileListResponse = {};
          $scope.fileListResponse.data = files;
          $scope.fileListResponse.count = files.length;
        }
        else {
          files.map(function (file) {
            var fileExists = false;
            $scope.fileListResponse.data.map(function (existingFile) {
              if(file.hashString === existingFile.hashString) {
                fileExists = true;
                if(file.fileId !== existingFile.id)
                  existingFile.fileId = file.fileId;
                if(file.fileName !== existingFile.fileName)
                  existingFile.name = file.name;
                if(file.fileCompletion !== existingFile.fileCompletion)
                  existingFile.fileCompletion = file.fileCompletion;
                if(file.fileSize !== existingFile.fileSize)
                  existingFile.fileSize = file.fileSize;
                if(file.downloadLink !== existingFile.downloadLink)
                  existingFile.downloadLink = file.downloadLink;
              }
            });

            if(!fileExists) {
              $scope.fileListResponse.data = files;
              $scope.fileListResponse.count = files.length;
            }
          });
        }
      });
    });

    socket.on('file', function (file) {
      $scope.$apply(function () {
        if($scope.fileListResponse && $scope.fileListResponse.data) {
          $scope.fileListResponse.data.map(function (existingFile) {
            if (existingFile.hashString === file.hashString) {
              if(file.fileId !== existingFile.id)
                existingFile.fileId = file.fileId;
              if(file.fileName !== existingFile.fileName)
                existingFile.name = file.name;
              if(file.fileCompletion !== existingFile.fileCompletion)
                existingFile.fileCompletion = file.fileCompletion;
              if(file.fileSize !== existingFile.fileSize)
                existingFile.fileSize = file.fileSize;
              if(file.inProgress !== existingFile.inProgress)
                existingFile.inProgress = file.inProgress;
              if(existingFile.downloadLink !== file.downloadLink)
                existingFile.downloadLink = file.downloadLink;
            }
            console.log(existingFile);
          });
        }
      });

    });

    var getFiles = function () {
      $scope.promise = FileService.getFileList();
      $scope.promise
        .then(function (data) {
          $scope.fileListResponse = {};
          $scope.fileListResponse.data = data.fileList.data;
          $scope.fileListResponse.count = data.fileList.data.length;
        })
        .catch(function (err) {
          $scope.fileListResponse = null;
          throw err;
        });
    };

    var archiveFile = function (file) {
      var archive = FileService.archiveFile(file);
      archive
      .then(function (data) {
        toastr.success('File ' + file.fileName + ' archived!', 'Success');
      })
      .catch(function (error) {
        toastr.error('Cannot archive file ' + file.fileName, 'Error');
      });
    };

    $scope.appId='Transmission File Processor';
    $scope.getFiles = getFiles;
    $scope.archiveFile = archiveFile;
    getFiles();
  }

  mainControllerFn.$inject = ['$scope', 'FileService', 'toastr'];

  angular.module('tfpApp').controller('mainController', mainControllerFn);
})();