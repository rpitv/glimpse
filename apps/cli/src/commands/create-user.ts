import {Command} from "../Command.js";
import {emailRegex, getGroup, hashPassword, prisma, style} from "../util.js";
import {Color} from "../Color.js";
import inquirer from 'inquirer';

export class CreateUserCommand extends Command {
    getAliases(): string[] {
        return ["create-user", "cu"];
    }

    getDescription(): string {
        return "Create a new user";
    }

    getName(): string {
        return "Create User";
    }

    getUsage(): string {
        return "user";
    }

    async run(): Promise<void> {

        const group = await getGroup("Admin");

        if (!group) {
            console.error(style(`Admin Group does not exist. Please create it first with the "init" command.`, Color.Red));
            return;
        }

        const response = await inquirer.prompt([
            {
                name: "username",
                message: "Username",
                validate: (answer) => {
                    if(answer.length === 0) {
                        return style("Username is required.", Color.Red)
                    }
                    if(answer.length > 8) {
                        return style("Username must be 8 characters or less.", Color.Red)
                    }
                    return true
                }
            },
            {
                name: "email",
                message: "Email",
                validate: (answer) => {
                    if(answer.length === 0) {
                        return style("Email address is required.", Color.Red)
                    }
                    if(!emailRegex.test(answer)) {
                        return style("Invalid email address.", Color.Red);
                    }
                    return true
                }
            },
            {
                name: "password",
                type: "password",
                mask: true,
                message: "Password (optional)"
            },
            {
                name: "confirmPassword",
                type: "password",
                mask: true,
                message: "Confirm Password",
                validate: (answer, prevAnswers) => {
                    if(prevAnswers.password !== answer) {
                        return style("Passwords do not match.", Color.Red)
                    }
                    return true
                },
                when: (answers) => !!answers.password
            }
        ])

        const user = await prisma.user.create({
            data: {
                username: response.username,
                password: await hashPassword(response.password),
                mail: response.email,
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

}
