import { ethers } from 'ethers';

export const convertFromSmallestUnit = (
	rawValue: bigint,
	decimals: number
): string => {
	const bigIntValue = BigInt(rawValue);
	const divisor = BigInt(10) ** BigInt(decimals);

	const wholePart = bigIntValue / divisor;
	// Format the fractional part with leading zeros
	let fractionalStr = (bigIntValue % divisor)
		.toString()
		.padStart(decimals, '0');
	fractionalStr = fractionalStr.replace(/0+$/, ''); // Remove trailing zeros

	// Trim the fractional part if it is zero
	if (fractionalStr === '') {
		return wholePart.toString();
	}

	return `${wholePart.toString()}.${fractionalStr}`;
};

export const getCallData = (
	functionName: string,
	args: any[],
	abi: any[]
): string => {
	const contractInterface = new ethers.Interface(abi);

	// Encode the function call
	try {
		const callData = contractInterface.encodeFunctionData(functionName, args);
		return callData;
	} catch (error) {
		console.error('Error encoding callData:', error);
		throw new Error('Error encoding call data');
	}
};

/**
 * Validates if an Ethereum address is in the correct format.
 * @param address - The address to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidAddress = (address: string): boolean => {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
};
