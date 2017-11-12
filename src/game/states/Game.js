const ACCELERATION = 50;
const MAX_VERTICAL_SPEED = 400;
const UPPER_BOUND = 200;
const LOWER_BOUND = 350;
let isEmitting = false;

class GameState {
  create() {
    this.game.stage.backgroundColor = '#64D6FE';
    this.game.add.sprite(0, 100, 'ocean');
    this.game.add.sprite(0, UPPER_BOUND, 'backwave');
    // Group for any sprites
    this.sprites = this.game.add.group();
    this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;

    // Create the player
    this.player = this.sprites.create(200, 200, 'player');

    this.surfer = this.game.add.spine(0, 0, 'surfer');

    this.surfer.setMixByName('idle', 'idle-up', 0.2);
    this.surfer.setMixByName('idle', 'idle-down', 0.2);

    this.surfer.setMixByName('idle-up', 'idle', 0.2);
    this.surfer.setMixByName('idle-down', 'idle', 0.2);

    this.surfer.setMixByName('idle-up', 'idle-down', 0.2);
    this.surfer.setMixByName('idle-down', 'idle-up', 0.2);

    this.player.addChild(this.surfer);

    // Collectables
    this.nextItemCountdown = 100;

    // Particles
    this.wash = this.game.add.emitter(100, 100, 200);
    // this.wash.gravity = 200;
    this.wash.makeParticles(['wash', 'wash2']);
    this.wash.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.wash.minParticleSpeed = new Phaser.Point(-200, -50);

    // this.player.addChild(this.wash);
    this.wash.start(false, 5000, 20);

    // Mode
    this.mode = 'playing';

    this.game.add.sprite(0, UPPER_BOUND, 'wave');
    //wave froth
    this.wavefroth1 = this.game.add.emitter(60, 400, 200);
    this.wavefroth1.makeParticles(['wave-froth-lrg', 'wave-froth', 'wave-froth-lrg', 'wave-froth-hge']);
    this.wavefroth1.maxParticleSpeed = new Phaser.Point(-100, 20);
    this.wavefroth1.minParticleSpeed = new Phaser.Point(-200, -150);
    this.wavefroth1.start(false, 1000, 1);

    this.wavefroth2 = this.game.add.emitter(170, UPPER_BOUND + 4, 200);
    this.wavefroth2.makeParticles(['wash', 'wash2', 'wave-froth', 'wave-froth-sml']);
    this.wavefroth2.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.wavefroth2.minParticleSpeed = new Phaser.Point(-200, -50);
    this.wavefroth2.start(false, 1500, 1);

    this.wavefroth3 = this.game.add.emitter(170, UPPER_BOUND + 4, 100);
    this.wavefroth3.makeParticles(['wash', 'wash2', 'wave-froth-sml']);
    this.wavefroth3.maxParticleSpeed = new Phaser.Point(-120, 10);
    this.wavefroth3.minParticleSpeed = new Phaser.Point(-120, 40);
    this.wavefroth3.start(false, 1500, 0.2);
    this.wavefroth3.gravity = 400;

    this.wash.minRotation = 0;
    this.wash.maxRotation = 0;

    this.wavefroth1.minRotation = 0;
    this.wavefroth1.maxRotation = 0;
    this.wavefroth2.minRotation = 0;
    this.wavefroth2.maxRotation = 0;
    this.wavefroth3.minRotation = 0;
    this.wavefroth3.maxRotation = 0;

    this.game.add.sprite(0, LOWER_BOUND + 50, 'wave-bottom');
  }

  update() {
    switch (this.mode) {
      case 'playing':
        this.handlePlayer();
        this.handleItems();
        this.handleCollisions();

        break;

      case 'gameover':
        this.handleGameOver();
        break;
    }
  }

  // Internal helpers

  handlePlayer() {
    let isTricking = false;

    this.wash.x = this.player.x - 10;
    this.wash.y = this.player.y + 10;

    // Movement
    if (this.game.input.activePointer.isDown) {
      // The player has actually done something so we can start
      // generating collectables and obstacles
      this.hasStarted = true;

      if (this.player.y < UPPER_BOUND) {
        this.player.body.velocity.y += ACCELERATION / 4;
        // THIS IS THE TRICK AREA
      } else {
        this.player.body.velocity.y -= ACCELERATION;
        if (this.player.body.velocity.y < 0 - MAX_VERTICAL_SPEED) {
          this.player.body.velocity.y = 0 - MAX_VERTICAL_SPEED;
        }
      }
    } else {
      // Player falls to the bottom of the wave
      if (this.player.y < LOWER_BOUND) {
        this.player.body.velocity.y += ACCELERATION;
        if (this.player.body.velocity.y > MAX_VERTICAL_SPEED) {
          this.player.body.velocity.y = MAX_VERTICAL_SPEED;
        }
      } else {
        // Decelerate near the bottom
        this.player.body.velocity.y -= ACCELERATION;
        if (this.player.body.velocity.y < 0) {
          this.player.body.velocity.y = 0;
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
      const isObstacle = Math.random() > 0.5;
      let item = this.sprites.getFirstDead(true, this.game.world.width + 50, 300, isObstacle ? 'obstacle' : 'item');
      item.scale.x = 1.5;
      item.scale.y = 1.5;

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

      this.nextItemCountdown = 50 + Math.ceil(Math.random() * 300);
    } else {
      this.nextItemCountdown--;
    }
  }

  handleCollisions() {
    // Handle collions with obstacles and collectables
    this.game.physics.arcade.collide(
      this.player,
      this.sprites,
      (p, s) => {
        // Nothing needs to bounce so this should never be called
      },
      (p, s) => {
        switch (s.key) {
          case 'item':
            if (!s.isCollected) {
              s.isCollected = true;
              s.body.velocity.x = 0;
              this.game.physics.arcade.moveToXY(s, 10, 10, 1500);
              // TODO: put a score thing in the corner where this flies to and add stuff to it
            }
            return false;

          case 'obstacle':
            // TODO: Custom death animation based on obstacle
            // ...
            this.gameOver();
            return false;

          default:
            return true;
        }
      }
    );
  }

  gameOver() {
    if (this.mode === 'gameover') return;

    this.player.body.velocity.y = 0;
    this.gameOverCountdown = 60;
    this.mode = 'gameover';
  }

  handleGameOver() {
    if (this.gameOverCountdown) {
      this.gameOverCountdown--;
    } else {
      this.game.state.start('summary');
    }
  }
}

module.exports = GameState;
