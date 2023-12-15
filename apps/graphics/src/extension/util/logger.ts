import Pino from 'pino';

let logLevel = 'info';
if (process.env.NODE_ENV === 'development') {
	logLevel = 'debug';
}
if(process.env.LOG_LEVEL) {
	logLevel = process.env.LOG_LEVEL;
}

export const logger = Pino({ level: logLevel });
