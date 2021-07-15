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