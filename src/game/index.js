const game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

// Load in states
game.state.add('loading', require('./states/Loading'));
game.state.add('menu', require('./states/Menu'));
game.state.add('game', require('./states/Game'));

// Start the game already
window.addEventListener('DOMContentLoaded', () => {
  game.state.start('loading');
});
