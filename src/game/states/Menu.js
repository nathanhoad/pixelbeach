class MenuState {
  constructor() {
    this.startText;
  }

  create() {
    this.startText = this.game.add.text(10, 10, 'Start the game already', {
      font: 'bold 20px Courier New',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.startText.setTextBounds(0, 0, this.game.world.width - 5, 50);
    this.startText.inputEnabled = true;
    this.startText.events.onInputDown.add(() => {
      this.game.state.start('game');
    }, this);

    this.startText = this.game.add.text(10, 10, 'Highscores', {
      font: 'bold 16px Courier New',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.startText.setTextBounds(0, 0, this.game.world.width - 5, 250);
    this.startText.inputEnabled = true;
    this.startText.events.onInputDown.add(() => {
      this.game.state.start('highscores');
    }, this);
  }
}

module.exports = MenuState;
