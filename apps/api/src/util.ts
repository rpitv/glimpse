import { Logger } from "@nestjs/common";

const logger = new Logger("Utilities");

/**
 * Convert unix timestamps to DateTime objects on an object input. Recursive for "AND" and "OR".
 * @param obj Object to convert the timestamps on
 * @param fields Fields which should be converted to dateTime if they are found on the object
 * @private
 */
export function parseDateTimeInputs(obj: any, fields: string[]) {
    if (!obj) {
        return;
    }
    for (const prop in obj) {
        if (["AND", "OR"].includes(prop)) {
            // Recurse
            parseDateTimeInputs(obj[prop], fields);
        }
        for (const field of fields) {
            if (prop === field && typeof obj[prop] === "number") {
                logger.verbose(`[parseDateTimeInputs] Converting ${prop} to Date object.`);
                obj[prop] = new Date(obj[prop]);
            }
        }
    }
}
