import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger} from "@nestjs/common";

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
    private logger: Logger = new Logger('GQLExceptionFilter');

    stringify(exception: unknown): string {
        if(exception instanceof HttpException) {
            return JSON.stringify(exception);
        }
        if(typeof exception === 'string') {
            return exception;
        }
        return exception.toString();
    }

    formatHttpException(exception: HttpException): string {
        return `Status ${exception.getStatus()} ${exception.name} - ${exception.message}`
    }

    catch(exception: unknown, host: ArgumentsHost): any {
        if(exception instanceof HttpException) {
            if(exception.getStatus() >= 500) {
                this.logger.warn(this.formatHttpException(exception));
            } else {
                this.logger.debug(this.formatHttpException(exception));
            }
        } else {
            this.logger.error(`Unexpected exception received: ${this.stringify(exception)}`);
        }

        return exception;
    }

}
