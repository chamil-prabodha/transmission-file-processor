/**
 * Created by chamilp on 1/8/18.
 */
var exec = require('child_process').exec;
var log = require('../logger');
var q = require('q');

var archive = function (filename) {
  var deferred = q.defer();
  var command = 'tar -zcvf '+
      global.appConfig.server.archiveDir + filename + global.appConfig.server.archiveFormat + ' ' +
      global.appConfig.transmission.downloadDir + filename;
  var child = exec(command, function (error, stdout, stderr) {
    if(error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(stdout);
  });
  return deferred.promise;
};

module.exports = {
  archive: archive
};