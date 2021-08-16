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
const { PRIVATE_KEY_ROLE_OBJ, MAINNET_PRIVATE_KEY, TESTNET_PRIVATE_KEY } = require('./private.json');

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
		// Forking network specification
		hardhat: {
			forking: { 
				url: `https://mainnet2.edgewa.re/evm`,
			},
			accounts: PRIVATE_KEY_ROLE_OBJ,
		},
		// Beresheet network specification
		Beresheet: { 
			url: `https://beresheet2.edgewa.re/evm`,
			chainId: 2022,
			accounts: [TESTNET_PRIVATE_KEY],
		},
		// Mainnet network specification
		Edgeware: {
			url: `https://mainnet.edgewa.re/evm`,
			chainId: 2021,
			accounts: [MAINNET_PRIVATE_KEY],
			gas: 1800,
		},
	},
};

export default config;
