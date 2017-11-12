const Data = require('../data');
const Chance = require('chance');

const ACCELERATION = 30;
const MAX_VERTICAL_SPEED = 400;
const UPPER_BOUND = 200;
const LOWER_BOUND = 400;
let isEmitting = false;
let timer, timerEvent;

const SKINS = {
  wetsuits: ['wetsuit.green', 'wetsuit.yellow', 'wetsuit.purple', 'wetsuit.red'],
  skins: ['skin.1', 'skin.2', 'skin.3', 'skin.4'],
  hairs: ['hair.blonde', 'hair.brunette', 'hair.ginger', 'hair.pink'],
  helmets: ['helmet'],
  boards: ['board.red', 'board.green', 'board.yellow', 'board.purple']
};

const ITEMS = {
  collectables: [
    { sprite: 'ducky', animates: true, scale: 1, points: 10 },
    { sprite: 'beachball-1', animates: true, scale: 1, points: 10 },
    { sprite: 'beachball-2', animates: true, scale: 1, points: 10 },
    { sprite: 'cat-1', animates: true, scale: 0.95, points: 25 },
    { sprite: 'cat-2', animates: true, scale: 0.95, points: 25 },
    { sprite: 'cat-3', animates: true, scale: 0.95, points: 25 },
    { sprite: 'hoff', animates: true, scale: 0.75, points: 50 },
    { sprite: 'pink-poodle', animates: true, scale: 0.95, points: 25 },
    { sprite: 'swan-floaty1', animates: true, scale: 0.65, points: 25 },
    { sprite: 'swan-floaty2', animates: true, scale: 0.65, points: 10 },
    { sprite: 'unicorn-floaty3', animates: true, scale: 0.65, points: 100 },
    { sprite: 'seagull', animates: true, scale: 0.75, points: 10 }
  ],
  obstacles: [
    { sprite: 'obstacle', animates: true, scale: 1 },
    { sprite: 'demogorgon', animates: true, scale: 1 },
    { sprite: 'shark', animates: true, scale: 1 },
    { sprite: 'loose-seal', animates: true, scale: 0.75 }
  ]
};

// For fast checking to which a sprite belongs using array.includes (collision)
const COLLECTABLE_SPRITES = ITEMS.collectables.map(col => col.sprite);
const OBSTACLE_SPRITES = ITEMS.obstacles.map(col => col.sprite);
const MAX_POINTS = Math.max(...ITEMS.collectables.map(col => col.points));
const COLLECTABLE_WEIGHTS = ITEMS.collectables.map(col => {
  const penalty = Math.ceil((col.points + 1) / 3);
  return MAX_POINTS - penalty;
});

class GameState {
  create() {
    Data.reset();

    this.game.add.sprite(0, 0, 'wave-background');
    const waveTop = this.game.add.sprite(150, 177, 'water-top');
    waveTop.animations.add('foam');
    waveTop.animations.play('foam', 6, true);

    // Float some clouds
    this.clouds = this.game.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    this.createCloud(150, 60);
    this.createCloud(this.game.world.width - 50, 120);

    // Create some speed lines
    this.speedLines = this.game.add.group();
    this.speedLines.enableBody = true;
    this.speedLines.physicsBodyType = Phaser.Physics.ARCADE;
    this.createSpeedLine(630, 300);
    this.createSpeedLine(10, 380);

    // Group for any sprites
    this.sprites = this.game.add.group();
    this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;

    // Create the player
    this.player = this.sprites.create(250, LOWER_BOUND, 'player');

    this.surfer = this.game.add.spine(0, 0, 'surfer');

    this.surfer.setMixByName('idle', 'idle-up', 0.2);
    this.surfer.setMixByName('idle', 'idle-down', 0.2);

    this.surfer.setMixByName('idle-up', 'idle', 0.2);
    this.surfer.setMixByName('idle-down', 'idle', 0.2);

    this.surfer.setMixByName('idle-up', 'idle-down', 0.2);
    this.surfer.setMixByName('idle-down', 'idle-up', 0.2);

    // Why use Chance? We can pass the constructor any seed, so it'll
    // generate the same one each time. Based on user id, or user name?
    // Or even just a "generate new character" button?
    const playerChance = new Chance();

    const skinElements = [
      playerChance.pickone(SKINS.wetsuits),
      playerChance.pickone(SKINS.skins),
      playerChance.pickone(SKINS.hairs),
      playerChance.pickone(SKINS.boards)
    ];

    if (playerChance.bool({ likelihood: 25 })) {
      skinElements.unshift(playerChance.pickone(SKINS.helmets));
    }
    const skin = this.surfer.createCombinedSkin('player', ...skinElements);

    this.surfer.setSkin(skin);
    // this.surfer.setSkinByName('helmet');
    this.surfer.setToSetupPose();

    this.player.addChild(this.surfer);

    // Particles
    this.wash = this.game.add.emitter(100, 100, 200);
    // this.wash.gravity = 200;
    this.wash.makeParticles(['wash', 'wash2']);
    this.wash.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.wash.minParticleSpeed = new Phaser.Point(-200, -50);

    // Audio
    this.pickUp = this.game.add.audio('pickup');
    this.fail = this.game.add.audio('fail');
    this.trick2 = this.game.add.audio('trick2');
    this.soundtrack = new Phaser.Sound(this.game, 'soundtrack', 1, true);

    // Play the soundtrack
    // this.soundtrack.play();

    // Turn the fucking volume down
    this.pickUp.volume = 0.05;
    this.fail.volume = 0.05;
    this.trick2.volume = 0.05;
    this.soundtrack.volume = 0.01;

    this.wash.start(false, 5000, 20);

    // Keep track of how much air you should get
    this.playerMomentum = 1;

    // Items
    this.lastCollisionDistance = 0;
    this.nextItemCountdown = 100;
    this.itemsChance = new Chance(); // put in a level seed here!

    this.collectableIcon = this.sprites.create(10, 10, 'ducky-icon');
    this.collectableText = this.game.add.text(70, 20, '0', {
      font: 'bold 20px Arial',
      fill: 'white',
      boundsAlignH: 'left',
      boundsAlignV: 'middle'
    });

    // Countdown
    this.countDown = this.game.add.text(0, 0, '0', {
      font: 'bold 20px Arial',
      fill: 'white',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });
    this.countDown.setTextBounds(0, 20, this.game.world.width, 20);

    // timer
    timer = this.game.time.create();
    timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    timer.start();

    // Mode
    this.mode = 'playing';

    const wave = this.game.add.sprite(-40, UPPER_BOUND - 41, 'wave');
    wave.animations.add('foam');
    wave.animations.play('foam', 6, true);

    //wave froth
    // this.wavefroth1 = this.game.add.emitter(60, 400, 200);
    // this.wavefroth1.makeParticles(['wave-froth-lrg', 'wave-froth', 'wave-froth-lrg', 'wave-froth-hge']);
    // this.wavefroth1.maxParticleSpeed = new Phaser.Point(-100, 20);
    // this.wavefroth1.minParticleSpeed = new Phaser.Point(-200, -150);
    // this.wavefroth1.start(false, 1000, 1);

    // this.wavefroth2 = this.game.add.emitter(170, UPPER_BOUND + 4, 200);
    // this.wavefroth2.makeParticles(['wash', 'wash2', 'wave-froth', 'wave-froth-sml']);
    // this.wavefroth2.maxParticleSpeed = new Phaser.Point(-100, 50);
    // this.wavefroth2.minParticleSpeed = new Phaser.Point(-200, -50);
    // this.wavefroth2.start(false, 1500, 1);

    // this.wavefroth3 = this.game.add.emitter(170, UPPER_BOUND + 4, 100);
    // this.wavefroth3.makeParticles(['wash', 'wash2', 'wave-froth-sml']);
    // this.wavefroth3.maxParticleSpeed = new Phaser.Point(-110, 10);
    // this.wavefroth3.minParticleSpeed = new Phaser.Point(-120, 40);
    // this.wavefroth3.start(false, 900, 0.2);
    // this.wavefroth3.gravity = 400;

    this.wash.minRotation = 0;
    this.wash.maxRotation = 0;

    // this.wavefroth1.minRotation = 0;
    // this.wavefroth1.maxRotation = 0;
    // this.wavefroth2.minRotation = 0;
    // this.wavefroth2.maxRotation = 0;
    // this.wavefroth3.minRotation = 0;
    // this.wavefroth3.maxRotation = 0;

    // this.game.add.sprite(0, LOWER_BOUND, 'wave-bottom');
    this.game.camera.flash('#000', 500, true);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
  }

  update() {
    switch (this.mode) {
      case 'playing':
        this.handlePlayer();
        this.handleItems();
        this.handleCollisions();
        this.handleScore();
        if (timer.running) {
          this.countDown.text = this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
        } else {
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

    this.wash.x = this.player.x - 10;
    this.wash.y = this.player.y + 10;

    // Movement
    if (this.player.y < UPPER_BOUND) {
      // Player is in the sky
      if (this.player.body.gravity.y === 0) {
        this.trick2.play();
        // 500 is the lowest gravity
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
      this.player.body.gravity.y = 0;

      if (this.game.input.activePointer.isDown || this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        // The player has actually done something so we can start
        // generating collectables and obstacles
        this.hasStarted = true;

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

    if (this.player.y < UPPER_BOUND) {
      isTricking = true;
    } else {
      isTricking = false;
    }

    // Animations
    if (this.player.body.velocity.y < 0) {
      if (this.surfer.anim !== 'idle-up') {
        this.surfer.setAnimationByName(0, 'idle-up', true);
        this.surfer.anim = 'idle-up';
      }
    } else if (this.player.body.velocity.y > 0) {
      if (this.surfer.anim !== 'idle-down') {
        this.surfer.setAnimationByName(0, 'idle-down', true);
        this.surfer.anim = 'idle-down';
      }
    } else {
      if (this.surfer.anim !== 'idle') {
        this.surfer.setAnimationByName(0, 'idle', true);
        this.surfer.anim = 'idle';
      }
    }

    if (isTricking) {
      this.wash.on = false;
      isEmitting = false;
    }

    if (!isTricking && !isEmitting) {
      this.wash.start(false, 5000, 20);
      isEmitting = true;
    }
  }

  handleItems() {
    // Don't start generating items until the player has actually
    // done something
    if (!this.hasStarted) return;

    // Create a new item
    if (this.nextItemCountdown === 0) {
      // TODO: have some smarts over whether to create a collectable or an obstacle
      const isObstacle = this.itemsChance.bool({
        likelihood: 5 + Math.min(55, this.lastCollisionDistance / 4000 * 55)
      });
      const itemConfig = isObstacle
        ? this.itemsChance.pickone(ITEMS.obstacles)
        : this.itemsChance.weighted(ITEMS.collectables, COLLECTABLE_WEIGHTS);

      const y = UPPER_BOUND + 20 + Math.random() * (LOWER_BOUND - UPPER_BOUND - 20);

      let item = this.sprites.getFirstDead(true, this.game.world.width + 50, y, itemConfig.sprite);
      item.scale.x = itemConfig.scale || 1.5;
      item.scale.y = itemConfig.scale || 1.5;
      if (itemConfig.animates) {
        item.animations.add('sheet');
        item.animations.play('sheet', 7, true);
      }

      if (isObstacle) {
        item.isObstacle = true;
      } else {
        item.isCollected = false;
      }

      item.checkWorldBounds = true;
      item.events.onOutOfBounds.removeAll();
      item.events.onOutOfBounds.add(target => {
        if (target.x < -20 || target.y < -20) {
          // TODO: remove any attached spines here
          target.kill();
        }
      });

      item.body.velocity.x = -200;

      this.nextItemCountdown =
        100 -
        this.itemsChance.integer({
          min: Math.min(50, Math.floor(this.lastCollisionDistance / 1000 * 50)),
          max: 80
        });
    } else {
      this.nextItemCountdown--;
    }
  }

  handleCollisions() {
    this.lastCollisionDistance++;
    // Handle collions with obstacles and collectables
    this.game.physics.arcade.collide(
      this.player,
      this.sprites,
      (p, s) => {
        // Nothing needs to bounce so this should never be called
      },
      (p, s) => {
        if (COLLECTABLE_SPRITES.includes(s.key)) {
          if (!s.isCollected) {
            let itemConfig = ITEMS.collectables.find(item => item.sprite === s.key);
            this.pickUp.play();
            s.isCollected = true;
            s.body.velocity.x = 0;
            this.game.physics.arcade.moveToXY(s, 10, 10, 1500);
            setTimeout(() => {
              this.collectableIcon.kill();
              this.collectableIcon = this.sprites.getFirstDead(true, 10, 10, s.key);
            }, 200);
            // TODO: put a score thing in the corner where this flies to and add stuff to it

            // TODO: different points for different things
            // and multipliers
            Data.addPoints(itemConfig.points);
            Data.collectCollectable();
          }
          return false;
        } else if (OBSTACLE_SPRITES.includes(s.key)) {
          this.lastCollisionDistance = 0;
          this.fail.play();
          this.gameOver(true);
          return false;
        } else {
          return true;
        }

        // switch (s.key) {
        //   case 'item':
        //   case 'ducky':

        //   case 'obstacle':
        //     // TODO: Custom death animation based on obstacle
        //     // ...

        //   default:
        //     return true;
        // }
      }
    );
  }

  handleScore() {
    this.collectableText.text = Data.get('points');
  }

  gameOver(died) {
    if (this.mode === 'gameover') return;

    if (died) {
      Data.died();

      this.game.camera.onFlashComplete.add(() => {
        this.game.camera.onFlashComplete.removeAll();
        this.game.camera.onFadeComplete.add(() => {
          this.game.camera.onFadeComplete.removeAll();
          this.game.state.start('summary');
        });
        this.game.camera.fade(0xff0000, 200);
      });
      this.game.camera.flash(0xff0000, 200);
      this.player.body.velocity.x = -200;
    } else {
      this.game.camera.onFadeComplete.add(() => {
        this.game.camera.onFadeComplete.removeAll();
        this.game.state.start('summary');
      });
      this.game.camera.fade(0xffffff, 400);
    }

    this.player.body.velocity.y = 0;

    this.mode = 'gameover';
    this.surfer.anim = 'idle';
  }

  endTimer() {
    timer.stop();
  }

  formatTime(s) {
    const minutes = '0' + Math.floor(s / 60);
    const seconds = '0' + (s - minutes * 60);
    return minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  createCloud(x, y) {
    x = x || this.game.world.width + 100;
    y = y || Math.random() * 200;

    let cloud = this.clouds.getFirstDead(true, x, y, 'menu-cloud');
    cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.removeAll();
    cloud.events.onOutOfBounds.add(target => {
      if (target.x < 0 - target.width) {
        target.x = this.game.world.width + target.width;
      }
    });

    cloud.body.velocity.x = 0 - (2 + Math.random() * 6);
  }

  createSpeedLine(x, y) {
    x = x || this.game.world.width + 100;
    y = y || Math.random() * 200;

    const speedLine = this.speedLines.getFirstDead(true, x, y, 'speed-line');
    speedLine.animations.add('ripple');
    speedLine.animations.play('ripple', 6, true);
    speedLine.checkWorldBounds = true;
    speedLine.events.onOutOfBounds.removeAll();
    speedLine.events.onOutOfBounds.add(target => {
      if (target.x < 0 - target.width) {
        target.x = this.game.world.width + target.width;
        target.y = UPPER_BOUND + 50 + Math.floor(Math.random() * (LOWER_BOUND - UPPER_BOUND));
      }
    });

    speedLine.body.velocity.x = -800;
  }
}
module.exports = GameState;
