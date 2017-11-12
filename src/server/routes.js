const Invariant = require('invariant');
const ScoresController = require('./controllers/scores');
const Config = require('./config');

exports.register = (server, options, next) => {
  server.register([require('hapi-auth-jwt')], err => {
    Invariant(!err, `Failed loading plugin: ${err}`);

    server.auth.strategy('token', 'jwt', {
      key: Config.auth.key
    });

    server.route([
      {
        method: 'GET',
        path: '/scores',
        config: ScoresController.getIndex
      },
      {
        method: 'POST',
        path: '/scores',
        config: ScoresController.postIndex(Config.auth.key)
      }
    ]);

    next();
  });
};

exports.register.attributes = {
  name: 'nko2017-pixelbeach-routes',
  version: '1.0.0'
};
