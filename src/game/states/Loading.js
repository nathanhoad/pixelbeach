const PhaserSpine = require('exports-loader?PhaserSpine!@orange-games/phaser-spine/build/phaser-spine.js');

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    const factor = Math.min(window.innerWidth / 640, window.innerHeight / 480) * 0.95;
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(factor, factor);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Load plugins
    this.game.add.plugin(PhaserSpine.SpinePlugin);

    // Load assets
    this.game.load.image('menu-background', require('../assets/menu-background.png'));
    this.game.load.image('menu-wave-1', require('../assets/wave-1.png'));
    this.game.load.image('menu-wave-2', require('../assets/wave-2.png'));
    this.game.load.image('menu-cloud', require('../assets/cloud.png'));
    this.game.load.image('title', require('../assets/title.png'));

    this.game.load.image('summary-background', require('../assets/summary-background.png'));
    this.game.load.image('summary-surfer', require('../assets/summary-surfer.png'));

    this.game.load.image('player', require('../assets/player.png'));

    this.game.load.spine('surfer', require('../spines/surfer'));

    // Collectables
    this.game.load.spritesheet('ducky', require('../assets/ducky_60x40.png'), 60, 40, 2);
    this.game.load.spritesheet('beachball-1', require('../assets/beachball_40x40.png'), 48, 40, 2);
    this.game.load.spritesheet('beachball-2', require('../assets/beachball2_40x40.png'), 44, 40, 2);
    this.game.load.spritesheet('cat-1', require('../assets/cat_surfer1_20x10.png'), 40, 20, 4);
    this.game.load.spritesheet('cat-2', require('../assets/cat_surfer2_20x10.png'), 40, 20, 4);
    this.game.load.spritesheet('cat-3', require('../assets/cat_surfer3_20x10.png'), 40, 20, 4);


    // obstacles
    this.game.load.spritesheet('obstacle', require('../assets/mine_60x50.png'), 60, 50, 2);
    this.game.load.spritesheet('demogorgon', require('../assets/demogorgon_30_20.png'), 60, 40, 2);

    //backgrounds
    this.game.load.image('wave-background', require('../assets/wave-background.png'));
    this.game.load.spritesheet('water-top', require('../assets/water-top.png'), 260 * 2, 30 * 2);
    this.game.load.spritesheet('wave', require('../assets/wave-over.png'), 280, 360);
    this.game.load.image('wave-bottom', require('../assets/wave-bottom.png'));
    this.game.load.spritesheet('speed-line', require('../assets/speed-line.png'), 320 * 2, 2 * 2);

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
    this.game.load.audio('soundtrack', require('../assets/surf1.wav'));
  }

  create() {
    this.game.state.start('summary');
  }
}

module.exports = LoadingState;
