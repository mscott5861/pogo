const express = require('express'), 
      hubitat = require('./hubitat'), 
      log = require('./log'),
      WSServer = require('ws').Server,
      HTTPServer = require('http').createServer(),
      ExpressServer = express();


module.exports = {
  _ip: '',
  _port: 0,
  _ws: {},
  //------------------------------------------------
  // Private methods
  //------------------------------------------------
  _send: function(msg) {
    this._ws.send(msg, function ack(err) {
      if (err) {
        log.levelAtLeast('INFO') && log.appendToLog(`WS send error: ${err}`);
      }
    });
  },
  _setRoutes: function() {
    //------------------------------------------------
    // GET
    //------------------------------------------------
    ExpressServer.get('/current-mode', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /current-mode endpoint`);
      response.send(hubitat.getCurrentMode());
    });


    ExpressServer.get('/devices', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /devices endpoint`);
      response.send(hubitat.getDevices());
    });
   

    ExpressServer.get('/devices/:id', (request, response) => {
      let id = request.params.id;

      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /devices/{id} endpoint`);
      response.send(hubitat.getDevice(id));
    });


    ExpressServer.get('/inhabitants', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /inhabitants endpoint`);
      response.send(inhabitants.getInhabitants());
    });


    ExpressServer.get('/presence/:id', (request, response) => {
      let id = request.params.id;
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /presence endpoint`);
      response.send(inhabitants.getPresence(id));
    });


    ExpressServer.get('/switches', (request, response) => {
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /switches endpoint`);
      response.send(hubitat.getSwitches());
    });


    ExpressServer.get('/switches/:id', (request, response) => {
      let id = request.params.id;
      log.levelAtLeast('VERBOSE') && log.appendToLog(`Handling request from /switches/{id} endpoint`);
      response.send(hubitat.getSwitch(id));
    });
    //------------------------------------------------
    // PUT
    //------------------------------------------------
    ExpressServer.put('/alert/:type', (request, response) => {
      let alert = request.params.type;
      log.levelAtLeast('INFO') && log.appendToLog(`Received an alert from Hubitat: ${alert}`);
    });


    ExpressServer.put('/mode/:mode', (request, response) => {
      let mode = request.params.mode;

      log.levelAtLeast('INFO') && log.appendToLog(`Home mode was changed to ${mode} by Hubitat`);
      hubitat.setCurrentMode(mode);
      this._send(`Setting this new mode of ${mode}`);
    });


    ExpressServer.put('/switchCommand/:deviceID/:command', (request, response) => {
      let deviceID = request.params.deviceID,
          command = request.params.command;

      log.levelAtLeast('INFO') && log.appendToLog(`Device ${deviceID} received ${command} command`);
      hubitat.updateSwitchStatus(deviceID, command);
    });
  },
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
  // Setters
  //------------------------------------------------
  getIP: function() {
    return this._ip;
  },
  getPort: function() {
    return this._port;
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  init: function() {
    this._setRoutes();
    
    const _this = this,
          wss = new WSServer({ 
      server: HTTPServer 
    });

    HTTPServer.on('request', ExpressServer);

    wss.on('connection', function connection(ws, req) {
      const clientIP = req.connection.remoteAddress;
      log.levelAtLeast('DEBUG') && log.appendToLog(`WS connection established with client ${clientIP}`);
      _this._ws = ws;

      ws.on('message', function incoming(message) {
        log.levelAtLeast('VERBOSE') && log.appendToLog(`WS message received from client ${clientIP}: ${message}`);
      });

      return ws;
    });
    
    HTTPServer.listen(this.getPort(), function() {
      log.levelAtLeast('INFO') && log.appendToLog(`HTTP/WS server listening at address ${_this.getIP()}:${_this.getPort()}`);
    });
    },
  }
