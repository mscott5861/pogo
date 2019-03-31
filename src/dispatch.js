const http = require('http'),
      log = require('./log');


module.exports = {
  _hubitatIP: '',
  _hubitatAccessToken: '',
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setHubitatIP: function(ip) {
    this._hubitatIP = ip;
  },
  setHubitatAccessToken: function(token) {
    this._hubitatAccessToken = token;
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  issueCommandToHubitat: function(deviceID, command) {
    const url = 'http://' + this._hubitatIP + '/apps/api/97/devices/' + deviceID + '/' + command + '?access_token=' + this._hubitatAccessToken;
    http.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode !== 200) {
        log.levelAtLeast('DEBUG') && log.appendToLog('Request to deviceID #' + deviceID + ' failed (' + url + ')');
      }
    });
  }
}
