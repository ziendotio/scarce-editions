// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ScarceEdition is ERC721, ERC721Pausable, ERC721Burnable {
    uint256 constant maxBatch = 40;

    address private _owner;
    address private _operator;
    address public upgrader;
    bool private _upgradeApproval;
    ScarceEdition public nextVersion;
    ScarceEdition public prevVersion;

    // authorised[owner][operator] -> will evaluate to true if operator is an operator for owner, and false otherwise
    // mapping(address => mapping(address => bool)) internal authorised;

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
            revert("Only the contract upgrader can perform this operation");
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

    /**
     * @dev function to set reference to previous version.
     * @param operator The address of the new operator
     */
    function setpreviousVersion(address previousAddress)
        external
        view
        onlyUpgrader
        returns (bool)
    {
        _prevVersion = ScarceEdition(previousAddress);
        return true;
    }

    /**
     * @dev function to set reference to upgrade version.
     * @param operator The address of the new operator
     */
    function setNextVersion(address upgradeAddress)
        external
        view
        onlyUpgrader
        returns (bool)
    {
        _nextVersion = ScarceEdition(upgradeAddress);
        return true;
    }

    /**
     * @dev function to set upgrade role
     * @param operator The address of the new operator
     */
    function setupgrader(address upgrade)
        external
        view
        onlyUpgrader
        returns (bool)
    {
        upgrader = upgrade;
        return true;
    }

    /**
     * @dev Logic for Phoenix Upgrade.
     * @param _prevVersion -the current contract address.
     */
    function createUpgrade(address prevVersionAddress)
        public
        whenNotPaused
        onlyOwner
        returns (bool)
    {
        // set reference hook to previous version // _prevVersion = prevVersion;
        prevVersion = setpreviousVersion(prevVersionAddress);
        console.log("NEXT set previous version to : ", prevVersion);

        // set previous version reference hook to this version
        prevVersion.setNextVersion(address(this));
        console.log("PREV set next version to : ", prevVersion.nextVersion);

        return true;
    }
}
