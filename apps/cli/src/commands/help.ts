import {Command, CommandContext} from "../Command.js";
import {style} from "../util.js";
import {Color} from "../Color.js";

export class HelpCommand extends Command {
    getDescription(): string {
        return "Display this help message";
    }

    getUsage(): string {
        return "help";
    }

    getName(): string {
        return "Help";
    }

    async run(ctx: CommandContext, args: string[]): Promise<void> {
        let helpStr = "";
        for(const cmd of ctx.commands) {
            // If user is asking for help about a specific command then we only want to output that commands help message
            if(args.length === 1 && !cmd.getAliases().includes(args[0])) {
                continue;
            }
            // Format: Aliases (comma-separated) - Command name. Command name is blue, aliases are bold, dash is gray.
            helpStr += `${style(cmd.getAliases().join(', '), Color.Bold)} ${style('-', Color.Dim)} ${style(cmd.getName(), Color.Blue)}\n`
            helpStr += `${cmd.getDescription()}\n\n`
        }
        helpStr = helpStr.slice(0, -2)
        console.log(helpStr);
    }

    getAliases(): string[] {
        return ["help", "h"];
    }
}
