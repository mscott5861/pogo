module.exports = {
  _inhabitants: [],
  //------------------------------------------------
  // Getters
  //------------------------------------------------
  getInhabitants: function() {
    return this._inhabitants;
  },
  getPresence: function(id) {
    const inhabitant = this._inhabitants.filter(inhabitant => inhabitant.deviceID === id)[0];
    return inhabitant.present;
  },
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setInhabitants: function(inhabitants) {
    this._inhabitants = inhabitants;
  },
}
