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
    this.nextCollectableCountdown = 100;
  }

  update() {
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

    // Create a new collectable randomly
    // TODO: make this not clash with obstacles
    if (this.nextCollectableCountdown === 0) {
      this.createCollectable();
      this.nextCollectableCountdown = 50 + Math.ceil(Math.random() * 300);
    } else {
      this.nextCollectableCountdown--;
    }

    this.game.physics.arcade.collide(
      this.player,
      this.sprites,
      (p, s) => {
        console.log('collide!');
      },
      (p, s) => {
        if (s.key === 'item') {
          if (!s.isCollected) {
            console.log('collected a thing!');
            s.isCollected = true;
            s.body.velocity.x = 0;
            this.game.physics.arcade.moveToXY(s, 10, 10, 1500);
            // TODO: put a score thing in the corner where this flies to and add stuff to it
          }
          return false;
        }

        return true;
      }
    );
  }

  // Internal helpers

  createCollectable() {
    let item = this.sprites.getFirstDead(true, this.game.world.width + 50, 300, 'item');
    item.scale.x = 1.5;
    item.scale.y = 1.5;
    item.isCollected = false;
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
}

module.exports = GameState;
