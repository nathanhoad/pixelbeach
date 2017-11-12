const Data = require('../data');

class HighScores {
  create() {
    // Render text
    this.headerText = this.game.add.text(10, 10, 'HIGH SCORES', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.headerText.setTextBounds(0, 0, this.game.world.width - 5, 50);

    this.goBackText = this.game.add.text(0, 0, 'BACK', {
      font: '20px Arial',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.goBackText.setTextBounds(0, this.game.world.height - 50, this.game.world.width - 5, 20);
    this.goBackText.inputEnabled = true;
    this.goBackText.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.state.start('menu');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    this.scoreTexts = [];
    for (let i = 0; i < 3; i++) {
      let text = this.game.add.text(0, 0, '', {
        font: `bold ${21 - i}px Arial`,
        fill: '#ffffff',
        boundsAlignH: 'center',
        boundsAlignV: 'middle'
      });
      text.setTextBounds(5, 100 + 28 * i, this.game.world.width - 5, 20);
      text.alpha = 0;
      this.scoreTexts.push(text);
    }

    Data.loadHighScores().then(scores => {
      this.scores = scores;
    });

    // Fade in
    this.game.camera.flash('#000', 300, true);
  }

  update() {
    if (this.scores) {
      this.scoreTexts.forEach((scoreText, i) => {
        const score = this.scores.get(i);
        scoreText.text = `${score.get('userName', 'Unknown').substr(0, 50)}: ${score.get('score')}`;
        scoreText.alpha = 1 - i * 0.1;
      });
    }
  }
}

module.exports = HighScores;
