class MenuState {
  create() {
    // Create background
    const background = this.game.add.sprite(0, 0, 'menu-background');

    const wave1 = this.game.add.sprite(-5, 280, 'menu-wave-1');
    const wave1Tween = this.game.add.tween(wave1).to({ y: 285 }, 1500, Phaser.Easing.Bounce.InOut, true, 0, -1);
    wave1Tween.yoyo(true, 1000);

    const wave2 = this.game.add.sprite(-40, 284, 'menu-wave-2');
    const wave2Tween = this.game.add.tween(wave2).to({ y: 290 }, 1500, Phaser.Easing.Bounce.InOut, true, 0, -1);
    wave2Tween.yoyo(true, 1100);

    this.clouds = this.game.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    this.createCloud(100, 50);
    this.createCloud(this.game.world.width - 100, 150);

    // Create the title
    const title = this.game.add.sprite(180, -200, 'title');
    const titleTween = this.game.add.tween(title).to({ y: 30 }, 1000, Phaser.Easing.Circular.Out, true, 300, 0);

    // Create Menu
    this.startText = this.game.add.text(0, 0, 'START', {
      font: 'bold 25px Arial',
      fill: '#000',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.startText.setTextBounds(0, 350, this.game.world.width, 20);
    this.startText.inputEnabled = true;
    this.startText.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.state.start('game');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    this.leaderboardText = this.game.add.text(0, 0, 'LEADERBOARD', {
      font: 'bold 18px Arial',
      fill: '#000',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });

    this.leaderboardText.setTextBounds(0, 400, this.game.world.width, 20);
    this.leaderboardText.inputEnabled = true;
    this.leaderboardText.events.onInputDown.add(() => {
      this.game.camera.onFadeComplete.add(() => {
        this.game.state.start('highscores');
      });
      this.game.camera.fade('#000', 500);
    }, this);

    // Fade in
    this.game.camera.flash('#000', 300, true);
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

module.exports = MenuState;
