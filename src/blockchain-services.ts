import axios from 'axios';
import { convertFromSmallestUnit } from './utils';

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
	const response = await axios.post<RPCResponse>(RPC_ENDPOINT, payload);
	return convertFromSmallestUnit(response.data.result, 18); //convert from wei to CRO
};
