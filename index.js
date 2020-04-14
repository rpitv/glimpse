require('dotenv').config();
const { initSchema } = require('./postgres-init');
const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const { pool } = require('./db-pool');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { ApolloServer } = require('apollo-server-express');
const Authentication = require('./authentication');
const fs = require('fs-extra');

console.log("Initializing...");
initSchema(true).then(async () => {
    console.log("Schema updated.");

    await fs.mkdirs('./static/uploads');

    const server = new ApolloServer({
        typeDefs: gqlSchema,
        resolvers: gqlResolvers,
        context: () => {
            return {
                pool: pool
            }
        }
    });

    const expApp = express();

    expApp.use(session({
        store: new pgSession({
            pool: pool
        }),
        secret: process.env.COOKIE_SECRET,
        cookie: {
            name: 'glimpse.sess',
            maxAge: 604800000, // 7 days
            secure: process.env.NODE_ENV === "production"
        },
        resave: false,
        saveUninitialized: false
    }));

    expApp.use(bodyParser.urlencoded({ extended: true }));
    expApp.use(bodyParser.json());
    expApp.use(bodyParser.raw());

    server.applyMiddleware({ app: expApp });

    expApp.use('/static', express.static('static'));
    expApp.use('/auth/login', Authentication.LoginRouter);
    expApp.use('/auth/sync', Authentication.SyncRouter);
    expApp.use('/auth/logout', Authentication.LogoutRouter);

    expApp.listen({port: 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });

}).catch((err) => console.error(err.stack));
