const Resolution = require('../resolution');
const { width, height } = Resolution.getGameSize();

const game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', require('./states/Loading'));
game.state.add('language', require('./states/Language'));
game.state.add('menu', require('./states/Menu'));
game.state.add('game', require('./states/Game'));
game.state.add('summary', require('./states/Summary'));
game.state.add('scores', require('./states/Scores'));
game.state.add('about', require('./states/About'));

// TODO: attach the data thing here

// Start the game already
game.state.start('loading');
