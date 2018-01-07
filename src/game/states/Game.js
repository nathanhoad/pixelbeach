const Scene = require('./Scene');
const Character = require('../Character');

const Data = require('../data');

const ACCELERATION = 30;
const MAX_VERTICAL_SPEED = 400;
const UPPER_BOUND = 200;
const LOWER_BOUND = 400;
const TIME = Phaser.Timer.MINUTE;

let isEmitting = false;

const ITEMS = {
  collectables: [{ sprite: 'star' }],
  obstacles: [{ sprite: 'mine', name: 'Mine' }]
};

// For fast checking to which a sprite belongs using array.includes (collision)
const COLLECTABLE_SPRITES = ITEMS.collectables.map(c => c.sprite);
const OBSTACLE_SPRITES = ITEMS.obstacles.map(c => c.sprite);

class GameState extends Scene {
  create() {
    Data.reset();
    this.score = 0;

    this.add.sprite(0, 0, 'game-background');
    this.waveTop = this.add.sprite(150, 177, 'game-wave-top');
    this.waveTop.animations.add('foam');
    this.waveTop.animations.play('foam', 6, true);

    // Float some clouds
    this.clouds = this.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    this.createCloud(150, 60);
    this.createCloud(this.world.width - 50, 120);

    // Create some speed lines
    this.speedLines = this.add.group();
    this.speedLines.enableBody = true;
    this.speedLines.physicsBodyType = Phaser.Physics.ARCADE;
    this.createSpeedLine(630, 300);
    this.createSpeedLine(10, 380);

    // Group for any sprites
    this.sprites = this.add.group();
    this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;

    // Create the player
    this.player = this.sprites.add(new Character(this.game, 250, LOWER_BOUND, 'surfer'));

    // Particles
    this.wash = this.add.emitter(100, 100, 200);
    // this.wash.gravity = 200;
    this.wash.makeParticles(['surfer-wash-1', 'surfer-wash-2']);
    this.wash.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.wash.minParticleSpeed = new Phaser.Point(-200, -50);
    this.wash.minParticleAlpha = 0.5;
    this.wash.minRotation = 0;
    this.wash.maxRotation = 0;
    this.wash.width = 20;
    this.wash.height = 3;
    this.wash.start(false, 5000, 20);

    this.splashEmitter = this.add.emitter(100, 100, 200);
    this.splashEmitter.makeParticles(['surfer-wash-1', 'surfer-wash-2']);
    this.splashEmitter.gravity = 200;
    this.splashEmitter.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.splashEmitter.minParticleSpeed = new Phaser.Point(-200, -50);
    this.splashEmitter.minParticleAlpha = 0.6;
    this.splashEmitter.minRotation = 0;
    this.splashEmitter.maxRotation = 0;
    this.splashEmitter.width = 32;
    this.splashEmitter.height = 5;

    // Background music
    this.playMusic('game-music');

    // Audio
    this.pickUp = this.add.audio('pickup');
    this.pickUp.volume = 0.5;
    this.collectSound = this.add.audio('collect-sound');
    this.collectSound.volume = 0.5;
    this.fail = this.add.audio('fail');
    this.fail.volume = 0.5;
    this.trick2 = this.add.audio('trick2');
    this.trick2.volume = 0.5;
    this.clockSound = this.add.audio('clock-sound');
    this.clockSound.volume = 0.5;
    this.timeoutSound = this.add.audio('time-out-sound');
    this.correctArrowSound = this.add.audio('correct-arrow-sound');
    this.correctArrowSound.volume = 0.5;
    this.splashSound = this.add.audio('splash-sound');
    this.splashSound.volume = 0.5;
    this.explosionSound = this.add.audio('explosion-sound');

    // Keep track of how much air you should get
    this.playerMomentum = 1;

    // Items
    this.chanceForObstacleBonus = 0;
    this.nextItemCountdown = 100;

    this.hintText = this.add.text(this.world.width / 2, this.world.height / 2 + 50, this.__('hint'), {
      font: '18px Arial',
      fill: 'white'
    });
    this.hintText.smoothed = false;
    this.hintText.anchor.set(0.5);
    this.hintText.alpha = 0;

    const hintTween = this.add.tween(this.hintText).to({ alpha: 0.8 }, 500, Phaser.Easing.Linear.None, true, 1500);
    hintTween.onStart.add(() => {
      if (this.hasStarted) {
        hintTween.stop();
      }
    });

    // Score text
    this.scoreText = this.add.text(30, 20, '0', {
      font: 'bold 20px Arial',
      fill: 'white',
      boundsAlignH: 'left',
      boundsAlignV: 'middle',
      stroke: '#000000',
      strokeThickness: 5
    });
    this.scoreText.smoothed = false;
    this.scoreText.anchor.set(0.5);

    this.multiplierText = this.add.text((this.world.width - 40) / 5 * 2, 20, this.__('multiplier', { multiplier: 1 }), {
      font: 'bold 20px Arial',
      fill: 'white',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      stroke: '#000000',
      strokeThickness: 5
    });
    this.multiplierText.smoothed = false;
    this.multiplierText.anchor.set(0.5);

    this.timer = this.time.create();
    this.timerEvent = this.timer.add(TIME, this.endTimer, this);
    for (let i = 1; i <= 3; i++) {
      this.timer.add(TIME - Phaser.Timer.SECOND * i, () => {
        this.countDownText.fill = '#c00';
        this.popText(this.countDownText);
        this.timeoutSound.play();
      });
    }
    this.timer.start();

    this.waveBarrel = this.add.sprite(-40, UPPER_BOUND - 41, 'game-wave');
    this.waveBarrel.animations.add('foam');
    this.waveBarrel.animations.play('foam', 6, true);

    // Tricks
    this.arrows = this.add.group();
    this.arrows.x = 100;
    this.arrows.y = 100;

    // Countdown
    this.countDownText = this.add.text(this.world.width / 2, 20, '1:00', {
      font: 'bold 22px Arial',
      fill: '#ffd400',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      stroke: '#000000',
      strokeThickness: 5
    });
    this.countDownText.smoothed = false;
    // this.countDownText.setShadow(0, 2, '#000000', 0);
    this.countDownText.anchor.set(0.5);
    this.add
      .tween(this.countDownText)
      .from({ x: this.world.width / 2, y: this.world.height / 2 }, 500, Phaser.Easing.Quartic.InOut, true, 500);
    this.add.tween(this.countDownText.scale).from({ x: 2, y: 2 }, 500, Phaser.Easing.Quartic.InOut, true, 500);

    this.CONGRATS = [
      this.__('congratulations.cowabunga'),
      this.__('congratulations.radical'),
      this.__('congratulations.cool'),
      this.__('congratulations.totally_tubular'),
      this.__('congratulations.far_out'),
      this.__('congratulations.gnarly')
    ];

    // Fade in
    this.fadeIn();

    // This stops the browser from getting certain key presses
    const { UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESC } = Phaser.Keyboard;
    this.input.keyboard.addKeyCapture([UP, DOWN, LEFT, RIGHT, SPACEBAR, ENTER, ESC]);
    this.input.keyboard.addKey(ENTER).onDown.add(() => {
      this.game.paused = !this.game.paused;
    });

    // Mode
    this.mode = 'playing';
  }

  update() {
    switch (this.mode) {
      case 'playing':
        this.handlePlayer();
        this.handleItems();
        this.handleCollisions();
        this.handleScore();
        if (this.timer.running) {
          this.millisecondsRemaining = Math.max(0, this.timerEvent.delay - this.timer.ms);
          this.countDownText.text = this.formatTime(this.millisecondsRemaining);
        } else {
          this.countDownText.text = this.formatTime(0);
          this.timeoutSound.play();
          this.popText(this.countDownText);
          this.gameOver();
        }

        break;

      case 'gameover':
        // this.handleGameOver();
        break;
    }
  }

  // Internal helpers

  handlePlayer() {
    let isTricking = false;

    this.wash.x = this.player.x - 14;
    this.wash.y = this.player.y + 6;
    this.wash.on = this.player.y > UPPER_BOUND;

    // Movement
    if (this.player.y < UPPER_BOUND) {
      // Player is in the sky (this will only fire once per sky bit)
      if (this.player.body.gravity.y === 0) {
        this.trick2.play();

        // set up tricks
        this.handleTrick(true);

        // 500 is the lowest gravity (sends the player to the top of the screen)
        let gravity;
        if (this.playerMomentum > 160) {
          gravity = 450;
        } else if (this.playerMomentum > 120) {
          gravity = 700;
        } else if (this.playerMomentum > 60) {
          gravity = 900;
        } else {
          gravity = 1100;
        }

        this.player.body.gravity.y = gravity;
        this.playerMomentum = 0;
      }
    } else {
      if (this.player.body.gravity.y > 0) {
        // Remove the trick handling
        this.handleTrick(false);
        this.splashSound.play();
        this.splashEmitter.x = this.player.x + 5;
        this.splashEmitter.y = this.player.y + 30;
        this.splashEmitter.explode(5000, 10);
      }

      this.player.body.gravity.y = 0;

      if (this.input.activePointer.isDown || this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        // The player has actually done something so we can start
        // generating collectables and obstacles
        this.hasStarted = true;
        this.hintText.alpha = 0;

        this.playerMomentum = Math.max(this.playerMomentum, this.player.y - UPPER_BOUND);

        this.player.body.velocity.y -= ACCELERATION;
        if (this.player.body.velocity.y < 0 - MAX_VERTICAL_SPEED) {
          this.player.body.velocity.y = 0 - MAX_VERTICAL_SPEED;
        }
      } else {
        this.playerMomentum = 1;

        // Player falls to the bottom of the wave
        if (this.player.y < LOWER_BOUND) {
          this.player.body.velocity.y += ACCELERATION;
          if (this.player.body.velocity.y > MAX_VERTICAL_SPEED) {
            this.player.body.velocity.y = MAX_VERTICAL_SPEED;
          }
        } else if (this.player.body.velocity.y > 0) {
          // Decelerate near the bottom
          this.player.body.velocity.y -= ACCELERATION * 5;
          if (this.player.body.velocity.y < 0) {
            this.player.body.velocity.y = 0;
          }
        } else {
          this.player.body.velocity.y -= 1;
        }
      }
    }

    // Animations
    if (this.player.y > LOWER_BOUND - 10) {
      this.player.playAnimation('idle');
    } else {
      if (this.player.body.velocity.y < 0) {
        this.player.playAnimation('up');
      } else if (this.player.body.velocity.y > 0) {
        this.player.playAnimation('down');
      }
    }
  }

  handleTrick(enable) {
    if (enable) {
      const { UP, DOWN, LEFT, RIGHT, SPACEBAR } = Phaser.Keyboard;

      this.trickWasResolved = false; // This is for stopping the leave animations clobbering each other

      this.trick = [];
      const trickStepCount = Math.min(Math.ceil(1 + Data.get('multiplier') / 2), 7);
      for (let i = 0; i < trickStepCount; i++) {
        this.trick.push(this.rnd.pick([UP, DOWN, LEFT, RIGHT]));
      }

      this.trickIndex = 0;
      this.trick.forEach((key, i) => {
        let direction;
        switch (key) {
          case UP:
            direction = 'up';
            break;
          case DOWN:
            direction = 'down';
            break;
          case LEFT:
            direction = 'left';
            break;
          case RIGHT:
            direction = 'right';
            break;
        }
        let arrow = this.arrows.getFirstDead(true, 50 * i, 0, 'arrow-' + direction);
        arrow.anchor.set(0.5);
        arrow.tint = 0xffffff;
      });
      this.arrows.x = (this.world.width - this.arrows.width) / 2;

      // Handle keys
      this.input.keyboard.onUpCallback = e => {
        if ([UP, DOWN, LEFT, RIGHT].includes(e.keyCode)) {
          if (this.trick[this.trickIndex] === e.keyCode) {
            this.arrows.getAt(this.trickIndex).tint = 0xffd400;
            this.correctArrowSound.play();

            // Mark off this trick and up the index
            this.trickIndex++;
            if (this.trickIndex === this.trick.length) {
              let index = 0;
              this.arrows.forEachAlive(arrow => {
                const t = this.add
                  .tween(arrow)
                  .to(
                    { x: -this.arrows.x + this.world.width / 2, y: -this.arrows.y + 40 },
                    400,
                    Phaser.Easing.Quartic.In,
                    false,
                    100 * index
                  );
                t.onComplete.add(() => {
                  // Add 500ms to the clock
                  this.timer.events.forEach((event, i) => {
                    event.tick += 500;
                    event.delay += 500;
                  });

                  this.clockSound.play();
                  this.popText(this.countDownText);
                  this.flyText('+00:00:50', this.world.width / 2, 20, 'down');
                  arrow.kill();
                });
                t.start();
                index++;
              });

              Data.addTrick();
              Data.addMultiplier();
              this.popText(this.multiplierText);
              this.flyText(this.__('plus_x', { points: 1 }), this.multiplierText.x, this.multiplierText.y, 'down');

              this.flyText(
                this.CONGRATS[this.rnd.between(0, this.CONGRATS.length - 1)],
                this.world.width / 2,
                this.arrows.y,
                'down'
              );

              this.trickWasResolved = true;
              this.handleTrick(false);
            }
          } else {
            this.arrows.getAt(this.trickIndex).tint = 0x000000;
            if (Data.get('multiplier') > 1) {
              this.flyText(
                this.__('minus_x', { points: Data.get('multiplier') - 1 }),
                this.multiplierText.x,
                this.multiplierText.y,
                'down',
                '#cc2222'
              );
            }
            Data.resetMultiplier();
            this.handleTrick(false);
          }
        }
      };
    } else {
      // Remove any trick indicators
      this.input.keyboard.onUpCallback = null;
      if (!this.trickWasResolved) {
        this.fail.play();
        this.trickWasResolved = true;
        let index = 0;
        this.arrows.forEachAlive(arrow => {
          const t = this.add
            .tween(arrow)
            .to({ y: this.world.height + arrow.height }, 400, Phaser.Easing.Quartic.In, true, 100 * index);
          t.onComplete.add(() => {
            arrow.kill();
          });
          index++;
        });
      }
    }
  }

  handleItems() {
    // Don't start generating items until the player has actually
    // done something
    if (!this.hasStarted) return;

    if (this.millisecondsRemaining < 3000) return;

    // Create a new item
    if (this.nextItemCountdown === 0) {
      // The chance of getting a mine goes up for every time its not a mine
      // and goes down by a bit for every mine
      const isObstacle = this.rnd.between(1, 100) > 40 + this.chanceForObstacleBonus;

      if (isObstacle) {
        this.chanceForObstacleBonus = Math.max(0, this.chanceForObstacleBonus - 6);
      } else {
        this.chanceForObstacleBonus = Math.min(50, this.chanceForObstacleBonus + 2);
      }

      const itemConfig = isObstacle ? this.rnd.pick(ITEMS.obstacles) : ITEMS.collectables[0];
      const y = this.rnd.between(UPPER_BOUND + 40, LOWER_BOUND - 40);

      // Make bunches of stars
      const itemCount = isObstacle ? 1 : this.rnd.between(1, 8);
      for (let i = 0; i < itemCount; i++) {
        let item = this.sprites.getFirstDead(
          true,
          this.world.width + 50 + i * 40,
          y + this.rnd.between(-5, 5),
          itemConfig.sprite
        );
        item.anchor.set(0.5);
        item.animations.add('a');
        item.animations.play('a', 10, true);

        if (isObstacle) {
          item.isObstacle = true;
        } else {
          item.isCollected = false;
        }

        item.checkWorldBounds = true;
        item.events.onOutOfBounds.removeAll();
        item.events.onOutOfBounds.add(target => {
          if (target.x < -20 || target.y < -20) {
            target.kill();
          }
        });

        item.body.velocity.x = -200;
      }

      this.nextItemCountdown = 100 + this.rnd.between(itemCount * 5, itemCount * 8);
    } else {
      this.nextItemCountdown--;
    }
  }

  handleCollisions() {
    // Handle collions with obstacles and collectables
    this.physics.arcade.collide(
      this.player,
      this.sprites,
      (p, s) => {
        // Nothing needs to bounce so this should never be called
      },
      (p, s) => {
        if (COLLECTABLE_SPRITES.includes(s.key)) {
          if (!s.isCollected) {
            let itemConfig = ITEMS.collectables.find(item => item.sprite === s.key);
            // TODO: make a swoosh sound
            this.collectSound.play();
            s.isCollected = true;
            s.body.velocity.x = 0;

            const points = Data.get('multiplier');
            this.flyText(this.__('plus_x', { points }), s.x, s.y, 'up');

            this.add
              .tween(s)
              .to({ x: 30, y: 20 }, 300, Phaser.Easing.Linear.None, true)
              .onComplete.add(() => {
                Data.addPoints(points);
                Data.addStar();
                this.pickUp.play();
                this.popText(this.scoreText);

                s.kill();
              });
          }
          return false;
        } else if (OBSTACLE_SPRITES.includes(s.key)) {
          this.explosionSound.play();

          const reason = ITEMS.obstacles.find(o => o.sprite === s.key).name;
          this.gameOver(true, reason);
          return false;
        } else {
          return true;
        }
      }
    );
  }

  handleScore() {
    this.score = Data.get('points');
    this.scoreText.text = this.score;

    this.multiplierText.text = this.__('multiplier', { multiplier: Data.get('multiplier') });
  }

  gameOver(died, reason) {
    if (this.explosion) {
      this.explosion.x = this.player.x;
      this.explosion.y = this.player.y;
    }

    if (this.mode === 'gameover') return;

    this.input.keyboard.onUpCallback = null;

    if (died) {
      Data.died(reason);

      this.explosion = this.add.sprite(this.player.x, this.player.y, 'explosion');
      this.explosion.anchor.set(0.5);
      this.explosion.animations.add('explode', [0, 1, 2, 3], 6);
      this.explosion.animations.play('explode');

      this.fadeMusic(200, 0);
      this.player.body.velocity.x = -200;
      this.wash.on = false;
      this.flash('#ff0000', 100, 2, 'summary');
    } else {
      if (this.player.y > UPPER_BOUND) {
        this.player.playAnimation('idle');
        this.add.tween(this.player).to({ x: this.world.width }, 800, Phaser.Easing.Quartic.In, true);
        this.add.tween(this.waveBarrel).to({ x: -50 }, 800, Phaser.Easing.Linear.None, true);
      }

      this.fadeMusic(700, 0);
      this.fadeOut('#ffffff', 800, 'summary');
    }

    this.player.body.velocity.y = 0;

    this.mode = 'gameover';
  }

  endTimer() {
    this.timer.stop();
  }

  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60 / 1000);
    const seconds = Math.floor((milliseconds - minutes * 60 * 1000) / 1000);
    milliseconds = Math.floor((milliseconds - seconds * 1000) / 10);
    return ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2) + ':' + ('0' + milliseconds).substr(-2);
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

    cloud.body.velocity.x = 0 - (2 + Math.random() * 6);
  }

  createSpeedLine(x, y) {
    x = x || this.world.width + 100;
    y = y || Math.random() * 200;

    const speedLine = this.speedLines.getFirstDead(true, x, y, 'speed-line');
    speedLine.animations.add('ripple');
    speedLine.animations.play('ripple', 6, true);
    speedLine.checkWorldBounds = true;
    speedLine.events.onOutOfBounds.removeAll();
    speedLine.events.onOutOfBounds.add(target => {
      if (target.x < 0 - target.width) {
        target.x = this.world.width + target.width;
        target.y = UPPER_BOUND + 50 + Math.floor(Math.random() * (LOWER_BOUND - UPPER_BOUND));
      }
    });

    speedLine.body.velocity.x = -800;
  }
}

module.exports = GameState;
