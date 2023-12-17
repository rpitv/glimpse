import { Color } from "./Color.js";
import argon2 from "argon2";
const { argon2id, hash } = argon2;

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
