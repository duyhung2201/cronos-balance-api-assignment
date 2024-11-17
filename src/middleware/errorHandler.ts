import { Request, Response, NextFunction } from 'express';
import {
	InvalidAddressError,
	BlockchainConnectionError,
	InternalServerError,
} from '../errors/customErrors';
import { logger } from '../utils';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error(`Error: ${err.name} - ${err.message}`);
	const timestamp = new Date().toISOString();
	// Map known errors
	if (err instanceof InvalidAddressError) {
		res.status(400).json({
			error: {
				code: 400,
				message: err.message,
				errorType: 'INVALID_ADDRESS',
				timestamp,
			},
		});
	} else if (err instanceof BlockchainConnectionError) {
		res.status(502).json({
			error: {
				code: 502,
				message: err.message,
				errorType: 'BLOCKCHAIN_CONNECTION_ERROR',
				timestamp,
			},
		});
	} else {
		// Fallback for unhandled errors
		res.status(500).json({
			error: {
				code: 500,
				message: 'An unexpected error occurred.',
				errorType: 'INTERNAL_SERVER_ERROR',
				timestamp,
			},
		});
	}
};
