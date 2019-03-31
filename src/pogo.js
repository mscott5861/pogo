#!/usr/bin/env node


const censor = require('./censor'),
      config = require('/etc/home-core/config'),
      dispatch = require('./dispatch'),
      inhabitants = require('./inhabitants'),
      home = require('./home'),
      log = require('./log'),
      server = require('./server');



class Pogo {
  init() {
    censor.setAbsenceThreshold(config.absenceThreshold);
    censor.setAwayModeDeviceID(config.awayModeDeviceID);
    censor.setHomeObject(home);
    
    dispatch.setHubitatIP(config.hubitatIPAddress);
    dispatch.setHubitatAccessToken(config.hubitatAccessToken);
    
    inhabitants.setInhabitants(config.inhabitants);
    log.setLogLevel(config.logLevel);

    if (config.restarted) {
      log.levelAtLeast('DEBUG') && log.appendToLog('Service restarted');
      config.restarted = false;
    }


    const intervalID = setInterval(() => {
      for (let i in inhabitants.getInhabitants()) {
        censor.arpPing(inhabitants.getInhabitants()[i]);
      }
    }, config.pingInterval || 10000);
  }
}



const pogo = new Pogo();
pogo.init();
