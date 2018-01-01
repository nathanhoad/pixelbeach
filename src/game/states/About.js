const SummaryScene = require('./SummaryScene');

class About extends SummaryScene {
  create() {
    super.create();

    this.createTitle(this.__('about'));

    this.createCreditText(
      this.game.world.width / 2,
      100,
      this.__('credits.designed_and_developed_by'),
      'Nathan Hoad, Lilly Piri, Ben Hoad, Jaap van Hardeveld',
      '#fff'
    );

    this.createCreditText(
      this.game.world.width / 2,
      160,
      this.__('credits.additional_development'),
      'Nathan Hoad',
      '#fff'
    );

    this.createCreditText(this.game.world.width / 2, 260, this.__('credits.box_illustration_by'), 'Lilly Piri');
    this.createCreditText(this.game.world.width / 2, 310, this.__('credits.music_by'), 'Jaap van Hardeveld');
    this.createCreditText(this.game.world.width / 2, 360, this.__('credits.effects'), 'Ben Hoad');

    this.createMenu([
      {
        text: this.createMenuText(this.world.width / 2, 440, this.__('menu.back_to_menu')),
        action: () => this.fadeOut('#000', 500, 'menu')
      }
    ]);
  }

  createCreditText(x, y, credit, name, fill) {
    fill = fill || '#000';

    const creditText = this.add.text(x, y, credit.toUpperCase(), {
      font: '11px Arial',
      fill
    });
    creditText.autoRound = false;
    creditText.smoothed = false;
    creditText.anchor.set(0.5);

    const nameText = this.add.text(x, y + 14, name, {
      font: '15px Arial',
      fill
    });
    nameText.autoRound = false;
    nameText.smoothed = false;
    nameText.anchor.set(0.5);
  }
}

module.exports = About;
