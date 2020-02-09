const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({
    typeDefs: gqlSchema,
    resolvers: gqlResolvers
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
