// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

contract ScarceEdition is ERC721, Pausable, Burnable {
    uint256 constant maxBatch = 40;

    address private _owner;
    address private _operator;

    // PHOENIX UPGRADE
    ScarceEdition public _nextVersion;
    ScarceEdition public _prevVersion;
    
    event Burn(address indexed burner, uint256 value);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    constructor() public ERC721("zien scarce editions", "AZSC") {
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
            revert(
                "Only the contract owner or operator can perform this operation"
            );
        }
        _;
    }

    /**
     * @dev function to safely create a new token.
     * @param to The address that will own the minted token
     * @param tokenId, uint256 ID of the work
     * @param uri uri of the work
     */
    function create(
        address to,
        uint256 tokenId,
        string memory uri
    ) public ownerOrOperatorOnly returns (bool) {
        require(paused == false, "Contract Paused");
        
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
    function batchCreate(
        uint256 batchSize,
        address[maxBatch] memory to,
        uint256[maxBatch] memory tokenId,
        string[maxBatch] memory uri
    ) public ownerOrOperatorOnly returns (bool) {
        require(paused == false, "Contract Paused");


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
     * @param operator The address of the new operator
     */
    function setOperator(address operator) public onlyOwner returns (bool) {
        _operator = operator;

        return true;
    }

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    // function totalSupply() external view returns (uint256);

    // /**
    //  * @dev function to perform contract details transfer,
    //  * @param _from -the current owner of the NFT
    //  * @param _to -address of the new owner
    //  * @param _tokenId -unique ID of the NFT to be transferred.
    //  * @param _data -Additional Data.
    //  */
    // function safeTransferFrom(address from, address to, uint256 tokenId) external;
    //     // a. It throws an error if the msg.sender is not the current owner, an authorized operator or an approved address for the NFT to be transferred.
    //     // b. If the _from parameter doesn’t contain the address of the current owner, then error will be thrown.
    //     // c. If the _to parameter is a zero address(invalid address).
    //     // d. If the _tokenId is not a valid NFT.
    //     // e. One of the most imperative part that must be understood is that as soon as the transfer is complete, this function checks if the _to address passed in the parameter is an Externally Owned Account(owned by a person) or a Contract Address(owned by a contract).

    // /**
    //  * @dev it allows the owner of the NFT to allow or prevent certain third parties, i.e., operators to manage all of his/her NFTs.
    //  * @param _operator -the address of the operator who will be approved for control over the NFTs
    //  * @param _approved -True if the provided operator is to be approved or False if the approval is to be revoked.
    //  */
    // function setApprovalForAll(address _operator, bool _approved) external;        
    //     //  It throws an error if the msg.sender is not the current owner, an authorized operator or an approved address for the NFT to be transferred.

    // /**
    //  * @dev provides us with the information that whether or not an operator is authorized for another address.
    //  * @param _owner -the Owner of the NFT
    //  * @param _operator -The address of the third party that acts on behalf of the owner.
    //  */
    // function isApprovedForAll(address _owner, address _operator) external view returns (bool);   

    // /**
    //  * @dev Destroys tokenId. The approval is cleared when the token is burned.
    //  * @param _owner -the Owner of the NFT
    //  * @param _operator -The address of the third party that acts on behalf of the owner.
    //  */
    // function _burn(uint256 tokenId);






    /**
     * @dev Replicate Contract State.
     * @param _owner -the Owner of the NFT
     * @param _operator -The address of the third party that acts on behalf of the owner.
     */

    function createState() external {

        // get NTFs state
        ntfsAmount = prevVersion.totalSupply();  
        console.log("PREV total supply: ", ntfsAmount)

        // If no NTF bearer
        if ( ntfsAmount == 0 ) return true;
        
        // If multiple unique NFTs
        for (uint256 i = 0; i < batchSize; i++) {

            // read metadata from nft
            prevNTFuri = _prevVersion//get URI of token

            // replicate token
            safeReCreate = create( _owner, tokenId[i], string memory prevNTFuri );

            if ( safeReCreate ) {
                // delete the contract
                _prevVersion._burn(tokenId[i]); 
            }
        }
        }
    };


            // safeTransfer = _prevVersion.safeTransferFrom(_owner, _operator, tokenId[i]); // return bool 
            // create(address to, uint256 tokenId, string memory uri);
    
    /** 
     * @dev Logic for Phoenix Upgrade.
     * @param _prevVersion -the current contract address.
     */
    function createUpgrade ( address prevVersion ) public onlyOwner returns (address) {

        // set reference hook to previous version 
        _prevVersion = prevVersion;
        console.log("PREV: ", _prevVersion);

        // set previous version reference hook to this version
        _prevVersion._nextVersion = address(this);
        console.log("PREV pointer: ", _prevVersion._nextVersion);

        // Old contract set to not allow new NFTs to be created
        _prevVersion.pause();
        console.log("PREV paused", _prevVersion.paused());

        // User authorise upgrade contract to control the asset
        let approval = _prevVersion.setApprovalForAll(_operator, true) external; // Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller. The operator cannot be the caller. Emits an ApprovalForAll event.
        console.log("APPROVAL: ", approval);
        let checkingApproval = _prevVersion.isApprovedForAll(_owner,_operator)
        console.log("CHECK: ", checkingApproval);78

        if ( approval ) {

            // Run transfer
            _prevVersion.createState()

            // Upgrade contract set the User as the owner
            _owner = _prevVersion._owner;
            _operator = _prevVersion._operator;
            
        }

        } else {
            _prevVersion._unpause()
        }


    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------


    }