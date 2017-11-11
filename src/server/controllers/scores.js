const Joi = require('joi');
const Immutable = require('immutable');
const Chance = require('chance');

const ScoreResource = Joi.object().keys({
	id: Joi.string().required(),
	userName: Joi.string()
		.min(1)
		.max(32)
		.required(),
	score: Joi.number()
		.min(0)
		.required()
});

const scoresChance = new Chance('scores');
const exampleScores = Immutable.Range(0, 100)
	.map(n =>
		Immutable.Map({
			id: `example-score-${n}`,
			userName: scoresChance.name(),
			score: scoresChance.integer({ min: 10, max: 100000 })
		})
	)
	.toList();

exports.getIndex = {
	response: {
		schema: Joi.array()
			.items(ScoreResource)
			.options({ stripUnknown: { objects: true, arrays: false } }),
		modify: true
	},

	handler(request, reply) {
		const sortedScores = exampleScores.sortBy(score => -score.get('score'));
		const top5 = sortedScores.take(5).toJS();

		reply(top5);
	}
};
