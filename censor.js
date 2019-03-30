const arp = require('arping'),
      log = require('./log'),
      dispatch = require('./dispatch');



module.exports = {
  config: {},
  arpPing: function(inhabitant) {
    arp.ping(inhabitant.ipAddress, (err, info) => {
      if (err) {
        let timeElapsed = Date.now() - inhabitant.lastPresent,
            absenceThreshold = this.config.absenceThreshold || 400000;

        if (inhabitant.present && timeElapsed > absenceThreshold) {
          inhabitant.present = false;
          this.config.log && log.appendToLog(inhabitant.name + ' departed');
          dispatch.issueCommandToHubitat(inhabitant.deviceID, 'off', this.config);
          this._checkCumulativePresence();
        }
      } else {
        if (!inhabitant.present) {
          this.config.log && log.appendToLog(inhabitant.name + ' arrived');
          dispatch.issueCommandToHubitat(inhabitant.deviceID, 'on', this.config);
        }

        inhabitant.lastPresent = Date.now();
        inhabitant.present = true;

        if (this.config.homeUnoccupied == true) {
          this.config.homeUnoccupied = false;
          this.config.log && log.appendToLog('Home is occupied');
          dispatch.issueCommandToHubitat(this.config.awayModeDeviceID, 'off', this.config);
        }
      }; 
    });
  },
  _checkCumulativePresence: function() {
    let everyoneAbsent = true;

    for (let i in this.config.inhabitants) {
      if (this.config.inhabitants[i].present === true || this.config.inhabitants[i].present === null) {
        everyoneAbsent = false;
      }
    }

    if (everyoneAbsent) {
      this.config.homeUnoccupied = true;
      this.config.log && log.appendToLog('Home is empty');
      dispatch.issueCommandToHubitat(this.config.awayModeDeviceID, 'on');
    }
  },
}
