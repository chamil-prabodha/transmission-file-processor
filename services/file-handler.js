/**
 * Created by chamilp on 1/13/18.
 */
var File = require('../model/file');
var log = require('../logger');
var connection = require('../util/connection');
var q = require('q');

var handleFile = function (receivedFile) {
  var deferred = q.defer();
  File.findOne({
    hashString: receivedFile.hashString
  }, function (error, file) {
    if(error) {
      deferred.reject(error);
      return;
    }

    if(file === null) {
      var newFile = new File({
        fileName: receivedFile.name,
        fileSize: receivedFile.totalSize,
        fileCompletion: receivedFile.percentDone,
        hashString: receivedFile.hashString,
        fileId: receivedFile.id,
        inProgress: false,
        downloadLink: null
      });
      newFile.save(function (error, savedFile) {
        if (error) {
          log.error('cannot create new file in database. error: %s',
              error.toString());
          deferred.reject(error);
          return;
        }
        log.debug('saved new file %s', savedFile.toString());
        deferred.resolve(savedFile);
      });
    }
    else if (file.fileName !== receivedFile.name
        || file.fileSize !== receivedFile.totalSize
        || file.fileCompletion !== receivedFile.percentDone
        || file.fileId !== receivedFile.id) {
      file.fileName = receivedFile.name;
      file.fileSize = receivedFile.totalSize;
      file.fileCompletion = receivedFile.percentDone;
      file.fileId = receivedFile.id;
      file.save(function (error, savedFile) {
        if (error) {
          log.error('cannot create new file in database. error: %s',
              error.toString());
          deferred.reject(error);
          return;
        }
        log.debug('updated file %s', savedFile.toString());
        deferred.resolve(savedFile);
      });
    }
    deferred.resolve(file);
  });
  return deferred.promise;
};

var handleFiles = function (receivedFiles) {
  var deferred = q.defer();
  updateIfExist(receivedFiles);
  removeIfNotFound(receivedFiles);
  File.find(function (error, files) {
    if(error) {
      deferred.reject(error);
      return;
    }

    deferred.resolve(files);
  });
  return deferred.promise;
};

var updateIfExist = function (receivedFiles) {
  receivedFiles.map(function (file) {
    handleFile(file).catch(function (error) {
      log.error('error occurred while updating files %s', error);
    });
  });
};

var removeIfNotFound = function (receivedFiles) {
  File.find({
    hashString: {
      $nin: receivedFiles.map(function (file) {
        return file.hashString;
      })
    }
  }, function (error, dbFiles) {
    if(dbFiles) {
      dbFiles.map(function (file) {
        File.remove({
          _id: file._id
        }, function (error, removedFile) {
          if(error){
            log.error('unable to remove file %j', file.name);
            return;
          }
          log.debug('removed file %s', removedFile.fileName);
        })
      })
    }
  })
};

var getFile = function (hashString) {
  var deferred = q.defer();
  File.findOne({
    hashString: hashString
  }, function (error, file) {
    if(error) {
      deferred.reject(error);
      return;
    }
    
    if(file === null) {
      deferred.reject('file with hash %s not found in database', hashString);
      return;
    }
    
    deferred.resolve(file);
  });
  return deferred.promise;
};

var updateArchiveStatus = function (hashString, status) {
  var deferred = q.defer();
  getFile(hashString)
  .then(function (file) {
    file.inProgress = status;
    file.save(function (error, savedFile) {
      if(error) {
        deferred.reject(error);
        return;
      }

      deferred.resolve(savedFile);
    });
  })
  .catch(function (error) {
    deferred.reject(error);
  });
  return deferred.promise;
};

var setDownloadLink = function (file) {
  var deferred = q.defer();
  var downloadLink = global.appConfig.server.host + global.appConfig.transmission.downloadDir + file.fileName +
          global.appConfig.server.archiveFormat;
  file.downloadLink = downloadLink;
  file.save(function (error, savedFile) {
    if(error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(savedFile);
  });
  return deferred.promise;
};

module.exports = {
  handleFiles: handleFiles,
  handleFile: handleFile,
  getFile: getFile,
  updateArchiveStatus: updateArchiveStatus,
  setDownloadLink: setDownloadLink
};