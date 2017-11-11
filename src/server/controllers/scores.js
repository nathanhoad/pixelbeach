const Joi = require('joi');
const Immutable = require('immutable');
const Chance = require('chance');
const db = require('../database');
const uuid = require('uuid/v4');

const ScoreResource = Joi.object().keys({
  id: Joi.string()
    .uuid()
    .required(),
  userId: Joi.string().uuid(),
  userName: Joi.string()
    .min(1)
    .max(32)
    .required(),
  score: Joi.number()
    .min(0)
    .required()
});

exports.getIndex = {
  response: {
    schema: Joi.array()
      .items(ScoreResource)
      .options({ stripUnknown: { objects: true, arrays: false } }),
    modify: true
  },

  async handler(request, reply) {
    const scores = (await db('scores')
      .orderBy('highScore', 'desc')
      .limit(5)).map(r => Object.assign({}, r));

    reply(scores);
  }
};

exports.postIndex = {
  response: {
    schema: ScoreResource.options({ stripUnknown: { objects: true, arrays: false } }),
    modify: true
  },
  async handler(request, reply) {
    // TODO: use JWT to get a User ID
    // ...then remove this:
    const userId = 'be88d1c1-0362-4821-8b5c-9195c49e7bf4';

    // Default counter caches
    let highScore = request.payload.score;
    let deaths = 0;
    // TODO: add any other couter caches

    // TODO: do some verification on the score
    // TODO: look up the last score from this user and apply sums, etc
    let previousScore = await db('scores')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .limit(1);
    if (previousScore && previousScore.length > 0) {
      previousScore = previousScore[0];

      highScore = Math.max(previousScore.highScore, highScore);
      deaths = previousScore.deaths + (request.payload.isDead ? 1 : 0);
    }

    const score = Object.assign(
      {},
      await db('scores').insert(
        {
          id: uuid(),
          userId,
          score: request.payload.score,
          highScore,
          deaths,
          createdAt: new Date()
        },
        '*'
      )
    );

    reply(score);
  }
};
