require('es6-promise').polyfill();
require('isomorphic-fetch');
const Invariant = require('invariant');
const Immutable = require('immutable');

const Store = require('./store');

exports.fetchTopScores = () => (dispatch, getState) => {
	fetch('/scores')
		.then(response => {
			Invariant(response.ok, 'Could not fetch top high scores');

			return response.json();
		})
		.then(rawScores => {
			setTimeout(() => {
				// don't dispatch inside a promise context..?
				dispatch({
					type: Store.RECEIVE_TOP_SCORES,
					payload: Immutable.fromJS(rawScores)
				});
			});
		})
		.catch(err => {
			console.error(`Error retrieving top scores: ${err}`);
		});
};
