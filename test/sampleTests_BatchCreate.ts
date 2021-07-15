// SPDX-License-Identifier: MIT

// When using typescript, none of the HRE properties are injected in global scope, you will need to import everything explicitly.

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { JsonRpcSigner } from '@ethersproject/providers';
const hre = require('hardhat');


describe('ScarceEdition_BatchCreate', function () {
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

	describe('Transactions', () => {
		it('batchCreate: Create a new Edition as the contract owner', async () => {
			const to_addresses = [
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
				addrRecipient._address,
			];

			const token_ids = [
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1,
				2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
			];

			const urls = [
				'http://url.io/drop/01/scarce-edition/211345a53c261a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c262a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c263a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c264a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c265a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c266a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c267a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c268a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c269a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c26aa7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c261a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c262a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c263a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c264a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c265a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c266a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c267a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c268a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c269a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c26aa7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c261a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c262a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c263a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c264a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c265a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c266a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c267a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c268a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c269a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c26aa7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c261a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c262a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c263a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c264a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c265a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c266a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c267a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c268a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c269a7e877b1e05a8f239e9',
				'http://url.io/drop/01/scarce-edition/211345a53c26aa7e877b1e05a8f239e9',
			];

			const totalSupplyBefore = await CONTRACT.totalSupply();

			const createRes = await CONTRACT.batchCreate(
				10,
				to_addresses,
				token_ids,
				urls
			);

			const totalSupplyAfter = await CONTRACT.totalSupply();

			expect(totalSupplyBefore.toNumber() + 10).to.equal(
				totalSupplyAfter.toNumber()
			);
		});
	});
});
