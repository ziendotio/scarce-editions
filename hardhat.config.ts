// ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-solhint';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-abi-exporter';

import { HardhatUserConfig } from 'hardhat/types';

// Here you can write Hardhat tasks. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// private key from the pre-funded Beresheet testing account
const { PRIVATE_KEY_ROLE_OBJ, ACCOUNT_PRIVATE_KEY } = require('./private.json');

const config: HardhatUserConfig = {
	abiExporter: {
		path: './abi',
		clear: true,
		flat: true,
		only: [],
		spacing: 2,
	},
	solidity: {
		version: '0.7.6',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			// Commands
				// npx hardhat node --fork https://mainnet2.edgewa.re/evm
				// npx hardhat run --network localhost scripts/deploy.js
				// npx hardhat test --network localhost 
			// HardhatConfigObject // https://hardhat.org/config/#hardhat-network
			forking: { 
				url: `https://mainnet2.edgewa.re/evm`,
			},
			accounts: PRIVATE_KEY_ROLE_OBJ,
		},
		// Beresheet network specification
		Beresheet: { // npx hardhat run --network Beresheet scripts/deploy.js
			url: `https://beresheet2.edgewa.re/evm`,
			chainId: 2022,
			accounts: [ACCOUNT_PRIVATE_KEY],
		},
		// Mainnet network specification
		EDGMainnet: {
			// Commands
				// npx hardhat run --network EDGMainnet scripts/deploy.js
			// HardhatConfigObject // https://hardhat.org/config/#json-rpc-based-networks
				// url: The url of the node. This argument is required for custom networks.
				url: `https://mainnet12.edgewa.re/evm`,
				// chainId: An optional number, used to validate the network Hardhat connects to. If not present, this validation is omitted.
				chainId: 2021,
				// from: The address to use as default sender. If not present the first account of the node is used.
				// gas: Its value should be "auto" or a number. If a number is used, it will be the gas limit used by default in every transaction. If "auto" is used, the gas limit will be automatically estimated. Default value: "auto".
				// gasPrice: Its value should be "auto" or a number. This parameter behaves like gas. Default value: "auto".
				// gasMultiplier: A number used to multiply the results of gas estimation to give it some slack due to the uncertainty of the estimation process. Default value: 1.
				// accounts: This field controls which accounts Hardhat uses. It can use the node's accounts (by setting it to "remote"), a list of local accounts (by setting it to an array of hex-encoded private keys), or use an HD Wallet. Default value: "remote".
				accounts: [ACCOUNT_PRIVATE_KEY],
				// httpHeaders: You can use this field to set extra HTTP Headers to be used when making JSON-RPC requests. It accepts a JavaScript object which maps header names to their values. Default value: undefined.
				// timeout: Timeout in ms for requests sent to the JSON-RPC server. If the request takes longer than this, it will be cancelled. Default value: 20000.
				timeout: 6000000,
		},
	},
};

export default config;
