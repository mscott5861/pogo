const arp = require('arping'),
      log = require('./log'),
      dispatch = require('./dispatch');



module.exports = {
  _absenceThreshold: 0,
  _awayModeDeviceID: 0,
  _homeObject: {},
  _inhabitants: [],
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setAbsenceThreshold: function(absenceThreshold) {
    this._absenceThreshold = absenceThreshold;
  },
  setAwayModeDeviceID: function(awayModeDeviceID) {
    this._awayModeDeviceID = awayModeDeviceID;
  },
  setHomeObject: function(homeObject) {
    this._homeObject = homeObject;
  },
  setInhabitants: function(inhabitants) {
    this._inhabitants = inhabitants;
  },
  //------------------------------------------------
  // Private methods
  //------------------------------------------------
  _checkCumulativePresence: function() {
    let everyoneAbsent = true;

    for (let i in this._inhabitants) {
      if (this._inhabitants[i].present === true || this._inhabitants[i].present === null) {
        everyoneAbsent = false;
      }
    }

    if (everyoneAbsent) {
      this._homeObject.setHomeUnoccupied(true);
      log.levelAtLeast('INFO') > 0 && log.appendToLog('Home is empty');
      dispatch.issueCommandToHubitat(this._awayModeDeviceID, 'on');
    }
  },
  //------------------------------------------------
  // Public methods
  //------------------------------------------------
  arpPing: function(inhabitant) {
    arp.ping(inhabitant.ipAddress, (err, info) => {
      if (err) {
        let timeElapsed = Date.now() - inhabitant.lastPresent,
            absenceThreshold = this._absenceThreshold || 400000;

        if (inhabitant.present && timeElapsed > absenceThreshold) {
          inhabitant.present = false;
          log.levelAtLeast('INFO') > 0 && log.appendToLog(inhabitant.name + ' departed');
          dispatch.issueCommandToHubitat(inhabitant.deviceID, 'off');
          this._checkCumulativePresence();
        }
      } else {
        if (!inhabitant.present) {
          log.levelAtLeast('INFO') && log.appendToLog(inhabitant.name + ' arrived');
          dispatch.issueCommandToHubitat(inhabitant.deviceID, 'on');
        }

        inhabitant.lastPresent = Date.now();
        inhabitant.present = true;

        if (this._homeObject.homeUnoccupied()) {
          this._homeObject.setHomeUnoccupied(false);
          log.levelAtLeast('INFO') && log.appendToLog('Home is occupied');
          dispatch.issueCommandToHubitat(this._awayModeDeviceID, 'off');
        }
      }; 
    });
  },
}
