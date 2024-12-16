import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";
import {GlimpseApiEvents, GlimpseApiInterface} from "./GlimpseApiInterface";

export class MockGlimpseApi extends TypedEmitter<GlimpseApiEvents> implements GlimpseApiInterface {
    private mockData = {
        productions: [
            {   id: 14n, // Production with full data
                name: "RPI Men's Hockey vs. Union College",
                description: "RPI Engineers play Union Garnet Chargers in the Houston Field House.",
                closetTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                startTime: new Date(Date.now() + 1 * 26 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 1 * 29 * 60 * 60 * 1000),
                closetLocation: "RPI TV Office",
                eventLocation: "Houston Field House",
                categoryId: 5n,
                teamNotes: "There will be a team picture after the game. Please wear your RPI TV shirts!\n\nFood will be served.",
                useDiscord: true
            },
            {   id: 15n, // Production with only start time
                name: "RMA Family Weekend Concert - Fall 2024",
                startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 16n, // Production with only end and closet times
                name: "RPI Football vs. Hobart College",
                endTime: new Date(Date.now() + 2 * 29 * 60 * 60 * 1000),
                closetTime: new Date(Date.now() + 2 * 31 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 17n, // Production that doesn't use Discord
                name: "RPI Phalanx Taping Ceremony",
                startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                useDiscord: false
            },
            {   id: 18n, // Production that just ended
                name: "RPI Women's Soccer vs. St. Lawrence University",
                startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 19n, // Production that started over 24 hours ago with no end date
                name: "Rensselyrics Spring Invitational",
                startTime: new Date(Date.now() - 1 * 25 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 20n, // Production that started less than 24 hours ago with no end date
                name: "RPI ACHA Hockey vs. University of Massachusetts Amherst",
                startTime: new Date(Date.now() - 1 * 23 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 21n, // Production that's ongoing
                name: "RPI Men's Lacrosse vs. Union College",
                startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 22n, // Multi-day production that's ongoing
                name: "RPI Women's Lacrosse vs. RIT",
                startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                useDiscord: true
            },
            {   id: 23n, // Production that's over two weeks in advance
                name: "RPI President Town Hall - Fall 2024",
                startTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
                useDiscord: true
            }
        ],
        productionTags: [
            {
                id: 1039n,
                productionId: 14n,
                name: "hockey"
            },
            {
                id: 1040n,
                productionId: 14n,
                name: "men's hockey"
            },
            {
                id: 1041n,
                productionId: 14n,
                name: "union"
            },
            {
                id: 1042n,
                productionId: 15n,
                name: "rma"
            }
        ],
        categories: [
            {
                id: 2n,
                name: "Sports"
            },
            {
                id: 3n,
                name: "Clubs"
            },
            {
                id: 4n,
                name: "Ice Hockey",
                parentId: 2n
            },
            {
                id: 5n,
                name: "Men's Ice Hockey",
                parent: 4n
            },
            {
                id: 6n,
                name: "Women's Ice Hockey",
                parent: 4n
            }
        ],
        users: [
            {
                id: 70n,
                username: "smithj7",
                mail: "spam@example.com",
                personId: 42n
            },
            {
                id: 71n,
                username: "thomar2",
                mail: "spam2@example.com",
                personId: 41n,
                discord: "459401844196769813"
            },
            {
                id: 73n,
                username: "kohlb3",
                mail: "spam4444@example.com",
                discord: "972913103480168448"
            }
        ],
        people: [
            {
                id: 39n,
                name: "Marty Byrde",
                pronouns: "he/him",
                graduation: new Date("1994-05-15T00:00:00.000Z"),
                description: "Professional financial advisor"
            },
            {
                id: 41n,
                name: "Rue Thomas",
                pronouns: "she/her",
                graduation: new Date("2025-05-15T00:00:00.000Z")
            },
            {
                id: 42n,
                name: "Jane Smith",
                pronouns: "she/her",
                graduation: new Date("2023-05-15T00:00:00.000Z"),
                description: "Hello!!!!"
            },
        ],
        personRoles: [
            {
                id: 1385n,
                personId: 39n,
                roleId: 15n,
                startTime: new Date("2020-09-01T00:00:00.000Z"),
                endTime: new Date("2020-12-31T00:00:00.000Z"),
            },
            {
                id: 1386n,
                personId: 39n,
                roleId: 14n,
                startTime: new Date("2020-12-31T00:00:00.000Z"),
                endTime: new Date("2021-12-31T00:00:00.000Z"),
            },
            {
                id: 1389n,
                personId: 41n,
                roleId: 18n,
                startTime: new Date("2022-09-01T00:00:00.000Z"),
                endTime: new Date(Date.now() + 31_556_952_000),
            },
            {
                id: 1390n,
                personId: 41n,
                roleId: 17n,
                startTime: new Date("2023-09-01T00:00:00.000Z")
            },
            {
                id: 1387n,
                personId: 42n,
                roleId: 18n,
                startTime: new Date("2019-09-01T00:00:00.000Z"),
                endTime: new Date("2023-12-31T00:00:00.000Z"),
            },
            {
                id: 1388n,
                personId: 42n,
                roleId: 19n,
                startTime: new Date("2023-12-31T00:00:00.000Z"),
            },
        ],
        roles: [
            {
                id: 14n,
                name: "President",
                displayInLeadership: true,
                displayInMembership: false
            },
            {
                id: 15n,
                name: "Vice President",
                displayInLeadership: true,
                displayInMembership: false
            },
            {
                id: 17n,
                name: "Secretary",
                displayInLeadership: true,
                displayInMembership: false
            },
            {
                id: 18n,
                name: "Member",
                displayInLeadership: false,
                displayInMembership: true
            },
            {
                id: 19n,
                name: "Alumni Member",
                displayInLeadership: false,
                displayInMembership: true
            },
            {
                id: 20n,
                name: "Associate",
                displayInLeadership: false,
                displayInMembership: false
            }
        ]
    }

    public getUserFromUserId(userId: BigInt): Promise<ApiResponse<User | null>> {
        throw new Error("Not implemented");
    }

    public getUserFromDiscordId(discordUserId: string): Promise<ApiResponse<User | null>> {
        throw new Error("Not implemented");
    }

    public registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>> {
        throw new Error("Not implemented");
    }

    public updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public setProductionDiscordData(productionId: BigInt, data: Record<string, any>): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        throw new Error("Not implemented");
    }

    public getProductionData(productionId: BigInt): Promise<ApiResponse<Production | null>> {
        throw new Error("Not implemented");
    }
}
