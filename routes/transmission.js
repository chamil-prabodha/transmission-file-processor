var express = require('express');
var router = express.Router();
var log = require('../logger');
var transmissionController = require('../controllers/transmission');

/* GET users listing. */
router.get('/file', function(req, res, next) {
  log.info('retrieving files');
  transmissionController.getTorrents().then(function (data) {
    log.info('successfully retrieved files %j', data.arguments.torrents);
    res.send('retried files: ' + data);
  }).catch(function (data) {
    log.error('error occurred while retrieving files. error: %j', data);
    res.send(data);
  });
});

module.exports = router;
