import { Group, GroupPermission, PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises";
import { Writable } from "node:stream";
import { argon2id, hash } from "argon2";

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
    name: "Create Admin User",
    description: "Create a new User and put them in the Admin group",
    run: async () => {
        const users = await userCount();
        if (users > 0) {
            console.error("For security reasons, this command can only be ran when there are no users.");
            return;
        }

        const group = await getGroup("Admin");

        if (!group) {
            console.error(`Admin Group does not exist. Please create it first with the "g" command.`);
            return;
        }

        let username = null;
        let password = null;
        let email = null;

        console.log(
            "WARNING! As a security precaution, this command can only be ran once. Once a user exists in the" +
                " database, this command will no longer work."
        );
        while (!username) {
            username = await rl.question("Username: ");
            if (username?.length > 8) {
                console.error("Username must be 8 characters or less.");
                username = null;
            }
        }

        let passwords: [string?, string?] = [];
        while (passwords.length === 0) {
            for (let i = 0; i < 2; i++) {
                const pwPromise = rl.question(i === 0 ? "Password: " : "Confirm Password: ");
                mutableStdout.muted = true;
                passwords[i] = await pwPromise;
                mutableStdout.muted = false;
                mutableStdout.write("\n");
            }

            if (passwords[0] !== passwords[1]) {
                console.error("Passwords do not match.\n");
                passwords = [];
            }
        }
        password = passwords[0];

        while (!email) {
            email = await rl.question("Email: ");
            if (email?.length > 300) {
                console.error("Email must be 300 characters or less.");
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
})();
