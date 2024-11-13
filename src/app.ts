import express from 'express';
import { balanceController } from './controllers';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/balance/:address', balanceController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});