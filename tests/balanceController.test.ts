import request from 'supertest';
import express from 'express';
import { balanceController, tokenBalanceController } from '../src/controllers';
import { errorHandler } from '../src/middleware/errorHandler';
import axios from 'axios';

const app = express();
app.use(express.json());
app.get('/balance/:address', balanceController);
app.get('/token-balance/:address/:tokenAddress', tokenBalanceController);
app.use(errorHandler);

const validAddress = '0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Balance Controller Tests', () => {
	it('should fetch balance successfully', async () => {
		const rawBalance = 1000;
		mockedAxios.post.mockResolvedValue({
			data: { result: rawBalance.toString() },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: { url: '/balance' },
		});
		const response = await request(app).get(`/balance/${validAddress}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'message',
			'Balance fetched successfully'
		);
		expect(response.body).toHaveProperty('status', 'success');
		expect(typeof response.body.result).toBe('string');
		expect(response.body.result).toBe((1e-15).toFixed(15));
	});

	it('should fetch balance successfully', async () => {
		const rawBalance = 1e19;
		mockedAxios.post.mockResolvedValue({
			data: { result: rawBalance.toString() },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: { url: '/balance' },
		});
		const response = await request(app).get(`/balance/${validAddress}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'message',
			'Balance fetched successfully'
		);
		expect(response.body).toHaveProperty('status', 'success');
		expect(typeof response.body.result).toBe('string');
		expect(response.body.result).toBe("10");
	});

	it('should handle invalid address error', async () => {
		const address = 'invalid_address';
		const response = await request(app).get(`/balance/${address}`);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			'message',
			'Invalid address format for user address'
		);
		expect(response.body).toHaveProperty('status', 'error');
	});

	it('should handle blockchain connection error', async () => {
		mockedAxios.post.mockRejectedValue(
			new Error('Blockchain connection error')
		);

		const response = await request(app).get(`/balance/${validAddress}`);
		expect(response.status).toBe(502);
		expect(response.body).toHaveProperty(
			'message',
			'Error retrieving CRO balance from blockchain'
		);
		expect(response.body).toHaveProperty('status', 'error');

		jest.unmock('axios');
	});
});
