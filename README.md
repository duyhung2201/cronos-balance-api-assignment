# cronos-balance-api-assignment

A Node.js backend API service that interacts with the Cronos (EVM) Blockchain. The service provides endpoints to query the CRO balance of an account address and the balance of a CRC20 token for a specified contract address using RPC methods.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/duyhung2201/cronos-balance-api-assignment.git
   cd cronos-balance-api-assignment
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
    RPC_URL=<your_cronos_rpc_url>
    PORT=<your_cronos_rpc_url>
    API_KEY=<your-secure-api-key>
   ```

## Running the Application

To run the application, use the following command:

```sh
  npm start
```

The server will start on the port specified in your environment variables (default is 3000).

## Testing the API Endpoints

You can test the API endpoints using tools like cURL.

### Get CRO Balance

To get the CRO balance of an account address:

```sh
curl -H "x-api-key: <your_api_key>" http://localhost:3000/balance/<account_address>
```

Replace <account_address> and <your_api_key> with the actual addresses and API key you want to use.

Example:
```sh
curl -H "x-api-key: your-secure-api-key" http://localhost:3000/balance/0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC
```

### Get CRC20 Token Balance

To get the balance of a CRC20 token for a specified contract address:

```sh
curl -H "x-api-key: <your_api_key>" http://localhost:3000/token-balance/<account_address>/<contract_address>
```

Replace <account_address>, <contract_address>, and <your_api_key> with the actual addresses and API key you want to use.

Example:
```sh
curl -H "x-api-key: your-secure-api-key" http://localhost:3000/token-balance/0xdBC781ee62E5DF9dFcbb35f6A592e61cB8680bdC/0xe44fd7fcb2b1581822d0c862b68222998a0c299a
```

## API Endpoints

### `GET /balance/:accountAddress`

- **Description**: Returns the CRO balance of the specified account address.
- **Parameters**:
    - `accountAddress` (string): The account address to query.
- **Headers**:
    - `x-api-key` (string): API key for authentication.

### `GET /token-balance/:accountAddress/:contractAddress`

- **Description**: Returns the balance of a CRC20 token for the specified contract address and account address.
- **Parameters**:
    - `accountAddress` (string): The account address to query.
    - `contractAddress` (string): The contract address of the CRC20 token.
- **Headers**:
    - `x-api-key` (string): API key for authentication.
