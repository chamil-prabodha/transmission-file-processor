/**
 * Created by chamilp on 1/8/18.
 */
var schedule = require('node-schedule');
var log = require('../logger');
var socketio = require('socket.io');
var mongoose = require('mongoose');
var fileHandler = require('../services/file-handler');
var transmissionController = require('../controllers/transmission');
var conn = require('../util/connection');

var connection = mongoose.connect('mongodb://localhost/tf_processor');
var socket = null;
var job = null;

var init = function (server) {
  socket = socketio(server);
  conn.connect(socket);
  socket.on('connection', function (sock) {
    log.info('received connection: %s', sock.ipAddresses);
    sock.on('disconnect', function () {
      log.info('disconnected: %j', sock);
    });
  });

  if(global.appConfig.daemon.enabled) {
    schedule.scheduleJob('daemon', global.appConfig.daemon.cronString, function () {
      log.debug('daemon retrieving torrents from transmission remote');
      transmissionController.getTorrents()
      .then(function (data) {
        return fileHandler.handleFiles(data.arguments.torrents);
      })
      .then(function (data) {
        conn.socket.emit('files', data);
      })
      .catch(function (error) {
        log.error('error occurred while retrieving files. error: %j', error.toString());
      })
    });
  }
};

module.exports = {
  socket: socket,
  init: init,
  job: job
};
