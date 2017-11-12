const Data = require('../data');

class SummaryState {
  create() {
    const background = this.game.add.sprite(0, 0, 'summary-background');

    const wave1 = this.game.add.sprite(-5, 200, 'menu-wave-1');
    const wave1Tween = this.game.add.tween(wave1).to({ y: 205 }, 1600, 'Linear', true, 0, -1);
    wave1Tween.yoyo(true, 1000);

    const wave2 = this.game.add.sprite(-40, 195, 'menu-wave-2');
    const wave2Tween = this.game.add.tween(wave2).to({ y: 210 }, 1500, 'Linear', true, 0, -1);
    wave2Tween.yoyo(true, 1100);

    const titles = ['COWABUNGA!', 'GNARLY!', 'RADICAL!', 'TOTALLY TUBULAR!'];
    let title = titles[Math.floor(Math.random() * titles.length)];

    if (!Data.get('died')) {
      const surfer = this.game.add.sprite(this.game.world.width / 2, -100, 'summary-surfer');
      const surferTween = this.game.add.tween(surfer).to({ y: 180 }, 1500, Phaser.Easing.Circular.Out, true, 500, 0);
      surferTween.onComplete.add(() => {
        Data.submitScore();
      });
    } else {
      title = `YOU DIDN'T MAKE IT...`;
      setTimeout(() => {
        Data.submitScore();
      }, 2000);
    }

    this.titleText = this.game.add.text(0, 0, title, {
      font: 'bold 40px Arial',
      fill: 'white',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.titleText.alpha = 0;
    this.titleText.setTextBounds(0, 50, this.game.world.width, 20);
    this.game.add.tween(this.titleText).to({ alpha: 1 }, 500, 'Linear', true, 1700, 0);

    // You scored
    this.scoreText = this.game.add.text(0, 0, 'You scored ' + Data.get('points', 0), {
      font: 'bold 20px Arial',
      fill: 'white',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.scoreText.alpha = 0;
    this.scoreText.setTextBounds(0, 90, this.game.world.width, 20);
    this.game.add.tween(this.scoreText).to({ alpha: 1 }, 500, 'Linear', true, 2000, 0);

    this.againButton = this.game.add.text(0, 0, 'TRY AGAIN', {
      font: 'bold 20px Arial',
      fill: 'black',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.againButton.alpha = 0;
    this.againButton.setTextBounds(0, 380, this.game.world.width, 20);
    this.game.add.tween(this.againButton).to({ alpha: 1 }, 500, 'Linear', true, 2500, 0);
    this.againButton.inputEnabled = true;
    this.againButton.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.camera.onFadeComplete.removeAll();
        this.game.state.start('game');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    this.scoresButton = this.game.add.text(0, 0, 'LEADERBOARD', {
      font: 'bold 20px Arial',
      fill: 'black',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.scoresButton.alpha = 0;
    this.scoresButton.setTextBounds(0, 420, this.game.world.width, 20);
    this.game.add.tween(this.scoresButton).to({ alpha: 1 }, 500, 'Linear', true, 2500, 0);
    this.scoresButton.inputEnabled = true;
    this.scoresButton.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.camera.onFadeComplete.removeAll();
        this.game.state.start('highscores');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    // Fade in
    this.game.camera.flash(Data.get('died') ? 0xff0000 : 0xffffff, 300, true);
  }
}

module.exports = SummaryState;
