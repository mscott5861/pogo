#!/usr/bin/env node


const censor = require('./censor'),
      config = require('/etc/home-core/config'),
      dispatch = require('./dispatch'),
      hubitat = require('./hubitat'),
      inhabitants = require('./inhabitants'),
      home = require('./home'),
      log = require('./log'),
      serverHTTPWS = require('./server-httpws');



class Pogo {
  init() {
    // Set the threshold (e.g., 5mins) after which a lack
    // of response from ARP ping will qualify an inhabitant
    // as 'absent'
    censor.setAbsenceThreshold(config.absenceThreshold);
  

    // TODO: stop sending commands directly to the hub
    hubitat.setHubitatIP(config.hubitatIPAddress);
    hubitat.setHubitatAccessToken(config.hubitatAccessToken);
    hubitat.setAwayModeDeviceID(config.awayModeDeviceID);


    // TODO: get these guys into a database
    inhabitants.setInhabitants(config.inhabitants);
    dispatch.getHubitatDevices();
    
    log.setLogLevel(config.logLevel);
    log.levelAtLeast('DEBUG') && log.appendToLog('Service restarted');


    // An Express server playing a double role as a Websocket server.
    // May have to reconsider this once RTSP/RTP are in the picture.
    serverHTTPWS.setIP(config.homeCoreIPAddress);
    serverHTTPWS.setPort(config.homeCorePort);
    serverHTTPWS.init();

    let users = inhabitants.getInhabitants();

    const intervalID = setInterval(() => {
      for (let i in users) {
        censor.arpPing(users[i]);
      }
    }, config.pingInterval || 10000);
  }
}



const pogo = new Pogo();
pogo.init();
