const Joi = require('joi');
const JsonWebToken = require('jsonwebtoken');
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
  userToken: Joi.string()
    .allow(null)
    .default(null)
    .optional(),
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

exports.postIndex = authKey => ({
  auth: {
    strategy: 'token',
    mode: 'try'
  },

  response: {
    schema: ScoreResource.options({ stripUnknown: { objects: true, arrays: false } }),
    modify: true
  },

  validate: {
    payload: {
      userName: Joi.reach(ScoreResource, 'userName').required(),
      score: Joi.reach(ScoreResource, 'score').required()
    }
  },

  async handler(request, reply) {
    var userId;

    if (request.auth.isAuthenticated) {
      userId = request.auth.credentials.uid;
    } else {
      userId = uuid();
    }

    const userName = request.payload.userName;

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

    const score = (await db('scores').insert(
      {
        id: uuid(),
        userId,
        userName,
        score: request.payload.score,
        highScore,
        deaths,
        createdAt: new Date()
      },
      '*'
    )).map(r =>
      Object.assign(
        {
          userToken: JsonWebToken.sign(
            {
              uid: userId
            },
            authKey,
            { algorithm: 'HS256' }
          )
        },
        r
      )
    )[0];

    reply(score);
  }
});
