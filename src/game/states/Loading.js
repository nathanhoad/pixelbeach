const PhaserSpine = require('exports-loader?PhaserSpine!@orange-games/phaser-spine/build/phaser-spine.js');

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    // TODO: set the scale factor based on the browsers width/height

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(1.5, 1.5);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Load plugins
    this.game.add.plugin(PhaserSpine.SpinePlugin);

    // Load assets
    this.game.load.image('player', require('../assets/player.png'));

    this.game.load.image('ducky', require('../assets/ducky.png'));
    this.game.load.spine('surfer', require('../spines/surfer'));

    this.game.load.image('obstacle', require('../assets/big-box.png'));

    //backgrounds
    this.game.load.image('ocean', require('../assets/ocean.png'));
    this.game.load.image('backwave', require('../assets/backwave-low.png'));
    this.game.load.image('wave', require('../assets/wave.png'));
    this.game.load.image('wave-bottom', require('../assets/wave-bottom.png'));

    //wash assets
    this.game.load.image('wash', require('../assets/wash.png'));
    this.game.load.image('wash2', require('../assets/wash2.png'));

    this.game.load.image('wave-froth-sml', require('../assets/wave-froth-sml.png'));
    this.game.load.image('wave-froth', require('../assets/wave-froth.png'));
    this.game.load.image('wave-froth-lrg', require('../assets/wave-froth-lrg.png'));
    this.game.load.image('wave-froth-hge', require('../assets/big-box.png'));
    //audio
    this.game.load.audio('pickup', require('../assets/pickup.wav'));
    this.game.load.audio('fail', require('../assets/fail.wav'));
    this.game.load.audio('trick2', require('../assets/trick2.wav'));
  }

  create() {
    this.game.state.start('menu');
  }
}

module.exports = LoadingState;
