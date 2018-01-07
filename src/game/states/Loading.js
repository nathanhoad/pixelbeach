const guessRootPath = require('guess-root-path');
const Resolution = require('../../resolution');
const { factor } = Resolution.getGameSize();
const Character = require('../Character');

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(factor, factor);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Define where to find loadable files
    this.game.load.path = guessRootPath() + '/src/';

    // Audio
    this.load.audio('game-music', './game/audio/game.mp3');
    this.load.audio('menu-music', './game/audio/title.mp3');
    this.load.audio('died-music', './game/audio/died.mp3');

    //setDecodedCallback -> for when music was loaded

    // Menus
    this.load.image('menu-background', './game/sprites/menu-background.png');
    this.load.image('menu-wave-1', './game/sprites/menu-wave-1.png');
    this.load.image('menu-wave-2', './game/sprites/menu-wave-2.png');
    this.load.image('menu-cloud', './game/sprites/menu-cloud.png');
    this.load.image('title', './game/sprites/menu-title.png');

    this.load.image('summary-background', './game/sprites/summary-background.png');

    // Game
    Character.load(this.game, 'surfer', './game/sprites/surfer.json');
    this.load.spritesheet('player', './game/sprites/surfer.png', 32, 32, 7);
    this.load.spritesheet('summary-surfer', './game/sprites/summary-surfer.png', 32, 32, 5);
    this.load.image('surfer-wash-1', './game/sprites/surfer-wash-1.png');
    this.load.image('surfer-wash-2', './game/sprites/surfer-wash-2.png');

    this.load.image('arrow-up', './game/sprites/arrow-01.png');
    this.load.image('arrow-down', './game/sprites/arrow-02.png');
    this.load.image('arrow-left', './game/sprites/arrow-03.png');
    this.load.image('arrow-right', './game/sprites/arrow-04.png');

    this.load.spritesheet('star', './game/sprites/star_32x32.png', 32, 32, 13);

    this.load.spritesheet('mine', './game/sprites/mine_60x50.png', 60, 50, 2);
    this.load.spritesheet('explosion', './game/sprites/explosion.png', 64, 64, 4);

    this.load.image('game-background', './game/sprites/game-background.png');
    this.load.spritesheet('game-wave-top', './game/sprites/game-wave-top.png', 260 * 2, 30 * 2);
    this.load.spritesheet('game-wave', './game/sprites/game-wave.png', 280, 360);
    this.load.spritesheet('speed-line', './game/sprites/speed-line.png', 320 * 2, 2 * 2);

    this.load.spritesheet('stats-deaths', './game/sprites/stats-skull_32x32.png', 32, 32, 4);
    this.load.spritesheet('stats-stars', './game/sprites/stats-stars_32x32.png', 32, 32, 4);
    this.load.spritesheet('stats-tricks', './game/sprites/stats-tricks_32x32.png', 32, 32, 4);
    this.load.spritesheet('stats-bonus', './game/sprites/stats-bonus_32x32.png', 32, 32, 4);

    // Audio
    this.load.audio('pickup', './game/audio/pickup.wav');
    this.load.audio('correct-arrow-sound', './game/audio/correct-arrow.wav');
    this.load.audio('collect-sound', './game/audio/points.wav');
    this.load.audio('fail', './game/audio/fail.wav');
    this.load.audio('trick2', './game/audio/trick2.wav');
    this.load.audio('clock-sound', './game/audio/clock.wav');
    this.load.audio('splash-sound', './game/audio/splash.wav');
    this.load.audio('time-out-sound', './game/audio/time-out.wav');
    this.load.audio('explosion-sound', './game/audio/explosion.wav');
  }

  create() {
    this.game.state.start('language');
  }
}

module.exports = LoadingState;
