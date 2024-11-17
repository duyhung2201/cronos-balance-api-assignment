import { Request, Response, NextFunction } from 'express';
import {
	InvalidAddressError,
	BlockchainConnectionError,
	InternalServerError,
} from '../errors/customErrors';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(`Error: ${err.name} - ${err.message}`);

	// Map known errors
	if (err instanceof InvalidAddressError) {
		res.status(400).json({
			error: {
				code: 400,
				message: err.message,
				status: 'INVALID_ADDRESS',
			},
		});
	} else if (err instanceof BlockchainConnectionError) {
		res.status(502).json({
			error: {
				code: 502,
				message: err.message,
				status: 'BLOCKCHAIN_CONNECTION_ERROR',
			},
		});
	} else {
		// Fallback for unhandled errors
		res.status(500).json({
			error: {
				code: 500,
				message: 'An unexpected error occurred.',
				status: 'INTERNAL_SERVER_ERROR',
			},
		});
	}
};
