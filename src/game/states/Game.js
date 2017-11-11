const ACCELERATION = 30;
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
  }
}

module.exports = GameState;
