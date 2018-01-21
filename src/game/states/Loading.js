const guessRootPath = require('guess-root-path');
const Resolution = require('../../resolution');
const { factor } = Resolution.getGameSize();
const Character = require('../../lib/Character');
const Path = require('path');

function asset(path) {
  const args = ['.', 'game'].concat(path.split('/'));
  return Path.sep + Array.from(args).join(Path.sep);
}

class LoadingState {
  preload() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(factor, factor);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Define where to find loadable files
    this.game.load.path = Path.resolve(Path.join(__dirname, '..', '..'));

    // Audio
    this.load.audio('game-music', asset('audio/game.mp3'));
    this.load.audio('menu-music', asset('audio/title.mp3'));
    this.load.audio('died-music', asset('audio/died.mp3'));

    //setDecodedCallback -> for when music was loaded

    // Menus
    this.load.image('menu-background', asset('sprites/menu-background.png'));
    this.load.image('menu-wave-1', asset('sprites/menu-wave-1.png'));
    this.load.image('menu-wave-2', asset('sprites/menu-wave-2.png'));
    this.load.image('menu-cloud', asset('sprites/menu-cloud.png'));
    this.load.image('title', asset('sprites/menu-title.png'));

    this.load.image('summary-background', asset('sprites/summary-background.png'));

    // Game
    Character.load(this.game, 'surfer', asset('sprites/surfer.json'));
    this.load.spritesheet('player', asset('sprites/surfer.png'), 32, 32, 7);
    this.load.spritesheet('summary-surfer', asset('sprites/summary-surfer.png'), 32, 32, 5);
    this.load.image('surfer-wash-1', asset('sprites/surfer-wash-1.png'));
    this.load.image('surfer-wash-2', asset('sprites/surfer-wash-2.png'));

    this.load.image('arrow-up', asset('sprites/arrow-01.png'));
    this.load.image('arrow-down', asset('sprites/arrow-02.png'));
    this.load.image('arrow-left', asset('sprites/arrow-03.png'));
    this.load.image('arrow-right', asset('sprites/arrow-04.png'));

    this.load.spritesheet('star', asset('sprites/star_32x32.png'), 32, 32, 13);

    this.load.spritesheet('mine', asset('sprites/mine_60x50.png'), 60, 50, 2);
    this.load.spritesheet('explosion', asset('sprites/explosion.png'), 64, 64, 4);

    this.load.image('game-background', asset('sprites/game-background.png'));
    this.load.spritesheet('game-wave-top', asset('sprites/game-wave-top.png'), 260 * 2, 30 * 2);
    this.load.spritesheet('game-wave', asset('sprites/game-wave.png'), 280, 360);
    this.load.spritesheet('speed-line', asset('sprites/speed-line.png'), 320 * 2, 2 * 2);

    this.load.spritesheet('stats-deaths', asset('sprites/stats-skull_32x32.png'), 32, 32, 4);
    this.load.spritesheet('stats-stars', asset('sprites/stats-stars_32x32.png'), 32, 32, 4);
    this.load.spritesheet('stats-tricks', asset('sprites/stats-tricks_32x32.png'), 32, 32, 4);
    this.load.spritesheet('stats-bonus', asset('sprites/stats-bonus_32x32.png'), 32, 32, 4);

    // Audio
    this.load.audio('pickup', asset('audio/pickup.wav'));
    this.load.audio('correct-arrow-sound', asset('audio/correct-arrow.wav'));
    this.load.audio('collect-sound', asset('audio/points.wav'));
    this.load.audio('fail', asset('audio/fail.wav'));
    this.load.audio('trick2', asset('audio/trick2.wav'));
    this.load.audio('clock-sound', asset('audio/clock.wav'));
    this.load.audio('splash-sound', asset('audio/splash.wav'));
    this.load.audio('time-out-sound', asset('audio/time-out.wav'));
    this.load.audio('explosion-sound', asset('audio/explosion.wav'));
  }

  create() {
    this.game.state.start('language');
  }
}

module.exports = LoadingState;
