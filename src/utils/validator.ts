/**
 * Validates if an Ethereum address is in the correct format.
 * @param address - The address to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidAddress = (address: string): boolean => {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
};
