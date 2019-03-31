const http = require('http'),
      log = require('./log');



module.exports = {
  _ip: '',
  _port: 0,
  _server: {},
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  init: function() {
    this._server = http.createServer((req, res) => {

    });

    server.listen(port, () => {
      log.levelAtLeast('DEBUG') && log.appendToLog(`Server running at ${this._ip}:${_this.port}`));
    });
  },
  setPort: function(port) {
    this._port = port;
  },
}
