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