const { first } = require('./util');

class EffectsManager {
  constructor(game) {
    this.game = game;
  }

  /**
   * Flash the camera a number of times
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fades (100)
   * @param {number?} times number of flashes (2)
   * @param {function?} onComplete a callback to run once the flashes are complete
   */
  flashCamera(colour, milliseconds, times, onComplete) {
    colour = first(colour, '#000');
    if (typeof colour !== 'number') {
      colour = Phaser.Color.hexToRGB(colour);
    }
    milliseconds = first(milliseconds, 500);
    times = first(times, 2);

    if (typeof onComplete === 'undefined') {
      onComplete = () => {};
    }

    if (typeof onComplete === 'string') {
      const stateKey = onComplete;
      onComplete = () => {
        this.game.state.start(stateKey);
      };
    }

    this.game.camera.onFlashComplete.addOnce(() => {
      if (times === 0) {
        onComplete();
      } else {
        this.flashCamera(colour, milliseconds, times - 1, onComplete);
      }
    });
    this.game.camera.flash(colour, milliseconds);
  }

  /**
   * Fade the camera in from a colour
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fade (500)
   * @param {function?} onComplete a callback to run once the fade is complete
   */
  fadeInCamera(colour, milliseconds, onComplete) {
    colour = first(colour, '#000');
    if (typeof colour !== 'number') {
      colour = Phaser.Color.hexToRGB(colour);
    }
    milliseconds = first(milliseconds, 500);

    if (typeof onComplete === 'function') {
      this.game.camera.onFadeComplete.addOnce(onComplete);
    }

    this.game.camera.flash(colour, milliseconds, true);
  }

  /**
   * Fade the camera out to a colour
   * @param {string|number?} colour hex colour code (black)
   * @param {number?} milliseconds length of fade (500)
   * @param {function|string?} onComplete a callback to run once the fade is complete or the key of a state to change to
   */
  fadeOutCamera(colour, milliseconds, onComplete) {
    colour = first(colour, '#000');
    if (typeof colour !== 'number') {
      colour = Phaser.Color.hexToRGB(colour);
    }
    milliseconds = first(milliseconds, 500);

    if (typeof onComplete === 'undefined') {
      onComplete = () => {};
    }

    if (typeof onComplete === 'string') {
      const stateKey = onComplete;
      onComplete = () => {
        this.game.state.start(stateKey);
      };
    }

    if (typeof onComplete === 'function') {
      this.game.camera.onFadeComplete.addOnce(onComplete);
    }

    this.game.camera.fade(colour, milliseconds, true);
  }

  /**
   * Pop text in and out
   * @param {Phaser.Text} text
   * @param {number} amount with 1 being 100%
   */
  popText(text, amount) {
    amount = typeof amount === 'undefined' ? 1.4 : amount;

    text.scale.x = 1;
    text.scale.y = 1;
    const tweenIn = this.game.add.tween(text.scale).to({ x: amount, y: amount }, 50);
    const tweenOut = this.game.add.tween(text.scale).to({ x: 1, y: 1 }, 100);
    tweenIn.chain(tweenOut);
    tweenIn.start();
  }

  /**
   * Float a little bit of text and fade it out
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {string} direction up or down (down)
   * @param {string?} colour hex string (#22cc22)
   */
  flyAwayText(text, x, y, direction, colour) {
    const flyText = this.game.add.text(x, y, text, {
      font: 'bold 16px Arial',
      fill: colour || '#22cc22',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    flyText.anchor.set(0.5);

    y += direction === 'up' ? -20 : 20;

    const flyTweenUp = this.game.add.tween(flyText).to({ y }, 400, Phaser.Easing.Quartic.Out);
    const flyTweenFade = this.game.add.tween(flyText).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None);
    flyTweenFade.onComplete.addOnce(() => {
      flyText.destroy();
    });
    flyTweenUp.chain(flyTweenFade);
    flyTweenUp.start();
  }

  /**
   * Flash some text in and out
   * @param {Phaser.Text} text
   * @param {number?} milliseconds
   * @param {number?} times
   * @param {function?} onComplete
   */
  flashText(text, milliseconds, times, onComplete) {
    milliseconds = first(milliseconds, 50);
    times = first(times, 2);

    if (typeof onComplete === 'undefined') {
      onComplete = () => {};
    } else if (typeof onComplete === 'string') {
      const stateKey = onComplete;
      onComplete = () => {
        this.game.state.start(stateKey);
      };
    }

    text.alpha = 1;
    const outTween = this.game.add.tween(text).to({ alpha: 0 }, milliseconds, Phaser.Easing.Linear.None);
    const inTween = this.game.add.tween(text).to({ alpha: 1 }, milliseconds, Phaser.Easing.Linear.None);
    inTween.onComplete.addOnce(() => {
      if (times === 0) {
        onComplete();
      } else {
        this.flashText(text, milliseconds, times - 1, onComplete);
      }
    });
    outTween.chain(inTween);
    outTween.start();
  }
}

module.exports = EffectsManager;
