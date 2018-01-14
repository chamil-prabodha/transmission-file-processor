var express = require('express');
var File = require('../model/file');
var router = express.Router();
var log = require('../logger');
var response = require('../util/response');
var transmissionController = require('../controllers/transmission');
var archiveController = require('../controllers/archive');
var fileHandler = require('../services/file-handler');
var connection = require('../util/connection');

/* GET files listing. */
router.get('/file', function(req, res, next) {
  log.info('retrieving files...');
  transmissionController.getTorrents()
  .then(function (data) {
    log.info('successfully retrieved files %j', data.arguments.torrents);
    return fileHandler.handleFiles(data.arguments.torrents);
  })
  .then(function (files) {
    res.status(200);
    res.send(response.success('successfully retrieved files', files));
  }).catch(function (error) {
    log.error('error occurred while retrieving files. error: %j', error.toString());
    res.status(402);
    res.send(response.error('error occurred while retrieving files', error));
  });
});

//Todo replace file name with hash received from db
router.put('/file/archive', function (req, res, next) {
  log.info('archiving file: %j', req.body.id);
  transmissionController.findTorrent(req.body.id)
  .then(function (data) {
    if(data.result && data.result === 'success') {
      if(data.arguments.torrents.length === 0) {
        log.error('%s file not found', req.body.filename);
        res.status(404);
        res.send(response.error('file not found', null));
      }
      else {
        if (req.body.hashString === data.arguments.torrents[0].hashString) {
          var payload = null;
          if (data.arguments.torrents[0].percentDone === 1) {
            log.info('%s file found and completed 100\%', req.body.filename);
            fileHandler.handleFile(data.arguments.torrents[0])
            .then(function (file) {
              payload = file;
              log.info('archive in progress for file %s', payload.fileName);
              return fileHandler.updateArchiveStatus(payload.hashString, true);
            })
            .then(function (file) {
              payload = file;
              connection.socket.emit('file', payload);
              return archiveController.archive(payload.fileName);
            })
            .then(function (archiveData) {
              log.info('archive successful for file %s. verbose: %j', payload.fileName, archiveData);
              return fileHandler.updateArchiveStatus(payload.hashString, false);
            })
            .then(function (file) {
              payload = file;
              return fileHandler.setDownloadLink(file);
            })
            .then(function (file) {
              payload = file;
              connection.socket.emit('file', payload);
              res.status(200);
              res.send(response.success('archive successful', payload));
            })
            .catch(function (error) {
              fileHandler.updateArchiveStatus(payload.hashString, false)
              .then(function (file) {
                payload = file;
                connection.socket.emit('file', payload);
              })
              .catch(function (error) {
                log.error('an error occurred when updating archive status %j', error.toString());
              });

              log.error('an error occurred while archiving %j', error.toString());
              res.status(500);
              res.send(response.error('an error occurred while archiving', error));
            });
          }
          else {
            log.info('%s file found but not complete', req.body.filename);
            res.status(402);
            res.send(response.error('file is not complete', null));
          }
        }
        else {
          log.info('%s file conflicts with the received one', null);
          res.status(404);
          res.send(response.error('given filename does not match with torrent file name', null));
        }
      }
    }
    else {
      res.status(500);
      res.send(response.error('error occurred while finding file', null));
    }
  }).catch(function (error) {
    log.error('an error occurred while finding file: %s, error: %j', req.body.filename, error);
    res.status(500);
    res.send(response.error('an error occurred while finding file', null))
  });
});

module.exports = router;
