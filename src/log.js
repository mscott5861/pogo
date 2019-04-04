const fs = require('fs');



module.exports = {
  _logLevel: 0,
  _getTimestamp: function() {
    let today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + String(today.getFullYear()) + ' ' + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + ' - ';
  },
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setLogLevel: function(logLevel) {
    this._logLevel = logLevel === 'NONE' ? 0 : (logLevel === 'INFO' ? 1 : (logLevel === 'DEBUG' ? 2 : 3));
  },
  //------------------------------------------------
  // Getters
  //------------------------------------------------
  getLogLevel: function() {
    return this._logLevel; 
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
    if (this._logLevel >= 1 && level === 'INFO' ||
        this._logLevel >= 2 && level === 'DEBUG' ||
        this._logLevel === 3 && level === 'VERBOSE') {
      return true;
    }

    return false;
  },
}
