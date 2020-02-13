const { GraphQLScalarType } = require('graphql');
const { Person } = require('./classes/Person');
const { User } = require('./classes/User');
const { Role } = require('./classes/Role');

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
            return User.getAllUsers();
        },
        members: async () => {
            return Person.getAllMembers();
        },
        people: async () => {
            return Person.getAllPeople();
        }
    },
    User: {
        identity: async (obj) => {
            return obj.getIdentity();
        }
    },
    Person: {
        roles: async(obj) => {
            return Role.getRolesForPerson(obj);
        }
    },
    Role: {
        appearsAfter: async(obj) => {
            return obj.getPreviousRole();
        }
    }
};

module.exports = resolvers;
