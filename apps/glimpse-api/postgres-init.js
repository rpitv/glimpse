const { Pool } = require('pg');

const pool = new Pool();

/**
 * Database schema to create if it does not exist.
 * Be careful exposing this! It is not parameterized before feeding to the database. Should be readonly.
 * @readonly
 */
const schema = Object.freeze({
    users: {
        id: 'serial not null primary key',
        email: 'varchar(256) not null unique',
        joined: 'timestamp not null default NOW()',
        is_admin: 'boolean default false not null'
    }
});

/**
 * Initiate the PostgreSQL schema if it does not exist already.
 * Will create new columns, but will not modify or drop existing columns to prevent data loss.
 * @see schema WARNING! This variable is taken in and fed to the database directly w/o sanitization.
 * @throws If a client couldn't be pulled from the pool.
 * @throws If something goes wrong while creating/modifying tables (e.g. SQL syntax error)
 * @returns {Promise<void>}
 */
async function initSchema() {
    const client = await pool.connect();
    try {
        for(let table in schema) {
            if(!schema.hasOwnProperty(table))
                continue;

            await client.query('CREATE TABLE IF NOT EXISTS ' + table +' ()');

            for(let column in schema[table]) {
                if(!schema[table].hasOwnProperty(column))
                    continue;

                await client.query('ALTER TABLE ' + table + ' ADD COLUMN IF NOT EXISTS ' + column + ' ' + schema[table][column]);
            }
        }
    } finally {
        client.release();
    }
}

module.exports = { pool, initSchema };
