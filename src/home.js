module.exports = {
  _homeUnoccupied: true,
  _numberInhabitantsPresent: 0,
  //------------------------------------------------
  // Getters
  //------------------------------------------------
  getNumberInhabitantsPresent: function() {
    return this._numberInhabitantsPresent;
  },
  homeUnoccupied: function() {
    return this._homeUnoccupied;
  },
  //------------------------------------------------
  // Setters
  //------------------------------------------------
  setHomeUnoccupied: function(homeUnoccupied) {
    this._homeUnoccupied = homeUnoccupied;
  },
  setNumberInhabitantsPresent: function(numberInhabitantsPresent) {
    this._numberInhabitantsPresent = numberInhabitantsPresent;
  },
}
