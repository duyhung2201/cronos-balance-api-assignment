import { Request, Response } from 'express';
import { getBalance } from './blockchain-services';

export const balanceController = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching balance' });
  }
};