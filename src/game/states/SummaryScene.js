const Scene = require('../../lib/Scene');

class SummaryScene extends Scene {
  create() {
    // Create background
    const background = this.add.sprite(0, 0, 'summary-background');

    const wave1 = this.add.sprite(-5, 200, 'menu-wave-1');
    const wave1Tween = this.add.tween(wave1).to({ y: 205 }, 1600, 'Linear', true, 0, -1);
    wave1Tween.yoyo(true, 1000);

    const wave2 = this.add.sprite(-40, 195, 'menu-wave-2');
    const wave2Tween = this.add.tween(wave2).to({ y: 210 }, 1500, 'Linear', true, 0, -1);
    wave2Tween.yoyo(true, 1100);

    // Fade in
    this.fadeIn();
  }

  createTitle(title) {
    this.titleTextShadow = this.add.text(this.world.width / 2, 51, title, {
      font: 'bold 40px Arial',
      fill: '#000',
      stroke: '#000',
      strokeThickness: 4
    });
    this.titleTextShadow.alpha = 0.1;
    this.titleTextShadow.anchor.set(0.5);

    const titleTextShadowTween = this.add
      .tween(this.titleTextShadow)
      .to({ y: 56 }, 1200, Phaser.Easing.Linear.None, true, 0, -1);
    titleTextShadowTween.yoyo(true, 800);

    this.titleText = this.add.text(this.world.width / 2, 50, title, {
      font: 'bold 40px Arial',
      fill: '#f79c8f',
      stroke: '#7e5dc0',
      strokeThickness: 4
    });
    this.titleText.smoothed = false;
    this.titleText.setShadow(0, 2, '#7e5dc0', 0);
    this.titleText.anchor.set(0.5);
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
      this.flashText(this.menuItems[this.menuItemIndex].text);
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

module.exports = SummaryScene;
