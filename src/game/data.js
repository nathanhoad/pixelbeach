require('es6-promise/auto');
require('isomorphic-fetch');

const Immutable = require('immutable');

const STORAGE_AUTH_TOKEN_KEY = 'user-token';

class Data {
  constructor() {
    // TODO: Load from localStorage
    this.state = Immutable.Map({
      collectables: 0,
      points: 0,
      pointMultiplier: 1,
      userName: null
    });
  }

  get(key, defaultValue) {
    return this.state.get(key, defaultValue);
  }

  resetScore() {
    this.state = this.state
      .set('collectables', 0)
      .set('points', 0)
      .set('pointMultiplier', 1);
  }

  addMultiplier() {
    this.state = this.state.update('pointMultiplier', m => m + 1);
  }

  addPoints(points) {
    this.state = this.state.update('points', p => p + points);
  }

  collectCollectable() {
    this.state = this.state.update('collectables', c => c + 1);
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
    // TODO ask for name if there is none saved
    // ...

    // TODO: work out how things get scored
    const payload = {
      userName: 'Nathan',
      score: this.get('points') + this.get('collectables') * this.get('collectables')
    };

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const authToken = global.localStorage && localStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch('/scores', {
      method: 'post',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json().then(body => {
          if (response.ok && body.userToken && global.localStorage) {
            localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, body.userToken);
          }
        });
      })
      .catch(err => {
        console.error('Error submitting score', err);
      });
  }
}

module.exports = new Data();
