import express from 'express';
import { balanceController, tokenBalanceController } from './controllers';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});