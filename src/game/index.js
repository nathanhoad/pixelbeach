window.addEventListener('DOMContentLoaded', () => {
  if (Math.max(window.innerWidth, window.innerHeight) === window.innerHeight) {
    document.getElementById('loading').innerHTML = 'Please rotate your device.';
    window.addEventListener('orientationchange', () => document.location.reload());
  } else {
    const PIXI = require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
    const p2 = require('expose-loader?p2!phaser-ce/build/custom/p2.js');
    const Phaser = require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');
    const PhaserSpine = require('expose-loader?PhaserSpine!@orange-games/phaser-spine/build/phaser-spine.min.js');

    const game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

    // Load in states
    game.state.add('loading', require('./states/Loading'));
    game.state.add('menu', require('./states/Menu'));
    game.state.add('game', require('./states/Game'));
    game.state.add('summary', require('./states/Summary'));
    game.state.add('highscores', require('./states/HighScores'));

    // Show the loading image
    const loadingImage = document.querySelector('#loading-image');
    loadingImage.onload = () => {
      setTimeout(() => {
        // Start the game already
        game.state.start('loading');
      }, 2000);
    };
    loadingImage.src = require('./assets/box.jpg');
    document.querySelector('#loading span').innerText = 'Loading...';
  }
});
