/**
 * Created by chamilp on 1/13/18.
 */
(function () {
  angular.module('tfpApp')
      .factory('FileService', ['$http', '$q', function ($http, $q) {
        var getFileList = function () {
          var deferred = $q.defer();
          $http({
            url:'/transmission/file',
            method: 'GET'
          })
          .then(function (res) {
            deferred.resolve({
              fileList: res.data
            });
          })
          .catch(function (err) {
            deferred.reject(err);
          });
          return deferred.promise;
        };

        var archiveFile = function (file) {
          var deferred = $q.defer();
          $http({
            url:'/transmission/file/archive',
            method: 'PUT',
            data:{
              id: file.fileId,
              filename: file.fileName,
              hashString: file.hashString
            }
          })
          .then(function (res) {
            deferred.resolve({
              data: res.data
            });
          })
          .catch(function (error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };
        return {
          getFileList: getFileList,
          archiveFile: archiveFile
        }
      }]);
})();