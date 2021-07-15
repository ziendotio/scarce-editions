// SPDX-License-Identifier: MIT

// When using typescript, none of the HRE properties are injected in global scope, you will need to import everything explicitly.

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { JsonRpcSigner } from '@ethersproject/providers';
const hre = require('hardhat');

describe('ScarceEdition_Create', function() {
	let CONTRACT: any;
	let ScarceEditionContract: any;

	const createError: string = "Only the contract owner or operator can perform this operation";

	let addrOwner: JsonRpcSigner;
	let addrRecipient: JsonRpcSigner;
	let addrOperator: JsonRpcSigner;

	beforeEach(async () => {
		
		ScarceEditionContract = await ethers.getContractFactory(
			'ScarceEdition'
		);

		CONTRACT = await ScarceEditionContract.deploy();

		// Impersonating Owner function 
		await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: ["0x69f97A611172FBCD736C774C445E1300b68BC2dB"],
		  });;
		// Set account balance function
		await hre.network.provider.send("hardhat_setBalance", [
			"0x69f97A611172FBCD736C774C445E1300b68BC2dB",
			"0x100000000000000000",			
		]);

		// Impersonating Recipient function 
		await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: ["0x504a6c24b2506A0B487b72281B3A8C43EfF7eb80"],
		  });;
		// Set account balance function
		await hre.network.provider.send("hardhat_setBalance", [
			"0x504a6c24b2506A0B487b72281B3A8C43EfF7eb80",
			"0x100000000000000000",	
		]);

		// Impersonating Operator function 
		await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: ["0x34304Bf02BB07881C4beb4f085C19f54f7C0104A"],
		  });;
		// Set account balance function
		await hre.network.provider.send("hardhat_setBalance", [
			"0x34304Bf02BB07881C4beb4f085C19f54f7C0104A",
			"0x100000000000000000",	
		]);

		  addrOwner = ethers.provider.getSigner("0x69f97A611172FBCD736C774C445E1300b68BC2dB");
		  addrRecipient = ethers.provider.getSigner("0x504a6c24b2506A0B487b72281B3A8C43EfF7eb80");
		  addrOperator = ethers.provider.getSigner("0x34304Bf02BB07881C4beb4f085C19f54f7C0104A");
	});

	describe('Deployment', () => {
		it('Should assign total supply of token to owner', async () => {
			const ownerBalance = await CONTRACT.balanceOf(addrOwner._address);
			expect(await CONTRACT.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe('Transactions', () => {
		//

		it('create: Create a new Edition as the contract owner', async () => {
			const tokenID: number = 1234567890;
			const tokenURIBefore: string = 'http://scarce.editions/one';
			const totalSupplyBefore = await CONTRACT.totalSupply();
			const createRes = await CONTRACT.create(
				addrRecipient._address,
				tokenID,
				tokenURIBefore
			);
			const totalSupplyAfter = await CONTRACT.totalSupply();
			const tokenURIAfter = await CONTRACT.tokenURI(tokenID);
			expect(totalSupplyBefore.toNumber() + 1).to.equal(
				totalSupplyAfter.toNumber()
			);
			expect(tokenURIBefore).to.equal(tokenURIAfter);
		});

		//

		it('create: Create a new Edition as the contract owner, after setting the operator', async () => {
			const tokenID = 1234567890;
			const tokenURIBefore = 'http://scarce.editions/one';
			const setOperatorRes = await CONTRACT.setOperator(
				addrOperator._address
			);
			const totalSupplyBefore = await CONTRACT.totalSupply();
			await CONTRACT.create(
				addrRecipient._address,
				tokenID,
				tokenURIBefore
			);
			const totalSupplyAfter = await CONTRACT.totalSupply();
			const tokenURIAfter = await CONTRACT.tokenURI(tokenID);
			expect(totalSupplyBefore.toNumber() + 1).to.equal(
				totalSupplyAfter.toNumber()
			);
			expect(tokenURIBefore).to.equal(tokenURIAfter);
		});

		//

		it('create: Create a new Edition as the contract owner, after setting and resetting the operator', async () => {
			const tokenID = 1234567890;
			const tokenURIBefore = 'http://scarce.editions/one';
			const setOperator1Res = await CONTRACT.setOperator(
				addrOperator._address
			);
			const setOperator2Res = await CONTRACT.setOperator(
				addrOwner._address
			);
			const totalSupplyBefore = await CONTRACT.totalSupply();
			await CONTRACT.create(
				addrRecipient._address,
				tokenID,
				tokenURIBefore
			);
			const totalSupplyAfter = await CONTRACT.totalSupply();
			const tokenURIAfter = await CONTRACT.tokenURI(tokenID);
			expect(totalSupplyBefore.toNumber() + 1).to.equal(
				totalSupplyAfter.toNumber()
			);
			expect(tokenURIBefore).to.equal(tokenURIAfter);
		});

		//

		it('create: Create a new Edition as the contract operator', async () => {
			const tokenID = 1234567890;
			const tokenURIBefore = 'http://scarce.editions/one';
			const totalSupplyBefore = await CONTRACT.totalSupply();
			await CONTRACT.setOperator(addrOperator._address, {
				from: addrOwner._address,
			});
			await CONTRACT.connect(addrOperator).create(
				addrRecipient._address,
				tokenID,
				tokenURIBefore
			);
			const totalSupplyAfter = await CONTRACT.totalSupply();
			const tokenURIAfter = await CONTRACT.tokenURI(tokenID);
			expect(totalSupplyBefore.toNumber() + 1).to.equal(
				totalSupplyAfter.toNumber()
			);
			expect(tokenURIBefore).to.equal(tokenURIAfter);
		});

		//

		it('create: Create a new Edition when not the contract owner', async () => {
			const tokenID = 1234567890;
			const tokenURIBefore = 'http://scarce.editions/one';
			const totalSupplyBefore = await CONTRACT.totalSupply.call();

			await expect(
				CONTRACT.connect(addrRecipient).create(addrRecipient._address, tokenID, tokenURIBefore)
			  ).to.be.revertedWith("Only the contract owner or operator can perform this operation");

			const totalSupplyAfter = await CONTRACT.totalSupply.call();
			expect(totalSupplyBefore.toNumber()).to.equal(
				totalSupplyAfter.toNumber()
			);
		});

		//

		it('create: Create a new Edition as the operator after that has been removed', async () => {
			const tokenID = 1234567890;
			const tokenURIBefore = 'http://scarce.editions/one';
			const setOperator1Res = await CONTRACT.setOperator(
				addrOperator._address
			);
			const setOperator2Res = await CONTRACT.setOperator(
				addrOwner._address
			);
			const totalSupplyBefore = await CONTRACT.totalSupply.call();

			await expect(
				CONTRACT.connect(addrOperator).create(addrRecipient._address, tokenID, tokenURIBefore)
			  ).to.be.revertedWith("Only the contract owner or operator can perform this operation");

			const totalSupplyAfter = await CONTRACT.totalSupply.call();
			expect(totalSupplyBefore.toNumber()).to.equal(
				totalSupplyAfter.toNumber()
			);
		});
	});
});
