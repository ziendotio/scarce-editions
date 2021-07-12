# Developing

We record our [architecture decisions][adrs]. Thse provide background on why we choose our solutions. 

## Building locally

### Prerequisites

This project is developed using Node.js with the following versions 

* node lts/erbium

It is recommended that [Node Version Manager][nvm] is used to ensure the correct versions are used. 

    nvm install lts/erbium 
    nvm use lts/erbium 
    
The expected output is

    Now using node v12.18.3 (npm v6.14.6)

### Dependencies

Install dependencies using [npm][npm]

    npm install

This will install all the required packages to develop using the Scarce Editions Contract.

### Testing

Run the tests

    npx hardhat test

[adrs]: architecture/decisions/
[npm]: https://docs.npmjs.com/getting-started/installing-node
[nvm]: https://github.com/nvm-sh/nvm

### Beresheet Deployment

See details instructions [here](https://main.edgeware.wiki/development/develop/smart-contracts/evm-smart-contracts/tutorials/deploy-an-evm-contract/using-hardhat)

Prerequisites

- Have MetaMask installed and connected to Beresheet

    Network name: EVM Beresheet 
    RPC URL: https://beresheet2.edgewa.re/evm
    Chain ID: 2022

- Have an account with funds, which you can get from the automated bot on the Edgeware discord (in construction). Alternatively you can use this third-party [app](https://beresheet-faucet.vercel.app/)  .
To send funds to your metamask you have to first convert your EVM address to a mainnet address. You can do so here at the bottom of the page https://edgewa.re/keygen (Convert Metamask/EVM address to mainnet address)

If you have not done so already, create a Hardhat config file ( hardhat.config.js ) in the project directory.

    npx hardhat

Install the ether plugin to interact smoothly with the blockchain

    npm install @nomiclabs/hardhat-ethers ethers

Create a `private.json` file ( It’s a good idea to add this file to your .gitignore. ) and insert your metamask account private key in json format

```
    {
    "privateKey": "YOUR-PRIVATE-KEY-HERE"
    }
```

Next, update the hardhat.config.js file module.exports to contain the following target: 

    RPC URL: https://beresheet2.edgewa.re/evm (Alternatively, one can use https://beresheetX.edgewa.re/evm where X can be any number from 1 to 8.)

The hardhat config file should look like this: 

```
    // ethers plugin required to interact with the contract
    require('@nomiclabs/hardhat-ethers');

    // private key from the pre-funded Beresheet testing account
    const { privateKey } = require('./private.json');

    module.exports = {
    // latest Solidity version
    solidity: "0.8.1",

    networks: {
        // Beresheet network specification
        Beresheet: {
        url: `https://beresheet2.edgewa.re/evm`,
        chainId: 2022,
        accounts: [privateKey]
        }
    }
    };
```

Compile the contract ( It’s a good idea to add the artifacts directory to your .gitignore. )

    npx hardhat compile

Create a deployment script like below 

```

    // scripts/deploy.js
    async function main() {
    // We get the contract to deploy
    const TargetContract = await ethers.getContractFactory('YourContractName');
    console.log('Deploying TargetContract...');

    // Instantiating a new TargetContract smart contract
    const instanceContract = await TargetContract.deploy();

    // Waiting for the deployment to resolve
    await instanceContract.deployed();
    console.log('TargetContract deployed to:', instanceContract.address);
    }

    main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

```

Run the command to deploy your contract

    npx hardhat run --network Beresheet scripts/deploy.js

After a few seconds, the contract will be deployed, and you should see the address in the terminal.



