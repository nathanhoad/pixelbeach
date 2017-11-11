const Redux = require('redux');
const { default: ReduxThunk } = require('redux-thunk');
const Immutable = require('immutable');
const Invariant = require('invariant');

const defaultState = Immutable.Map({
	highscores: Immutable.List()
});

exports.RECEIVE_TOP_SCORES = 'RECEIVE_TOP_SCORES';

const reduce = (state = defaultState, action) => {
	// Invariant(
	// 	typeof action === 'object' && typeof action.type === 'string' && action.type && action.payload,
	// 	'Action must be an object with a type (string) and payload'
	// );

	switch (action.type) {
		case exports.RECEIVE_TOP_SCORES:
			return state.update('highscores', scores => receiveScores(scores, action));
		default:
			return state;
	}
};

const receiveScores = (scores, { payload }) => {
	return payload.sortBy(score => score.get('highscores'));
};

exports.getHighScores = state => state.get('highscores');

const store = Redux.createStore(reduce, Redux.applyMiddleware(ReduxThunk));

module.exports = Object.assign(store, exports);
