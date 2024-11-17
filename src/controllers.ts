import { NextFunction, Request, Response } from 'express';
import { getTokenBalance } from './services/tokenService';
import { getBalance } from './services/balanceService';

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

// /Error fetching token balance: TypeError: Cannot convert undefined to a BigInt
// curl http://localhost:3000/token-balance/0x0862b415323A432f57F2E7cA5171DD0f38130D79/0xcCcCcCcCdbEC186DC426F8B5628AF94737dF0E6
// curl http://localhost:3000/balance/0xF0847B3207b452248455c3ce5703a1831E4f5Cf1

// curl --request GET 'https://cronos.org/explorer/api?module=account&action=tokenbalance&contractaddress=0xe44fd7fcb2b1581822d0c862b68222998a0c299a&address=0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bd1'
// 0xe44fd7fcb2b1581822d0c862b68222998a0c299a
// 0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC

// curl http://localhost:3000/token-balance/0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bd1/0xe44fd7fcb2b1581822d0c862b68222998a0c299a
// {"message":"Invalid function name or arguments","status":"error"}%
