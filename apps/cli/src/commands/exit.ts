import {Command} from "../Command.js";
import {exit} from "../util.js";

export class ExitCommand extends Command {
    getDescription(): string {
        return "Exit interactive mode for the CLI";
    }

    getUsage(): string {
        return "exit";
    }

    getName(): string {
        return "Exit";
    }

    async run(): Promise<void> {
        await exit()
    }

    getAliases(): string[] {
        return ["exit", "quit", "q"];
    }
}
