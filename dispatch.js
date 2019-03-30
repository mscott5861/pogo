const http = require('http');


module.exports = {
  issueCommandToHubitat: function(deviceID, command, config) {
    const url = 'http://' + config.hubitatIPAddress + '/apps/api/97/devices/' + deviceID + '/' + command + '?access_token=' + config.hubitatAccessToken;
    http.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode !== 200) {
        config.log && log.appendToLog('Request to deviceID #' + deviceID + ' failed (' + url + ')');
      }
    });
  }
}
