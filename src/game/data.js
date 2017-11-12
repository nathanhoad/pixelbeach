require('es6-promise/auto');
require('isomorphic-fetch');

const Immutable = require('immutable');

class Data {
  constructor() {
    this.state = Immutable.Map({
      currentScore: 0
    });
  }

  addPoints(points) {
    this.state = this.state.update('currentScore', s => s + points);
  }

  loadHighScores() {
    return fetch('/scores')
      .then(r => r.json())
      .then(json => {
        return Immutable.fromJS(json);
      })
      .catch(err => {
        console.error('Failed to load high scores', err);
      });
  }

  submitScore() {
    const payload = {
      score: this.state.get('currentScore')
    };

    return fetch('/scores', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .catch(err => {
        console.error('Error submitting score', err);
      });
  }
}

module.exports = new Data();
