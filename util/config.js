/**
 * Created by chamilp on 1/14/18.
 */
var config = require('../config/appConfig.json');
var getConfig = function () {
  global.appConfig = config;
};

module.exports = {
  getConfig: getConfig
};