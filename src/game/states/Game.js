const ACCELERATION = 50;
const MAX_VERTICAL_SPEED = 400;
const UPPER_BOUND = 200;
const LOWER_BOUND = 350;

class GameState {
  create() {
    // Group for any sprites
    this.sprites = this.game.add.group();
    this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;

    // Create the player
    this.player = this.sprites.create(100, 100, 'player');

    // Collectables
    this.nextItemCountdown = 100;

    // Mode
    this.mode = 'playing';
  }

  update() {
    switch (this.mode) {
      case 'playing':
        // Update the player
        if (this.game.input.activePointer.isDown) {
          if (this.player.y < UPPER_BOUND) {
            console.log('trick time!');
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

        // Create a new item
        if (this.nextItemCountdown === 0) {
          // TODO: have some smarts over whether to create a collectable or an obstacle
          this.createItem(Math.random() >= 0.5);
          this.nextItemCountdown = 50 + Math.ceil(Math.random() * 300);
        } else {
          this.nextItemCountdown--;
        }

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
        break;

      case 'gameover':
        if (this.gameOverCountdown) {
          this.gameOverCountdown--;
        } else {
          this.game.state.start('summary');
        }
        break;
    }
  }

  // Internal helpers

  createItem(isObstacle) {
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
  }

  gameOver() {
    if (this.mode === 'gameover') return;

    this.player.body.velocity.y = 0;
    this.gameOverCountdown = 60;
    this.mode = 'gameover';
  }
}

module.exports = GameState;
