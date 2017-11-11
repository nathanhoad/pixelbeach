const PIXI = require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
const p2 = require('expose-loader?p2!phaser-ce/build/custom/p2.js');
const Phaser = require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');
const PhaserSpine = require('expose-loader?PhaserSpine!@orange-games/phaser-spine/build/phaser-spine.min.js');

const game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', require('./states/Loading'));
game.state.add('menu', require('./states/Menu'));
game.state.add('game', require('./states/Game'));

// Start the game already
window.addEventListener('DOMContentLoaded', () => {
  game.state.start('loading');
});
