import { Group, GroupPermission, PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises";
import { Writable } from "node:stream";
import { argon2id, hash } from "argon2";

enum Color {
    Reset = "0",
    Bold = "1",
    Dim = "2",
    Italic = "3",
    Underline = "4",
    Red = "31",
    Green = "32",
    Yellow = "33",
    Blue = "34",
    Magenta = "35",
    Cyan = "36",
    White = "37"
}

let asciiArt =
    "" +
    "                                          *******************                     \n" +
    "                              ****             ****************************       \n" +
    "                                                            ******************    \n" +
    "                                      ▄▄      ██      ██           ************** \n" +
    "          *     ▄ ▄▄▄▄   ▄ ▄▄▄▄▄▄             ██     ████              ***********\n" +
    "      ***       ▀██  ██  ▀██▀   ██   ▀██      ██      ██    ▀█▀  █▀      ******** \n" +
    "    *****        ██       ██    ██    ██      ██      ██     █████        ******  \n" +
    "  ********      ▄██▄      ███████   ██████    ██      ████    ███         ***     \n" +
    "  **********              ██                  ██                        *         \n" +
    "  ***************       ▄████▄                ██                                  \n" +
    "    *******************                                                           \n" +
    "         *******************************************                              \n" +
    "                      ************                                                \n" +
    "                                               ";

asciiArt = asciiArt.replace(/(\*+)/g, style("$1", [Color.Red, Color.Bold]));

function style(text: string, color: Color | Color[]): string {
    const control = Array.isArray(color) ? color.join(";") : color;
    return `\x1b[${control}m${text}\x1b[${Color.Reset}m`;
}

const prisma = new PrismaClient();

// These are copy-pasted from src/auth/auth.service.ts. If you change them here, change them there too.
const hashOptions = {
    type: argon2id,
    memoryCost: 32768, // 32MiB
    timeCost: 4,
    parallelism: 1
};

// Stdout is "mutable" so we can hide password inputs.
const mutableStdout: Writable & { muted?: boolean } = new Writable({
    write: function (chunk, encoding, callback) {
        if (!(this as Writable & { muted?: boolean }).muted) process.stdout.write(chunk, encoding);
        callback();
    }
});
const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
});

type GroupPermissionInput = Partial<GroupPermission> & { action: string };

const guestPermissions: GroupPermissionInput[] = [
    {
        action: "create",
        subject: ["ContactSubmission"],
        fields: ["email", "name", "subject", "body"]
    },
    {
        action: "filter",
        subject: ["ProductionImage"],
        fields: ["productionId", "imageId"]
    },
    {
        action: "filter",
        subject: ["PersonRole"],
        fields: ["personId", "roleId"]
    },
    {
        action: "filter",
        subject: ["Production"],
        fields: ["name", "description", "startTime", "endTime", "category"]
    },
    {
        action: "filter",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "filter",
        subject: ["Role"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["Category"],
        fields: ["name", "priority", "parentId"]
    },
    {
        action: "filter",
        subject: ["Credit"],
        fields: ["personId", "productionId"]
    },
    {
        action: "filter",
        subject: ["ProductionVideo"],
        fields: ["productionId", "videoId"]
    },
    {
        action: "filter",
        subject: ["PersonImage"],
        fields: ["personId", "imageId"]
    },
    {
        action: "filter",
        subject: ["BlogPost"],
        fields: ["authorId", "authorDisplayName", "title", "content"]
    },
    {
        action: "filter",
        subject: ["ProductionTag"],
        fields: ["productionId", "tag"]
    },
    {
        action: "read",
        subject: ["GroupPermission"],
        conditions: {
            groupId: {
                in: "$groups"
            }
        }
    },
    {
        action: "read",
        subject: ["BlogPost"],
        conditions: {
            postedAt: {
                lte: "$now"
            }
        }
    },
    {
        action: "read",
        subject: [
            "Category",
            "Credit",
            "Image",
            "Person",
            "PersonImage",
            "PersonRole",
            "ProductionImage",
            "ProductionTag",
            "ProductionVideo",
            "Role",
            "Video"
        ]
    },
    {
        action: "read",
        subject: ["Redirect"],
        fields: ["key", "location", "id"],
        conditions: {
            OR: [
                {
                    expires: {
                        gt: "$now"
                    }
                },
                {
                    expires: null
                }
            ]
        }
    },
    {
        action: "read",
        subject: ["Production"],
        fields: ["id", "name", "description", "startTime", "endTime", "category", "eventLocation", "thumbnail"]
    },
    {
        action: "sort",
        subject: ["BlogPost"],
        fields: ["postedAt", "title"]
    },
    {
        action: "sort",
        subject: ["Role"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Production"],
        fields: ["name", "startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["Category"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["PersonRole"],
        fields: ["startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["ProductionVideo"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["ProductionTag"],
        fields: ["tag"]
    },
    {
        action: "sort",
        subject: ["ProductionImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["PersonImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "sort",
        subject: ["Image"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Credit"],
        fields: ["priority", "title"]
    },
    {
        action: "sort",
        subject: ["Video"],
        fields: ["name"]
    }
];
const memberPermissions: GroupPermissionInput[] = [
    {
        action: "create",
        subject: ["ProductionRSVP"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "create",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "delete",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "filter",
        subject: ["Production"],
        fields: ["name", "description", "startTime", "endTime", "category", "closetLocation", "closetTime", "teamNotes"]
    },
    {
        action: "filter",
        subject: ["Role"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["ProductionRSVP"],
        fields: ["productionId"]
    },
    {
        action: "filter",
        subject: ["VoteResponse"],
        fields: ["voteId"]
    },
    {
        action: "filter",
        subject: ["AccessLog"],
        fields: ["ip", "timestamp", "service"]
    },
    {
        action: "filter",
        subject: ["BlogPost"],
        fields: ["authorId", "authorDisplayName", "title", "content"]
    },
    {
        action: "filter",
        subject: ["Credit"],
        fields: ["personId", "productionId"]
    },
    {
        action: "filter",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "filter",
        subject: ["PersonImage"],
        fields: ["personId", "imageId"]
    },
    {
        action: "filter",
        subject: ["PersonRole"],
        fields: ["personId", "roleId"]
    },
    {
        action: "filter",
        subject: ["ProductionImage"],
        fields: ["productionId", "imageId"]
    },
    {
        action: "filter",
        subject: ["Category"],
        fields: ["name", "priority", "parentId"]
    },
    {
        action: "filter",
        subject: ["ProductionTag"],
        fields: ["productionId", "tag"]
    },
    {
        action: "filter",
        subject: ["ProductionVideo"],
        fields: ["productionId", "videoId"]
    },
    {
        action: "read",
        subject: ["Vote"],
        fields: ["question", "options", "description", "expires"]
    },
    {
        action: "read",
        subject: ["GroupPermission"],
        conditions: {
            groupId: {
                in: "$groups"
            }
        }
    },
    {
        action: "read",
        subject: ["BlogPost"],
        conditions: {
            postedAt: {
                lte: "$now"
            }
        }
    },
    {
        action: "read",
        subject: [
            "Category",
            "Credit",
            "Image",
            "Person",
            "PersonImage",
            "PersonRole",
            "ProductionImage",
            "ProductionRSVP",
            "ProductionTag",
            "ProductionVideo",
            "Role",
            "Video",
            "Production"
        ]
    },
    {
        action: "read",
        subject: ["Redirect"],
        fields: ["key", "location", "id"],
        conditions: {
            OR: [
                {
                    expires: {
                        gt: "$now"
                    }
                },
                {
                    expires: null
                }
            ]
        }
    },
    {
        action: "read",
        subject: ["UserPermission", "AccessLog", "VoteResponse", "UserGroup", "User"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "sort",
        subject: ["AccessLog"],
        fields: ["ip", "timestamp", "service"]
    },
    {
        action: "sort",
        subject: ["Category"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["Credit"],
        fields: ["priority", "title"]
    },
    {
        action: "sort",
        subject: ["Image"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "sort",
        subject: ["PersonImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["PersonRole"],
        fields: ["startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["ProductionImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["ProductionTag"],
        fields: ["tag"]
    },
    {
        action: "sort",
        subject: ["ProductionVideo"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["Production"],
        fields: ["name", "startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["Role"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["VoteResponse"],
        fields: ["selection", "timestamp"]
    },
    {
        action: "sort",
        subject: ["BlogPost"],
        fields: ["postedAt", "title"]
    },
    {
        action: "update",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "update",
        subject: ["User"],
        fields: ["mail", "password"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "update",
        subject: ["ProductionRSVP"],
        conditions: {
            userId: "$id"
        }
    }
];
const adminPermissions: GroupPermissionInput[] = [
    {
        action: "manage",
        subject: ["all"]
    }
];

interface Command {
    name: string;
    description: string;
    run: () => Promise<void>;
}
const commands: Map<string[], Command> = new Map();

// Help command
commands.set(["help", "h"], {
    name: "Help",
    description: "Display this help message.",
    run: async () => {
        let minTabCount = 1;
        for (const [names] of commands) {
            const namesLength = names.join(", ").length;
            const tabCount = Math.ceil(namesLength / 8);
            minTabCount = Math.max(minTabCount, tabCount);
        }

        console.log(style("\tUsage", [Color.Cyan, Color.Underline, Color.Bold]));
        console.log('\t"npm run cli" for interactive mode.');
        console.log('\t"npm run cli -- <commands>" for non-interactive mode.');
        console.log("");
        console.log(
            style(`\tCommands${"\t".repeat(minTabCount)}Description`, [Color.Cyan, Color.Underline, Color.Bold])
        );

        const descriptionWidth = process.stdout.columns - (minTabCount + 3) * 8 - 5;

        for (const [names, command] of commands) {
            const commandsString = names.join(", ");
            const tabStr = "\t".repeat(minTabCount - Math.ceil(commandsString.length / 8) + 2);
            const description = command.description;

            const descriptionLines = [];
            let nextLine = "";
            for (const word of description.split(" ")) {
                if (nextLine.length + word.length > descriptionWidth) {
                    descriptionLines.push(nextLine);
                    nextLine = "";
                }
                nextLine += word + " ";
            }
            descriptionLines.push(nextLine);

            mutableStdout.write(style(`\t${commandsString}${tabStr}`, [Color.Bold]));
            for (let i = 0; i < descriptionLines.length; i++) {
                if (i > 0) {
                    mutableStdout.write("\t".repeat(minTabCount + 2));
                }
                mutableStdout.write(`${descriptionLines[i]}\n`);
            }
        }

        console.log("");
    }
});

// Exit command
commands.set(["exit", "quit", "q"], {
    name: "Exit",
    description: "Exit the CLI.",
    run: async () => {
        await exit();
    }
});

// Create default groups command
commands.set(["groups", "g"], {
    name: "Create default Groups",
    description:
        "Create the default Guest, Member, and Admin groups with default permissions. Permissions can (and should) be modified by an admin later.",
    run: async () => {
        const users = await userCount();
        if (users > 0) {
            console.error(
                style("For security reasons, this command can only be ran when there are no users.", Color.Red)
            );
            return;
        }
        await createGroup(1n, "Guest", guestPermissions);
        await createGroup(2n, "Member", memberPermissions);
        await createGroup(3n, "Admin", adminPermissions);
    }
});

// Create user command
commands.set(["user", "u"], {
    name: "Create Admin User",
    description: "Create a new User and put them in the Admin group",
    run: async () => {
        const users = await userCount();
        if (users > 0) {
            console.error(
                style("For security reasons, this command can only be ran when there are no users.", Color.Red)
            );
            return;
        }

        const group = await getGroup("Admin");

        if (!group) {
            console.error(style(`Admin Group does not exist. Please create it first with the "g" command.`, Color.Red));
            return;
        }

        let username = null;
        let password = null;
        let email = null;

        console.log(
            style(
                "WARNING! As a security precaution, this command can only be ran once. Once a user exists in the" +
                    " database, this command will no longer work.",
                [Color.Yellow, Color.Bold, Color.Italic]
            )
        );
        while (!username) {
            username = await rl.question(style("Username: ", Color.Bold));
            if (username?.length > 8) {
                console.error(style("Username must be 8 characters or less.", Color.Red));
                username = null;
            }
        }

        let passwords: [string?, string?] = [];
        while (passwords.length === 0) {
            for (let i = 0; i < 2; i++) {
                const pwPromise = rl.question(style(i === 0 ? "Password: " : "Confirm Password: ", Color.Bold));
                mutableStdout.muted = true;
                passwords[i] = await pwPromise;
                mutableStdout.muted = false;
                mutableStdout.write("\n");
            }

            if (passwords[0] !== passwords[1]) {
                console.error(style("Passwords do not match.", Color.Red));
                passwords = [];
            }
        }
        password = passwords[0];

        while (!email) {
            email = await rl.question(style("Email: ", Color.Bold));
            if (email?.length > 300) {
                console.error(style("Email must be 300 characters or less.", Color.Red));
                email = null;
            }
        }

        const user = await prisma.user.create({
            data: {
                username: username,
                password: await hash(password, hashOptions),
                mail: email,
                groups: {
                    create: {
                        groupId: group.id
                    }
                }
            },
            select: {
                id: true
            }
        });

        console.log(style(`User (ID: ${user.id}) created.`, Color.Green));
    }
});

function getCommand(name: string): Command {
    for (const [names, command] of commands) {
        if (names.includes(name)) {
            return command;
        }
    }

    return null;
}

async function exit() {
    await prisma.$disconnect();
    console.log(style("Exiting", [Color.Dim, Color.Italic]));
    process.exit(0); // Graceful exit not working for me
}

async function getGroup(id: bigint): Promise<Pick<Group, "id" | "name">>;
async function getGroup(name: string): Promise<Pick<Group, "id" | "name">>;
async function getGroup(idOrName: bigint | string): Promise<Pick<Group, "id" | "name">> {
    if (typeof idOrName === "bigint") {
        return await prisma.group.findFirst({
            where: {
                id: idOrName
            },
            select: {
                id: true,
                name: true
            }
        });
    } else {
        return await prisma.group.findFirst({
            where: {
                name: idOrName
            },
            select: {
                id: true,
                name: true
            }
        });
    }
}

async function createGroup(id: bigint, name: string, permissions: GroupPermissionInput[]): Promise<Pick<Group, "id">> {
    const group = await getGroup(id);
    if (group) {
        console.error(
            style(
                `Group with ID ${id} already exists. Please manually delete it first if you want to recreate it.`,
                Color.Red
            )
        );
    } else {
        const group = await prisma.group.create({
            data: {
                id: id,
                name: name,
                permissions: {
                    create: permissions
                }
            },
            select: {
                id: true
            }
        });
        console.log(
            style(
                `${name} group (ID: ${group.id}) created with default permissions. You can change these with an admin account.`,
                Color.Green
            )
        );
        return group;
    }
}

async function userCount(): Promise<number> {
    return await prisma.user.count();
}

(async () => {
    await prisma.$connect();
    const args = process.argv;

    if (args.length > 2) {
        const command = getCommand(args[2]);
        if (command) {
            await command.run();
        } else {
            console.log(style(`Command '${args[2]}' not found.`, Color.Red));
        }
        await exit();
    } else {
        if (process.stdout.columns >= 80) {
            console.log(asciiArt);
        }
        console.log(
            style("Starting interactive mode. Type 'help' for a list of commands or 'exit' to exit.", [
                Color.Blue,
                Color.Bold
            ])
        );
        let command;
        // noinspection InfiniteLoopJS
        while (true) {
            command = (await rl.question(style("> ", [Color.Dim, Color.Blue]))).toLowerCase();
            const commandObj = getCommand(command);
            if (commandObj) {
                await commandObj.run();
            } else {
                console.log(style(`Command '${command}' not found.`, Color.Red));
            }
        }
    }
})();
