/**
 * Created by chamilp on 1/7/18.
 */
var Q = require('q');
var transmissionRpc = require('../services/transmission-rpc');
var log = require('../logger');

var getTorrents = function () {
  var deffered = Q.defer();
  var data = {
    arguments: {
      fields: [ 'id', 'name', 'hashString', 'totalSize', 'percentDone' ]
    },
    method: 'torrent-get',
    tag: 39693
  };
  transmissionRpc.execute(data)
  .then(function (data) {
    log.info('successfully retrieved torrents: %j', data);
    deffered.resolve(data);
  })
  .catch(function (error) {
    log.error('an error occurred while retrieving torrents. error: %j', error);
    deffered.reject(error);
  });
  return deffered.promise;
};

var findTorrent = function (id) {
  var deffered = Q.defer();
  var data = {
    arguments: {
      ids: [ id ],
      fields: [ 'id', 'name', 'hashString', 'totalSize', 'percentDone' ]
    },
    method: 'torrent-get',
    tag: 39693
  };
  transmissionRpc.execute(data)
  .then(function (data) {
    deffered.resolve(data);
  })
  .catch(function (error) {
    deffered.reject(error);
  });
  return deffered.promise;
};

module.exports = {
  getTorrents: getTorrents,
  findTorrent: findTorrent
};