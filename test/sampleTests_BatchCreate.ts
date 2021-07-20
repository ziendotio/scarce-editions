// SPDX-License-Identifier: MIT

// When using typescript, none of the HRE properties are injected in global scope, you will need to import everything explicitly.

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

describe('ScarceEdition_BatchCreate', function () {
	let CONTRACT: any;
	let ScarceEditionContract: any;
	let addrOwner: SignerWithAddress;
	let addrRecipient: SignerWithAddress;
	let addrOperator: SignerWithAddress;

	const createError: string =
		'Error: VM Exception while processing transaction: revert Only the contract owner or operator can perform this operation';

	beforeEach(async () => {
		ScarceEditionContract = await ethers.getContractFactory(
			'ScarceEdition'
		);
		[addrOwner, addrRecipient, addrOperator] = await ethers.getSigners();
		CONTRACT = await ScarceEditionContract.deploy();
		await CONTRACT.deployed();
	});

	describe('Transactions', () => {

		//

		it('batchCreate: Create a new Edition as the contract owner', async () => {
			const to_addresses = [
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
				addrRecipient.address,
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


		it('batchCreate: revert when batchSize > maxBatch', async () => {

			// uint256 batchSize
			let batchSize = 50;
			// console.log("BATCHSIZE: ", batchSize)

			// uint256 maxBatch 
			let maxbatch = 40;
			console.log("MAXBATCH: ", maxbatch)

			// address[maxBatch] memory to
			let to_addresses = new Array();
			for (let i = 1; i <= maxbatch; i++) {
				to_addresses.push(addrRecipient.address);
			}
			console.log("TO_ADDRESSES: ", to_addresses)
			
			// uint256[maxBatch] memory tokenId
			let token_ids = new Array();
			let j = 1
			for (let k = 1; k <= maxbatch; k++ ) {
				if ( j > 10 ) { j = 1 }
				token_ids.push(j);
				j++
			}
			console.log("TOKEN_IDS: ", token_ids)

			// string[maxBatch] memory uri
			let urls = new Array();
			for ( let k = 1; k <= maxbatch; k++) {
				urls.push('http://url.io/drop/01/scarce-edition/211345a53c261a7e877b1e05a8f239e9')
			}
			console.log("URLS: ", urls)

			const totalSupplyBefore = await CONTRACT.totalSupply();

			await expect(
				CONTRACT.batchCreate(batchSize, to_addresses, token_ids, urls))
			.to.be.revertedWith("Batches can not exceed the max batch size (10)");

			const totalSupplyAfter = await CONTRACT.totalSupply();

			expect(totalSupplyBefore.toNumber()).to.equal(
				totalSupplyAfter.toNumber()
			);

		});
	});
});
