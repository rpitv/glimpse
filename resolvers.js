const { pool } = require('./db-pool');
const { GraphQLScalarType } = require('graphql');

const resolvers = {
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A timestamp containing a date and a time.',
        serialize(val) {
            return val.getTime()
        },
        parseValue(val) {
            return new Date(val);
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value) // ast value is always in string format
            }
            return null;
        }
    }),
    Query: {
        users: async () => {
            const response = await pool.query('SELECT * FROM users');
            response.rows = response.rows.map(r => {
                r.isAdmin = r.is_admin;
                return r;
            });
            return response.rows;
        },
        members: async () => {
            const members = [];
            const people = await pool.query('select * from people');
            for(let i = 0; i < people.rows.length; i++) {
                const roles = await pool.query('select * from roles where person=$1', [people.rows[i].id]);
                let currentMember = false;
                for(let j = 0; j < roles.rows.length; j++) {
                    if(roles.rows[j].start_date < Date.now() && (roles.rows[j].end_date == null || roles.rows[j].end_date > Date.now())) {
                        currentMember = true;
                    }
                }

                if(currentMember) {
                    members.push({
                        id: people.rows[i].id,
                        firstName: people.rows[i].first_name,
                        lastName: people.rows[i].last_name,
                        preferredName: people.rows[i].preferred_name,
                        classYear: people.rows[i].class_year,
                        roles: roles.rows.map((r => {
                            return {
                                name: r.name,
                                startDate: r.start_date,
                                endDate: r.end_date
                            }
                        }))
                    })
                }
            }
            return members;
        }
    }
};

module.exports = resolvers;
