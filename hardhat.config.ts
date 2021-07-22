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
const { INFURA_API_KEY, ALCHEMY_API_KEY, BERESHEET_PRIVATE_KEY, ROPSTEN_PRIVATE_KEY, MAINNET_PRIVATE_KEY, EDGEWARE_MAIN_PRIVATE_KEY, POLKADOT_MNEMONIC, POLKADOT_PRIVATE_KEY } = require('./private.json');

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
		EDGMainnet: {
			url: `https://mainnet2.edgewa.re/evm`,
			chainId: 2021,
			accounts: [POLKADOT_PRIVATE_KEY],
		}
	},
};

export default config;
