import axios from 'axios';
import { convertFromSmallestUnit, getCallData } from './utils';
import { abi as crc20Abi } from './abis/ERC20.json';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://evm.cronos.org';

interface RPCResponse {
	jsonrpc: string;
	id: number;
	result: string;
}

export const getBalance = async (address: string): Promise<string> => {
	const payload = {
		jsonrpc: '2.0',
		method: 'eth_getBalance',
		params: [address, 'latest'],
		id: 1,
	};
	try {
		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, payload);
		if (!response.data || !response.data.result) {
			throw new Error('Invalid response: Missing result field');
		}
		return convertFromSmallestUnit(BigInt(response.data.result), 18); //convert from wei to CRO
	} catch (error) {
		console.error('Error fetching balance:', error);
		throw new Error('Failed to fetch balance');
	}
};

export async function getTokenBalance(
	address: string,
	tokenAddress: string
): Promise<string> {
	try {
		// Fetch the decimals and raw balance
		const decimals = await getTokenDecimals(tokenAddress);
		const rawBalance = await getRawTokenBalance(address, tokenAddress);

		return convertFromSmallestUnit(rawBalance!, decimals);
	} catch (error) {
		console.error('Error fetching token balance:', error);
		throw new Error('Failed to fetch token balance');
	}
}

const getRawTokenBalance = async (
	address: string,
	tokenAddress: string
): Promise<bigint> => {
	const payload = {
		jsonrpc: '2.0',
		method: 'eth_call',
		params: [
			{
				to: tokenAddress,
				data: getCallData('balanceOf', [address], crc20Abi),
			},
			'latest',
		],
		id: 1,
	};

	try {
		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, payload);

		if (!response.data || !response.data.result) {
			throw new Error('Invalid response: Missing result field');
		}

		return BigInt(response.data.result);
	} catch (error) {
		console.error('Error fetching token balance:', error);
		throw new Error('Failed to fetch token balance');
	}
};

const getTokenDecimals = async (tokenAddress: string): Promise<number> => {
	const data = {
		jsonrpc: '2.0',
		method: 'eth_call',
		params: [
			{
				to: tokenAddress,
				data: getCallData('decimals', [], crc20Abi),
			},
			'latest',
		],
		id: 1,
	};

	try {
		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, data);

		if (!response.data || !response.data.result) {
			throw new Error('Invalid response: Missing result field');
		}

		// Parse the result as a hexadecimal number
		return parseInt(response.data.result, 16);
	} catch (error) {
		console.error('Error fetching token decimals:', error);
		throw new Error('Failed to fetch token decimals');
	}
};
