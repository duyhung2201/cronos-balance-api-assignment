import axios from 'axios';
import { convertFromSmallestUnit, getCallData, isValidAddress } from '../utils';
import { abi as crc20Abi } from '../abis/ERC20.json';
import {
	BlockchainConnectionError,
	InternalServerError,
	InvalidAddressError,
} from '../errors/customErrors';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://evm.cronos.org';

export async function getTokenBalance(
	address: string,
	tokenAddress: string
): Promise<string> {
	try {
		if (!isValidAddress(address)) {
			throw new InvalidAddressError('Invalid user address format');
		}

		if (!isValidAddress(tokenAddress)) {
			throw new InvalidAddressError('Invalid token address format');
		}

		// Fetch the decimals and raw balance
		const decimals = await getTokenDecimals(tokenAddress);
		const rawBalance = await getRawTokenBalance(address, tokenAddress);

		return convertFromSmallestUnit(rawBalance!, decimals);
	} catch (error) {
		console.error('Error in getTokenBalance:', error);
		throw new InternalServerError('Failed to get token balance');
	}
}

const getRawTokenBalance = async (
	address: string,
	tokenAddress: string
): Promise<bigint> => {
	try {
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

		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, payload);

		if (!response.data || !response.data.result) {
			throw new BlockchainConnectionError(
				'Failed to retrieve raw token balance'
			);
		}

		return BigInt(response.data.result);
	} catch (error) {
		console.error('Error in getRawTokenBalance:', error);
		throw new BlockchainConnectionError(
			'Error fetching raw token balance from blockchain'
		);
	}
};

const getTokenDecimals = async (tokenAddress: string): Promise<number> => {
	try {
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

		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, data);

		if (!response.data || !response.data.result) {
			throw new BlockchainConnectionError('Failed to retrieve token decimals');
		}

		// Parse the result as a hexadecimal number
		const decimals = parseInt(response.data.result, 16);
		if (isNaN(decimals)) {
			throw new InternalServerError(
				'Invalid decimals value received from blockchain'
			);
		}

		return decimals;
	} catch (error) {
		console.error('Error in getTokenDecimals:', error);
		throw new BlockchainConnectionError(
			'Error retrieving token decimals from blockchain'
		);
	}
};
