/**
 * Created by chamilp on 1/7/18.
 */

var encodeBase64 = function (data) {
  var buffer = new Buffer(data);
  return buffer.toString('base64');
};

var decodeBase64 = function (data) {
  var buffer = new Buffer(data, 'base64');
  return buffer.toString('ascii');
};

module.exports = {
  encodeBase64: encodeBase64,
  decodeBase64: decodeBase64
};
