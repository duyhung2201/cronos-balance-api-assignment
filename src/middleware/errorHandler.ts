import { Request, Response, NextFunction } from 'express';
import {
	InvalidAddressError,
	BlockchainConnectionError,
	InternalServerError,
	UnauthenticatedError,
} from '../errors/customErrors';
import { logger } from '../utils/logger';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error(`Error: ${err.name} - ${err.message}`);
	const timestamp = new Date().toISOString();
	let statusCode: number;
	let errorType: string;
	let message: string = err.message;

	switch (true) {
		case err instanceof InvalidAddressError:
			statusCode = 400;
			errorType = 'INVALID_ADDRESS';
			break;
		case err instanceof BlockchainConnectionError:
			statusCode = 502;
			errorType = 'BLOCKCHAIN_CONNECTION_ERROR';
			break;
		case err instanceof UnauthenticatedError:
			statusCode = 401;
			errorType = 'UNAUTHENTICATED';
			break;
		default:
			statusCode = 500;
			errorType = 'INTERNAL_SERVER_ERROR';
			message = 'An unexpected error occurred.';
			break;
	}

	res.status(statusCode).json({
		error: {
			code: statusCode,
			message,
			errorType,
			timestamp,
		},
	});
};

export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(404).json({
		error: {
			code: 404,
			message: 'API not implemented',
			errorType: 'NOT_FOUND',
			timestamp: new Date().toISOString(),
		},
	});
};
