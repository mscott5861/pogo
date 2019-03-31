const fs = require('fs');



module.exports = {
  _getTimestamp: function() {
    let today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + String(today.getFullYear()) + ' ' + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + ' - ';
  },
  appendToLog: function(logMsg) {
    fs.appendFile('/var/log/pogo.log', this._getTimestamp() + logMsg + '\n', (err) => {
      if (err) throw err;
    });
  }
}

