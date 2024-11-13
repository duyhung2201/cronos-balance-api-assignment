import { ethers } from 'ethers';

export function convertFromSmallestUnit(
	rawValue: bigint,
	decimals: number
): string {
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
}

export function getCallData(
	functionName: string,
	args: any[],
	abi: any[]
): string {
	const contractInterface = new ethers.Interface(abi);

	// Encode the function call
	try {
		const callData = contractInterface.encodeFunctionData(functionName, args);
		return callData;
	} catch (error) {
		console.error('Error encoding callData:', error);
		throw new Error('Invalid function name or arguments');
	}
}
