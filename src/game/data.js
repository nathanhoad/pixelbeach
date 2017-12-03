const Immutable = require('immutable');

class Data {
  constructor() {
    this.state = Immutable.Map({
      collectables: 0,
      points: 0,
      pointMultiplier: 1,
      userName: null,
      died: false,
      diedReason: null
    });
  }

  get(key, defaultValue) {
    return this.state.get(key, defaultValue);
  }

  reset() {
    this.state = this.state
      .set('died', false)
      .set('diedReason', null)
      .set('collectables', 0)
      .set('points', 0)
      .set('pointMultiplier', 1);
  }

  died(reason) {
    this.state = this.state.set('died', true).set('diedReason', reason);
  }

  addMultiplier() {
    this.state = this.state.update('pointMultiplier', m => m + 1);
  }

  addPoints(points) {
    this.state = this.state.update('points', p => p + points);
  }
}

module.exports = new Data();
