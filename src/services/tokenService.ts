import axios from 'axios';
import {
	convertFromSmallestUnit,
	getCallData,
	isValidAddress,
	logger,
} from '../utils';
import { abi as crc20Abi } from '../abis/ERC20.json';
import {
	BlockchainConnectionError,
	InternalServerError,
	InvalidAddressError,
} from '../errors/customErrors';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://evm.cronos.org';

/**
 * Fetches the token balance for a given address and token contract address.
 *
 * @param address - The address to fetch the token balance for.
 * @param tokenAddress - The token contract address.
 * @returns The token balance as a string.
 * @throws InvalidAddressError if the address or token address format is invalid.
 * @throws BlockchainConnectionError if there is an error fetching the balance.
 * @throws InternalServerError if there is an error converting the balance.
 */
export async function getTokenBalance(
	address: string,
	tokenAddress: string
): Promise<string> {
	if (!isValidAddress(address)) {
		throw new InvalidAddressError(`Invalid user address format: ${address}`);
	}

	if (!isValidAddress(tokenAddress)) {
		throw new InvalidAddressError(
			`Invalid token address format: ${tokenAddress}`
		);
	}

	const rawBalance = await getRawTokenBalance(address, tokenAddress);
	const decimals = await getTokenDecimals(tokenAddress);

	try {
		// Convert the raw balance to a human-readable format
		return convertFromSmallestUnit(rawBalance!, decimals);
	} catch (error) {
		logger.error('Error in getTokenBalance:', {
			error: (error as Error).message,
			context: { address, tokenAddress },
		});
		throw new InternalServerError('Failed to get token balance');
	}
}

/**
 * Fetches the raw token balance for a given address and token contract address.
 *
 * @param address - The address to fetch the token balance for.
 * @param tokenAddress - The token contract address.
 * @returns The raw token balance as a bigint.
 * @throws BlockchainConnectionError if there is an error fetching the balance.
 */
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
		logger.error('Error in getRawTokenBalance:', {
			error: (error as Error).message,
			context: { address, tokenAddress },
		});
		throw new BlockchainConnectionError(
			'Error fetching raw token balance from blockchain'
		);
	}
};

/**
 * Fetches the token decimal of a token contract address.
 *
 * @param tokenAddress - The token contract address.
 * @returns The decimal as number.
 * @throws BlockchainConnectionError if there is an error fetching the decimal.
 */
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
				`Invalid decimals value received from blockchain: ${decimals}`
			);
		}

		return decimals;
	} catch (error) {
		logger.error('Error in getTokenDecimals:', {
			error: (error as Error).message,
			context: { tokenAddress },
		});
		throw new BlockchainConnectionError(
			'Error retrieving token decimals from blockchain'
		);
	}
};
