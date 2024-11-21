import { createLogger, format, transports } from 'winston';
/**
 * Creates a logger instance using Winston.
 *
 * The logger is configured to log messages to both the console and a file.
 * The log format includes a timestamp and the log level.
 */
export const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.printf(({ level, message, timestamp, ...meta }) => {
			const metaInfo = Object.keys(meta).length ? JSON.stringify(meta) : '';
			return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaInfo}`;
		})
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'application.log' }),
	],
});
