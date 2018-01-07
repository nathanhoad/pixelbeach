const { first } = require('./util');

class MusicManager {
  constructor(game) {
    this.game = game;

    this.currentMusic = null;
  }

  /**
   * Play background music
   * @param {string} key
   * @param {number?} volume (1)
   * @param {boolean?} loop (true)
   */
  play(key, volume, loop) {
    if (!key) throw new Error('No cache key given for music');

    volume = first(volume, 1);
    loop = first(loop, true);

    console.log('current?', this.currentMusic);

    // Don't play the same music if it's already playing
    if (this.currentMusic && key === this.currentMusic.key) {
      this.currentMusic.volume = volume;
      return;
    }

    // Get rid of the old music
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }

    console.log('setting the music to', key, volume, loop);

    this.currentMusic = this.game.sound.play(key, volume, loop);
  }

  /**
   * Fade the current background music
   * @param {number} milliseconds (defaults to 500)
   * @param {number} toVolume (default to 0)
   * @param {number?} fromVolume (default to whatever volume it already is)
   */
  fade(milliseconds, toVolume, fromVolume) {
    milliseconds = first(milliseconds, 500);
    toVolume = first(toVolume, 0);
    fromVolume = first(fromVolume, this.currentMusic.volume);

    this.currentMusic.volume = fromVolume;
    this.currentMusic.fadeTo(milliseconds, toVolume);
  }
}

module.exports = MusicManager;
