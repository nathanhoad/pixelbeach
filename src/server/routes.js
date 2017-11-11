const ScoresController = require('./controllers/scores');

exports.register = (server, options, next) => {
	server.route([{ method: 'GET', path: '/scores', config: ScoresController.getIndex }]);

	next();
};

exports.register.attributes = {
	name: 'nko2017-pixelbeach-routes',
	version: '1.0.0'
};
