// SPDX-License-Identifier: MIT

// When using typescript, none of the HRE properties are injected in global scope, you will need to import everything explicitly.

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Console } from 'console';

// Old contract set to not allow new NFTs to be created
// Set upgrade contract address
// User authorise upgrade contract to control the asset
// Upgrade contract reads the metadata from the current contract
// Upgrade contract create new NFT
// Upgrade contract set the User as the owner
// Upgrade contract burns the old NFT
// If no NFTs remain. Burn the contract

describe('ScarceEdition_Upgrade', function() {
	let CONTRACTPREV: any;
	let CONTRACTNEXT: any;
	let ScarceEditionContract: any;
	let addrOwner: SignerWithAddress;
	let addrRecipient: SignerWithAddress;
	let addrOperator: SignerWithAddress;

	const createError: string = "Only the contract owner or operator can perform this operation";

	beforeEach(async () => {

        // Contract reference
		ScarceEditionContract = await ethers.getContractFactory(
			'ScarceEdition'
		);

        // Set accounts
		[addrOwner, addrRecipient, addrOperator] = await ethers.getSigners();

        // Deploy two versions
		CONTRACTPREV = await ScarceEditionContract.deploy(); 
		await CONTRACTPREV.deployed();
        // console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);

		CONTRACTNEXT = await ScarceEditionContract.deploy(); 
		await CONTRACTNEXT.deployed();
        // console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
	});

	describe('Deployment', () => {
		it('PREV: Should assign total supply of token to owner', async () => {
			const ownerBalance = await CONTRACTPREV.balanceOf(addrOwner.address);
			expect(await CONTRACTPREV.totalSupply()).to.equal(ownerBalance);
		});
		it('NEXT: Should assign total supply of token to owner', async () => {
			const ownerBalance = await CONTRACTNEXT.balanceOf(addrOwner.address);
			expect(await CONTRACTNEXT.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe.only('Upgrade', () => {

		//

        describe('Initialisation', () => {

            beforeEach(async () => {

                console.log("\n")
                console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("TEST_ CALL Owner : ",  addrOwner.address);
                console.log("TEST_ CALL Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade versions: sets previous version reference on upgrade contract', async () => {

                const previousAddressBefore = CONTRACTPREV.address;
                console.log("TEST_ CALL previousAddressBefore = ", previousAddressBefore );

                await CONTRACTNEXT.connect(addrOwner).set_previousVersion(previousAddressBefore);

                const previousAddressAfter = await CONTRACTNEXT.get_previousVersion();
                console.log("TEST_ CALL previousAddressAfter = ", previousAddressAfter );

                expect(previousAddressAfter).to.equal(previousAddressBefore);
                console.log("TEST_ CALL \n")

            });

            it('upgrade versions: sets upgrade version reference on previous contract', async () => {

                const nextAddressBefore = CONTRACTNEXT.address;
                console.log("TEST_ CALL nextAddressBefore = ", nextAddressBefore );

                await CONTRACTPREV.connect(addrOwner).set_nextVersion(CONTRACTNEXT.address);

                const nextAddressAfter = await CONTRACTPREV.get_nextVersion();
                console.log("TEST_ CALL nextAddressAfter = ", nextAddressAfter );
                expect(nextAddressAfter).to.equal(nextAddressBefore);
                console.log("TEST_ CALL \n")

            });

        })

        describe('Upgrade Role', () => {

            beforeEach(async () => {

                console.log("\n")
                console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("TEST_ CALL Owner : ",  addrOwner.address);
                console.log("TEST_ CALL Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade: retrieves contract Owner and Operator', async () => {

                const owner = await CONTRACTPREV.connect(addrOwner).get_owner();
                const operator = await CONTRACTPREV.connect(addrOwner). get_operator();
                expect(owner).to.equal(addrOwner.address);
                expect(operator).to.equal(owner);

            });

            it('upgrade: sets upgrade_role on previous contract', async () => {

                const upgradeAddress_Before = CONTRACTNEXT.address;
                
                await CONTRACTPREV.connect(addrOwner).set_upgrader(CONTRACTNEXT.address);

                const upgradeAddress_After = await CONTRACTPREV.get_upgrader();

                expect(upgradeAddress_After).to.equal(upgradeAddress_Before);
                console.log("TEST_ CALL \n")

            });
        })

        describe('Pause', () => {
            // Old contract set to not allow new NFTs to be created

            beforeEach(async () => {

                console.log("\n")
                console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("TEST_ CALL Owner : ",  addrOwner.address);
                console.log("TEST_ CALL Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade: pauses previous version contract', async () => {

                await CONTRACTPREV.connect(addrOwner).set_pauseVersion();

                const isPaused = await CONTRACTPREV.get_pauseVersion();

                expect(isPaused).to.equal(true);
                console.log("TEST_ CALL \n")
            });

        })

        describe('Replication', () => {
            // Upgrade contract reads the metadata from the current contract
            // Upgrade contract create new NFT

            beforeEach(async () => {

                console.log("\n")
                console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("TEST_ CALL Owner : ",  addrOwner.address);
                console.log("TEST_ CALL Operator : ", addrOperator.address); 
                console.log("TEST_ CALL Recipient : ", addrRecipient.address); 

                const tokenID = 1234567890;
                const tokenURI = 'one';
                const totalSupply_BeforeCreate = await CONTRACTPREV.totalSupply.call();
                console.log("TEST_ CALL totalSupply_BeforeCreate: ", totalSupply_BeforeCreate)
                await CONTRACTPREV.create(
                    addrRecipient.address,
                    tokenID,
                    tokenURI
                    );
                const totalSupply_AfterCreate = await CONTRACTPREV.totalSupply.call();
                console.log("TEST_ CALL totalSupply_AfterCreate: ", totalSupply_AfterCreate);

                console.log("TEST_ CALL NFT created..")
                console.log("\n")

            });


            it('upgrade: return contract total supply', async () => {

                const supply = await CONTRACTPREV.connect(addrOwner).totalSupply() // get_supply()
                
                expect(supply).to.equal(1);

            });

            it('upgrade: return role balance', async () => {

                const recipientBalance = (await CONTRACTPREV.connect(addrOwner).get_roleBalance(addrRecipient.address)).toNumber();

                expect(recipientBalance).to.equal(1);

            });

            it('upgrade: returns token ID for role account provided an index', async () => {

                const tokenID = 9876543210;
                const tokenURI = 'two';
                await CONTRACTPREV.create(
                    addrRecipient.address,
                    tokenID,
                    tokenURI
                    );

                const recipientBalance = (await CONTRACTPREV.connect(addrOwner).get_roleBalance(addrRecipient.address)).toNumber();

                let tokenIDs = new Array();

                for (let i = 0; i < recipientBalance; i++) {
                    let token_Id = (await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex(addrRecipient.address, i)).toNumber(); 
                    // console.log("TEST_ CALL TOKEN ID index: ", i , " is ", token_Id);
                    tokenIDs.push(token_Id);
                };

                expect(tokenIDs.toString()).to.equal([ 1234567890, 9876543210 ].toString());

            });

            it('upgrade: return token URI provided token id', async () => {

                const tokenID = 9876543210;
                const tokenURI = 'two';
                await CONTRACTPREV.create(
                    addrRecipient.address,
                    tokenID,
                    tokenURI
                    );
                const recipientBalance = (await CONTRACTPREV.connect(addrOwner).get_roleBalance(addrRecipient.address)).toNumber();
                let tokenIDs = new Array();

                for (let i = 0; i < recipientBalance; i++) {
                    let token_Id = (await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex(addrRecipient.address, i)).toNumber(); 
                    // console.log("TEST_ CALL TOKEN ID index: ", i , " is ", token_Id);
                    tokenIDs.push(token_Id);
                };

                let tokenURIs = new Array();

                for ( let i = 0; i < tokenIDs.length; i++ ) {
                    const uri = await CONTRACTPREV.connect(addrOwner).get_tokenURI(tokenIDs[i]);
                    // console.log("TEST_ CALL RETRIEVED URI: ", uri);
                    tokenURIs.push(uri);
                }

                expect(tokenURIs.toString()).to.equal([ "zien.io/one", "zien.io/two" ].toString());

            });

            it('upgrade: burn token provided token id', async () => {

                // GET TOTAL SUPPLY AFTER MINTING
                const totalSupply_BeforeBurn = await CONTRACTPREV.connect(addrOwner).totalSupply();
                console.log("TEST_ CALL TOTAL SUPPLY BEFORE: ", totalSupply_BeforeBurn);

                // GET ROLE BALANCE
                const recipientBalance = (await CONTRACTPREV.connect(addrOwner).get_roleBalance(addrRecipient.address)).toNumber();

                // RETRIEVE MINTED TOKEN IDs
                let tokenIDs = new Array();
                for (let i = 0; i < recipientBalance; i++) {
                    let token_Id = (await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex(addrRecipient.address, i)).toNumber(); 
                    // console.log("TEST_ CALL TOKEN ID index: ", i , " is ", token_Id);
                    tokenIDs.push(token_Id);
                };

                // BURN ALL TOKENS
                for ( let j = 0; j < tokenIDs.length; j++ ) {
                    await CONTRACTPREV.connect(addrOwner).set_burnToken(tokenIDs[j]);
                }

                // GET TOTAL SUPPLY AFTER BURN RUN
                const totalSupply_AfterBurn = await CONTRACTPREV.connect(addrOwner).totalSupply();
                console.log("TEST_ CALL TOTAL SUPPLY AFTER: ", totalSupply_AfterBurn);

                expect(totalSupply_AfterBurn.toNumber()).to.equal(0);
            });

        })

        describe('Destroy', () => {

            it('upgrade destroy: contract is destroyed', async () => {

                // After a contract has called selfdestruct(), all values are set to 0

                let checkBEFOREburn = await CONTRACTNEXT.connect(addrOwner).get_burnContract(CONTRACTPREV.address);
                console.log("TEST_ BEFORE check if contract exist: ", checkBEFOREburn);

                await CONTRACTPREV.connect(addrOwner).set_burnContract();
                
                let checkAFTERburn = await CONTRACTNEXT.connect(addrOwner).get_burnContract(CONTRACTPREV.address);
                console.log("TEST_ AFTER check if contract exist: ", checkAFTERburn);
                
                expect(checkBEFOREburn).to.equal(true);
                expect(checkAFTERburn).to.equal(false);

            });

            it('upgrade destroy: contract is destroyed only if it does not hold NFTs', async () => {

                const createError: string = "Operation aborted: the contract still holds NFTs";
                const tokenID = 9876543210;
                const tokenURI = 'two';
                await CONTRACTPREV.create(addrOwner.address,tokenID,tokenURI);
                
                let check = await CONTRACTNEXT.connect(addrOwner).get_burnContract(CONTRACTPREV.address);
                console.log("TEST_ check if contract exist ", check);

                await expect(
                    CONTRACTPREV.connect(addrOwner).set_burnContract()
                ).to.be.revertedWith(createError);
    
            });

        })


        describe('upgrade script', () => {
            // Upgrade contract reads the metadata from the current contract
            // Upgrade contract create new NFT

            beforeEach(async () => {

                console.log("\n")
                console.log('TEST_ CALL ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('TEST_ CALL ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("TEST_ CALL Owner : ",  addrOwner.address);
                console.log("TEST_ CALL Operator : ", addrOperator.address); 
                console.log("TEST_ CALL Recipient : ", addrRecipient.address); 
                
                const totalSupply_BeforeCreate = await CONTRACTPREV.totalSupply.call();
                // console.log("TEST_ CALL totalSupply_BeforeCreate: ", totalSupply_BeforeCreate)

                const tokenIDs = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
                const tokenURIs = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'height', 'nine'];

                for (let i = 0; i < tokenIDs.length; i++) {
                    await CONTRACTPREV.create(
                        addrOwner.address,
                        tokenIDs[i],
                        tokenURIs[i]
                        );
                };

                const totalSupply_AfterCreate = await CONTRACTPREV.totalSupply.call();
                console.log("TEST_ CALL BEFORE EACH PREV CREATED: ", totalSupply_AfterCreate.toNumber());

                console.log("TEST_ CALL NFTs created..")
                console.log("\n")

            });

            // SETTING ENDPOINTS

            // it('upgrade script: sets prevVersison on nextVersion, and nextVersion on prevVersion through createUpgrade()', async () => {
 
            //     const previousAddressBefore = CONTRACTPREV.address;
            //     const nextAddressBefore = CONTRACTNEXT.address;
                
            //     await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);

            //     const previousAddressAfter = await CONTRACTNEXT.get_previousVersion();
            //     const nextAddressAfter = await CONTRACTPREV.get_nextVersion();

            //     expect(previousAddressAfter).to.equal(previousAddressBefore);
            //     expect(nextAddressAfter).to.equal(nextAddressBefore);
            //     console.log("TEST_ CALL \n")

            // });

            // PAUSING VERSIONS

            // it('upgrade script: pauses previous version contract', async () => {
            //     await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);
            //     const isPaused = await CONTRACTPREV.get_pauseVersion();
            //     expect(isPaused).to.equal(true);
            // });

            it('upgrade script: scripts reproduces states', async () => {

                const previousAddressBefore = CONTRACTPREV.address;
                const nextAddressBefore = CONTRACTNEXT.address;
                
                const prev_totalSupply_BeforeReproduce = await CONTRACTPREV.connect(addrOwner).totalSupply();
                const next_totalSupply_BeforeReproduce = await CONTRACTNEXT.connect(addrOwner).totalSupply();

                await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);
                
                const previousAddressAfter = await CONTRACTNEXT.get_previousVersion();
                const nextAddressAfter = await CONTRACTPREV.get_nextVersion();

                const prev_totalSupply_AfterReproduce = await CONTRACTPREV.connect(addrOwner).totalSupply();
                const next_totalSupply_AfterReproduce = await CONTRACTNEXT.connect(addrOwner).totalSupply();

                const isPaused = await CONTRACTPREV.get_pauseVersion();
                
                // CHECK ADDRESSES
                expect(previousAddressAfter).to.equal(previousAddressBefore);
                expect(nextAddressAfter).to.equal(nextAddressBefore);
    
                // CONTRACT IS PAUSED
                expect(isPaused).to.equal(true);

                // TOKEN HAVE BEEN TRANSFERED
                expect(prev_totalSupply_BeforeReproduce.toNumber()).to.equal(10);
                expect(prev_totalSupply_AfterReproduce.toNumber()).to.equal(0);
                expect(next_totalSupply_BeforeReproduce.toNumber()).to.equal(0);
                expect(next_totalSupply_AfterReproduce.toNumber()).to.equal(10);

            });

        });

	});
});
