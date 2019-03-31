#!/usr/bin/env node


const censor = require('./censor'),
      config = require('/etc/home-core/config'),
      dispatch = require('./dispatch'),
      inhabitants = require('./inhabitants'),
      home = require('./home'),
      log = require('./log');



class Pogo {
  init() {
    inhabitants.setInhabitants(config.inhabitants);
    
    censor.setAbsenceThreshold(config.absenceThreshold);
    censor.setAwayModeDeviceID(config.awayModeDeviceID);
    censor.setHomeObject(home);
    censor.shouldLog(config.shouldLog);
    censor.shouldStore(config.shouldStore);
    
    dispatch.setHubitatIP(config.hubitatIPAddress);
    dispatch.setHubitatAccessToken(config.hubitatAccessToken);

    if (config.restarted) {
      config.shouldLog && log.appendToLog('Service restarted');
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
