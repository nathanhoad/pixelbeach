const Data = require('../data');
const SummaryScene = require('./SummaryScene');

class HighScores extends SummaryScene {
  create() {
    super.create();

    this.createTitle(this.__('your_scores'));

    // High score
    this.highScoreText = this.add.text(this.world.width / 2, 120, Data.get('highestScore'), {
      font: '35px Arial',
      fill: 'white'
    });
    this.highScoreText.autoRound = false;
    this.highScoreText.smoothed = false;
    this.highScoreText.anchor.set(0.5);

    this.highScoreText = this.add.text(this.world.width / 2, 150, this.__('high_score').toUpperCase(), {
      font: '16px Arial',
      fill: 'white'
    });
    this.highScoreText.autoRound = false;
    this.highScoreText.smoothed = false;
    this.highScoreText.anchor.set(0.5);

    // Stats
    this.deathsIcon = this.add.sprite(10 + (this.world.width - 20) * 0.2, 250, 'stats-deaths');
    this.deathsIcon.animations.add('bounce', [0, 1, 2, 3], 6, true);
    this.deathsIcon.animations.play('bounce');
    this.deathsIcon.anchor.set(0.5);
    this.totalDeathsText = this.add.text(10 + (this.world.width - 20) * 0.2, 280, Data.get('totalDeaths'), {
      font: '18px Arial',
      fill: 'black'
    });
    this.totalDeathsText.autoRound = false;
    this.totalDeathsText.smoothed = false;
    this.totalDeathsText.anchor.set(0.5);

    this.totalDeathsText = this.add.text(
      10 + (this.world.width - 20) * 0.2,
      300,
      this.__('total_deaths').toUpperCase(),
      {
        font: '11px Arial',
        fill: 'black'
      }
    );
    this.totalDeathsText.autoRound = false;
    this.totalDeathsText.smoothed = false;
    this.totalDeathsText.anchor.set(0.5);

    this.starsIcon = this.add.sprite(10 + (this.world.width - 20) * 0.4, 250, 'stats-stars');
    this.starsIcon.animations.add('bounce', [0, 1, 2, 3], 6, true);
    this.starsIcon.animations.play('bounce');
    this.starsIcon.anchor.set(0.5);
    this.totalStarsText = this.add.text(10 + (this.world.width - 20) * 0.4, 280, Data.get('totalStars'), {
      font: '18px Arial',
      fill: 'black'
    });
    this.totalDeathsText.autoRound = false;
    this.totalStarsText.smoothed = false;
    this.totalStarsText.anchor.set(0.5);

    this.totalStarsText = this.add.text(10 + (this.world.width - 20) * 0.4, 300, this.__('total_stars').toUpperCase(), {
      font: '11px Arial',
      fill: 'black'
    });
    this.totalDeathsText.autoRound = false;
    this.totalStarsText.smoothed = false;
    this.totalStarsText.anchor.set(0.5);

    this.tricksIcon = this.add.sprite(10 + (this.world.width - 20) * 0.6, 250, 'stats-tricks');
    this.tricksIcon.animations.add('bounce', [0, 1, 2, 3], 6, true);
    this.tricksIcon.animations.play('bounce');
    this.tricksIcon.anchor.set(0.5);
    this.totalTricksText = this.add.text(10 + (this.world.width - 20) * 0.6, 280, Data.get('totalTricks'), {
      font: '18px Arial',
      fill: 'black',
      boundsAlignH: 'center'
    });
    this.totalTricksText.autoRound = false;
    this.totalTricksText.smoothed = false;
    this.totalTricksText.anchor.set(0.5);

    this.totalTricksText = this.add.text(
      10 + (this.world.width - 20) * 0.6,
      300,
      this.__('total_tricks').toUpperCase(),
      {
        font: '11px Arial',
        fill: 'black',
        boundsAlignH: 'center'
      }
    );
    this.totalTricksText.autoRound = false;
    this.totalTricksText.smoothed = false;
    this.totalTricksText.anchor.set(0.5);

    this.bonusIcon = this.add.sprite(10 + (this.world.width - 20) * 0.8, 250, 'stats-bonus');
    this.bonusIcon.animations.add('bounce', [0, 1, 2, 3], 6, true);
    this.bonusIcon.animations.play('bounce');
    this.bonusIcon.anchor.set(0.5);
    this.highestMultiplierText = this.add.text(10 + (this.world.width - 20) * 0.8, 280, Data.get('highestMultiplier'), {
      font: '18px Arial',
      fill: 'black',
      boundsAlignH: 'center'
    });
    this.highestMultiplierText.autoRound = false;
    this.highestMultiplierText.smoothed = false;
    this.highestMultiplierText.anchor.set(0.5);

    this.highestMultiplierText = this.add.text(
      10 + (this.world.width - 20) * 0.8,
      300,
      this.__('highest_multiplier').toUpperCase(),
      {
        font: '11px Arial',
        fill: 'black',
        boundsAlignH: 'center'
      }
    );
    this.highestMultiplierText.autoRound = false;
    this.highestMultiplierText.smoothed = false;
    this.highestMultiplierText.anchor.set(0.5);

    // Menu
    this.startText = this.createMenuText(this.world.width / 2, 410, this.__('menu.start'));
    this.menuText = this.createMenuText(this.world.width / 2, 440, this.__('menu.back_to_menu'));

    this.createMenu([
      {
        text: this.startText,
        action: () => {
          this.fadeMusic(500, 0);
          this.fadeOut('#000', 500, 'game');
        }
      },
      {
        text: this.menuText,
        action: () => {
          this.fadeOut('#000', 500, 'menu');
        }
      }
    ]);

    // Easter egg to wipe save data
    const { ZERO } = Phaser.Keyboard;
    this.input.keyboard.addKeyCapture([ZERO]);
    this.input.keyboard.addKey(ZERO).onDown.addOnce(() => {
      Data.erase();
      this.state.restart();
    });
    // End erase

    this.playMusic('menu-music');
    this.fadeIn();
  }

  handleMenu(didChange) {
    this.menuItems.forEach((item, index) => {
      if (index === this.menuItemIndex) {
        item.text.fill = '#ffd400';
      } else {
        item.text.fill = '#fff';
      }
    });

    if (didChange) {
      this.changeSelectionSound.play();
      this.popText(this.menuItems[this.menuItemIndex].text, 1.2);
    }
  }
}

module.exports = HighScores;
