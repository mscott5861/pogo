module.exports = {
  _awayModeDeviceID: 0,
  _devices: [],
  _hubitatIP: '',
  _hubitatAccessToken: '',
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setAwayModeDeviceID: function(awayModeDeviceID) {
    this._awayModeDeviceID = awayModeDeviceID;
  },
  setDevices: function(devices) {
    this._devices = devices;
  },
  setHubitatAccessToken: function(token) {
    this._hubitatAccessToken = token;
  },
  setHubitatIP: function(ip) {
    this._hubitatIP = ip;
  },
  //------------------------------------------------
  // Getters
  //------------------------------------------------
  getAwayModeDeviceID: function() {
    return this._awayModeDeviceID;
  },
  getDevices: function() {
    return this._devices;
  },
  getHubitatIP: function() {
    return this._hubitatIP;
  },
  getHubitatAccessToken: function() {
    return this._hubitatAccessToken;
  },
}
