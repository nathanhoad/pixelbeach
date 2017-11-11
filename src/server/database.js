const Knex = require('knex');

module.exports = Knex(require('./config').knex);
