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
const { INFURA_API_KEY, ALCHEMY_API_KEY, BERESHEET_PRIVATE_KEY, ROPSTEN_PRIVATE_KEY, MAINNET_PRIVATE_KEY } = require('./private.json');

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
		// Beresheet network specification // npx hardhat run scripts/deploy.js --network beresheet
		Beresheet: {
		  url: `https://beresheet2.edgewa.re/evm`,
		  chainId: 2022,
		  accounts: [BERESHEET_PRIVATE_KEY]
		},
		// Ropsten network specification // npx hardhat run scripts/deploy.js --network ropsten
		ropsten: {
			url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
			accounts: [`0x${ROPSTEN_PRIVATE_KEY}`],
		  },
		// Mainnet network specification // npx hardhat run scripts/deploy.js --network mainnet
		mainnet: {
			url: `https://mainnet.infura.io/v3/${ALCHEMY_API_KEY}`, // or any other JSON-RPC provider // <INFURA_API_KEY>
			accounts: [MAINNET_PRIVATE_KEY]
		} 
	  },
};

export default config;
