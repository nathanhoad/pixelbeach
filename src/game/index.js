const PIXI = require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
const p2 = require('expose-loader?p2!phaser-ce/build/custom/p2.js');
const Phaser = require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');

const game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', require('./states/Loading'));
game.state.add('menu', require('./states/Menu'));
game.state.add('game', require('./states/Game'));
game.state.add('summary', require('./states/Summary'));
game.state.add('highscores', require('./states/HighScores'));

// Start the game already
window.addEventListener('DOMContentLoaded', () => {
	game.state.start('loading');
});
