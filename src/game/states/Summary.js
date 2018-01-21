const Data = require('../data');
const SummaryScene = require('./SummaryScene');

class SummaryState extends SummaryScene {
  create() {
    super.create();

    const CONGRATS = [
      this.__('congratulations.cowabunga'),
      this.__('congratulations.radical'),
      this.__('congratulations.cool'),
      this.__('congratulations.totally_tubular'),
      this.__('congratulations.far_out'),
      this.__('congratulations.gnarly')
    ];
    let title = CONGRATS[this.rnd.between(0, CONGRATS.length - 1)];

    this.surfer = this.add.sprite(this.world.width / 2, -100, 'summary-surfer');
    this.surfer.anchor.set(0.5);
    this.surfer.animations.add('safe', [0], 6, true);
    this.surfer.animations.add('sit_up', [1, 2, 3, 4], 6, false);

    this.wash = this.add.emitter(100, 100, 200);
    this.wash.gravity = 0;
    this.wash.makeParticles(['surfer-wash-1', 'surfer-wash-2']);
    this.wash.maxParticleSpeed = new Phaser.Point(10, -50);
    this.wash.minParticleSpeed = new Phaser.Point(-10, -10);
    this.wash.minParticleAlpha = 0.5;
    this.wash.minRotation = 0;
    this.wash.maxRotation = 0;
    this.wash.width = 10;
    this.wash.height = 3;
    this.wash.start(false, 200, 30);

    const basePoints = Data.get('points');

    if (Data.get('died')) {
      this.playMusic('died-music', 0.5, false);
      title = this.__('bummer');
    } else {
      this.playMusic('menu-music');
      this.surfer.animations.play('safe');
      const surferTween = this.add.tween(this.surfer).to({ y: 220 }, 2000, Phaser.Easing.Circular.Out, true, 400, 0);
      surferTween.onComplete.addOnce(() => {
        this.surfer.animations.play('sit_up');
        this.flyText(this.__('finish_bonus'), this.scoreText.x, this.scoreText.y, 'up', '#fff');
        this.popText(this.scoreText);

        Data.doublePoints();
        this.scoreText.text = this.__('you_scored_x_points', { points: Data.get('points') });

        if (Data.get('points') > Data.get('highestScore')) {
          this.bestScoreText.text = this.__('high_score_x', { points: Data.get('highestScore') });
        }
      });
    }

    this.createTitle(title);

    // You scored
    this.scoreText = this.add.text(this.world.width / 2, 120, this.__('you_scored_x_points', { points: basePoints }), {
      font: 'bold 20px Arial',
      fill: 'white'
    });
    this.scoreText.anchor.set(0.5);
    this.scoreText.alpha = 0;
    this.scoreText.smoothed = false;
    this.add.tween(this.scoreText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 600, 0);

    this.bestScoreText = this.add.text(
      this.world.width / 2,
      150,
      this.__('high_score_x', { points: Data.get('highestScore') }),
      {
        font: 'bold 20px Arial',
        fill: 'white'
      }
    );
    this.bestScoreText.anchor.set(0.5);
    this.bestScoreText.alpha = 0;
    this.add.tween(this.bestScoreText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 1000, 0);

    // Menu
    this.createMenu([
      {
        text: this.createMenuText(this.world.width / 2, 380, this.__('menu.try_again')),
        action: () => this.fadeOut('#000', 500, 'game')
      },
      {
        text: this.createMenuText(this.world.width / 2, 410, this.__('menu.scores')),
        action: () => this.fadeOut('#000', 500, 'scores')
      },
      {
        text: this.createMenuText(this.world.width / 2, 440, this.__('menu.back_to_menu')),
        action: () => this.fadeOut('#000', 500, 'menu')
      }
    ]);

    Data.saveState();

    this.fadeIn(Data.get('died') ? '#ff0000' : '#ffffff', 300);
  }

  update() {
    this.wash.x = this.surfer.x;
    this.wash.y = this.surfer.y - 14;
    this.wash.on = this.surfer.y < 200;
  }
}

module.exports = SummaryState;
