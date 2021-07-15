// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ScarceEdition is ERC721 {
    uint constant maxBatch = 40;

    address private _owner;
    address private _operator;  

    constructor() ERC721("zien scarce editions", "AZSC") public {
        _owner = msg.sender;
        _operator = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert("Only the contract owner can perform this operation");
        }
        _;
    }  
    
    modifier ownerOrOperatorOnly() {

        if ((msg.sender != _owner) && (msg.sender != _operator)) {
            revert("Only the contract owner or operator can perform this operation");
        }
        _;
    }  

    /**
      * @dev function to safely create a new token.
      * @param to The address that will own the minted token
      * @param tokenId, uint256 ID of the work
      * @param uri uri of the work
      */
    function create(address to, uint256 tokenId, string memory uri) public ownerOrOperatorOnly returns (bool) {
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri); 

        return true;
    }

    /**
      * @dev function to safely create a new token.
      * @param to The address that will own the minted token
      * @param tokenId, uint256 ID of the work
      * @param uri uri of the work
      */
    function batchCreate(uint256 batchSize, address[maxBatch] memory to, 
    uint256[maxBatch] memory tokenId, string[maxBatch] memory uri) public ownerOrOperatorOnly returns (bool) {

        if (batchSize > maxBatch) {
            revert("Batches can not exceed the max batch size (10)");
        }
      
        for (uint256 i = 0; i < batchSize; i++) {
            _mint(to[i], tokenId[i]);
            _setTokenURI(tokenId[i], uri[i]); 
        }

        return true;
    }

    /**
      * @dev function to set the operator.
      * Reverts if the given editionNumber is greater than editionCount.
      * @param operator The address of the new operator
      */
    function setOperator(address operator) public onlyOwner returns (bool) {
        _operator = operator;

        return true;
    }

}
