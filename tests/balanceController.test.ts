import request from 'supertest';
import express from 'express';
import { balanceController, tokenBalanceController } from '../src/controllers';
import { errorHandler } from '../src/middleware/errorHandler';
import axios from 'axios';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';

const app = express();
app.use(express.json());
app.use(apiKeyAuth);
app.get('/balance/:address', balanceController);
app.use(errorHandler);

const API_KEY = process.env.API_KEY || 'your-secure-api-key';
const validAddress = '0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC';

describe('Balance Controller Tests', () => {
	it('should fetch token balance successfully from Cronos', async () => {
		const response = await request(app)
			.get(`/balance/${validAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'message',
			'Balance fetched successfully'
		);
		expect(response.body).toHaveProperty('status', 'success');
		expect(response.body.data.balance).toMatch(/^\d+(\.\d+)?$/);
	});

	it('should fetch balance successfully mock', async () => {
		const rawBalance = 1000;
		jest.spyOn(axios, 'post').mockResolvedValue({
			data: { result: rawBalance.toString() },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: { url: '/balance' },
		});
		const response = await request(app)
			.get(`/balance/${validAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'message',
			'Balance fetched successfully'
		);
		expect(response.body).toHaveProperty('status', 'success');
		expect(response.body.data.balance).toBe((1e-15).toFixed(15));

		const rawBalance2 = 1e19;
		jest.spyOn(axios, 'post').mockResolvedValue({
			data: { result: rawBalance2.toString() },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: { url: '/balance' },
		});
		const response2 = await request(app)
			.get(`/balance/${validAddress}`)
			.set('x-api-key', API_KEY);
		expect(response2.body.data.balance).toBe('10');
	});

	it('should handle invalid address error', async () => {
		const invalidAddress = 'invalid_address';
		const response = await request(app)
			.get(`/balance/${invalidAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error', {
			code: 400,
			message: `Invalid user address format: ${invalidAddress}`,
			errorType: 'INVALID_ADDRESS',
			timestamp: expect.any(String),
		});
	});

	it('should handle blockchain connection error', async () => {
		jest
			.spyOn(axios, 'post')
			.mockRejectedValue(new Error('Blockchain connection error'));

		const response = await request(app)
			.get(`/balance/${validAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(502);

		expect(response.body).toHaveProperty('error', {
			code: 502,
			message: 'Error retrieving CRO balance from blockchain',
			errorType: 'BLOCKCHAIN_CONNECTION_ERROR',
			timestamp: expect.any(String),
		});

		jest.restoreAllMocks();
	});
});
