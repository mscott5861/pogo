const express = require('express'),
      hubitat = require('./hubitat'),
      log = require('./log'),
      srvr = express();



module.exports = {
  _ip: '',
  _port: 0,
  _server: {},
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  init: function() {
    srvr.get('/devices', (request, response) => {
      log.levelAtLeast('DEBUG') && log.appendToLog(`Handling request from /devices endpoint`);
      response.send(hubitat.getDevices());
    });

    srvr.listen(this._port, (err) => {
      if (err) {
        log.levelAtLeast('INFO') && log.appendToLog(`Error establishing server: ${err}`);
      }

      log.levelAtLeast('DEBUG') && log.appendToLog(`Server running at ${this._ip}:${this._port}`);
    });
  },
  setIP: function(ip) {
    this._ip = ip;
  },
  setPort: function(port) {
    this._port = port;
  },
}
