const fs = require('fs');



module.exports = {
  appendToLog: function(logMsg) {
    function _getTimestamp() {
      let today = new Date();
      return String(today.getMonth()).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + String(today.getFullYear()) + ' ' + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + ' - ';
    }

    fs.appendFile('/var/log/pogo.log', _getTimestamp() + logMsg + '\n', (err) => {
      if (err) throw err;
    });
  }
}

