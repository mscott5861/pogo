#!/usr/bin/env node


const config = require('/etc/home-core/config'),
      log = require('./log'),
      censor = require('./censor');



class Pogo {
  init() {
    censor.config = config;

    if (config.restarted) {
      config.log && log.appendToLog('Service restarted');
      config.restarted = false;
    }

    const intervalID = setInterval(() => {
      for (let i in config.inhabitants) {
        censor.arpPing(config.inhabitants[i]);
      }
    }, config.pingInterval || 10000);
  }
}



const pogo = new Pogo();
pogo.init();
