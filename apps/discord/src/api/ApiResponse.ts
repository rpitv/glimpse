export class ApiResponse<T> {
    private constructor(private readonly source: { error?: string, data?: T }) {
        if(source.error) {
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
        const obj = JSON.parse(json);
        if(typeof obj !== "object" || obj === null) {
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
        return this.source.data!;
    }
}
