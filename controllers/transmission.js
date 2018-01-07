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
      fields: [ 'id', 'name', 'totalSize' ]
    },
    method: 'torrent-get',
    tag: 39693
  };
  transmissionRpc.execute(data)
  .then(function (data) {
    log.info('successfully retrieved torrents: %j', data);
    deffered.resolve(data);
  })
  .catch(function (data) {
    log.error('an error occurred while retrieving torrents. error: %j', data);
    deffered.reject(data);
  });
  return deffered.promise;
};

module.exports = {
  getTorrents: getTorrents
}