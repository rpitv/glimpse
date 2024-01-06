import {Command} from "../Command.js";
import fs from "fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url))

export class LicenseCommand extends Command {
    getDescription(): string {
        return "Copy the LICENSE file into each app/package for distribution";
    }

    getUsage(): string {
        return "license";
    }

    getName(): string {
        return "Copy License";
    }

    async run(): Promise<void> {
        await fs.promises.copyFile(join(__dirname, "..", "..", "..", "LICENSE"), join(__dirname, "LICENSE"))
    }

    getAliases(): string[] {
        return ["license"];
    }

}
