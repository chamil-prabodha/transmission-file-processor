/**
 * Created by chamilp on 1/14/18.
 */
var socket = null;

var connect = function (socket) {
  this.socket = socket;
};

module.exports = {
  connect: connect,
  socket: socket
};