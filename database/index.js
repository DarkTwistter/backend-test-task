const knex = require('knex');

const pg = require('knex')({
    client: 'pg',
    connection: `postgres://postgres:pobave23@localhost:5432/test`,
    searchPath: ['knex', 'public', 'cars'],
});

module.exports = pg;
