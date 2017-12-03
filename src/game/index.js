const Resolution = require('../resolution');
const { width, height } = Resolution.getGameSize();

console.log({ width, height });

const game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', require('./states/Loading'));
game.state.add('menu', require('./states/Menu'));
game.state.add('game', require('./states/Game'));
game.state.add('summary', require('./states/Summary'));
game.state.add('highscores', require('./states/HighScores'));

// Start the game already
game.state.start('loading');
