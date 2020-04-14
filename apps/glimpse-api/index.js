require('dotenv').config();
const { initSchema } = require('./postgres-init');
const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const Authentication = require('./authentication');
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

    expApp.use(bodyParser.urlencoded({ extended: true }));
    expApp.use(bodyParser.json());
    expApp.use(bodyParser.raw());

    server.applyMiddleware({ app: expApp });

    expApp.use('/static', express.static('static'));
    expApp.use('/login', Authentication.LoginRouter);
    expApp.use('/logout', Authentication.LogoutRouter);

    expApp.listen({port: 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });

}).catch((err) => console.error(err.stack));
