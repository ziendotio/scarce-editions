# Scarce Editions

![Truffle Unittests](https://github.com/axna/scarce-editions/workflows/Truffle%20Unittests/badge.svg) ![Solidity linter](https://github.com/axna/scarce-editions/workflows/Solidity%20linter/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

Scarce Editions are NFTs with a license and instructions to produce a physical artwork. Used by [zien][zien].

Instructions on [creating an edition][usage] and [development][develop] are provided. Noteworthy changes are recorded in the [changelog][changelog].

## Features

- [Non-fungible tokens][nft] are used to represent each edition.
- Based on the [ERC721][erc721] standard.
- ERC721 uses a uint256 as the unique id of each token.

## Contribute

We welcome [contributions][contrib], be they [issues][issues], [pull requests][pullrequest] or in another form that follow our [code of conduct][codeofconduct].

[zien]: https://zien.io/
[nft]: https://en.wikipedia.org/wiki/Non-fungible_token
[erc721]: http://erc721.org/
[issues]: ../../issues/new/choose
[pullrequest]: .github/PULL_REQUEST_TEMPLATE.md
[contrib]: .github/CONTRIBUTING.md
[codeofconduct]: ./CODE_OF_CONDUCT.md
[changelog]: CHANGELOG.md
[usage]: documentation/usage.md
[develop]: documentation/develop.md

## Testing & Deployment

Hardhat offers great deployment features to test your smart contract! Amongst other, you can test against:

- the Hardhat default Network - run your tests using the default Hardhat Network, where you can use Hardhat default configuration, either in-process or stand-alone daemon, servicing JSON-RPC and WebSocket requests.
- A blockchain fork - Where a solution of your choice will be run locally, ie copy the state of the net blockchain into your local environment, including all balances and deployed contracts.
- A live JSON-RPC Network, ie any TestNet or Mainnet.

The below will quickly lay out a few considerations for testing and deploying the scarce editions contract(s).

In order to deploy to live nets you will most probably need:

- A `private.json` file to store your wallet account(s) keys.
- A compiled smart contract. Run `npx hardhat compile`
- Metamask account(s) with Tokens ( real or tap - please search for the recommended infrastructure solution).
- Details of the Node to target.
- An Etherium API key (Infura, Alchemy, etc..) for mainnet deployment.

#### Default Hardhat Network

Test your smart contract with the `npx hardhat test` command.

#### Local Node

The following command will start Hardhat Network, and expose it as a JSON-RPC and WebSocket server (on top of Hardhat Network).

`npx hardhat node`

Then, connect your wallet or application to `http://localhost:8545`.

If you want to connect Hardhat to this node, you just need to run using the following flag.

        `--network localhost`

Deploy the smart contract to the localhost network:

        `npx hardhat run --network localhost scripts/deploy.js`

Test your smart contract:

        `npx hardhat test --network localhost`

#### TestNet / Mainnet Fork

For a default hardhat configuration solution, run the following:

Configure the `hardhar.config.ts` Hardhat Network file with the following

```
networks: {
  hardhat: {
    forking: {
      url: "TARGETURL<key>";
      blockNumber: BLOCKNUMBER
    }
  }
}
```

(Note that you'll need to replace the <key> component of the URL with your personal Alchemy API key. You can optionally pin a block number to increase performance of your tests.)

Alternatively, using hardhat default configuration, you can use flags to achieve the same result:

The following command will spawn your local server, fetch the blockchain data and embedded its state and behavior locally.

    ```npx hardhat node --fork <url> --fork-block-number <block>```

Either ways, you can now hit the localhost environment to run deployment and tests.

        npx hardhat run --network localhost scripts/deploy.js
        npx hardhat test --network localhost

Note: In general, to run the test against a specific endpoint, run the command

`npx hardhat test --network <name>`

#### TestNet / Mainnet:

- Buy / Retrieve the necessary chain token from market place or taps.

- Update your Metamask account holding the tokens to target the right network (MyAccount / Settings / Network)

- Create a `private.json` untracked file and past your account private key in the following format: `"TESTNET_PRIVATE_KEY": "f1dc1b81185..."`

- Configure `hardhat.config.ts` file to your needs. Example:

```
/**
* url : The target node
* chainId: Id of the target blockchain (security measure)
* accounts: Account private key, from private.json
*/

TARGETNETWORK: {
    url: "",
    chainId: "",
    accounts: [ACCOUNT_PRIVATE_KEY],
}
```

Note: .. Additional properties as per [hardhat config](https://hardhat.org/hardhat-network/reference/)

- To deploy the contract, run the command

```
npx hardhat run --network <name> scripts/deploy.js
```

- To test the contract, run the command

```
npx hardhat test --network <name>
```

Please note, on a live chain, this will consume tokens for each test transaction, and test performance will be lower due to network and block operations.

#### Deploy Flag

Although using the script may help automate deployment tasks, the hardhat config file allows you to specify accounts to use for deployment, which will be used when running the deploy command:

`npx hardhat deploy --network <name>`
