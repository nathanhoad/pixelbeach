require('es6-promise/auto');
require('isomorphic-fetch');

const Immutable = require('immutable');

const STORAGE_AUTH_TOKEN_KEY = 'user-token';

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
