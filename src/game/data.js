const Immutable = require('immutable');
const DataManager = require('../lib/DataManager');

class Data extends DataManager {
  getDefaultState() {
    return Immutable.Map({
      highestScore: 0,

      totalDeaths: 0,
      totalStars: 0,
      totalTricks: 0,
      highestMultiplier: 0,

      points: 0,
      multiplier: 1,
      died: false,
      diedReason: null
    });
  }

  reset() {
    this.state = this.state.merge({
      points: 0,
      multiplier: 1,
      died: false,
      diedReason: null
    });
  }

  died(reason) {
    this.state = this.state.set('died', true).set('diedReason', reason);
    this.state = this.state.update('totalDeaths', d => d + 1);
  }

  doublePoints() {
    this.addPoints(this.state.get('points'));
  }

  addPoints(points) {
    this.state = this.state.update('points', p => p + points);
    if (this.state.get('points') > this.state.get('highestScore')) {
      this.state = this.state.set('highestScore', this.state.get('points'));
    }
  }

  addStar() {
    this.state = this.state.update('totalStars', s => s + 1);
  }

  addTrick() {
    this.state = this.state.update('totalTricks', t => t + 1);
  }

  addMultiplier() {
    this.state = this.state.update('multiplier', m => m + 1);
    if (this.state.get('multiplier') > this.state.get('highestMultiplier')) {
      this.state = this.state.set('highestMultiplier', this.state.get('multiplier'));
    }
  }

  resetMultiplier() {
    this.state = this.state.set('multiplier', 1);
  }
}

module.exports = new Data();
