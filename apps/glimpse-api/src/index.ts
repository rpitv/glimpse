import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { ApolloServer } from "apollo-server-express";
import * as fs from "fs-extra";
import cors from "cors";

import { GlimpseRequest } from "./GlimpseRequest";
const { initSchema } = require('./util/postgres-init');
const gqlSchema = require('./schema');
const gqlResolvers = require('./resolvers');
const { pool } = require('./util/db-pool');
const Authentication = require('./util/authentication');
const { User } = require('./classes/User');
const { Model } = require('./classes/Model');

const pgSession = connectPgSimple(session);

console.log("Initializing...");
initSchema(true).then(async (): Promise<void> => {
    console.log("Schema updated.");

    await fs.mkdirs('./static/uploads');

    // The public model is the accessible model that faces users when they are not logged in.
    const publicModel = new Model(null, false);
    const server = new ApolloServer({
        typeDefs: gqlSchema,
        resolvers: gqlResolvers,
        csrfPrevention: true,
        context: async (ctx: { req: GlimpseRequest }) => {
            const response = {
                pool: pool,
                user: null,
                model: publicModel
            };

            const rcs_id = ctx.req.session?.rcs_id;

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

    if(process.env.NODE_ENV === "development") {
        expApp.use(cors());
        console.log("App booted in development, enabling CORS");
    }

    expApp.use(session({
        store: new pgSession({
            pool: pool
        }),
        secret: process.env.COOKIE_SECRET ?? "",
        cookie: {
            maxAge: 604800000, // 7 days
            secure: process.env.NODE_ENV === "production"
        },
        resave: false,
        saveUninitialized: false
    }));

    expApp.use(express.urlencoded({ extended: true }));
    expApp.use(express.json());
    expApp.use(express.raw());

    server.applyMiddleware({ app: expApp });

    expApp.use('/static', express.static('static'));
    expApp.use('/auth/login', Authentication.LoginRouter);
    expApp.use('/auth/sync', Authentication.SyncRouter);
    expApp.use('/auth/logout', Authentication.LogoutRouter);

    expApp.listen({port: process.env.PORT || 4000, host: '0.0.0.0'}, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`);
    });

}).catch((err: Error) => console.error(err.stack));
