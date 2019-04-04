module.exports = {
  _awayModeDeviceID: 0,
  _currentMode: '',
  _devices: [],
  _hubitatIP: '',
  _hubitatAccessToken: '',
  _switches: [],
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setAwayModeDeviceID: function(awayModeDeviceID) {
    this._awayModeDeviceID = awayModeDeviceID;
  },
  setCurrentMode: function(currentMode) {
    this._currentMode = currentMode;
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
  setSwitches: function(switches) {
    this._switches = switches;
  },
  //------------------------------------------------
  // Getters
  //------------------------------------------------
  getAwayModeDeviceID: function() {
    return this._awayModeDeviceID;
  },
  getCurrentMode: function() {
    return this._currentMode;
  },
  getDevice: function(id) {
    return device = this._devices.filter(dvc => dvc.id === id)[0];
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
  getSwitch: function(id) {
    return swtch = this._switches.filter(swtch => swtch.id === id)[0];
  },
  getSwitches: function() {
    return this._switches;
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  populateDevices: function(devices) {
    let deviceArray = JSON.parse(devices).map(device => {
      return {
        label: device.label,
        id: device.id,
        capabilities: device.capabilities,
        attributes: device.attributes,
        commands: [...new Set(device.commands.map((dev) => { return dev.command }))]
      }
    });
    
    let switchArray = deviceArray.filter(device => device.capabilities.includes("Switch"))

    deviceArray.sort((a, b) => a.label.localeCompare(b.label));
    switchArray.sort((a, b) => a.label.localeCompare(b.label));

    this.setDevices(deviceArray);
    this.setSwitches(switchArray);
  },

}
