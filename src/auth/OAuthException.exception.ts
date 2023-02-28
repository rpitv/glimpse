import { HttpException } from "@nestjs/common";

export class OAuthException extends HttpException {
    public readonly type: string;
    public readonly error?: Error;

    constructor(type: string, error?: Error) {
        super("Authentication failed: " + type, 302);
        this.type = type;
        this.error = error;
    }
}
