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

        let minTabCount = 1;
        for (const cmd of ctx.commands) {
            const aliasLength = cmd.getAliases().join(", ").length;
            const tabCount = Math.ceil(aliasLength / 8);
            minTabCount = Math.max(minTabCount, tabCount);
        }

        console.log(style("\tUsage", [Color.Cyan, Color.Underline, Color.Bold]));
        console.log("\t\"rpitv\" for interactive mode.");
        console.log("\t\"rpitv <command>\" for non-interactive mode.");
        console.log("");
        console.log(
            style(`\tCommands${"\t".repeat(minTabCount)}Description`, [Color.Cyan, Color.Underline, Color.Bold])
        );

        const descriptionWidth = process.stdout.columns - (minTabCount + 3) * 8 - 5;

        for (const cmd of ctx.commands) {
            const aliasesString = cmd.getAliases().join(", ");
            const tabStr = "\t".repeat(minTabCount - Math.ceil(aliasesString.length / 8) + 2);
            const description = cmd.getDescription();

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

            process.stdout.write(style(`\t${aliasesString}${tabStr}`, [Color.Bold]));
            for (let i = 0; i < descriptionLines.length; i++) {
                if (i > 0) {
                    process.stdout.write("\t".repeat(minTabCount + 2));
                }
                process.stdout.write(`${descriptionLines[i]}\n`);
            }
        }

        console.log("");
    }

    getAliases(): string[] {
        return ["help", "h"];
    }
}
