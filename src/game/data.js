require('es6-promise/auto');
require('isomorphic-fetch');

const Immutable = require('immutable');

const STORAGE_USER_NAME = 'user-name';
const STORAGE_AUTH_TOKEN_KEY = 'user-token';

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
    let userName = global.localStorage && localStorage.getItem(STORAGE_USER_NAME);
    if (!userName) {
      userName = prompt('What is your name?', 'Madmax');
      global.localStorage && localStorage.setItem(STORAGE_USER_NAME, userName);
    }

    const payload = {
      userName,
      score: this.get('points'),
      deaths: this.get('died') ? 1 : 0
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
