import express from 'express';
import { balanceController, tokenBalanceController } from './controllers';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiKeyAuth } from './middleware/apiKeyAuth';

const app = express();
app.use(apiKeyAuth);
const PORT = process.env.PORT || 3000;

app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);
app.use(errorHandler);
app.use(notFoundHandler);
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
