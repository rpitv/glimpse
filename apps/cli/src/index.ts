#! /usr/bin/env node
import { Group, PrismaClient } from "@prisma/client";
import * as readline from "node:readline/promises";
import { Writable } from "node:stream";
import * as fs from "fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Color } from "./Color.js";
import { adminPermissions, GroupPermissionInput, guestPermissions, memberPermissions } from "./default-permissions.js";
import { hashPassword, printSplashText, style } from "./util.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient()

// Stdout is "mutable" so we can hide password inputs.
const mutableStdout: Writable & { muted?: boolean } = new Writable({
    write: function(chunk, encoding, callback) {
        if (!(this as Writable & { muted?: boolean }).muted) process.stdout.write(chunk, encoding);
        callback();
    }
});
const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
});

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
        console.log("\t\"npm run cli\" for interactive mode.");
        console.log("\t\"npm run cli -- <commands>\" for non-interactive mode.");
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

// License command
commands.set(["license"], {
    name: "Copy License",
    description: "Copy the LICENSE file into each app/package for distribution",
    run: async () => {
        await fs.promises.copyFile(join(__dirname, "..", "..", "LICENSE"), join(__dirname, "LICENSE"))
    }
})

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
                password: await hashPassword(password),
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
            printSplashText()
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
