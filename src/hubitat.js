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
    let deviceArray = JSON.parse(devices).map(device => {
      return {
        label: device.label,
        id: device.id,
        capabilities: device.capabilities,
        attributes: device.attributes,
        commands: [...new Set(device.commands.map((dev) => { return dev.command }))]
      }
    });
    this._devices = deviceArray;
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
