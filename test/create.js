// SPDX-License-Identifier: MIT

const ScarceEdition = artifacts.require('ScarceEdition');

let CONTRACT;

contract('ScarceEditionCreate', (accounts) => {
    const addrOwner = accounts[0];
    beforeEach(async () => {
        CONTRACT = await ScarceEdition.new({ from: addrOwner });
    });

    it('create: Create a new Edition as the contract owner', async () => {
        const addrRecipient = accounts[1];
        const tokenID = 1234567890
        const tokenURIBefore = "http://scarce.editions/one"
        
        const totalSupplyBefore = await CONTRACT.totalSupply() 

        const createRes = await CONTRACT.create(addrRecipient, tokenID, tokenURIBefore, { from: addrOwner });

        const totalSupplyAfter = await CONTRACT.totalSupply() 
        const tokenURIAfter = await CONTRACT.tokenURI(tokenID);

 	assert.strictEqual(totalSupplyBefore.toNumber() + 1, totalSupplyAfter.toNumber());
        assert.strictEqual(tokenURIBefore, tokenURIAfter);
    });
    
    it('create: Create a new Edition when not the contract owner', async () => {
        const addrRecipient = accounts[1];
        const tokenID = 1234567890
        const tokenURIBefore = "http://scarce.editions/one"

        const totalSupplyBefore = await CONTRACT.totalSupply.call();

        let actualError = null;
        try {
              const createRes = await CONTRACT.create(addrRecipient, tokenID, tokenURIBefore, { from: addrRecipient });
        } catch (error) {
            actualError = error;
        }

        const totalSupplyAfter = await CONTRACT.totalSupply.call();

        assert.strictEqual(totalSupplyBefore.toNumber(), totalSupplyAfter.toNumber());
        assert.strictEqual(actualError.toString(),"Error: Returned error: VM Exception while processing transaction: revert Only the contract owner can perform this operation -- Reason given: Only the contract owner can perform this operation.");
    });      
});
