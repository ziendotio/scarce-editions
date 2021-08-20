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
        // console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);

		CONTRACTNEXT = await ScarceEditionContract.deploy(); 
		await CONTRACTNEXT.deployed();
        // console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
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
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade: sets previous version reference on upgrade contract', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address);

                const previousAddressBefore = CONTRACTPREV.address;
                console.log("previousAddressBefore = ", previousAddressBefore );

                await CONTRACTNEXT.connect(addrOwner).set_previousVersion(previousAddressBefore);

                const previousAddressAfter = await CONTRACTNEXT.get_previousVersion();
                console.log("previousAddressAfter = ", previousAddressAfter );

                expect(previousAddressAfter).to.equal(previousAddressBefore);
                console.log("\n")

            });

            it('upgrade: sets upgrade version reference on previous contract', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address)   
                console.log("Operator : ", addrOperator.address )   

                // await CONTRACTPREV.set_upgraderRole(CONTRACTNEXT.address, {
                //     from: addrOwner.address,
                // });

                const nextAddressBefore = CONTRACTNEXT.address;
                console.log("nextAddressBefore = ", nextAddressBefore );

                await CONTRACTPREV.connect(addrOwner).set_nextVersion(CONTRACTNEXT.address);

                const nextAddressAfter = await CONTRACTPREV.get_nextVersion();
                console.log("nextAddressAfter = ", nextAddressAfter );
                expect(nextAddressAfter).to.equal(nextAddressBefore);
                console.log("\n")

            });

            it('upgrade script: sets prevVersison on nextVersion, and nextVersion on prevVersion through createUpgrade()', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address)   
                console.log("Operator : ", addrOperator.address )   
                
                const previousAddressBefore = CONTRACTPREV.address;
                const nextAddressBefore = CONTRACTNEXT.address;
                
                await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);

                const previousAddressAfter = await CONTRACTNEXT.get_previousVersion();
                const nextAddressAfter = await CONTRACTPREV.get_nextVersion();

                expect(previousAddressAfter).to.equal(previousAddressBefore);
                expect(nextAddressAfter).to.equal(nextAddressBefore);
                console.log("\n")

            });
        })

        
        describe('Upgrade Role', () => {

            beforeEach(async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade: sets upgrade_role on previous contract', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address)   
                console.log("Operator : ", addrOperator.address )   
                
                const upgradeAddress_Before = CONTRACTNEXT.address;
                
                await CONTRACTPREV.connect(addrOwner).set_upgraderRole(CONTRACTNEXT.address);

                const upgradeAddress_After = await CONTRACTPREV.get_upgraderRole();

                expect(upgradeAddress_After).to.equal(upgradeAddress_Before);
                console.log("\n")

            });

            it('upgrade script: does not allow previous version NFT minting', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address)   
                console.log("Operator : ", addrOperator.address )   

                const upgradeAddress_Before = CONTRACTNEXT.address;
                
                await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);

                const upgradeAddress_After = await CONTRACTPREV.get_upgraderRole();

                expect(upgradeAddress_After).to.equal(upgradeAddress_Before);
                console.log("\n")

            });
        })

        describe('Pause', () => {
            // Old contract set to not allow new NFTs to be created

            beforeEach(async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address); 
                console.log("\n")

            });

            it('upgrade: pauses previous version contract', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address);  

                await CONTRACTPREV.connect(addrOwner).set_pauseVersion();
                const isPaused = await CONTRACTPREV.get_pauseVersion();

                expect(isPaused).to.equal(true);
                console.log("\n")
            });

            it('upgrade script: pauses previous version contract', async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address); 

                await CONTRACTNEXT.connect(addrOwner).createUpgrade(CONTRACTPREV.address);

                const isPaused = await CONTRACTPREV.get_pauseVersion();

                expect(isPaused).to.equal(true);
                console.log("\n")

                
            });
        })

        describe.only('Replication', () => {
            // Upgrade contract reads the metadata from the current contract
            // Upgrade contract create new NFT

            beforeEach(async () => {

                console.log("\n")
                console.log('ScarceEdition PREV deployed to:', CONTRACTPREV.address);
                console.log('ScarceEdition NEXT deployed to:', CONTRACTNEXT.address);
                console.log("Owner : ",  addrOwner.address);
                console.log("Operator : ", addrOperator.address); 

                const tokenID = 1234567890;
                const tokenURI = 'one';
                const totalSupply_BeforeCreate = await CONTRACTPREV.totalSupply.call();
                console.log("totalSupply_BeforeCreate: ", totalSupply_BeforeCreate)
                await CONTRACTPREV.create(
                    addrOwner.address,
                    tokenID,
                    tokenURI
                    );
                const totalSupply_AfterCreate = await CONTRACTPREV.totalSupply.call();
                console.log("totalSupply_AfterCreate: ", totalSupply_AfterCreate);
                const tokenURIAfter = await CONTRACTPREV.tokenURI(tokenID);

                console.log("NFT created..")
                console.log("\n")

            });


            it('upgrade: return contract total supply', async () => {

                // this.balance
                // How to return contract total supply 
                const supply = await CONTRACTPREV.connect(addrOwner).totalSupply()
                console.log("CONTRACT SUPPLY: ", supply);
                expect(supply).to.equal(1);

            });

            it.only('upgrade: return role balance', async () => {

                // make sure supply of contract is 1

                // How to return a role balance which should have been allocated NFT


                const ownerBalance = await CONTRACTPREV.connect(addrOwner).get_roleBalance();
                console.log("owner balance: ", ownerBalance);

                expect(ownerBalance).to.equal(1);


            });

            it('upgrade: return token ID provided an index', async () => {

                // const id1 = await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex("_OWNER", 0);
                // const id2 = await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex("_OWNER", 1);
                // console.log("TOKEN ID: ", id1)
                // console.log("TOKEN ID: ", id2)
            });

            it('upgrade: return token URI provided token id', async () => {

                // const tokenId = await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex("_OWNER", 0);
                // const uri = await CONTRACTPREV.connect(addrOwner).get_tokenURI(tokenId);

            });

            it('upgrade: burn token provided token id', async () => {

                // const totalSupply_BeforeBurn = await CONTRACTPREV.connect(addrOwner).totalSupply();
                // const tokenId = await CONTRACTPREV.connect(addrOwner).get_tokenOfOwnerByIndex("_OWNER", 0);
                // await CONTRACTPREV.connect(addrOwner).set_burnToken(tokenId);
                // const totalSupply_AfterBurn = await CONTRACTPREV.connect(addrOwner).totalSupply();

                // expect(totalSupply_AfterBurn.toNumber()).to.equal(totalSupply_BeforeBurn.toNumber() - 1);
            });

            it('upgrade script: upgrade contract reads metadata from previous contract, reproduce state, clean up', async () => {

                // const totalSupply_BeforeReproduce = await CONTRACTPREV.connect(addrOwner).totalSupply();
                // await CONTRACTNEXT.connect(addrOwner).reproduceState()
                // const totalSupply_AfterReproduce = await CONTRACTPREV.connect(addrOwner).totalSupply();
                // expect(totalSupply_BeforeReproduce.toNumber() - 1).to.equal(
                //     totalSupply_AfterReproduce.toNumber()
                //     );

            });

        })

        // // Upgrade contract set the User as the owner
        // describe('Ownership', () => {

        //     it('upgrade: upgrade contract owner becomes previous version owner', async () => {
        //     });

        // })

        // // If no NFTs remain. Burn the contract
        // describe('Clean Up', () => {

        //     it('upgrade: burns previous version contract if no NTFs remain', async () => {
        //     });

        // })

	});
});
