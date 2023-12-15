import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Stream } from "./stream.entity";
import { CreateStreamInput } from "./dto/create-stream.input";
import { connect, Connection, ConsumeMessage } from "amqplib";
import { GraphQLUUID } from "graphql-scalars";
import { ConfigService } from "@nestjs/config";
import { Rule, RuleType } from "../../casl/rule.decorator";

@Resolver(() => Stream)
export class StreamResolver {
    private logger: Logger = new Logger("StreamResolver");

    private streams: Stream[] = [];
    private streamLastSeen: { [key: string]: number } = {};

    constructor(private readonly configService: ConfigService) {
        this.connectToRabbit(configService.get<string>("RABBITMQ_URL"), 10).then(async (client) => {
            const channel = await client.createChannel();
            // Create exclusive queue to be bound to the state exchange
            const queue = await channel.assertQueue("", { exclusive: true });
            await channel.assertExchange("video:state", "fanout", { durable: true });
            await channel.bindQueue(queue.queue, "video:state", "");

            await channel.consume(queue.queue, async (rmqMessage: ConsumeMessage | null) => {
                this.logger.verbose("Received message from RabbitMQ");
                if (!rmqMessage) {
                    return; // TODO throw error
                }

                const message = JSON.parse(rmqMessage.content.toString());

                if (message.id) {
                    const streamIndex = this.streams.findIndex((stream) => stream.id === message.id);
                    if (streamIndex !== -1) {
                        this.logger.verbose(`Updating stream ${message.id}`);
                        this.streams[streamIndex] = message;
                    } else {
                        this.logger.verbose(`Adding stream ${message.id}`);
                        this.streams.push(message);
                        this.streams.sort((a, b) => a.id.localeCompare(b.id));
                    }
                    this.streamLastSeen[message.id] = Date.now();
                }
            });
        });

        // Periodically clear dead streams from list of streams
        setInterval(() => {
            this.logger.verbose("Sweeping list of streams");
            for (let i = 0; i < this.streams.length; i++) {
                const stream = this.streams[i];
                // Delete after 5 minutes instead of 10 seconds as a temporary partial fix for the issue where streams are still
                //  running after the "from" location has stopped sending data.
                if (!this.streamLastSeen[stream.id] || Date.now() - this.streamLastSeen[stream.id] > 300000) {
                    this.logger.verbose(`Deleting stream ${stream.id} from list of streams`);
                    this.streams.splice(i, 1);
                    delete this.streamLastSeen[stream.id];
                    i--;
                }
            }
            this.logger.verbose("Done sweeping list of streams");
        }, 10000);
    }

    /**
     * Connect to RabbitMQ and retry if connection fails. Retries every 5 seconds.
     * @param url RabbitMQ URL to connect to
     * @param retries Number of times to retry
     * @throws Error if connection still fails after all retries.
     */
    private async connectToRabbit(url: string, retries: number): Promise<Connection> {
        let client;
        for (let i = 0; i < retries; i++) {
            try {
                client = await connect(url);
                break;
            } catch (err) {
                console.log("Error connecting to RabbitMQ, retrying in 5 seconds");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        if (!client) {
            throw new Error("Could not connect to RabbitMQ");
        }
        return client;
    }

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Stream], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Stream)
    async findManyStream(
        @Context() ctx: { req: Request },
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Stream[]> {
        this.logger.verbose("findManyStream resolver called");

        const cursorIndex = this.streams.findIndex((stream) => stream.id === pagination?.cursor);
        const take = pagination?.take || 20;
        const skip = pagination?.skip || 0;

        const start = (cursorIndex === -1 ? 0 : cursorIndex) + skip;
        const end = start + take;

        return this.streams.slice(start, end);
    }

    @Query(() => Stream, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Stream)
    async findOneStream(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLUUID }) id: string
    ): Promise<Stream> {
        this.logger.verbose("findOneStream resolver called");
        return this.streams.find((stream) => stream.id === id);
    }

    @Mutation(() => Stream, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Stream)
    async createStream(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateStreamInput }) input: CreateStreamInput
    ): Promise<Stream> {
        this.logger.verbose("createStream resolver called");
        input = plainToClass(CreateStreamInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const newStream = { id: null, message: null, from: input.from, to: input.to };

        const client = await connect(this.configService.get<string>("RABBITMQ_URL"));
        const channel = await client.createChannel();

        await channel.assertQueue("video:control:start", { durable: true });
        channel.sendToQueue("video:control:start", Buffer.from(JSON.stringify(newStream)));

        await channel.close();
        await client.close();

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: newStream,
            subject: "Stream"
        });

        return newStream;
    }

    @Mutation(() => Stream, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Stream)
    async deleteStream(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLUUID }) id: string
    ): Promise<Stream> {
        this.logger.verbose("deleteStream resolver called");

        const streamToDelete = this.streams.find((stream) => stream.id === id);

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Stream", streamToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const client = await connect(this.configService.get<string>("RABBITMQ_URL"));
        const channel = await client.createChannel();

        // Intentionally don't assert queue here, because we don't want to create it if it doesn't exist
        channel.sendToQueue("video:control:" + id, Buffer.from("stop"));
        await channel.close();
        await client.close();

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: streamToDelete,
            subject: "Stream"
        });

        return streamToDelete;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Stream)
    async streamCount(): Promise<number> {
        return this.streams.length;
    }
}
