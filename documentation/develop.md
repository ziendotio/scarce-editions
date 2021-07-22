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

    npx hardhat test --network localhost

This will run the test against a edgeware mainnet fork using your own metamask test accounts. 

### Deployment

1. Acquire EDG tokens through an exchange and transfer your funds to metamask. ( Should you need to use polkadot.js/extension wallet in the process, you can convert your metamask EVM account address to a Polkadot address using this [helper tool](https://edgewa.re/keygen) in order to perform a [token transfer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmainnet.edgewa.re#/accounts) from your polkadot account to metamask )

2. Update the private.json file with your own EVM private key (from metamask?), which should hold enough EDG to perform the deployment successfully.

3. Set the hardhat configuration file to use the latest Edgeware load balancer: 

Run the deployment script :

    npx hardhat run --network EDGMainnet scripts/deploy.js


