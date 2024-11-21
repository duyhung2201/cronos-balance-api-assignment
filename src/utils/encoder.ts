import { ethers } from 'ethers';
/**
 * Generates the call data for a contract function call.
 *
 * @param functionName - The name of the contract function to call.
 * @param args - The arguments to pass to the contract function.
 * @param abi - The ABI of the contract.
 * @returns The encoded call data as a string.
 */
export const getCallData = (
	functionName: string,
	args: any[],
	abi: any[]
): string => {
	const contractInterface = new ethers.Interface(abi);

	try {
		// Encode the function call data using the contract interface
		const callData = contractInterface.encodeFunctionData(functionName, args);
		return callData;
	} catch (error) {
		throw new Error(`Error encoding callData: ${error}`);
	}
};
