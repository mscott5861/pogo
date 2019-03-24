### POGO (Present: On, Gone: Off)

A Node.js experiment in using `arp ping` to establish presence of home inhabitants. ARP ping is reported to be more reliable than ICMP for this use particular use case, which involves establishing presence through confirming network connectivity of Android phones, each operating on Oreo or above.

The end goal is to develop a centralized means of reliably tracking presence for all home inhabitants, a notoriously difficult problem to solve in home automation.

### Dependencies

An `npm` package, `arping`, is used to wrap the raw sockets provided by an additional `npm` package, `raw-sockets`. This in turn depends on the `libpcap-dev` C library.

In Debian, this can be gotten using:

`sudo apt-get install libpcap-dev`

### Installation and Usage

#### Debian

```bash
sudo apt-get install libpcap-dev
git clone https://github.com/mscott5861/pogo.git
npm install
# Have to execute this with superuser privileges because it accesses raw sockets
sudo node pogo.js
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

Not particularly useful in its current state. Just logging to the console.
