const fs = require('fs');



module.exports = {
  _logLevel: '',
  _getTimestamp: function() {
    let today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + String(today.getFullYear()) + ' ' + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + ' - ';
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  appendToLog: function(logMsg) {
    fs.appendFile('/var/log/pogo.log', this._getTimestamp() + logMsg + '\n', (err) => {
      if (err) throw err;
    });
  },
  levelAtLeast: function(level) {
    this._logLevel >= 1 && level === 'INFO' && return true;
    this._logLevel >= 2 && level === 'DEBUG' && return true;
    return false;
  },
  getLogLevel: function() {
    return this._logLevel; 
  },
  setLogLevel: function(logLevel) {
    this._logLevel = logLevel;
  }
}

