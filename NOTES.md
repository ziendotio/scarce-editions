// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

// INTERFACES
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
// EXTENSIONS
import "/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

contract ScarceEdition is ERC721, IERC721Metadata, Pausable, Burnable {
uint256 constant maxBatch = 40;

    address private _owner;
    address private _operator;
    bool private _upgradeApproval
    address public upgrader;

    // PHOENIX UPGRADE
    ScarceEdition public _nextVersion;
    ScarceEdition public _prevVersion;

    // authorised[owner][operator] -> will evaluate to true if operator is an operator for owner, and false otherwise
    mapping (address => mapping (address => bool)) internal authorised;

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

    modifier onlyOwnerOrOperator() {
        if ((msg.sender != _owner) && (msg.sender != _operator)) {
            revert(
                "Only the contract owner or operator can perform this operation"
            );
        }
        _;
    }

    modifier onlyUpgrader() {
        if ((msg.sender != upgrader)) {
            revert(
                "Only the contract upgrader can perform this operation"
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
    ) public onlyOwnerOrOperator returns (bool) {
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
    ) public onlyOwnerOrOperator returns (bool) {
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

    // onlyOwner
    // isScarceEdition
    setpreviousVersion ( address upgrade) public view onlyUpgrader {
        _prevVersion = ScarceEdition( upgrade );
        return true;
    }

    // external
    // onlyUpgrader
    //
    setNextVersion ( address upgrade) public view onlyUpgrader {
        _nextVersion = ScarceEdition( upgrade );
        return true;
    }

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




    // // external
    // setupgrader( address upgrade) public view onlyUpgrader {

    //     // upgrader = upgrade

    // }



    // // onlyUpgrader
    // // nextVersionIsAvailable && isScarceEdition
    // //
    // pauseContract() public view onlyUpgrader {

    //     // pause();
    //     // return paused();
    // }



    // runApproval ( address newOperator, bool status ) public view onlyUpgrader {
    //     // run logic for ownership transfer to new contract?
    //     // transferOwnership(newOperator)
    //     // setApprovalForAll(newOperator, status) external; // Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller. The operator cannot be the caller. Emits an ApprovalForAll event.
    //     // isApprovedForAll(_owner,_operator)

    // }



    // getTokenURI( number id ) view public {

    //     require(isValidToken(_tokenId));
    //     tokenURI( tokenId[i] );

    // }


    // // onlyIfExistInNextVersion
    // // onyUpgrader
    // function burnToken() public view onlyUpgrader {
    //     _burn(tokenId[i]);
    // }


    // function burnContract() public view onlyUpgrader {
    //     suicide(owner);
    //     // selfdestruct
    // }

    /**
     * @dev Replicate Contract State.
     * @param _owner -the Owner of the NFT
     * @param _operator -The address of the third party that acts on behalf of the owner.
     */
     // onlyOwner
     // onlyOwnerOfPreviousContract
    function createState() whenNotPaused() external {

        // // get NTFs state
        // prevNFTAmount = prevVersion.totalSupply();
        // // console.log("PREV total supply: ", prevNFTAmount)

        // // If no NTF bearer
        // if ( prevNFTAmount == 0 ) return true;

        // // If multiple unique NFTs
        // for (uint256 i = 0; i < batchSize; i++) {

        //     // read metadata from nft
        //     // The tokenURI function takes a tokenId as its only argument, and returns a URI which points to metadata about that specific token.
        //     // prevNTFuri = _prevVersion.tokenURI( tokenId[i] ) //get URI of token
        //     prevNTFuri = _prevVersion.getTokenURI(tokenId[i] ) //get URI of token

        //     // replicate token // create(address to, uint256 tokenId, string memory uri);
        //     safeReCreate = create( _owner, tokenId[i], string memory prevNTFuri );

        //     if ( safeReCreate ) {
            //         // delete the contract
            //         _prevVersion._burnToken(tokenId[i]);
            //     }
            // }
        // }
    };

    /**
     * @dev Logic for Phoenix Upgrade.
     * @param _prevVersion -the current contract address.
     */
     // onlyOwner
     // whenNotPaused
     // isValidAddress
     // checkOwner?
    function createUpgrade ( address prevVersion ) whenNotPaused() public onlyOwner returns (address) {

        // set reference hook to previous version // _prevVersion = prevVersion;
        _prevVersion = setpreviousVersion(prevVersion);
        // console.log("PREV version: ", _prevVersion);

        // set previous version reference hook to this version
        _prevVersion.setNextVersion(address(this));
        // console.log("PREV pointer: ", _prevVersion._nextVersion);

        // set NextVersion as operator of prevVersion contract
        _prevVersion.setupgrader(address(this));
        // console.log("PREV upgrade Operator", _prevVersion.upgrader);
        // console.log("PREV operator", _prevVersion._operator);

        // Old contract set to not allow new NFTs to be created
        _prevVersion.pauseContract();
        // console.log("PREV paused", _prevVersion.paused());

        // User authorise upgrade contract to control the asset // The operator cannot be the caller
        _upgradeApproval = _prevVersion.runApproval(address(this), true);

        // if ( _upgradeApproval ) {

        //     // Reproduce Assets
        //     createState();

        //     // Upgrade contract set the User as the owner
        //     _owner = _prevVersion._owner;
        //     _operator = _prevVersion._operator;

        //     // if contract has no ntfs left, burn the contract?
        //     if ( !prevVersion.totalSupply() ) _prevVersion.burnContract();

        // } else {

        //     _prevVersion._unpause()

        // }

    }

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------





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


    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
