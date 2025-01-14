import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";
import {GlimpseApiEvents, GlimpseApiInterface} from "./GlimpseApiInterface";

export class MockGlimpseApi extends TypedEmitter<GlimpseApiEvents> implements GlimpseApiInterface {
    public mockData = {
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
            },
            {   id: 24n, // Production with only closet time
                name: "RPI Football vs. Hobart College",
                closetTime: new Date(Date.now() + 2 * 31 * 60 * 60 * 1000),
                useDiscord: true
            },
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
                discord: "301567061547548673"
            },
            {
                id: 73n,
                username: "kohlb3",
                mail: "spam4444@example.com",
                discord: "972913103480168448"
            }
        ],
        productionRsvps: [
            {
                id: 440n,
                productionId: 14n,
                userId: 71n,
                willAttend: "yes",
                notes: "I'm going to be late by 15 minutes!"
            },
            {
                id: 441n,
                productionId: 14n,
                userId: 72n,
                willAttend: "no"
            },
            {
                id: 442n,
                productionId: 15n,
                userId: 71n,
                willAttend: "yes"
            },
            {
                id: 443n,
                productionId: 15n,
                userId: 72n,
                willAttend: "yes"
            },
            {
                id: 444n,
                productionId: 16n,
                userId: 71n,
                willAttend: "no"
            },
            {
                id: 445n,
                productionId: 16n,
                userId: 72n,
                willAttend: "no",
                notes: "Sorry, I have an exam :("
            },
            {
                id: 446n,
                productionId: 17n,
                userId: 72n,
                willAttend: "yes",
                notes: "\n\n\n# This should not be a header!\n\n[this should not be a link!](https://google.com)\n\nThis should not be a tag! <@301567061547548673>"
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

    public async getUserFromUserId(userId: bigint): Promise<ApiResponse<User | null>> {
        const user = this.mockData.users.find(v => v.id === userId);
        if(!user) {
            return ApiResponse.fromObject({
                data: null
            })
        }

        const output: User = {
            id: user.id,
            username: user.username,
            mail: user.mail,
            discord: user.discord
        }

        if(!user.personId) {
            return ApiResponse.fromObject({
                data: output
            })
        }

        const person = this.mockData.people.find(v => v.id === user.personId);
        if(!person) {
            throw new Error(`Mock database constraint violation: Person with ID ${user.personId} does not exist.`)
        }
        output.personId = person.id;
        output.personName = person.name;
        output.personGraduation = person.graduation;
        output.personCurrentRoles = [];

        const personRoleEntries = this.mockData.personRoles.filter(v => v.personId === person.id)
        for(const personRoleEntry of personRoleEntries) {
            const roleIsActive = personRoleEntry.startTime < new Date() && (!personRoleEntry.endTime || personRoleEntry.endTime > new Date())
            if(roleIsActive) {
                const role = this.mockData.roles.find(v => v.id === personRoleEntry.roleId)
                if(!role) {
                    throw new Error(`Mock database constraint violation: Role with ID ${user.personId} does not exist.`)
                }

                output.personCurrentRoles.push({
                    id: role.id,
                    name: role.name,
                    isLeadership: role.displayInLeadership,
                    isMembership: role.displayInMembership
                })
            }
        }

        return ApiResponse.fromObject({
            data: output
        })
    }

    public async getUserFromDiscordId(discordUserId: string): Promise<ApiResponse<User | null>> {
        const user = this.mockData.users.find(v => v.discord === discordUserId);
        if(!user) {
            return ApiResponse.fromObject(null)
        }
        return this.getUserFromUserId(user.id)
    }

    public async registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>> {
        const discordUserExists = !!this.mockData.users.find(v => v.discord === discordUserId);
        if (discordUserExists) {
            return ApiResponse.fromObject({
                error: `User Error: You already have an account. You can log in with Discord at ${process.env.WEB_URL}/login.`
            })
        }
        const usernameExists = !!this.mockData.users.find(v => v.username === username);
        const emailExists = !!this.mockData.users.find(v => v.mail === email);
        if (usernameExists || emailExists) {
            return ApiResponse.fromObject({
                error: "User Error: An account with that username or email already exists. Contact an officer if you need help."
            })
        }

        const nextId = this.mockData.users.reduce((accumulator, current) => current.id > accumulator ? current.id : accumulator, 0n)
        const newUser = {
            id: nextId + 1n,
            username,
            mail: email,
            discord: discordUserId
        };

        this.mockData.users.push(newUser);
        return ApiResponse.fromObject({
            data: newUser
        })
    }

    public async updateUserVolunteerStatus(discordUserId: string, productionId: bigint, status: boolean, notes?: string | null): Promise<ApiResponse<void>> {
        const user = this.mockData.users.find(v => v.discord === discordUserId);
        if(!user) {
            return ApiResponse.fromObject({
                error: "User Error: You must create an account before you can volunteer for a production. Use the `/register` command."
            })
        }
        const userId = user.id;

        const production = this.mockData.productions.find(production => production.id === productionId)
        if(!production) {
            return ApiResponse.fromObject({
                error: `Production with ID ${productionId} does not exist.`
            })
        }

        let currentRsvp = this.mockData.productionRsvps.find(rsvp => rsvp.userId === userId && rsvp.productionId === productionId)
        if(!currentRsvp) {
            const nextId = this.mockData.productionRsvps.reduce((accumulator, current) => current.id > accumulator ? current.id : accumulator, 0n)
            currentRsvp = {
                id: nextId,
                productionId,
                userId,
                willAttend: status ? "yes" : "no"
            }
            this.mockData.productionRsvps.push(currentRsvp)
        }

        currentRsvp.willAttend = status ? "yes" : "no"
        if(notes === null) {
            currentRsvp.notes = undefined
        } else if(notes) {
            currentRsvp.notes = notes
        }

        return ApiResponse.fromObject(null);
    }

    public async setProductionDiscordData(productionId: bigint, data: Record<string, any>): Promise<ApiResponse<void>> {
        const production = this.mockData.productions.find(production => production.id === productionId);
        if(!production) {
            return ApiResponse.fromObject({
                error: `A production with ID ${productionId} could not be found.`
            })
        }
        (production as any).discordData = data;
        return ApiResponse.fromObject(null);
    }

    public async getLatestProductions(): Promise<ApiResponse<Production[]>> {
        const productions: Production[] = [];
        for(const production of this.mockData.productions) {
            const hasAtLeastOneDate = production.startTime || production.endTime || production.closetTime
            if(!production.useDiscord || !hasAtLeastOneDate) {
                continue;
            }

            const endTime: Date = production.endTime || production.startTime || production.closetTime;

            // If end time is greater than 24 hours ago
            if(endTime.getTime() > Date.now() - 86_400_000) {
                const transformedProductionData = await this.getProductionData(production.id);
                productions.push(transformedProductionData.getData() as Production)
            }
        }
        return ApiResponse.fromObject({
            data: productions
        })
    }

    public async getProductionData(productionId: bigint): Promise<ApiResponse<Production | null>> {
        const production = this.mockData.productions.find(production => production.id === productionId)
        if(!production) {
            return ApiResponse.fromObject({
                data: null
            })
        }

        const output: Production = {
            id: production.id,
            name: production.name,
            description: production.description,
            startTime: production.startTime,
            endTime: production.endTime,
            closetTime: production.closetTime,
            closetLocation: production.closetLocation,
            eventLocation: production.eventLocation,
            teamNotes: production.teamNotes,
            useDiscord: production.useDiscord,
            discordData: (production as any).discordData,
            tags: [],
            rsvps: []
        }

        if(production.categoryId) {
            const category = this.mockData.categories.find(v => v.id === production.categoryId);
            if(!category) {
                throw new Error(`Mock database constraint violation: Category with ID ${production.categoryId} does not exist.`)
            }
            output.category = category.name
        }

        this.mockData.productionTags.forEach(tag => {
            if(tag.productionId === production.id) {
                output.tags.push(tag.name)
            }
        })

        this.mockData.productionRsvps.forEach(rsvp => {
            if(rsvp.productionId === production.id) {
                output.rsvps.push({
                    productionId: rsvp.productionId,
                    userId: rsvp.userId,
                    willAttend: rsvp.willAttend,
                    notes: rsvp.notes
                })
            }
        })

        return ApiResponse.fromObject({
            data: output
        })

    }
}
