// SPDX-License-Identifier: MIT
// scripts/deploy.js

async function main() {
  // Deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const ScarceEdition = await ethers.getContractFactory('ScarceEdition');
  console.log('Deploying ScarceEdition...');

  // Instantiating a new Box smart contract
  const scarceEdition = await ScarceEdition.deploy();

  // Waiting for the deployment to resolve
  await scarceEdition.deployed();
  console.log('ScarceEdition deployed to:', scarceEdition.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
     console.error(error);
     process.exit(1);
  });