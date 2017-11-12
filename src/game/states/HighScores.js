const Data = require('../data');

class HighScores {
  create() {
    // Create background
    const background = this.game.add.sprite(0, 0, 'menu-background');

    const wave1 = this.game.add.sprite(-5, 280, 'menu-wave-1');
    const wave1Tween = this.game.add.tween(wave1).to({ y: 285 }, 1500, 'Linear', true, 0, -1);
    wave1Tween.yoyo(true, 1000);

    const wave2 = this.game.add.sprite(-40, 284, 'menu-wave-2');
    const wave2Tween = this.game.add.tween(wave2).to({ y: 290 }, 1500, 'Linear', true, 0, -1);
    wave2Tween.yoyo(true, 1100);

    this.clouds = this.game.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    this.createCloud(100, 50);
    this.createCloud(this.game.world.width - 100, 150);

    // Render text
    this.headerText = this.game.add.text(10, 10, 'HIGH SCORES', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.headerText.setTextBounds(0, 0, this.game.world.width - 5, 50);

    this.goBackText = this.game.add.text(0, 0, 'START', {
      font: 'bold 20px Arial',
      fill: 'black',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.goBackText.setTextBounds(0, this.game.world.height - 50, this.game.world.width - 5, 20);
    this.goBackText.inputEnabled = true;
    this.goBackText.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.camera.onFadeComplete.removeAll();
        this.game.state.start('game');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    this.scoreTexts = [];
    for (let i = 0; i < 5; i++) {
      let text = this.game.add.text(0, 0, '', {
        font: `bold 18px Arial`,
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
        if (score) {
          scoreText.text = `${i + 1}. ${score.get('userName', 'Unknown').substr(0, 50)} scored ${score.get('score')}`;
          scoreText.alpha = 1 - i * 0.1;
        }
      });
    }
  }

  createCloud(x, y) {
    x = x || this.game.world.width + 100;
    y = y || Math.random() * 200;

    let cloud = this.clouds.getFirstDead(true, x, y, 'menu-cloud');
    cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.removeAll();
    cloud.events.onOutOfBounds.add(target => {
      if (target.x < 0 - target.width) {
        target.x = this.game.world.width + target.width;
      }
    });

    cloud.body.velocity.x = 0 - (1 + Math.random() * 5);
  }
}

module.exports = HighScores;
