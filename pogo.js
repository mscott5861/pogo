const arp = require('arping');
const config = require('./config');

//----------------------------------------------------------------------------------------------
// TODO: Currently just logging to the console. Next steps:
//  1. Begin logging presence/absence to a databse
//  2. Concurently keep a manual log of when people are present/absent
//  3. Compare manual log with database to determine reliability
//  4. Set up server for communication with Hubitat (trigger virtual switches on presence/
//     absence for automating Home/Away modes)
//----------------------------------------------------------------------------------------------

let intervalID = setInterval(() => {
  for (let i in config.inhabitants) {
    arpPing(config.inhabitants[i]);
  }
}, config.pingInterval || 10000);

let arpPing = (inhabitant) => {
 arp.ping(inhabitant.ipAddress, (err, info) => {
  let today = new Date();
  if (err) {
    //----------------------------------------------------------------------------------------------
    // Certain phones seem to drop into and off the network at regular intervals when sleeping, but 
    // of course will stay off the network entirely when outside of the LAN. We configure an 
    // absenceThreshold in config.js, and only mark the inhabitant as gone if they were last marked 
    // present at a time whose distance from now is greater than this threshold.
    //----------------------------------------------------------------------------------------------
    let timeElapsed = Date.now() - inhabitant.lastPresent,
        absenceThreshold = config.absenceThreshold || 450000;

    if (inhabitant.present !== false && timeElapsed > absenceThreshold) {
      inhabitant.present = false;
      console.log(inhabitant.name + " is not present at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
    }
  } else {
    if (inhabitant.present !== true) {
      inhabitant.present = true;
      inhabitant.lastPresent = Date.now();
      console.log(inhabitant.name + " arrived at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
    }
  }; 
 });
}
