import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'your-secure-api-key';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers['x-api-key'];

	if (apiKey && apiKey === API_KEY) {
		next();
	} else {
		res.status(401).json({
			error: {
				code: 401,
				message: 'API key is invalid or missing.',
				status: 'UNAUTHENTICATED',
			},
		});
	}
};
