const Immutable = require('immutable');

class DataManager {
  constructor() {
    this.state = this.loadState() || this.getDefaultState();
  }

  erase() {
    localStorage.removeItem('data');
    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Immutable.Map();
  }

  loadState() {
    const data = localStorage.getItem('data');
    if (data) {
      return Immutable.fromJS(JSON.parse(data));
    }
  }

  get(key, defaultValue) {
    return this.state.get(key, defaultValue);
  }

  getIn(key, defaultValue) {
    return this.state.getIn(key, defaultValue);
  }

  saveState() {
    const data = JSON.stringify(this.state.toJS());
    localStorage.setItem('data', data);
  }
}

module.exports = DataManager;
