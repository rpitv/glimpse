import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {RabbitMQService} from "../../amqp/rabbitmq.service";
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserRpcService implements OnModuleInit {
    private logger = new Logger("UserRpcService");

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit(): void {
        (async () => {
            await this.addGetUserFromDiscordIdHandler();
            await this.addGetUserFromUserIdHandler();
            await this.addRegisterUserHandler();
        })().catch((err: Error) => {
            this.logger.error("Failed to add User RPC handlers: " + err);
        })
    }

    private async addGetUserFromDiscordIdHandler() {
        return this.rabbitMQService.addRpcHandler('getUserFromDiscordId', async (data: {discordUserId: string}) => {
            if(typeof data?.discordUserId !== "string") {
                throw new Error('Invalid input: must be object with discordUserId string')
            }
            const out = await this.prismaService.user.findFirst({
                where: {
                    discord: data.discordUserId,
                },
                select: {
                    id: true
                }
            })
            if(!out) {
                return null
            }
            return this.getUserData(out.id);
        })
    }

    private async addGetUserFromUserIdHandler() {
        return this.rabbitMQService.addRpcHandler('getUserFromUserId', async (data: {userId: string}) => {
            if(typeof data?.userId !== "string") {
                throw new Error('Invalid input: must be object with userId string')
            }
            return this.getUserData(BigInt(data.userId));
        })
    }

    private async addRegisterUserHandler() {
        return this.rabbitMQService.addRpcHandler('registerUser', async (data: { discordUserId: string, username: string, email: string }) => {
            if(typeof data?.discordUserId !== "string") {
                throw new Error('Invalid input: must be object with discordUserId string')
            }
            if(typeof data?.username !== "string") {
                throw new Error('Invalid input: must be object with username string')
            }
            if(typeof data?.email !== "string") {
                throw new Error('Invalid input: must be object with email string')
            }

            if(data.username.match(/^[a-z][-a-z0-9]{0,7}$/) === null) {
                throw new Error('User Error: Username must be alphanumeric lowercase, start with a letter, and be one to eight characters long.')
            }
            if(data.email.length > 300 || data.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) === null) {
                throw new Error('User Error: Invalid email address')
            }

            const existingDiscordUser = await this.prismaService.user.findFirst({
                where: {
                    discord: data.discordUserId,
                }
            })
            if(existingDiscordUser) {
                throw new Error(`User Error: You already have an RPI TV account. Log in at ${this.configService.get<string>("WEB_URL")}/login.`)
            }

            const existingUsernameOrEmail = await this.prismaService.user.findFirst({
                where: {
                    OR: [
                        {
                            username: data.username,
                        },
                        {
                            mail: data.email,
                        }
                    ]
                }
            })
            if(existingUsernameOrEmail) {
                throw new Error('User Error: An account with that username or email already exists.')
            }

            const user = await this.prismaService.user.create({
                data: {
                    username: data.username,
                    mail: data.email,
                    discord: data.discordUserId,
                    groups: {
                        create: {
                            group: {
                                connect: {
                                    id: 2
                                }
                            }
                        }
                    },
                },
                select: {
                    id: true
                }
            })

            return this.getUserData(user.id)
        })
    }

    public async getUserData(userId: bigint, prisma?: Omit<PrismaService, "$on" | "$connect" | "$disconnect" | "$use" | "$transaction">) {
        if(!prisma) {
            prisma = this.prismaService;
        }
        const raw = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                id: true,
                username: true,
                mail: true,
                discord: true,
                personId: true,
                person: {
                    select: {
                        name: true,
                        graduation: true,
                        roles: {
                            select: {
                                id: true,
                                role: {
                                    select: {
                                        name: true,
                                        displayInLeadership: true,
                                        displayInMembership: true
                                    }
                                }
                            },
                            where: {
                                AND: [
                                    {
                                        startTime: {
                                            lte: new Date(),
                                        }
                                    },
                                    {
                                        OR: [
                                            {
                                                endTime: {
                                                    gte: new Date(),
                                                },
                                            },
                                            {
                                                endTime: null
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        })

        if(!raw) {
            return null;
        }

        const out: any = {
            id: raw.id,
            username: raw.username,
            mail: raw.mail,
            discord: raw.discord,
            personId: raw.personId
        }

        if(raw.personId) {
            out.personName = raw.person.name
            out.personGraduation = raw.person.graduation
            out.personCurrentRoles = []

            for(const role of raw.person.roles) {
                out.personCurrentRoles.push({
                    id: role.id,
                    name: role.role.name,
                    isLeadership: role.role.displayInLeadership,
                    isMembership: role.role.displayInMembership
                })
            }
        }

        return out;
    }

}
