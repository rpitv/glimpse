import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {RabbitMQService} from "../../amqp/rabbitmq.service";
import {PrismaService} from "../../prisma/prisma.service";
import {ProductionRSVPRpcService} from "../production_rsvp/production_rsvp_rpc.service";

@Injectable()
export class ProductionRpcService implements OnModuleInit {
    private logger = new Logger("ProductionRpcService");

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly prismaService: PrismaService,
        private readonly productionRsvpRpcService: ProductionRSVPRpcService
    ) {}

    onModuleInit(): void {
        (async () => {
            await this.addGetProductionDataHandler();
            await this.addSetProductionDiscordDataHandler();
            await this.addGetLatestProductionsHandler();
        })().catch((err: Error) => {
            this.logger.error("Failed to add Production RPC handlers: " + err);
        })
    }

    private async addGetProductionDataHandler() {
        return this.rabbitMQService.addRpcHandler('getProductionData', async (data: {productionId: string}) => {
            if(typeof data?.productionId !== "string") {
                throw new Error('Invalid input: must be object with productionId string')
            }

            return this.getProductionData(BigInt(data.productionId));
        })
    }

    private async addSetProductionDiscordDataHandler() {
        return this.rabbitMQService.addRpcHandler('setProductionDiscordData', async (data: {productionId: string, data: Record<string, any>}) => {
            if(typeof data?.productionId !== "string") {
                throw new Error('Invalid input: must be object with productionId string')
            }
            if(typeof data?.data !== "object" || data?.data === null) {
                throw new Error('Invalid input: must be object with data object')
            }

            const production = await this.prismaService.production.findFirst({
                where: {
                    id: BigInt(data.productionId),
                },
                select: {
                    id: true
                }
            })
            if(!production) {
                throw new Error(`Production with ID ${data.productionId} not found`)
            }

            await this.prismaService.production.update({
                data: {
                    discordData: JSON.stringify(data)
                },
                where: {
                    id: BigInt(data.productionId)
                }
            })

            return null;
        })
    }

    private async addGetLatestProductionsHandler() {
        return this.rabbitMQService.addRpcHandler('getLatestProductions', async () => {
            const oneDayAgo = new Date(Date.now() - 86_400_000);
            const rawProductions = await this.prismaService.production.findMany({
                where: {
                    useDiscord: true,
                    OR: [
                        {
                            endTime: {
                                gte: oneDayAgo
                            }
                        },
                        {
                            endTime: null,
                            startTime: {
                                gte: oneDayAgo
                            }
                        },
                        {
                            endTime: null,
                            startTime: null,
                            closetTime: {
                                gte: oneDayAgo
                            }
                        }
                    ]
                },
                select: {
                    id: true
                }
            })

            const productions: any[] = [];
            for(const rawProduction of rawProductions) {
                productions.push(await this.getProductionData(rawProduction.id))
            }

            return productions;
        })
    }

    public async getProductionData(productionId: bigint) {
        const raw = await this.prismaService.production.findFirst({
            where: {
                id: productionId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                startTime: true,
                endTime: true,
                closetTime: true,
                closetLocation: true,
                eventLocation: true,
                teamNotes: true,
                useDiscord: true,
                discordData: true,
                category: {
                    select: {
                        name: true
                    }
                },
                tags: {
                    select: {
                        tag: true
                    }
                }
            }
        })

        if(!raw) {
            return null;
        }

        const out: any = {
            id: raw.id,
            name: raw.name,
            description: raw.description,
            startTime: raw.startTime,
            endTime: raw.endTime,
            closetTime: raw.closetTime,
            closetLocation: raw.closetLocation,
            eventLocation: raw.eventLocation,
            teamNotes: raw.teamNotes,
            useDiscord: raw.useDiscord,
            discordData: raw.discordData,
            tags: [],
            rsvps: []
        }

        if(raw.category) {
            out.category = raw.category.name;
        }
        for(const tag of raw.tags) {
            out.tags.push(tag.tag);
        }

        out.rsvps = await this.productionRsvpRpcService.getProductionRSVPList(productionId);

        return out;
    }

}
