const PhaserSpine = require('exports-loader?PhaserSpine!@orange-games/phaser-spine/build/phaser-spine.js');

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    // TODO: set the scale factor based on the browsers width/height

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(1, 1);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    console.log(PhaserSpine);
    // Load plugins
    this.game.add.plugin(PhaserSpine.SpinePlugin);

    // Load assets
    this.game.load.image('player', require('../assets/player.png'));
    this.game.load.image('item', require('../assets/temp-surfer.png'));
    this.game.load.spine(
      'surfer', //The key used for Phaser's cache
      require('../spines/surfer') //The location of the spine's json file
    );
  }

  create() {
    this.game.state.start('menu');
  }
}

module.exports = LoadingState;
