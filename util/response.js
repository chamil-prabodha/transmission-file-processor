/**
 * Created by chamilp on 1/8/18.
 */
var success = function (message, data) {
  var res = {
    message: message,
    data: data
  };
  return res;
};

var error = function (error, data) {
  var res = {
    error: error,
    data: data
  };
  return res;
};

module.exports = {
  success: success,
  error: error
};