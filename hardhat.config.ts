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
			// Commands // npx hardhat run --network EDGMainnet scripts/deploy.js
			// HardhatConfigObject // https://hardhat.org/config/#json-rpc-based-networks
			url: `https://mainnet12.edgewa.re/evm`,
			chainId: 2021,
			accounts: [ACCOUNT_PRIVATE_KEY],
			// timeout: 6000000,
		},
	},
};

export default config;
