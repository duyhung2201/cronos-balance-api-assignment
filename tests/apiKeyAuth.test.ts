import request from 'supertest';
import express from 'express';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';
import { balanceController, tokenBalanceController } from '../src/controllers';
import { errorHandler } from '../src/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(apiKeyAuth);
app.use(errorHandler);
app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);

const API_KEY = process.env.API_KEY || 'your-secure-api-key';
const validAddress = '0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC';
const validTokenAddress = '0xe44fd7fcb2b1581822d0c862b68222998a0c299a';

describe('API Key Authentication Middleware', () => {
    it('should return 401 if no API key is provided for /balance', async () => {
        const response = await request(app).get(`/balance/${validAddress}`);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 if an incorrect API key is provided for /balance', async () => {
        const response = await request(app)
            .get(`/balance/${validAddress}`)
            .set('x-api-key', 'wrong-api-key');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should allow access if the correct API key is provided for /balance', async () => {
        const response = await request(app)
            .get(`/balance/${validAddress}`)
            .set('x-api-key', API_KEY);
        expect(response.status).toBe(200);
    });

    it('should return 401 if no API key is provided for /token-balance', async () => {
        const response = await request(app).get(`/token-balance/${validAddress}/${validTokenAddress}`);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 if an incorrect API key is provided for /token-balance', async () => {
        const response = await request(app)
            .get(`/token-balance/${validAddress}/${validTokenAddress}`)
            .set('x-api-key', 'wrong-api-key');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should allow access if the correct API key is provided for /token-balance', async () => {
        const response = await request(app)
            .get(`/token-balance/${validAddress}/${validTokenAddress}`)
            .set('x-api-key', API_KEY);
        expect(response.status).toBe(200);
    });
});