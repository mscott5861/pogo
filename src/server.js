const express = require('express'),
      hubitat = require('./hubitat'),
      inhabitants = require('./inhabitants'),
      log = require('./log'),
      srvr = express();



module.exports = {
  _ip: '',
  _port: 0,
  _server: {},
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setIP: function(ip) {
    this._ip = ip;
  },
  setPort: function(port) {
    this._port = port;
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  init: function() {
    srvr.get('/current-mode', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /current-mode endpoint`);
      response.send(hubitat.getCurrentMode());
    });

    srvr.get('/devices', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /devices endpoint`);
      response.send(hubitat.getDevices());
    });
    
    srvr.get('/devices/:id', (request, response) => {
      let id = request.params.id;

      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /devices/{id} endpoint`);
      response.send(hubitat.getDevice(id));
    });

    srvr.get('/inhabitants', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /inhabitants endpoint`);
      response.send(inhabitants.getInhabitants());
    });


    srvr.get('/presence/:id', (request, response) => {
      let id = request.params.id;

      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /presence endpoint`);
      response.send(inhabitants.getPresence(id));
    });


    srvr.get('/switches', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /switches endpoint`);
      response.send(hubitat.getSwitches());
    });


    srvr.get('/switches/:id', (request, response) => {
      let id = request.params.id;

      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /switches/{id} endpoint`);
      response.send(hubitat.getSwitch(id));
    });


    srvr.listen(this._port, (err) => {
      if (err) {
        log.levelAtLeast('DEBUG') && log.appendToLog(`Error establishing server: ${err}`);
      }

      log.levelAtLeast('INFO') && log.appendToLog(`Server running at ${this._ip}:${this._port}`);
    });
  },
}
