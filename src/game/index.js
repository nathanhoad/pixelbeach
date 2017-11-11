const LoadingState = require('./states/Loading');

const game = new Phaser.Game(320, 240, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', LoadingState);

// Start the game already
window.addEventListener('DOMContentLoaded', () => {
  game.state.start('loading');
});
