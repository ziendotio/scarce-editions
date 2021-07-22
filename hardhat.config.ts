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
const { PRIVATE_KEY_ROLE_OBJ, POLKADOT_MNEMONIC, POLKADOT_PRIVATE_KEY } = require('./private.json');

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
			// npx hardhat node --fork https://mainnet2.edgewa.re/evm
			// npx hardhat run --network localhost scripts/deploy.js
			// npx hardhat test --network localhost 
			forking: { 
				url: `https://mainnet2.edgewa.re/evm`,
			},
			// Account to provide node with
			accounts: PRIVATE_KEY_ROLE_OBJ,
		},
		EDGMainnet: {
			// https://mainnet.edgewa.re/evm
			url: `https://mainnet.edgewa.re/evm`,
			chainId: 2021,
			accounts: [POLKADOT_PRIVATE_KEY],
		}
	},
};

export default config;
