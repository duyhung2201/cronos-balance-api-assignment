import { ethers } from 'ethers';
import { createLogger, format, transports } from 'winston';

/**
 * Converts a raw value from the smallest unit (e.g., wei) to a human-readable format.
 *
 * @param rawValue - The raw value in the smallest unit (e.g., wei).
 * @param decimals - The number of decimal places to consider (e.g., 18 for ETH).
 * @returns The formatted value as a string.
 */
export const convertFromSmallestUnit = (
	rawValue: bigint,
	decimals: number
): string => {
	const bigIntValue = BigInt(rawValue);
	const divisor = BigInt(10) ** BigInt(decimals);

	// Calculate the whole part of the value
	const wholePart = bigIntValue / divisor;

	// Format the fractional part with leading zeros
	let fractionalStr = (bigIntValue % divisor)
		.toString()
		.padStart(decimals, '0');

	// Remove trailing zeros from the fractional part
	fractionalStr = fractionalStr.replace(/0+$/, '');

	// If there is no fractional part, return the whole part only
	if (fractionalStr === '') {
		return wholePart.toString();
	}

	// Return the formatted value with both whole and fractional parts
	return `${wholePart.toString()}.${fractionalStr}`;
};

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
		// Log an error if encoding fails
		logger.error('Error encoding callData:', error);
		throw error;
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

/**
 * Creates a logger instance using Winston.
 *
 * The logger is configured to log messages to both the console and a file.
 * The log format includes a timestamp and the log level.
 */
export const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.printf(({ level, message, timestamp, ...meta }) => {
			const metaInfo = Object.keys(meta).length ? JSON.stringify(meta) : '';
			return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaInfo}`;
		})
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'application.log' }),
	],
});
