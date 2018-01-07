const { first } = require('./util');

class Character extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y);

    // Might need this: https://github.com/photonstorm/phaser/issues/2173
    //this.texture.baseTexture.skipRender = false

    // Center the sprite
    this.anchor.set(0.5);

    const json = game.cache.getJSON(key + 'JSON');
    const animations = json.meta.frameTags.reduce((list, tag) => {
      // If animation is already in the list don't add it again
      return !list.find(item => item.name === tag.name) ? list.concat(tag) : list;
    }, []);

    // Each layer is a Sprite
    this.layers = {};
    json.meta.layers.forEach(layerInfo => {
      // Add a child sprite
      const layer = this.addChild(new Phaser.Sprite(game, 0, 0, key));
      layer.anchor.set(0.5);

      // All layers will have all animations defined on them
      animations.forEach(animation => {
        layer.animations.add(
          animation.name,
          Phaser.Animation.generateFrameNames(`${key} (${layerInfo.name}) `, animation.from, animation.to, '.ase'),
          6, // fps
          true, // loop
          false // useNumericIndex
        );
      });

      layer.animations.play(animations[0].name);

      this.layers[layerInfo.name] = layer;
    });
  }

  /**
   * Play an animation on all layers
   * @param {string} name
   * @param {number?} fps [6] the framerate
   * @param {boolean?} loop [true] loop this animation?
   * @param {boolean?} killOnComplete [false] kill this sprite after this animation?
   */
  playAnimation(name, fps, loop, killOnComplete) {
    fps = first(fps, 6);
    loop = first(loop, true);

    Object.keys(this.layers).forEach(key => {
      this.layers[key].animations.play(name, fps, loop, killOnComplete);
    });
  }
}

Character.load = (game, key, jsonPath) => {
  const imagePath = jsonPath.replace('.json', '.png');

  game.load.json(key + 'JSON', jsonPath);
  game.load.atlasJSONArray(key, imagePath, jsonPath);
};

module.exports = Character;
