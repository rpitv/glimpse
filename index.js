require('dotenv').config();
const { initSchema } = require('./util/postgres-init');
const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const { pool } = require('./util/db-pool');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { ApolloServer } = require('apollo-server-express');
const Authentication = require('./util/authentication');
const { User } = require('./classes/User');
const { Model } = require('./classes/Model');
const fs = require('fs-extra');

console.log("Initializing...");
initSchema(true).then(async () => {
    console.log("Schema updated.");

    await fs.mkdirs('./static/uploads');

    // The public model is the accessible model that faces users when they are not logged in.
    const publicModel = new Model(null, false);
    const server = new ApolloServer({
        typeDefs: gqlSchema,
        resolvers: gqlResolvers,
        context: async ({req}) => {
            const response = {
                pool: pool,
                user: null,
                model: publicModel
            };

            const rcs_id = req.session.rcs_id;

            if(rcs_id) {
                const usr = await User.getUserFromEmail(rcs_id + '@rpi.edu')
                if(usr != null) {
                    response.user = usr;
                    response.model = new Model(usr, false);
                }
            }

            return response;
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
