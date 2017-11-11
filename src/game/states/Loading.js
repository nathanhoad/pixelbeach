class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    // TODO: set the scale factor based on the browsers width/height

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(1, 1);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Load assets
    this.game.load.image('player', require('../assets/temp-surfer.png'));
    this.game.load.image('item', require('../assets/temp-surfer.png'));
    this.game.load.image('obstacle', require('../assets/temp-surfer.png'));
  }

  create() {
    this.game.state.start('menu');
  }
}

module.exports = LoadingState;
