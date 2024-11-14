export class InvalidAddressError extends Error {
	constructor(message = 'Invalid address format') {
		super(message);
		this.name = 'InvalidAddressError';
	}
}

export class BlockchainConnectionError extends Error {
	constructor(message = 'Failed to fetch data from blockchain') {
		super(message);
		this.name = 'BlockchainConnectionError';
	}
}

export class InternalServerError extends Error {
	constructor(message = 'An internal server error occurred') {
		super(message);
		this.name = 'InternalServerError';
	}
}

export class NetworkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NetworkError';
	}
}
