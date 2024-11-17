import { NextFunction, Request, Response } from 'express';
import { getTokenBalance } from './services/tokenService';
import { getBalance } from './services/balanceService';

/**
Controller to handle fetching the balance of an address.
*/
export const balanceController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { address } = req.params;
		const balance = await getBalance(address);
		res.json({
			status: 'success',
			message: 'Balance fetched successfully',
			data: {
				address,
				balance,
			},
		});
	} catch (error) {
		next(error);
	}
};

/**
Controller to handle fetching the token balance of an address for a specific token.
*/
export const tokenBalanceController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { address, tokenAddress } = req.params;
		const balance = await getTokenBalance(address, tokenAddress);
		res.json({
			status: 'success',
			message: 'Token balance fetched successfully',
			data: {
				address,
				tokenAddress,
				balance,
			},
		});
	} catch (error) {
		next(error);
	}
};
