import {Command} from "../Command.js";
import {adminPermissions, guestPermissions, memberPermissions} from "../default-permissions.js";
import {createGroup} from "../util.js";

export class InitCommand extends Command {
    getDescription(): string {
        return "Initialize the database with default groups and permissions";
    }

    getUsage(): string {
        return "init";
    }

    getName(): string {
        return "Initialize database";
    }

    async run(): Promise<void> {
        await createGroup(1n, "Guest", guestPermissions);
        await createGroup(2n, "Member", memberPermissions);
        await createGroup(3n, "Admin", adminPermissions);
    }

    getAliases(): string[] {
        return ["init"];
    }
}
