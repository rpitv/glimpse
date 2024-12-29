import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {RabbitMQService} from "../../amqp/rabbitmq.service";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class ProductionRSVPRpcService implements OnModuleInit {
    private logger = new Logger("ProductionRSVPRpcService");

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly prismaService: PrismaService
    ) {}

    onModuleInit(): void {
        (async () => {
            await this.addUpdateUserVolunteerStatusHandler()
        })().catch((err: Error) => {
            this.logger.error("Failed to add Production RSVP RPC handlers: " + err);
        })
    }

    private async addUpdateUserVolunteerStatusHandler() {
        return this.rabbitMQService.addRpcHandler('updateUserVolunteerStatus', async (data: {
            discordUserId: string,
            productionId: string,
            status: boolean,
            notes?: string | null
        }) => {
            if(typeof data?.productionId !== "string") {
                throw new Error('Invalid input: must be object with productionId string')
            }
            if(typeof data?.discordUserId !== "string") {
                throw new Error('Invalid input: must be object with discordUserId string')
            }
            if(typeof data?.status !== "boolean") {
                throw new Error('Invalid input: must be object with status boolean')
            }
            if(typeof data?.notes !== "string" && data?.notes !== null && data?.notes !== undefined) {
                throw new Error('Invalid input: must be object with notes string/null/undefined')
            }

            const user = await this.prismaService.user.findFirst({
                where: {
                    discord: data.discordUserId,
                },
                select: {
                    id: true
                }
            })
            if(!user) {
                throw new Error(`User Error: You must register an account using the \`/register\` command before volunteering for a production.`)
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

            const statusString = data.status ? "yes" : "no";

            const existingRSVP = await this.prismaService.productionRSVP.findFirst({
                where: {
                    userId: user.id,
                    productionId: production.id
                },
                select: {
                    id: true
                }
            })
            if(existingRSVP) {
                await this.prismaService.productionRSVP.update({
                    where: {
                        id: existingRSVP.id
                    },
                    data: {
                        willAttend: statusString,
                        notes: data.notes
                    }
                })
            } else {
                await this.prismaService.productionRSVP.create({
                    data: {
                        userId: user.id,
                        productionId: production.id,
                        willAttend: statusString,
                        notes: data.notes
                    }
                })
            }
        })
    }

    public async getProductionRSVPList(productionId: bigint, prisma?: Omit<PrismaService, "$on" | "$connect" | "$disconnect" | "$use" | "$transaction">) {
        if(!prisma) {
            prisma = this.prismaService
        }
        return prisma.productionRSVP.findMany({
            where: {
                productionId: productionId,
            },
            select: {
                productionId: true,
                userId: true,
                willAttend: true,
                notes: true
            }
        })
    }

}
