import { Color } from "./Color";

export function style(text: string, color: Color | Color[]): string {
    const control = Array.isArray(color) ? color.join(";") : color;
    return `\x1b[${control}m${text}\x1b[${Color.Reset}m`;
}
