import { Request, Response } from 'express';
import { getTokenBalance } from './services/tokenService';
import { getBalance } from './services/balanceService';

export const balanceController = async (req: Request, res: Response) => {
	try {
		const { address } = req.params;
		const balance = await getBalance(address);
		res.json({ address, balance });
	} catch (error) {
		res.status(500).json({ error: 'Error fetching balance' });
	}
};

export const tokenBalanceController = async (req: Request, res: Response) => {
	try {
		const { address, tokenAddress } = req.params;
		const balance = await getTokenBalance(address, tokenAddress);
		res.json({ address, tokenAddress, balance });
	} catch (error) {
		res.status(500).json({ error: 'Error fetching token balance' });
	}
};

// /Error fetching token balance: TypeError: Cannot convert undefined to a BigInt
// curl http://localhost:3000/token-balance/0x0862b415323A432f57F2E7cA5171DD0f38130D79/0xcCcCcCcCdbEC186DC426F8B5628AF94737dF0E6
