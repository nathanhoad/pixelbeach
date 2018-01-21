const i18n = require('./i18n');
const { first } = require('./util');
const MusicManager = require('./MusicManager');
const EffectsManager = require('./EffectsManager');

class Scene {
  constructor(game) {
    this.__ = i18n;
    this.music = game.music = game.music || new MusicManager(game);
    this.effects = game.effects = game.effects || new EffectsManager(game);

    // TODO: make a character manager to keep the player between scenes?
  }

  /**
   * Play background music
   * @param {string} key
   * @param {number?} volume (1)
   * @param {boolean?} loop (true)
   */
  playMusic(key, volume, loop) {
    this.music.play(key, volume, loop);
  }

  /**
   * Fade the current background music
   * @param {number} milliseconds (defaults to 500)
   * @param {number} volume (default to 0)
   */
  fadeMusic(milliseconds, volume) {
    this.music.fade(milliseconds, volume);
  }

  /**
   * Flash the camera a number of times
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fades (100)
   * @param {number?} times number of flashes (2)
   * @param {function?} onComplete a callback to run once the flashes are complete
   */
  flash(colour, milliseconds, times, onComplete) {
    this.effects.flashCamera(colour, milliseconds, times, onComplete);
  }

  /**
   * Fade the camera in from a colour
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fade (500)
   * @param {function?} onComplete a callback to run once the fade is complete
   */
  fadeIn(colour, milliseconds, onComplete) {
    this.effects.fadeInCamera(colour, milliseconds, onComplete);
  }

  /**
   * Fade the camera out to a colour
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fade (500)
   * @param {function|string?} onComplete a callback to run once the fade is complete or the key of a state to change to
   */
  fadeOut(colour, milliseconds, onComplete) {
    this.effects.fadeOutCamera(colour, milliseconds, onComplete);
  }

  /**
   * Pop text in and out
   * @param {Phaser.Text} text
   * @param {number} amount with 1 being 100%
   */
  popText(text, amount) {
    this.effects.popText(text, amount);
  }

  /**
   * Float a little bit of text and fade it out
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {string} direction up or down (down)
   * @param {string?} colour hex string (#22cc22)
   */
  flyText(text, x, y, direction, colour) {
    this.effects.flyAwayText(text, x, y, direction, colour);
  }

  /**
   * Flash some text in and out
   * @param {Phaser.Text} text
   * @param {number?} milliseconds
   * @param {number?} times
   * @param {function?} onComplete
   */
  flashText(text, milliseconds, times, onComplete) {
    this.effects.flashText(text, milliseconds, times, onComplete);
  }
}

module.exports = Scene;
