/**
 * Created by chamilp on 1/7/18.
 */
var winston = require('winston');
var fs = require('fs');
var path = require('path');
require('winston-daily-rotate-file');

const level = process.env.ENVIRONMENT === 'prod' ? 'info': 'debug';
const tsFormat = (new Date()).toISOString();
const logDir = './logs/';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var fileTransport = new (winston.transports.DailyRotateFile)({
  filename: path.join(logDir,'log'),
  datePattern: 'dd-MM-yyyy.',
  prepend: true,
  level: level,
  maxFiles: '7d'
});

var consoleTransport = new (winston.transports.Console)({
  level: 'info',
  timestamp: tsFormat,
  colorize: true
});
var logger = new (winston.Logger)({
  transports: [
      fileTransport,
      consoleTransport
  ]
});
module.exports = logger;