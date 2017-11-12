exports.up = function(knex, Promise) {
  return knex.schema.createTable('scores', table => {
    table.uuid('id').primary();

    table.uuid('userId');
    table.string('userName');
    table.integer('score');
    table.integer('highScore');
    table.integer('deaths');

    table.timestamp('createdAt');

    // index

    table.index('userId');
    table.index('userName');
    table.index('score');
    table.index('createdAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('scores');
};
