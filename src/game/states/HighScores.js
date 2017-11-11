const Immutable = require('immutable');

const Store = require('../store');
const Actions = require('../actions');

class HighScores {
  create() {
    // Render text
    this.headerText = this.game.add.text(10, 10, 'The tubalarest surfers', {
      font: 'bold 20px Courier New',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });

    this.headerText.setTextBounds(0, 0, this.game.world.width - 5, 50);
    this.headerText.inputEnabled = true;
    this.headerText.events.onInputDown.add(() => {
      this.game.state.start('game');
    }, this);

    this.highScores = Immutable.Range(0, 5)
      .map(n => {
        const text = this.game.add.text(0, 0, '', {
          font: `bold ${21 - n}px Courier New`,
          fill: '#ffffff',
          boundsAlignH: 'center',
          boundsAlignV: 'middle'
        });

        text.setTextBounds(5, 100 + 28 * n, this.game.world.width - 5, 20);
        text.alpha = 0;

        return text;
      })
      .toList();

    Store.dispatch(Actions.fetchTopScores());
  }

  update() {
    const scores = Store.getHighScores(Store.getState()).take(5);

    scores.forEach((score, i) => {
      const scoreText = this.highScores.get(i);
      const name = score.get('userName') || 'unknown player';
      const amount = score.get('score') || 0;
      scoreText.text = `${name.substr(0, 50)}: ${amount}`;
      scoreText.alpha = 1 - i * 0.1;
    });
  }
}

module.exports = HighScores;
