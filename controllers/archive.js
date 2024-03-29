/**
 * Created by chamilp on 1/8/18.
 */
var exec = require('child_process').exec;
var log = require('../logger');
var q = require('q');

var archive = function (filename) {
  var deferred = q.defer();
  var command = 'tar -zcvf '+
      global.appConfig.server.archiveDir + filename.replace(/(\s+)/g, '\\$1') + global.appConfig.server.archiveFormat + ' ' +
      global.appConfig.server.downloadDir + filename.replace(/(\s+)/g, '\\$1');
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