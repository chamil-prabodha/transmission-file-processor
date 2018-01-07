/**
 * Created by chamilp on 1/7/18.
 */

var config = require('../config/appConfig.json');
var request = require('request');
var log = require('../logger');
var util = require('../util/util');
var parser = require('xml2json');
var Q = require('q');

const options = {
  url: config.transmission.url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Transmission-Session-Id': '',
    'Authorization': 'Basic '+ util.encodeBase64(config.transmission.username + ':' +config.transmission.password)
  }
};

var execute = function (body) {
  var deffered = Q.defer();
  options.data = body;
  log.info('sending requst: %j', options);
  request(options, function (err, res, body) {
    if (err) {
      log.error('an error occurred while sending request. %j', err.toString());
      deffered.reject({
        error: 'an error occurred while executing rpc call',
      });
    }
    else if(res.statusCode === 409) {
      log.info('something fishy | %j', res.headers);
      try {
        var jsonResponse = parser.toJSON(body);
        options.headers['X-Transmission-Session-Id'] = jsonResponse.code.split(" ")[1];
        request(options, function (err, res, body) {
          if(res.statusCode !== 200) {
            deffered.reject({
              error: 'non-200 response code received from transmission rpc client',
              code: res.statusCode
            });
          }
          else {
            deffered.resolve(body);
          }
        });
      } catch (err) {
        log.error('cannot parse xml body to json. error: %j', err);
        deffered.reject({
          error: 'cannot parse xml body to json',
          code: res.statusCode
        });
      }
    }
    else if(res.statusCode === 200) {
      deffered.resolve(body);
    }
    else {
      log.info('something too fishy | %j', body.toString());
      deffered.reject({
        error: 'non-200 response code received from transmission rpc client',
        code: res.statusCode
      });
    }
  });
  return deffered.promise;
};

module.exports = {
  execute: execute
};
