import {Logger, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {createClient} from "redis";

const redisServiceProvider = {
    provide: 'REDIS_CLIENT',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const logger = new Logger("RedisClientProvider");
        const client = createClient({
            url: configService.get<string>("REDIS_URL")
        })
        await client.connect().catch((e) => {
            logger.error(e);
        })
        logger.log("Redis client connected")
        return client;
    }
}

@Module({
    providers: [redisServiceProvider],
    imports: [ConfigModule],
    exports: ['REDIS_CLIENT']
})
export class RedisModule {}
