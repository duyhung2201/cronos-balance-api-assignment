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

	if (err instanceof InvalidAddressError) {
		res.status(400).json({
			message: err.message,
			status: 'error',
		});
		return;
	}

	if (err instanceof BlockchainConnectionError) {
		res.status(502).json({
			message: err.message,
			status: 'error',
		});
		return;
	}

	const internalError = new InternalServerError();
	res.status(500).json({
		message: err.message,
		status: 'error',
	});
};
