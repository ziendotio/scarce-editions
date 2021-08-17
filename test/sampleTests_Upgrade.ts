// SPDX-License-Identifier: MIT

// When using typescript, none of the HRE properties are injected in global scope, you will need to import everything explicitly.

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

// Old contract set to not allow new NFTs to be created
// Set upgrade contract address
// User authorise upgrade contract to control the asset
// Upgrade contract reads the metadata from the current contract
// Upgrade contract create new NFT
// Upgrade contract set the User as the owner
// Upgrade contract burns the old NFT
// If no NFTs remain. Burn the contract

describe('ScarceEdition_Upgrade', function() {
	let CONTRACT: any;
	let ScarceEditionContract: any;
	let addrOwner: SignerWithAddress;
	let addrRecipient: SignerWithAddress;
	let addrOperator: SignerWithAddress;
	let addrUpgradeOperator: SignerWithAddress;

	const createError: string = "Only the contract owner or operator can perform this operation";

	beforeEach(async () => {
		ScarceEditionContract = await ethers.getContractFactory(
			'ScarceEdition'
		);
		[addrOwner, addrRecipient, addrOperator, addrUpgradeOperator] = await ethers.getSigners();
		CONTRACT = await ScarceEditionContract.deploy(); // addrOwner.address
		await CONTRACT.deployed();
	});

	describe('Deployment', () => {
		it('Should assign total supply of token to owner', async () => {
			const ownerBalance = await CONTRACT.balanceOf(addrOwner.address);
			expect(await CONTRACT.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe('Upgrade', () => {
		//

        describe('Initialisation', () => {

            it('upgrade: sets previous version reference on upgrade contract', async () => {
            });

            it('upgrade: sets upgrade version reference on previous contract', async () => {
            });

            it('upgrade: sets previous version _upgradeOperator and _operator as upgrade contract', async () => {
            });

        })

        // Old contract set to not allow new NFTs to be created
        describe('Pause', () => {

            it('upgrade: pauses previous version contract', async () => {
            });

            it('upgrade: does not allow previous version NFT minting', async () => {
            });

        })

        // User authorise upgrade contract to control the asset
        describe('Interoperability', () => {

            it('upgrade: upgrade contract become _operator or _owner', async () => {
            });

            it('upgrade: upgrade contract can call previous versions functions', async () => {
            });

        })

        // Upgrade contract reads the metadata from the current contract
        // Upgrade contract create new NFT
        describe('Replication', () => {

            it('upgrade: upgrade contract reads metadata from previous contract', async () => {
            });

            it('upgrade: upgrade contract duplicates token(s)', async () => {
            });

            it('upgrade: upgrade contract burn token if duplicated', async () => {
            });

        })

        // Upgrade contract set the User as the owner
        describe('Ownership', () => {

            it('upgrade: upgrade contract owner becomes previous version owner', async () => {
            });

        })

        // If no NFTs remain. Burn the contract
        describe('Clean Up', () => {

            it('upgrade: burns previous version contract if no NTFs remain', async () => {
            });

        })

	});
});
