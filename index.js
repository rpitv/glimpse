require('dotenv').config();
const { initSchema } = require('./postgres-init');
const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs-extra');

console.log("Initializing...");
initSchema().then(async () => {
    console.log("Schema updated.");

    await fs.mkdirs('./static/uploads');

    const server = new ApolloServer({
        typeDefs: gqlSchema,
        resolvers: gqlResolvers,
        context: () => {
            return {
                pool: require('./db-pool').pool
            }
        }
    });

    const expApp = express();
    server.applyMiddleware({ app: expApp });

    expApp.use('/static', express.static('static'));

    expApp.listen({port: 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });

}).catch((err) => console.error(err.stack));
