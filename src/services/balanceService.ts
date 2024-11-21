import axios from 'axios';
import { isValidAddress } from '../utils/validator';
import {
	BlockchainConnectionError,
	InvalidAddressError,
} from '../errors/customErrors';
import { convertFromSmallestUnit } from '../utils/number';
import { logger } from '../utils/logger';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://evm.cronos.org';

/**
 * Fetches the CRO balance for a given address.
 *
 * @param address - The address to fetch the CRO balance for.
 * @returns The CRO balance as a formatted string.
 * @throws BlockchainConnectionError if there is an error fetching the balance.
 */
export const getBalance = async (address: string): Promise<string> => {
	if (!isValidAddress(address)) {
		throw new InvalidAddressError(`Invalid user address format: ${address}`);
	}

	const payload = {
		jsonrpc: '2.0',
		method: 'eth_getBalance',
		params: [address, 'latest'],
		id: 1,
	};

	try {
		const response = await axios.post<RPCResponse>(RPC_ENDPOINT, payload);

		if (!response.data || !response.data.result) {
			throw new BlockchainConnectionError(
				'Failed to retrieve balance from blockchain'
			);
		}

		return convertFromSmallestUnit(BigInt(response.data.result), 18); // Convert from wei to CRO
	} catch (error) {
		logger.error('Error in getBalance:', {
			error: (error as Error).message,
			context: { address },
		});
		throw new BlockchainConnectionError(
			'Error retrieving CRO balance from blockchain'
		);
	}
};
