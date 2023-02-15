import { Group, GroupPermission, PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises";
import { Writable } from "node:stream";

const prisma = new PrismaClient();

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

const guestPermissions: GroupPermissionInput[] = [];
const memberPermissions: GroupPermissionInput[] = [];
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
        console.log("\tUsage");
        console.log("\t------");
        console.log('\t"npm run cli" for interactive mode.');
        console.log('\t"npm run cli -- <commands>" for non-interactive mode.');
        console.log("");
        console.log("\tCommands\t\tDescription");
        console.log("\t------------------------------------");

        let minTabCount = 1;
        for (const [names] of commands) {
            const namesLength = names.join(", ").length;
            const tabCount = Math.ceil(namesLength / 8);
            minTabCount = Math.max(minTabCount, tabCount);
        }

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

            mutableStdout.write(`\t${commandsString}${tabStr}`);
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
            console.error("For security reasons, this command can only be ran when there are no users.");
            return;
        }
        await createGroup(1, "Guest", guestPermissions);
        await createGroup(2, "Member", memberPermissions);
        await createGroup(3, "Admin", adminPermissions);
    }
});

// Create user command
commands.set(["user", "u"], {
    name: "Create User",
    description: "Create a new User, with the option to make them an admin.",
    run: async () => {
        const users = await userCount();
        if (users > 0) {
            console.error("For security reasons, this command can only be ran when there are no users.");
            return;
        }

        let username = null;
        let password = null;
        let email = null;
        let admin = null;

        console.log(
            "NOTE! This command can only be ran once. Once a user exists in the database, this command will" +
                " no longer work for security reasons."
        );
        while (!username) {
            username = await rl.question("Username: ");
        }

        while (!password) {
            const passwordPromise = rl.question("Password: ");
            mutableStdout.muted = true;
            password = await passwordPromise;
            mutableStdout.muted = false;
            mutableStdout.write("\n");
        }

        while (!email) {
            email = await rl.question("Email: ");
        }

        while (admin === null) {
            admin = await rl.question("Admin? (y/n): ");
            if (admin === "y") {
                admin = true;
            } else if (admin === "n") {
                admin = false;
            } else {
                admin = null;
                console.log("Please enter 'y' or 'n'.");
            }
        }

        const groupName = admin ? "Admin" : "Member";
        const group = await getGroup(groupName);

        if (!group) {
            console.error(`${groupName} Group does not exist. Please create it first with the "g" command.`);
            return;
        }

        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
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

        console.log(`User (ID: ${user.id}) created.`);
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
    console.log("Exiting");
    process.exit(0); // Graceful exit not working for me
}

async function getGroup(id: number): Promise<Pick<Group, "id" | "name">>;
async function getGroup(name: string): Promise<Pick<Group, "id" | "name">>;
async function getGroup(idOrName: number | string): Promise<Pick<Group, "id" | "name">> {
    if (typeof idOrName === "number") {
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

async function createGroup(id: number, name: string, permissions: GroupPermissionInput[]): Promise<Pick<Group, "id">> {
    const group = await getGroup(id);
    if (group) {
        console.error(
            `Group with ID ${id} already exists. Please manually delete it first if you want to recreate it.`
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
            `${name} group (ID: ${group.id}) created with default permissions. You can change these with an admin account.`
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
            console.log(`Command '${args[2]}' not found.`);
        }
        await exit();
    } else {
        console.log("Starting interactive mode. Type 'help' for a list of commands or 'exit' to exit.");
        let command;
        // noinspection InfiniteLoopJS
        while (true) {
            command = (await rl.question("> ")).toLowerCase();
            const commandObj = getCommand(command);
            if (commandObj) {
                await commandObj.run();
            } else {
                console.log(`Command '${command}' not found.`);
            }
        }
    }

    // const rl = readline.createInterface({ input, output });
    // let answer = null;
    //
    // while(answer !== "y" && answer !== "n") {
    //     answer = (await rl.question("This script will create the Guest group with permissions to manage all " +
    //         "resources. This should only be used in setup, and the Guest group's permissions should be modified " +
    //         "manually immediately after. Are you sure you want to continue? (y/N)")).toLowerCase();
    //
    //     if(answer === "") {
    //         answer = "n";
    //     } else if(answer !== "y" && answer !== "n") {
    //         console.log("Invalid answer. Please enter 'y' or 'n'.");
    //     }
    // }
    //
    // if(answer === "n") {
    //     return await exit();
    // }
    //
    // const guestGroup = await getGroup(1);
    // if (guestGroup) {
    //     console.log("Guest group already exists.");
    //     return await exit();
    // }
    //
    // await createGuestGroup("Guest");
    //
    // console.log("Created Guest group with permissions to manage all resources. Please create an admin account and " +
    //     "modify the guest permissions as soon as possible.");
})();
