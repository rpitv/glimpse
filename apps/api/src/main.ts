import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import { AppModule } from "./app.module";
import * as connectRedis from "connect-redis";
import * as passport from "passport";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { Logger, LogLevel } from "@nestjs/common";
import {RedisModule} from "./redis/redis.module";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
BigInt.prototype["toJSON"] = function () {
    return this.toString();
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["log", "warn", "error"]
    });

    const configService = app.get(ConfigService);
    const redis = app.select(RedisModule).get('REDIS_CLIENT')

    // Joi asserts that LOG_LEVELS are all valid LogLevels.
    const logLevels = configService.get<string>("LOG_LEVELS").split(",");
    app.useLogger(logLevels as LogLevel[]);

    const logger = new Logger("Main");

    app.set("trust proxy", configService.get<string | number | boolean>("TRUST_PROXY"));
    console.log(configService.get("TRUST_PROXY"), typeof configService.get("TRUST_PROXY"))

    app.use(cookieParser());

    const RedisSessionStore = connectRedis(session);
    app.use(
        session({
            store: new RedisSessionStore({
                client: redis,
                prefix: `${configService.get<string>("SESSION_NAME")}:`
            }),
            name: configService.get<string>("SESSION_NAME"),
            cookie: {
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                secure: configService.get<boolean>("HTTPS")
            },
            secret: configService.get<string>("SESSION_SECRET"),
            saveUninitialized: false,
            resave: false
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(configService.get<number>("PORT"));
    logger.log(`Listening on port ${configService.get<number>("PORT")}`);
    if (!configService.get("POSTGRES_PASSWORD")) {
        logger.warn(
            "POSTGRES_PASSWORD environment variable not detected. This application does not require this " +
                "variable, but PostgreSQL Docker containers do."
        );
    }

    if (
        !configService.get<boolean>("HTTPS") &&
        ["production", "staging"].includes(configService.get<string>("NODE_ENV"))
    ) {
        logger.warn(
            `HTTPS should be enabled in ${configService.get<string>("NODE_ENV")}. This is a security risk.` +
                `Set the HTTPS environment variable to true to enable HTTPS.`
        );
    }
}

bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
});
