import request from 'supertest';
import express from 'express';
import { tokenBalanceController } from '../src/controllers';
import { errorHandler } from '../src/middleware/errorHandler';
import axios from 'axios';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';

const app = express();
app.use(express.json());
app.use(apiKeyAuth);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);
app.use(errorHandler);

const API_KEY = process.env.API_KEY || 'your-secure-api-key';
const validTokenAddr = '0xe44fd7fcb2b1581822d0c862b68222998a0c299a';
const validUserAddr = '0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC';

describe('Token Controller Tests', () => {
	it('should fetch token balance successfully from Cronos', async () => {
		const response = await request(app)
			.get(`/token-balance/${validUserAddr}/${validTokenAddr}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'message',
			'Token balance fetched successfully'
		);
		expect(response.body).toHaveProperty('status', 'success');
		expect(response.body.data.balance).toMatch(/^\d+(\.\d+)?$/);
	});

	it('should handle invalid user address error', async () => {
		const invalidAddress = 'invalid_address';
		const response = await request(app)
			.get(`/token-balance/${invalidAddress}/${validTokenAddr}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error', {
			code: 400,
			message: 'Invalid user address format',
			status: 'INVALID_ADDRESS',
		});
	});

	it('should handle invalid token address error', async () => {
		const invalidAddress = 'invalid_address';
		const response = await request(app)
			.get(`/token-balance/${validUserAddr}/${invalidAddress}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error', {
			code: 400,
			message: 'Invalid token address format',
			status: 'INVALID_ADDRESS',
		});
	});

	it('should handle blockchain connection error', async () => {
		jest
			.spyOn(axios, 'post')
			.mockRejectedValue(new Error('Blockchain connection error'));

		const response = await request(app)
			.get(`/token-balance/${validUserAddr}/${validTokenAddr}`)
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(502);
		expect(response.body).toHaveProperty('error', {
			code: 502,
			message: 'Error retrieving token decimals from blockchain',
			status: 'BLOCKCHAIN_CONNECTION_ERROR',
		});
		jest.restoreAllMocks();
	});
});
