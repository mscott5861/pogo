#!/usr/bin/env node

const arp = require('arping'),
      config = require('/etc/home-core/config'),
      fs = require('fs'),
      http = require('http');



const intervalID = setInterval(() => {
  for (let i in config.inhabitants) {
    arpPing(config.inhabitants[i]);
  }
}, config.pingInterval || 10000);



const getTimestamp = () => {
  let today = new Date();
  return String(today.getMonth()).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + String(today.getFullYear()) + ' ' + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + ' - ';
}



const appendToLog = (logMsg) => {
  fs.appendFile('/var/log/pogo.log', getTimestamp() + logMsg + '\n', (err) => {
    if (err) throw err;
  });
}



const issueCommandToHubitat = (deviceID, command) => {
  const url = 'http://' + config.hubitatIPAddress + '/apps/api/97/devices/' + deviceID + '/' + command + '?access_token=' + config.hubitatAccessToken;
  http.get(url, (res) => {
    const { statusCode } = res;
    
    if (statusCode !== 200) {
      appendToLog('Request to deviceID #' + deviceID + ' failed (' + url + ')');
    }
  });
}



const arpPing = (inhabitant) => {
  if (config.restarted) {
    appendToLog('Service restarted');
    config.restarted = false;
  }

  arp.ping(inhabitant.ipAddress, (err, info) => {
    if (err) {
      //----------------------------------------------------------------------------------------------
      // Certain phones seem to drop into and off the network at regular intervals when sleeping, but 
      // of course will stay off the network entirely when outside of the LAN. We configure an 
      // absenceThreshold in config.js, and only mark the inhabitant as gone if they were last marked 
      // present at a time whose distance from now was greater than this threshold (e.g., 6 minutes)
      //----------------------------------------------------------------------------------------------
      let timeElapsed = Date.now() - inhabitant.lastPresent,
          absenceThreshold = config.absenceThreshold || 400000;

      if (inhabitant.present !== false && timeElapsed > absenceThreshold) {
        inhabitant.present = false;
        appendToLog(inhabitant.name + ' departed');
        issueCommandToHubitat(inhabitant.deviceID, 'off');
        checkCumulativePresence();
      }
    } else {
      if (inhabitant.present !== true) {
        appendToLog(inhabitant.name + ' arrived');
        issueCommandToHubitat(inhabitant.deviceID, 'on');
      }

      inhabitant.lastPresent = Date.now();
      inhabitant.present = true;

      if (config.homeUnoccupied == true) {
        config.homeUnoccupied = false;
        appendToLog('Home is occupied');
        issueCommandToHubitat(config.awayModeDeviceID, 'off');
      }
    }; 
  });
}



const checkCumulativePresence = () => {
  let everyoneAbsent = true;

  for (let i in config.inhabitants) {
    if (config.inhabitants[i].present === true || config.inhabitants[i].present === null) {
      everyoneAbsent = false;
    }
  }

  if (everyoneAbsent) {
    config.homeUnoccupied = true;
    appendToLog('Home is empty');
    issueCommandToHubitat(config.awayModeDeviceID, 'on');
  }
}
