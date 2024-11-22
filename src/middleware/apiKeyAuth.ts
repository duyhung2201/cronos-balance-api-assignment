import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors/customErrors';

const API_KEY = process.env.API_KEY || 'your-secure-api-key';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers['x-api-key'];

	if (apiKey && apiKey === API_KEY) {
		next();
	} else {
		next(new UnauthenticatedError('API key is invalid or missing.'));
	}
};
