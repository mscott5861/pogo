const http = require('http'),
      hubitat = require('./hubitat'),
      log = require('./log');


module.exports = {
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  getHubitatDevices: function() {
    const url = `http://${hubitat.getHubitatIP()}/apps/api/97/devices/all?access_token=${hubitat.getHubitatAccessToken()}`;
    http.get(url, (res) => {
      const { statusCode } = res;
     
      if (statusCode === 200) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.stringify(rawData);
            hubitat.populateDevices(JSON.parse(parsedData));
          } catch (e) {
            console.error(e.message);
          }
        });
      }
    });
  },
  issueCommandToHubitat: function(deviceID, command) {
    const url = `http://${hubitat.getHubitatIP()}/apps/api/97/devices/${deviceID}/${command}?access_token=${hubitat.getHubitatAccessToken()}`;
    http.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode !== 200) {
        log.levelAtLeast('DEBUG') && log.appendToLog('Request to deviceID #' + deviceID + ' failed (' + url + ')');
      }
    });
  }
}
