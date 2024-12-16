import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";
import {GlimpseApiEvents, GlimpseApiInterface} from "./GlimpseApiInterface";

export class MockGlimpseApi extends TypedEmitter<GlimpseApiEvents> implements GlimpseApiInterface {
    private mockData = {
        productions: [
            {   id: 14n,
                name: "RPI Men's Hockey vs. Union College",
                description: "RPI Engineers play Union Garnet Chargers in the Houston Field House.",
                closetTime: new Date("2024-10-01T20:00:00.000Z"),
                startTime: new Date("2024-10-01T22:00:00.000Z"),
                endTime: new Date("2024-10-02T03:00:00.000Z"),
                closetLocation: "RPI TV Office",
                eventLocation: "Houston Field House",
                teamNotes: "There will be a team picture after the game. Please wear your RPI TV shirts!\n\nFood will be served.",
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
                id: 1039n,
                productionId: 14n,
                name: "men's hockey"
            },
            {
                id: 1039n,
                productionId: 14n,
                name: "union"
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
                endTime: new Date("2025-12-31T00:00:00.000Z"),
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
