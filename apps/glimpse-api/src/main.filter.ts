import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class MainExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    private logger: Logger = new Logger("GQLExceptionFilter");

    stringify(exception: unknown): string {
        if (exception instanceof HttpException) {
            return JSON.stringify(exception);
        }
        if (typeof exception === "string") {
            return exception;
        }
        return exception.toString();
    }

    formatHttpException(exception: HttpException): string {
        return `Status ${exception.getStatus()} ${exception.name} - ${
            (exception as any).stack
        }`;
    }

    catch(exception: unknown, host: ArgumentsHost): any {
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            if (httpStatus >= 500) {
                this.logger.warn(this.formatHttpException(exception));
            } else {
                this.logger.debug(this.formatHttpException(exception));
            }
        } else {
            this.logger.error(
                `Unexpected exception received: ${this.stringify(exception)}`
            );
        }

        if (host.getType() === "http") {
            const { httpAdapter } = this.httpAdapterHost;
            const ctx = host.switchToHttp();
            httpAdapter.reply(ctx.getResponse(), {
                error: true,
                statusCode: httpStatus,
                message:
                    exception instanceof HttpException
                        ? exception.message
                        : "Internal server error"
            });
        }

        return exception;
    }
}
