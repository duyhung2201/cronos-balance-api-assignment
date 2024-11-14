import axios from 'axios';
import { convertFromSmallestUnit, isValidAddress } from '../utils';
import {
	BlockchainConnectionError,
	InternalServerError,
	InvalidAddressError,
} from '../errors/customErrors';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://evm.cronos.org';

// Function to get the CRO balance of an address
export const getBalance = async (address: string): Promise<string> => {
	if (!isValidAddress(address)) {
		throw new InvalidAddressError('Invalid address format for user address');
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
		console.error('Error in getBalance:', error);
		throw new BlockchainConnectionError(
			'Error retrieving CRO balance from blockchain'
		);
	}
};
