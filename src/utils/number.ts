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
