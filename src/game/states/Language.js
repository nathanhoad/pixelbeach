const Scene = require('../../lib/Scene');

class Language extends Scene {
  create() {
    if (localStorage.getItem('language')) {
      this.state.start('menu');
    }

    this.createMenu([
      {
        text: this.createMenuText(this.world.width / 2, 100, 'English'),
        action: this.setLanguage('english')
      },
      {
        text: this.createMenuText(this.world.width / 2, 130, 'Español'),
        action: this.setLanguage('espanol')
      },
      {
        text: this.createMenuText(this.world.width / 2, 160, 'Deutsch'),
        action: this.setLanguage('deutsch')
      }
    ]);

    this.fadeIn();
  }

  setLanguage(language) {
    return () => {
      localStorage.setItem('language', language);
      this.fadeOut('#000', 500, 'menu');
    };
  }

  createMenu(items) {
    this.selectSound = this.add.audio('pickup');
    this.selectSound.volume = 0.5;
    this.changeSelectionSound = this.add.audio('clock-sound');
    this.changeSelectionSound.volume = 0.5;

    this.menuItems = items;
    this.menuItemIndex = 0;

    const { UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESCAPE } = Phaser.Keyboard;
    this.input.keyboard.addKeyCapture([UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESCAPE]);

    this.input.keyboard.addKey(ENTER).onDown.addOnce(() => {
      this.selectSound.play();
      this.input.keyboard.onUpCallback = null;
      return this.menuItems[this.menuItemIndex].action();
    });

    this.input.keyboard.addKey(UP).onDown.add(() => {
      this.menuItemIndex = Math.max(this.menuItemIndex - 1, 0);
      this.handleMenu(true);
    });

    this.input.keyboard.addKey(DOWN).onDown.add(() => {
      this.menuItemIndex = Math.min(this.menuItemIndex + 1, this.menuItems.length - 1);
      this.handleMenu(true);
    });

    this.handleMenu(false);
  }

  createMenuText(x, y, label) {
    const text = this.add.text(x, y, label.toUpperCase(), {
      font: '19px Arial',
      fill: 'black',
      stroke: '#000',
      strokeThickness: 4
    });
    text.autoRound = false;
    text.smoothed = false;
    text.anchor.set(0.5);

    return text;
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

module.exports = Language;
