### POGO (Present: On, Gone: Off)

A Node.js experiment in using `arp ping` to establish presence of home inhabitants. ARP ping is reported to be more reliable than ICMP for this use particular use case, which involves establishing presence through confirming network connectivity of Android phones, each operating on Oreo or above.

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
sudo cp pogo.service /etc/systemd/system/
cd .. && sudo cp -rf pogo /var/www/
sudo chmod +x /var/www/pogo/pogo.js
sudo systemctl enable pogo.service
sudo systemctl start pogo.service
```

The program expects an additional javascript file, `config.js`, present at the root directory. This file should be structured as follows:

```javascript
module.exports = {
  inhabitants: [{
    name: "user1",
    ipAddress: "some-ip-address",
    present: null,
    lastPresent: 0,
  },{
    name: "user2",
    ipAddress: "some-ip-address",
    present: null,
    lastPresent: 0,
  }, ...additional Objects for each user],
  pingInterval: some-int-in-ms // Interval by which to execute arp ping,
  absenceThreshold: some-int-in-ms // Interval after which to mark inhabitant as gone
}
```
### Current State

Inspect your log (located at `/var/www/pogo/presence.log`) to confirm against manual records of presence.
