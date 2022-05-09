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
        permission_level: 'smallint default 0 not null',
        identity: 'int references people(id)'
    },
    roles: {
        id: 'serial not null primary key',
        name: 'varchar(128) not null',
        owner: 'int references people(id) not null',
        start_date: 'timestamp not null default NOW()',
        end_date: 'timestamp',
        priority: 'int'
    },
    videos: {
        id: 'serial not null primary key',
        name: 'varchar(128) not null',
        video_type: 'varchar(32) not null default \'RTMP\'', // TODO could be changed to enum
        data: 'json not null'
    },
    images: {
        id: 'serial not null primary key',
        link: 'varchar(1000) not null',
        name: 'varchar(100) not null',
        added: 'timestamp not null default NOW()'
    },
    categories: {
        id: 'serial not null primary key',
        name: 'varchar(64) not null',
        parent: 'int references categories(id)', // TODO Add constraint to prevent circular structures
        priority: 'int'
    },
    productions: {
        id: 'serial not null primary key',
        name: 'varchar(256) not null',
        created_by: 'int not null references users(id)',
        description: 'varchar(1000)',
        start_time: 'timestamp not null default NOW()',
        create_time: 'timestamp not null default NOW()',
        thumbnail: 'int references images(id)',
        visible: 'boolean default true',
        category: 'int references categories(id)'
    },
    production_videos: {
        id: 'serial not null primary key',
        production: 'int references productions(id)',
        video: 'int references videos(id)'
    },
    production_images: {
        id: 'serial not null primary key',
        production: 'int references productions(id)',
        image: 'int references images(id)'
    },
    credits: {
        id: 'serial not null primary key',
        person: 'int references people(id) not null',
        job: 'varchar(200) not null',
        production: 'int references productions(id) not null',
        priority: 'int'
    }
});

/**
 * Initiate the PostgreSQL schema if it does not exist already.
 * Will create new columns, but will not modify or drop existing columns to prevent data loss.
 * @see schema WARNING! This variable is taken in and fed to the database directly w/o sanitization.
 * @param onlyInitOnDev {boolean} Whether this function should only initialize the schema if it is not in production.
 *      This should probably be true. Database schema changes should be added manually for safety in production.
 * @throws If a client couldn't be pulled from the pool.
 * @throws If something goes wrong while creating/modifying tables (e.g. SQL syntax error)
 * @returns {Promise<void>}
 */
async function initSchema(onlyInitOnDev) {
    if(onlyInitOnDev && process.env.NODE_ENV === "production")
        return;

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

    try {
        await createSessionTable();
    } catch(e) {
        console.warn('There was an error while creating the session table: ' + e.message)
    }
}

/**
 * Create the table for Express session data, used by the store "connect-pg-simple".
 * @see https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
 * @return {Promise<void>}
 */
async function createSessionTable() {
    const client = await pool.connect();
    try {
        await client.query('CREATE TABLE IF NOT EXISTS "session" (' +
            '"sid" varchar NOT NULL COLLATE "default",' +
            '"sess" json NOT NULL,' +
            '"expire" timestamp(6) NOT NULL' +
            ')' +
            'WITH (OIDS=FALSE);');
        await client.query('ALTER TABLE "session" ADD CONSTRAINT "session_pkey" ' +
            'PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;');
        await client.query('CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");');
    } finally {
        client.release();
    }
}

module.exports = { initSchema };
