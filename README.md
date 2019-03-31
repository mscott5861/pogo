### POGO (Present: On, Gone: Off)

A Node.js experiment in using `arp ping` to establish presence of home inhabitants. ARP ping is reported to be more reliable than ICMP for this use particular use case, which involves establishing presence through confirming network connectivity of Android phones, each operating on Oreo or above.

Intended for use with the Hubitat HA platform.

The end goal is to develop a centralized means of reliably tracking presence for all home inhabitants, a notoriously difficult problem to solve in home automation.

### Dependencies

* [arping](https://github.com/dresende/node-arping) (node module)
* [raw-sockets](https://github.com/nospaceships/node-raw-socket) (node module)
* [libpcap-dev](https://packages.debian.org/stretch/libpcap-dev) (C library)


### Installation and Usage

#### Debian

```bash
git clone https://github.com/mscott5861/pogo.git
sudo apt-get install libpcap-dev
npm install

# Edit the pogo.service file to point ExecStart and WorkingDirectory to
# wherever you cloned the repo. ExecStart should point at pogo.js;
# WorkingDirectory should point at the pogo directory.

sudo cp pogo.service /etc/systemd/system/
sudo chmod +x pogo.js
sudo touch /var/log/pogo.log
sudo systemctl enable pogo.service
sudo systemctl start pogo.service
```

The program expects an additional javascript file, `config.js`, present at `/etc/home-core/config.js`. Give this file `0600` permissions, and structure it as follows:

```javascript
module.exports = {
  inhabitants: [{
    name: "user1",
    ipAddress: "static-ip-of-user1-phone",
    present: null,
    lastPresent: 0,
    deviceID: "device-id-from-maker-api",
  },{
    name: "user2",
    ipAddress: "static-ip-of-user2-phone",
    present: null,
    lastPresent: 0,
    deviceID: "device-id-from-maker-api",
  }, ...additional Objects for each user],
  pingInterval: some-int-in-ms // Interval at which to execute arp ping,
  absenceThreshold: some-int-in-ms // Interval after which to mark inhabitant as gone,
  restarted: true,
  hubitatAccessToken: "access-token-given-by-hubitat-maker-api",
  hubitatIPAddress: "ip-address-of-hubitat-hub",
  awayModeDeviceID: "away-mode-virtual-switch-device-id-from-maker-api",
}
```
### Current State

Inspect your log (`tail -20 /var/log/pogo.log`) to confirm against manual records of presence.
