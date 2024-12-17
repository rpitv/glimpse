import {UserError} from "./UserError";

export class ApiResponse<T> {
    private constructor(private readonly source: { error?: string, data?: T } | null) {
        if(source === null) {
            return;
        }
        if(source.error) {
            if(source.error.startsWith("User Error: ")) {
                throw new UserError(source.error.substring("User Error: ".length));
            }
            throw new Error(source.error);
        }
    }

    /**
     * Converts a JSON string into an ApiResponse object.
     *
     * @param json The JSON string to be converted. It should be a valid JSON string
     *             representation of an ApiResponse object, containing either an
     *             "error" property with a string value OR a defined "data" property
     *             of any value.
     * @return An ApiResponse instance created from the JSON string content.
     * @throws Error If the JSON string is invalid, does not parse to an object,
     *               or does not meet the expected structure.
     */
    public static fromJSON<T>(json: string): ApiResponse<T> {
        return ApiResponse.fromObject(JSON.parse(json))
    }

    /**
     * Parses an unknown object into an ApiResponse object.
     *
     * @param obj The object to be converted. It should be a representation of an
     *             ApiResponse object, containing either an "error" property with a
     *             string value OR a defined "data" property of any value.
     * @return An ApiResponse instance created from the object.
     * @throws Error If the object does not meet the expected structure.
     */
    public static fromObject<T>(obj: { error?: string, data?: T }): ApiResponse<T> {
        if(obj === null) {
            return new ApiResponse<T>(obj);
        }
        if(typeof obj !== "object") {
            throw new Error("Invalid JSON");
        }
        if(Object.keys(obj).length !== 1) {
            throw new Error("Invalid JSON");
        }
        if((obj.data === undefined) === (obj.error === undefined)) {
            throw new Error("Invalid JSON");
        }
        if(obj.error !== undefined && typeof obj.error !== "string") {
            throw new Error("Invalid JSON");
        }
        return new ApiResponse(obj);
    }

    public getData(): T {
        if(this.source === null) {
            throw new Error("Illegal state: cannot get data of an empty API response")
        }
        return this.source.data!;
    }
}
