const Data = require('../data');

class SummaryState {
  create() {
    this.game.stage.backgroundColor = '#06f';
    this.deadText = this.game.add.text(10, 10, 'You be ded', {
      font: 'bold 20px Courier New',
      fill: 'black',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });

    // TODO: check for username
    // Data.submitScore();
  }
}

module.exports = SummaryState;
