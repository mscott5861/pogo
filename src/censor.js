const arp = require('arping'),
      dispatch = require('./dispatch'),
      home = require('./home'),
      hubitat = require('./hubitat'),
      inhabitants = require('./inhabitants'),
      log = require('./log');



module.exports = {
  _absenceThreshold: 0,
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setAbsenceThreshold: function(absenceThreshold) {
    this._absenceThreshold = absenceThreshold;
  },
  //------------------------------------------------
  // Private methods
  //------------------------------------------------
  _checkCumulativePresence: function() {
    let everyoneAbsent = true,
        users = inhabitants.getInhabitants();

    for (let i in users) {
      if (users[i].present === true || users[i].present === null) {
        everyoneAbsent = false;
      }
    }

    if (everyoneAbsent) {
      home.setHomeUnoccupied(true);
      log.levelAtLeast('INFO') && log.appendToLog('Home is empty');
      log.levelAtLeast('DEBUG') && log.appendToLog(JSON.stringify(users));
      dispatch.issueCommandToHubitat(hubitat.getAwayModeDeviceID(), 'on');
      hubitat.setCurrentMode('Away');
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


        if ((inhabitant.present || inhabitant.present === null) && timeElapsed > absenceThreshold) {
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

        if (home.homeUnoccupied()) {
          home.setHomeUnoccupied(false);
          log.levelAtLeast('INFO') && log.appendToLog('Home is occupied');
          dispatch.issueCommandToHubitat(hubitat.getAwayModeDeviceID(), 'off');
        }
      }; 
    });
  },
}
