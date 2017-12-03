const Resolution = require('../../resolution');
const { factor } = Resolution.getGameSize();

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(factor, factor);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Menus
    this.game.load.image('menu-background', './game/assets/menu-background.png');
    this.game.load.image('menu-wave-1', './game/assets/menu-wave-1.png');
    this.game.load.image('menu-wave-2', './game/assets/menu-wave-2.png');
    this.game.load.image('menu-cloud', './game/assets/menu-cloud.png');
    this.game.load.image('title', './game/assets/menu-title.png');

    this.game.load.image('summary-background', './game/assets/summary-background.png');
    this.game.load.image('summary-surfer', './game/assets/summary-surfer.png');

    // Game
    this.game.load.image('player', './game/assets/temp-surfer.png');
    this.game.load.image('surfer-wash-1', './game/assets/surfer-wash-1.png');
    this.game.load.image('surfer-wash-2', './game/assets/surfer-wash-2.png');

    this.game.load.spritesheet('beachball', './game/assets/beachball_40x40.png', 48, 40, 2);

    this.game.load.spritesheet('mine', './game/assets/mine_60x50.png', 60, 50, 2);

    this.game.load.image('game-background', './game/assets/game-background.png');
    this.game.load.spritesheet('game-wave-top', './game/assets/game-wave-top.png', 260 * 2, 30 * 2);
    this.game.load.spritesheet('game-wave', './game/assets/game-wave.png', 280, 360);
    this.game.load.spritesheet('speed-line', './game/assets/speed-line.png', 320 * 2, 2 * 2);

    // Audio
    this.game.load.audio('pickup', './game/audio/pickup.wav');
    this.game.load.audio('fail', './game/audio/fail.wav');
    this.game.load.audio('trick2', './game/audio/trick2.wav');
    this.game.load.audio('soundtrack', './game/audio/surf1.wav');
  }

  create() {
    this.game.state.start('menu');
  }
}

module.exports = LoadingState;
