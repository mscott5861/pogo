#!/usr/bin/env node

const arp = require('arping');
const config = require('./config');
const fs = require('fs');


//----------------------------------------------------------------------------------------------
//  TODO: After testing reliability--and if reliable--set up server for communication with Hubitat 
//  (trigger virtual switches on presence/absence for automating Home/Away modes)
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
        absenceThreshold = config.absenceThreshold || 400000;

    if (inhabitant.present !== false && timeElapsed > absenceThreshold) {
      inhabitant.present = false;
      fs.appendFile('./presence.log', inhabitant.name + " departed at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + '\n', (err) => {
        if (err) throw err;
      });
    }
  } else {
    
    if (inhabitant.present !== true) {
      fs.appendFile('./presence.log', inhabitant.name + " arrived at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + '\n', (err) => {
        if (err) throw err;
      });

    }

    inhabitant.lastPresent = Date.now();
    inhabitant.present = true;
  }; 
 });
}
