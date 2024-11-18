import request from 'supertest';
import express from 'express';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';
import { balanceController, tokenBalanceController } from '../src/controllers';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(apiKeyAuth);
app.use(errorHandler);
app.use(notFoundHandler);
app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);

const API_KEY = process.env.API_KEY || 'your-secure-api-key';
const validAddress = '0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC';
const validTokenAddress = '0xe44fd7fcb2b1581822d0c862b68222998a0c299a';

describe('NotFound Middleware', () => {
	it('should return 404 for unimplemented routes', async () => {
		const response = await request(app)
			.get('/unimplemented-api')
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(404);

		expect(response.body).toHaveProperty('error', {
			code: 404,
			message: 'API not implemented',
			errorType: 'NOT_FOUND',
			timestamp: expect.any(String),
		});
	});
	it('should return 404 for unimplemented routes', async () => {
		const response = await request(app)
			.get('/balance')
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(404);

		expect(response.body).toHaveProperty('error', {
			code: 404,
			message: 'API not implemented',
			errorType: 'NOT_FOUND',
			timestamp: expect.any(String),
		});
	});
	it('should return 404 for unimplemented routes', async () => {
		const response = await request(app)
			.get(`/token-balance/${validAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(404);

		expect(response.body).toHaveProperty('error', {
			code: 404,
			message: 'API not implemented',
			errorType: 'NOT_FOUND',
			timestamp: expect.any(String),
		});
	});
});
