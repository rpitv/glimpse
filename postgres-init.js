const { pool } = require('./db-pool');

/**
 * Database schema to adhere to
 * Be careful exposing this! It is not parameterized before feeding to the database. Should be readonly.
 * @readonly
 */
const schema = Object.freeze({
    people: {
        id: 'serial not null primary key',
        first_name: 'varchar(100)',
        last_name: 'varchar(100)',
        preferred_name: 'varchar(100)',
        class_year: 'smallint default (DATE_PART(\'year\', NOW()) + 4)',
    },
    users: {
        id: 'serial not null primary key',
        email: 'varchar(256) not null unique',
        joined: 'timestamp not null default NOW()',
        is_admin: 'boolean default false not null',
        person: 'int references people(id)'
    },
    roles: {
        id: 'serial not null primary key',
        name: 'varchar(128) not null',
        person: 'int references people(id)',
        start_date: 'timestamp not null default NOW()',
        end_date: 'timestamp',
        appears_after: 'int references roles(id)' // Add constraint to prevent circular structures
    },
    videos: {
        id: 'serial not null primary key',
        link: 'varchar(1000) not null'
    },
    images: {
        id: 'serial not null primary key',
        link: 'varchar(1000) not null',
        name: 'varchar(100) not null'
    },
    categories: {
        id: 'serial not null primary key',
        name: 'varchar(64) not null',
        parent: 'int references categories(id)', // Add constraint to prevent circular structures
        appears_after: 'int references categories(id)' // Add constraint to prevent circular structures
    },
    productions: {
        id: 'serial not null primary key',
        name: 'varchar(256) not null',
        createdBy: 'int not null references users(id)',
        description: 'varchar(1000)',
        embed_link: 'varchar(2000)',
        start_time: 'timestamp not null default NOW()',
        create_time: 'timestamp not null default NOW()',
        visible: 'boolean default true',
        category: 'int references categories(id)'
    },
    production_videos: {
        id: 'serial not null primary key',
        production: 'int references productions(id)',
        video: 'int references videos(id)'
    },
    credits: {
        id: 'serial not null primary key',
        person: 'int references people(id) not null',
        job: 'varchar(200) not null',
        production: 'int references productions(id)',
        appears_after: 'int references credits(id)' // Add constraint to make sure both are on the same production
                                                    // Add constraint to prevent circular structures
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
        for(const table in schema) {
            if(!schema.hasOwnProperty(table))
                continue;

            await client.query('CREATE TABLE IF NOT EXISTS ' + table +' ()');

            for(const column in schema[table]) {
                if(!schema[table].hasOwnProperty(column))
                    continue;

                try {
                    await client.query('ALTER TABLE ' + table + ' ADD COLUMN IF NOT EXISTS ' + column + ' ' + schema[table][column]);
                } catch(e) {
                    if(!e.message || !e.message.startsWith('multiple primary keys for table'))
                        throw e;
                }
            }
        }
    } finally {
        client.release();
    }
}

module.exports = { initSchema };
