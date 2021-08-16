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
    address private _upgradeOperator;

    
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

    modifier upgradeOnly() {
        if ((msg.sender != _upgradeOperator)) {
            revert(
                "Only the contract upgrade can perform this operation"
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

        // Old contract set to not allow new NFTs to be created
        // Set upgrade contract address
        // User authorise upgrade contract to control the asset
        // Upgrade contract reads the metadata from the current contract
        // Upgrade contract create new NFT
        // Upgrade contract set the User as the owner
        // Upgrade contract burns the old NFT
        // If no NFTs remain. Burn the contract

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

       // you can call it anything you want
    function destroyContract() public upgradeOnly {
        suicide(owner);
    }

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

            // replicate token // create(address to, uint256 tokenId, string memory uri);
            safeReCreate = create( _owner, tokenId[i], string memory prevNTFuri );

            if ( safeReCreate ) {
                // delete the contract
                _prevVersion._burn(tokenId[i]); 
            }
        }
        }
    };
    
    /** 
     * @dev Logic for Phoenix Upgrade.
     * @param _prevVersion -the current contract address.
     */
    function createUpgrade ( address prevVersion ) public onlyOwner returns (address) {

        // set reference hook to previous version // _prevVersion = prevVersion;
        _prevVersion = ScarceEdition(prevVersion);
        console.log("PREV: ", _prevVersion);

        // set previous version reference hook to this version
        _prevVersion._nextVersion = ScarceEdition(address(this));
        console.log("PREV pointer: ", _prevVersion._nextVersion);

        // set NextVersion as operator of prevVersion contract
        _prevVersion._upgradeOperator = address(this)

        // Old contract set to not allow new NFTs to be created
        _prevVersion.pause();
        console.log("PREV paused", _prevVersion.paused());

        // User authorise upgrade contract to control the asset // The operator cannot be the caller
        let approval = _prevVersion.setApprovalForAll(_operator, true) external; // Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller. The operator cannot be the caller. Emits an ApprovalForAll event.
        console.log("APPROVAL: ", approval);
        let checkingApproval = _prevVersion.isApprovedForAll(_owner,_operator)
        console.log("CHECK: ", checkingApproval);

        if ( approval ) {

            // Run transfer
            _prevVersion.createState()

            // Upgrade contract set the User as the owner
            _owner = _prevVersion._owner;
            _operator = _prevVersion._operator;

            // if contract has no ntfs left, burn the contract?
            if ( !prevVersion.totalSupply() )

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