import { Request, Response, NextFunction } from 'express';

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
