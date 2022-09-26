import dotenv from "dotenv";

dotenv.config();

import express, { Express } from "express";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import https from "https";
import http from "http";
import * as ip from "ip";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer, YogaNodeServerInstance } from "@graphql-yoga/node";

import { prisma } from "./prisma";
import { GlimpseAbility, GraphQLContext, TrustProxyOption } from "custom";
import { getPermissions } from "./permissions";
import { PrismaAbility } from "@casl/prisma";
import { loadFiles } from "@graphql-tools/load-files";
import { authDirective } from "./directives/Auth";
import { nonNullDirective } from "./directives/NonNull";
import {
    DateTimeResolver,
    EmailAddressResolver,
    JSONObjectResolver,
} from "graphql-scalars";
import {
    generateCrudResolvers,
    relationalIdWriteTransformer,
} from "./CrudGenerator";
import { logger } from "./logger";
import { assertValidPassword, PASSWORD_HASH_OPTIONS } from "./utils";
import { hash } from "argon2";
import { RawRuleOf } from "@casl/ability";

dotenv.config();

/**
 * Check whether this server should run in HTTPS mode or not.
 * @returns true if HTTPS environment variable is set and isn't equal to "false", otherwise returns false.
 */
function isHttps(): boolean {
    return !!process.env.HTTPS && process.env.HTTPS !== "false";
}

/**
 * Setup all the necessary middleware and listeners on an Express server.
 *   Note, this currently sets up the session, but it doesn't touch GraphQL context.
 *   Context items should generally be added to GraphQL server instead of the Express request.
 * @param expressServer Express server to add middleware to.
 */
async function setupExpressMiddleware(expressServer: Express): Promise<void> {
    // Enable CORS in development environments, as frontend and backend may be running on separate ports/hosts
    if (process.env.NODE_ENV === "development") {
        expressServer.use(cors({ origin: true, credentials: true }));
        console.log("App booted in development, enabling CORS");
    }

    // Create and add the middleware for sessions.
    const redisSessionStorageClient = createClient({
        legacyMode: true,
        url: process.env.REDIS_URL,
    });
    redisSessionStorageClient.connect().catch(console.error);
    expressServer.use(
        session({
            store: new (connectRedis(session))({
                client: redisSessionStorageClient,
                prefix: "glimpse-sess:",
            }),
            name: "glimpse-sess",
            cookie: {
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                secure: isHttps(),
            },
            secret: process.env.SESSION_SECRET ?? "",
            saveUninitialized: false,
            resave: false,
        })
    );

    // Serve GraphQL server
    expressServer.use("/graphql", await createGraphQLServer());
    // Serve static content
    expressServer.use("/", express.static("public"));
}

/**
 * Set up the context for the incoming request to the GraphQL server.
 * @param req Express Request
 * @param res Express Response
 */
async function setupGraphQLContext({
    req,
    res,
}: {
    req: Express.Request;
    res: Express.Response;
}): Promise<GraphQLContext> {
    let user;
    if (req.session.userId) {
        user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        user = user ?? undefined; // If null, set to undefined
    }
    if (!req.session.permissionJSON) {
        // Cast is required since string is not covariant with AbilityActions, but DB doesn't have AbilityActions enum.
        req.session.permissionJSON = <RawRuleOf<GlimpseAbility>[]>(
            await getPermissions(user)
        );
    }
    return {
        prisma,
        permissions: new PrismaAbility(req.session.permissionJSON),
        user,
        req,
    };
}

/**
 * Load the GraphQL schema from the filesystem.
 * @returns The GraphQL schema as a string
 */
async function loadGraphQLSchema(): Promise<string> {
    const file = await fs.readFile(path.join(__dirname, "schema.graphql"));
    return file.toString();
}

/**
 * Create an Express server/app instance with middleware. Express can be used for custom HTTP endpoints outside of
 *   GraphQL, as well as static file serving.
 * @param customTrustProxyValue Value to be set for the 'trust proxy' key in Express' key/value store. If you wish
 *   to not trust proxies, then this can be omitted.
 * @see http://expressjs.com/en/guide/behind-proxies.html
 */
async function createExpressServer(
    customTrustProxyValue?: TrustProxyOption
): Promise<Express> {
    const expressServer = express();
    // When behind an HTTP proxy server, the PROXIED environment variable can be passed to enable express to trust it.
    //   http://expressjs.com/en/guide/behind-proxies.html
    if (customTrustProxyValue !== undefined) {
        expressServer.set("trust proxy", customTrustProxyValue);
    }

    await setupExpressMiddleware(expressServer);
    return expressServer;
}

/**
 * Create the HTTP/HTTPS server. This takes care of determining what type of server to use and creates the correct
 *   instances, but it doesn't start the server. The server should not be started until all middleware has been added
 *   to the Express app.
 */
async function createHttpServer(expressServer: Express): Promise<http.Server> {
    if (isHttps()) {
        // If user set the HTTPS env variable to true, but didn't set the KEY and/or CERT paths, server can't start.
        if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
            throw new Error(
                "HTTPS is enabled but the environment variable(s) HTTPS_KEY_PATH and/or HTTPS_CERT_PATH were not set."
            );
        }
        const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
        const cert = fs.readFileSync(process.env.HTTPS_CERT_PATH);

        return https.createServer(
            {
                key: privateKey,
                cert: cert,
            },
            expressServer
        );
    } else {
        return http.createServer(expressServer);
    }
}

/**
 * Create a GraphQL server, which can either be ran independently or put on top of an Express server as middleware.
 */
async function createGraphQLServer(): Promise<
    YogaNodeServerInstance<
        { req: Express.Request; res: Express.Response },
        GraphQLContext,
        {}
    >
> {
    // Create schema from resolver functions & graphql.schema file
    let schema = makeExecutableSchema({
        typeDefs: await loadGraphQLSchema(),
        resolvers: [
            ...(await loadFiles("src/resolvers/**/*.ts")),
            { JSONObject: JSONObjectResolver },
            { DateTime: DateTimeResolver },
            { EmailAddress: EmailAddressResolver },
            generateCrudResolvers("AccessLog", {
                findMany: true,
                findOne: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                    },
                },
                relations: ["user"],
            }),
            generateCrudResolvers("AlertLog", {
                findMany: true,
                findOne: true,
                create: true,
            }),
            generateCrudResolvers("Asset", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        parentId: relationalIdWriteTransformer("Asset"),
                        lastKnownHandlerId:
                            relationalIdWriteTransformer("User"),
                    },
                },
                relations: ["children", "parent", "lastKnownHandler"],
            }),
            generateCrudResolvers("AuditLog", {
                findMany: true,
                findOne: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                    },
                },
                relations: ["user"],
            }),
            generateCrudResolvers("BlogPost", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        authorId: relationalIdWriteTransformer("Person"),
                    },
                },
                relations: ["author"],
            }),
            generateCrudResolvers("Category", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        parentId: relationalIdWriteTransformer("Category"),
                    },
                },
                relations: ["children", "productions", "parent"],
            }),
            generateCrudResolvers("ContactSubmissionAssignee", {
                findMany: true,
                findOne: true,
                create: true,
                delete: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                        submissionId:
                            relationalIdWriteTransformer("ContactSubmission"),
                    },
                },
                relations: ["user", "submission"],
            }),
            generateCrudResolvers("ContactSubmission", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                relations: ["assignees"],
            }),
            generateCrudResolvers("Credit", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        personId: relationalIdWriteTransformer("Person"),
                        productionId:
                            relationalIdWriteTransformer("Production"),
                    },
                },
                relations: ["person", "production"],
            }),
            generateCrudResolvers("GroupPermission", {
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        groupId: relationalIdWriteTransformer("Group"),
                    },
                },
                relations: ["group"],
            }),
            generateCrudResolvers("Group", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        parentId: relationalIdWriteTransformer("Group"),
                    },
                },
                relations: ["permissions", "children", "users", "parent"],
            }),
            generateCrudResolvers("Image", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                relations: ["people", "imageFor", "thumbnailFor"],
            }),
            generateCrudResolvers("Person", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                relations: ["images", "blogPosts", "credits", "roles", "users"],
            }),
            generateCrudResolvers("PersonImage", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        personId: relationalIdWriteTransformer("Person"),
                    },
                },
                relations: ["person"],
            }),
            generateCrudResolvers("ProductionImage", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        imageId: relationalIdWriteTransformer("Image"),
                        productionId:
                            relationalIdWriteTransformer("Production"),
                    },
                },
                relations: ["image", "production"],
            }),
            generateCrudResolvers("ProductionRSVP", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                        productionId:
                            relationalIdWriteTransformer("Production"),
                    },
                },
                relations: ["user", "production"],
            }),
            generateCrudResolvers("ProductionTag", {
                findOne: true,
                create: true,
                delete: true,
                transformers: {
                    write: {
                        productionId:
                            relationalIdWriteTransformer("Production"),
                    },
                },
                relations: ["production"],
            }),
            generateCrudResolvers("ProductionVideo", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        productionId:
                            relationalIdWriteTransformer("Production"),
                        videoId: relationalIdWriteTransformer("Video"),
                    },
                },
                relations: ["production", "video"],
            }),
            generateCrudResolvers("Production", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        categoryId: relationalIdWriteTransformer("Category"),
                        thumbnailId: relationalIdWriteTransformer("Image"),
                    },
                },
                relations: [
                    "images",
                    "rsvps",
                    "tags",
                    "videos",
                    "category",
                    "thumbnail",
                ],
            }),
            generateCrudResolvers("Redirect", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
            }),
            generateCrudResolvers("Role", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        personId: relationalIdWriteTransformer("Person"),
                    },
                },
                relations: ["person"],
            }),
            generateCrudResolvers("UserGroup", {
                findOne: true,
                create: true,
                delete: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                        groupId: relationalIdWriteTransformer("Group"),
                    },
                },
                relations: ["user", "group"],
            }),
            generateCrudResolvers("UserPermission", {
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        userId: relationalIdWriteTransformer("User"),
                    },
                },
                relations: ["user"],
            }),
            generateCrudResolvers("User", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        personId: relationalIdWriteTransformer("Person"),
                        password: async (value) => {
                            if (!value) {
                                return value;
                            }
                            try {
                                assertValidPassword(value);
                            } catch (e) {
                                throw e;
                            }
                            return await hash(value, PASSWORD_HASH_OPTIONS);
                        },
                    },
                },
                relations: [
                    "person",
                    "permissions",
                    "groups",
                    "accessLogs",
                    "auditLogs",
                    "assignedContactSubmissions",
                    "productionRsvps",
                    "voteResponses",
                    "checkedOutAssets",
                ],
            }),
            generateCrudResolvers("Video", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                relations: ["videoFor"],
            }),
            generateCrudResolvers("VoteResponse", {
                findOne: true,
                create: true,
                update: true,
                delete: true,
                transformers: {
                    write: {
                        voteId: relationalIdWriteTransformer("Vote"),
                        userId: relationalIdWriteTransformer("User"),
                    },
                },
                relations: ["vote", "user"],
            }),
            generateCrudResolvers("Vote", {
                findMany: true,
                findOne: true,
                create: true,
                update: true,
                delete: true,
                relations: ["responses"],
            }),
        ],
    });

    // Apply directives. The order here matters. Faster operations should be done first (e.g. non-null comes before
    //    auth). This way, if the faster operation fails, we save time that would've been spent on slower directives.
    schema = authDirective("Auth")(schema);
    schema = nonNullDirective("NonNull")(schema);

    // Create server based on schema
    return createServer({
        schema,
        context: setupGraphQLContext,
    });
}

/**
 * Start the API server. There is no guarantee that this will work if called more than once.
 */
async function main(): Promise<void> {
    // Enforce that some environment variables are set
    if (!process.env.DATABASE_URL) {
        throw new Error(
            "DATABASE_URL environment variable not set. This is required."
        );
    }
    if (!process.env.SESSION_SECRET) {
        throw new Error(
            "SESSION_SECRET environment variable not set. This is required."
        );
    }
    if (!process.env.REDIS_URL) {
        throw new Error(
            "REDIS_URL environment variable not set. This is required."
        );
    }
    if (!process.env.RABBITMQ_URL) {
        throw new Error(
            "RABBITMQ_URL environment variable not set. This is required."
        );
    }
    if (!process.env.NODE_ENV) {
        console.warn("NODE_ENV not set. Defaulting to production.");
        process.env.NODE_ENV = "production";
    }

    // If PROXIED environment variable is set and isn't equal to "false", then trust one layer of proxy.
    const trustProxyOption =
        !!process.env.PROXIED && process.env.PROXIED !== "false"
            ? 1
            : undefined;

    // Create the three servers this app uses. Note, express isn't an actual server with it's own port. It is just
    //   middleware on top of the HTTP server.
    const expressServer = await createExpressServer(trustProxyOption);
    const httpServer = await createHttpServer(expressServer);

    const port = parseInt(process.env.PORT ?? "4000");
    const host = "0.0.0.0";

    httpServer.listen({ port, host }, () => {
        const localIp = ip.address();
        const protocol = httpServer instanceof https.Server ? "https" : "http";
        console.log(
            "\n🎥 Glimpse GraphQL API is now running.\n" +
                `\tLocal: \t ${protocol}://localhost:${port}/\n` +
                `\tRemote:\t ${protocol}://${localIp}:${port}/\n`
        );

        if (process.env.NODE_ENV !== "development" && !isHttps()) {
            console.warn(
                "Server is running without HTTPS outside of development. This is not recommended."
            );
        }
    });
}

main()
    .catch((e) => {
        logger.fatal(e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
