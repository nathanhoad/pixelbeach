const Scene = require('./Scene');

class MenuState extends Scene {
  create() {
    // Create background
    const background = this.add.sprite(0, 0, 'menu-background');

    const wave1 = this.add.sprite(-5, 280, 'menu-wave-1');
    const wave1Tween = this.add.tween(wave1).to({ y: 285 }, 1500, 'Linear', true, 0, -1);
    wave1Tween.yoyo(true, 1000);

    const wave2 = this.add.sprite(-40, 284, 'menu-wave-2');
    const wave2Tween = this.add.tween(wave2).to({ y: 290 }, 1500, 'Linear', true, 0, -1);
    wave2Tween.yoyo(true, 1100);

    this.clouds = this.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    this.createCloud(100, 50);
    this.createCloud(this.world.width - 100, 150);

    // Create the title
    const title = this.add.sprite(180, -200, 'title');
    const titleTween = this.add.tween(title).to({ y: 30 }, 1000, Phaser.Easing.Circular.Out, true, 300, 0);

    // Background music
    this.playMusic('menu-music');

    // Create Menu
    this.startText = this.add.text(this.world.width / 2, 350, this.__('menu.start').toUpperCase(), {
      font: '19px Arial',
      fill: '#fff',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.startText.autoRound = false;
    this.startText.smoothed = false;
    this.startText.anchor.set(0.5);

    this.scoresText = this.add.text(this.world.width / 2, 380, this.__('menu.scores').toUpperCase(), {
      font: '19px Arial',
      fill: '#fff',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.scoresText.autoRound = false;
    this.scoresText.smoothed = false;
    this.scoresText.anchor.set(0.5);

    this.aboutText = this.add.text(this.world.width / 2, 410, this.__('menu.about').toUpperCase(), {
      font: '19px Arial',
      fill: '#fff',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.aboutText.autoRound = false;
    this.aboutText.smoothed = false;
    this.aboutText.anchor.set(0.5);

    this.exitText = this.add.text(this.world.width / 2, 440, this.__('menu.exit').toUpperCase(), {
      font: '19px Arial',
      fill: '#fff',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.exitText.autoRound = false;
    this.exitText.smoothed = false;
    this.exitText.anchor.set(0.5);

    this.selectSound = this.add.audio('pickup');
    this.selectSound.volume = 0.5;
    this.changeSelectionSound = this.add.audio('clock-sound');
    this.changeSelectionSound.volume = 0.5;

    this.menuItems = [
      {
        key: 'game',
        text: this.startText
      },
      {
        key: 'scores',
        text: this.scoresText
      },
      {
        key: 'about',
        text: this.aboutText
      },
      {
        key: 'exit',
        text: this.exitText
      }
    ];
    this.menuItemIndex = 0;

    // This stops the browser from getting certain key presses
    const { UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESCAPE, L } = Phaser.Keyboard;
    this.input.keyboard.addKeyCapture([UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESCAPE, L]);

    this.input.keyboard.addKey(ENTER).onDown.addOnce(() => {
      this.flashText(this.menuItems[this.menuItemIndex].text);
      this.selectSound.play();
      return this.goToState();
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

    // Change language
    this.input.keyboard.addKey(L).onDown.addOnce(() => {
      localStorage.removeItem('language');
      this.fadeOut('#000', 500, 'language');
    });

    // Fade in
    this.fadeIn('#000', 300);
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

  createCloud(x, y) {
    x = x || this.world.width + 100;
    y = y || Math.random() * 200;

    let cloud = this.clouds.getFirstDead(true, x, y, 'menu-cloud');
    cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.removeAll();
    cloud.events.onOutOfBounds.add(target => {
      if (target.x < 0 - target.width) {
        target.x = this.world.width + target.width;
      }
    });

    cloud.body.velocity.x = 0 - (1 + Math.random() * 5);
  }

  goToState() {
    const state = this.menuItems[this.menuItemIndex].key;

    if (state === 'exit' || state === 'game') {
      this.fadeMusic(450);
    }

    this.fadeOut('#000', 500, () => {
      if (state === 'exit') {
        window.close();
      } else {
        this.state.start(state);
      }
    });
  }
}

module.exports = MenuState;
