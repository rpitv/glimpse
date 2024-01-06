#! /usr/bin/env node
import {Color} from "./Color.js";
import {exit, printSplashText, prisma, style} from "./util.js";
import {Command, CommandMode} from "./Command.js";
import {CreateUserCommand} from "./commands/create-user.js";
import {ExitCommand} from "./commands/exit.js";
import {InitCommand} from "./commands/init.js";
import {LicenseCommand} from "./commands/license.js";
import {HelpCommand} from "./commands/help.js";
import inquirer from "inquirer";


const commands: Command[] = [
    new HelpCommand(),
    new ExitCommand(),
    new InitCommand(),
    new CreateUserCommand(),
    new LicenseCommand()
]

function getCommand(name: string): Command {
    for (const command of commands) {
        if (command.getAliases().includes(name)) {
            return command;
        }
    }

    return null;
}

(async () => {
    await prisma.$connect();
    const args = process.argv;
    const commandArgs = args.slice(3)

    if (args.length > 2) {
        const command = getCommand(args[2]);
        if (command) {
            await command.run({
                commands,
                mode: CommandMode.Direct
            }, commandArgs);
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
        // noinspection InfiniteLoopJS
        while (true) {
            const { input } = await inquirer.prompt([
                {
                    name: "input",
                    prefix: "",
                    message: style("> ", [Color.Dim, Color.Blue])
                }
            ])

            const [ cmd, ...args ]: string[] = input.split(' ')

            const commandObj = getCommand(cmd);
            if (commandObj) {
                await commandObj.run({
                    commands,
                    mode: CommandMode.Interactive
                }, args);
            } else {
                console.log(style(`Command '${input}' not found.`, Color.Red));
            }
        }
    }
})();
