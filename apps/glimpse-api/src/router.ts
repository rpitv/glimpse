import express, {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import {buildSchema} from "type-graphql";
import {auth} from "./auth";

async function getRouter(): Promise<Router> {
    const router = express.Router();

    router.use('/graphql',
        graphqlHTTP(async (req) => {
            return {
                schema: await buildSchema({
                    resolvers: [__dirname + "/resolvers/**/*.ts"],
                    validate: false,
                    authChecker: auth
                }),
                context: req
            }
        }))

    return router;
}

export { getRouter };
