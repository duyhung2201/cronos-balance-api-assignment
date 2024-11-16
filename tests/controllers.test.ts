import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { balanceController, tokenBalanceController } from '../src/controllers';
import { errorHandler } from '../src/middleware/errorHandler';

const app = express();
app.use(express.json());
app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);
app.use(errorHandler);

describe('API Tests', () => {
  it('should fetch balance successfully', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const response = await request(app).get(`/balance/${address}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Data fetched successfully');
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.result).to.have.property('balance');
  });

  it('should fetch token balance successfully', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const tokenAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdef';
    const response = await request(app).get(`/token-balance/${address}/${tokenAddress}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Data fetched successfully');
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.result).to.have.property('balance');
  });

  it('should handle invalid address error', async () => {
    const address = 'invalid_address';
    const response = await request(app).get(`/balance/${address}`);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message', 'Invalid address provided');
    expect(response.body).to.have.property('status', 'error');
  });

  it('should handle blockchain connection error', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    // Simulate blockchain connection error
    // You need to mock the getBalance or getTokenBalance function to throw BlockchainConnectionError
    const response = await request(app).get(`/balance/${address}`);
    expect(response.status).to.equal(502);
    expect(response.body).to.have.property('message', 'Failed to connect to the blockchain');
    expect(response.body).to.have.property('status', 'error');
  });
});