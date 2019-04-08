### POGO (Present: On, Gone: Off)

A project that started off as a Node.js experiment in using `arp ping` to establish presence of home inhabitants. ARP ping is reported to be more reliable than ICMP for this use particular use case, which involves establishing presence through confirming network connectivity of Android phones, each operating on Oreo or above.

Intended for use with the Hubitat HA platform. Currently being expanded to serve as a middleman between the Hubitat hub and any number of mobile clients (being developed in React Native in a separate, private repo), with the additional goal of eventually managing RTSP/RTP streams and shipping frames off to an Nvidia Jetson Nano for ML analysis.

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
### Current State: Usage

At a minimum, this has proven extremely reliable in automatically setting `Away` mode on my hub, with no false positives
over 2+ weeks of usage. You'll need a few things for this:

1. A virtual switch on your hub and its device ID
2. Some Groovy set up (or possibly Rule Machine; I haven't used it) to toggle between modes depending on the switch's state
3. The Maker API activated on your hub
4. Your hub's IP and an access token (add these to the `config.js` file

That should get you a functional presence detector. More to come!
