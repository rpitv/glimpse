import { Color } from "./Color.js";
import argon2 from "argon2";
import {Group, PrismaClient} from "@prisma/client";
import {GroupPermissionInput} from "./default-permissions";
import {Writable} from "node:stream";
const { argon2id, hash } = argon2;

export type PromptFunction = (input: string) => Promise<string>;
export type MutableWritable = Writable & { muted?: boolean };

export const prisma = new PrismaClient()
export const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function style(text: string, color: Color | Color[]): string {
    const control = Array.isArray(color) ? color.join(";") : color;
    return `\x1b[${control}m${text}\x1b[${Color.Reset}m`;
}

// Ascii art representing the RPI TV logo - May not look so pretty in your IDE...
let splashText =
    "" +
    "                                          *******************                     \n" +
    "                              ****             ****************************       \n" +
    "                                                            ******************    \n" +
    "                                      ▄▄      ██      ██           ************** \n" +
    "          *     ▄ ▄▄▄▄   ▄ ▄▄▄▄▄▄             ██     ████              ***********\n" +
    "      ***       ▀██  ██  ▀██▀   ██   ▀██      ██      ██    ▀█▀  █▀      ******** \n" +
    "    *****        ██       ██    ██    ██      ██      ██     █████        ******  \n" +
    "  ********      ▄██▄      ███████   ██████    ██      ████    ███         ***     \n" +
    "  **********              ██                  ██                        *         \n" +
    "  ***************       ▄████▄                ██                                  \n" +
    "    *******************                                                           \n" +
    "         *******************************************                              \n" +
    "                      ************                                                \n" +
    "                                               ";
// Give the "*" characters red+bold formatting
splashText = splashText.replace(/(\*+)/g, style("$1", [Color.Red, Color.Bold]));

export function printSplashText(): void {
    console.log(splashText);
}

export async function hashPassword(password: string): Promise<string> {
    // These options are copy-pasted from src/auth/auth.service.ts. in @rpitv/glimpse-api. If you change them here,
    // change them there too.
    return await hash(password, {
        type: argon2id,
        memoryCost: 32768, // 32MiB
        timeCost: 4,
        parallelism: 1
    })
}


export async function exit() {
    await prisma.$disconnect();
    console.log(style("Exiting", [Color.Dim, Color.Italic]));
    process.exit(0); // Graceful exit not working for me
}


export async function getGroup(id: bigint): Promise<Pick<Group, "id" | "name">>;
export async function getGroup(name: string): Promise<Pick<Group, "id" | "name">>;
export async function getGroup(idOrName: bigint | string): Promise<Pick<Group, "id" | "name">> {
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

export async function createGroup(id: bigint, name: string, permissions: GroupPermissionInput[]): Promise<Pick<Group, "id">> {
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
