#!/usr/bin/env node


const censor = require('./censor'),
      config = require('/etc/home-core/config'),
      dispatch = require('./dispatch'),
      hubitat = require('./hubitat'),
      inhabitants = require('./inhabitants'),
      home = require('./home'),
      log = require('./log'),
      serverWS = require('./server-ws');



class Pogo {
  init() {
    censor.setAbsenceThreshold(config.absenceThreshold);
    
    hubitat.setHubitatIP(config.hubitatIPAddress);
    hubitat.setHubitatAccessToken(config.hubitatAccessToken);
    hubitat.setAwayModeDeviceID(config.awayModeDeviceID);

    inhabitants.setInhabitants(config.inhabitants);
    dispatch.getHubitatDevices();
    
    log.setLogLevel(config.logLevel);
    log.levelAtLeast('DEBUG') && log.appendToLog('Service restarted');

    serverWS.setIP(config.homeCoreIPAddress);
    serverWS.setPort(config.homeCorePort);
    serverWS.init();

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
