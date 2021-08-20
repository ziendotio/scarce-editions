// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

pragma experimental ABIEncoderV2;

// https://forum.openzeppelin.com/t/multiple-inheritance-in-openzeppelin-contracts-upgradeable/5118
import "@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";

contract ScarceEdition is ERC721PresetMinterPauserAutoId {
    uint256 constant maxBatch = 40;
    address public UPGRADER_ROLE;
    address private _OWNER;
    address private _OPERATOR;
    ScarceEdition public nextVersion;
    ScarceEdition public prevVersion;

    // // Optional mapping for token URIs
    // mapping (uint256 => string) private _tokenURIs;

    // constructor(string name, string symbol, string baseURI)
    /**
     * @dev {ERC721} token, including:
     *
     *  - ability for holders to burn (destroy) their tokens
     *  - a minter role that allows for token minting (creation)
     *  - a pauser role that allows to stop all token transfers
     *  - token ID and URI autogeneration
     *
     * This contract uses {AccessControl} to lock permissioned functions using the
     * different roles - head to its documentation for details.
     *
     * The account that deploys the contract will be granted the DEFAULT_ADMIN_ROLE, MINTER_ROLE and PAUSER_ROLE,
     * as well as the default admin role, which will let it grant both minter and pauser roles to other accounts.
     */
    constructor()
        ERC721PresetMinterPauserAutoId(
            "zien scarce editions",
            "AZSC",
            "zien.io/"
        )
    {
        _OWNER = msg.sender;
        _OPERATOR = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != _OWNER) {
            revert("Only the contract owner can perform this operation");
        }
        _;
    }

    modifier onlyOwnerOrOperator() {
        if ((msg.sender != _OWNER) && (msg.sender != _OPERATOR)) {
            revert(
                "Only the contract owner or operator can perform this operation"
            );
        }
        _;
    }

    modifier onlyUpgrader() {
        if ((msg.sender != UPGRADER_ROLE)) {
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
     * @dev Extension of {ERC20} that allows token holders to destroy both their own
     * tokens and those that they have an allowance for, in a way that can be
     * recognized off-chain (via event analysis).
     */

    /**
     * @dev function to set the operator.
     * @param OPERATOR The address of the new operator
     */
    function setOperator(address OPERATOR) public onlyOwner returns (bool) {
        _OPERATOR = OPERATOR;
        return true;
    }

    // SET - GET UPGRADE ROLE //
    // SET - GET UPGRADE ROLE //
    // SET - GET UPGRADE ROLE //
    // SET - GET UPGRADE ROLE //
    // SET - GET UPGRADE ROLE //

    /**
     * @dev function to set upgrade role
     * @param upgradeAddress The address of the new upgrade contract version
     * @return bool
     */
    function set_upgraderRole(address upgradeAddress) public returns (bool) {
        // grantRole("UPGRADER", upgradeAddress); // grantRole(bytes32 role, address account)
        UPGRADER_ROLE = upgradeAddress;
        return true;
    }

    /**
     * @dev function to get upgrade role
     * @return address
     */
    function get_upgraderRole() public view returns (address) {
        // require(hasRole("UPGRADER", upgradeAddress));// hasRole(bytes32 role, address account) → bool
        return UPGRADER_ROLE;
    }

    // SET - GET PREVIOUS VERSION //
    // SET - GET PREVIOUS VERSION //
    // SET - GET PREVIOUS VERSION //
    // SET - GET PREVIOUS VERSION //
    // SET - GET PREVIOUS VERSION //

    /**
     * @dev function to set reference to previous version.
     * @param previousAddress The address of the previous contract version
     * @return bool
     */
    function set_previousVersion(address previousAddress)
        public
        returns (bool)
    {
        prevVersion = ScarceEdition(previousAddress);
        return true;
    }

    /**
     * @dev function to get reference of previous version.
     * @return ScarceEdtion address
     */
    function get_previousVersion() public view returns (ScarceEdition) {
        return prevVersion;
    }

    // SET - GET NEXT VERSION //
    // SET - GET NEXT VERSION //
    // SET - GET NEXT VERSION //
    // SET - GET NEXT VERSION //
    // SET - GET NEXT VERSION //

    /**
     * @dev function to set reference to upgrade version.
     * @param upgradeAddress The address of the new upgrade contract version
     * @return bool
     */
    function set_nextVersion(address upgradeAddress) external returns (bool) {
        nextVersion = ScarceEdition(upgradeAddress);
        return true;
    }

    /**
     * @dev function to get reference of next version.
     * @return ScarceEdtion address
     */
    function get_nextVersion() public view returns (ScarceEdition) {
        return nextVersion;
    }

    // SET - GET PAUSE VERSION //
    // SET - GET PAUSE VERSION //
    // SET - GET PAUSE VERSION //
    // SET - GET PAUSE VERSION //
    // SET - GET PAUSE VERSION //

    /**
     * @dev function to pause the version.
     * Requirements:
     * - the caller must have the `PAUSER_ROLE`. (defaults to owner)
     * @return bool
     */
    function set_pauseVersion() public returns (bool) {
        _pause();
        return true;
    }

    /**
     * @dev function to unpause the version.
     * Requirements:
     * - the caller must have the `PAUSER_ROLE`. (defaults to owner)
     * @return bool
     */
    function set_unpauseVersion() public returns (bool) {
        _unpause();
        return true;
    }

    /**
     * @dev function getter version pause status.
     * @return bool
     */
    function get_pauseVersion() public view returns (bool) {
        return paused();
    }

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    /**
     * @dev function to retrieve contract OWNER.
     * Requirements:
     * @return address
     */

    function get_owner() public view returns (address) {
        return _OWNER;
    }

    /**
     * @dev function to retrieve contract OPERATOR.
     * Requirements:
     * @return address
     */

    function get_operator() public view returns (address) {
        return _OPERATOR;
    }

    // SET - GET APPROVAL //
    // SET - GET APPROVAL //
    // SET - GET APPROVAL //
    // SET - GET APPROVAL //
    // SET - GET APPROVAL //

    // /**
    //  * @dev function to set approval for tokens management.
    //  * Requirements:
    //  * - the caller must have the `PAUSER_ROLE`. (defaults to owner)
    //  * @return bool
    //  */
    // function set_approval(upgrader) public returns (bool) {
    //     // setOperator(upgrader);
    //     // setApprovalForAll(upgrader, bool true);
    //     // approve(address to, uint256 tokenId)

    //     return true;
    // }

    // SET - GET SUPPLY //
    // SET - GET SUPPLY //
    // SET - GET SUPPLY //
    // SET - GET SUPPLY //
    // SET - GET SUPPLY //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return uint256
     */
    function get_Supply() public returns (uint256) {
        // address payable self = address(this);
        // uint256 balance = self.balance;
        // return balance;
        // OR
        // uint256 contractBalance = address(this).balance;
        // retunr contractBalance;
        // return address(this).balance
        return totalSupply();
    }

    // // SET - GET ROLE BALANCE //
    // // SET - GET ROLE BALANCE //
    // // SET - GET ROLE BALANCE //
    // // SET - GET ROLE BALANCE //
    // // SET - GET ROLE BALANCE //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return uint256
     */
    function get_roleBalance() public returns (uint256) {
        // return balanceOf(_OWNER);
        return _OWNER.balance;
    }

    // SET - GET TOKEN ID //
    // SET - GET TOKEN ID //
    // SET - GET TOKEN ID //
    // SET - GET TOKEN ID //
    // SET - GET TOKEN ID //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return uint256
     */
    function get_tokenOfOwnerByIndex(address role, uint256 index)
        public
        returns (uint256)
    {
        return tokenOfOwnerByIndex(role, index);
    }

    // SET - GET TOKEN URI //
    // SET - GET TOKEN URI //
    // SET - GET TOKEN URI //
    // SET - GET TOKEN URI //
    // SET - GET TOKEN URI //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return string uid
     */
    function get_tokenURI(uint256 token_id) public returns (string memory) {
        return tokenURI(token_id);
    }

    // SET - BURN ASSET //
    // SET - BURN ASSET //
    // SET - BURN ASSET //
    // SET - BURN ASSET //
    // SET - BURN ASSET //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * - the caller must have the `PAUSER_ROLE`. (defaults to owner)
     * @return bool
     */
    function set_burnToken(uint256 token_id) public returns (bool) {
        _burn(token_id);
        return true;
    }

    // SET - GET REPRODUCESTATE //
    // SET - GET REPRODUCESTATE //
    // SET - GET REPRODUCESTATE //
    // SET - GET REPRODUCESTATE //
    // SET - GET REPRODUCESTATE //

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return bool
     */
    function reproduceState() public returns (bool) {
        bool hasTransfered;

        // contract balance
        // uint256 totalNTF = prevVersion.get_Supply(); // totalSupply();
        uint256 totalNTF = prevVersion.totalSupply(); // totalSupply();

        // balanceOf(address owner) → uint256 balance
        uint256 ownerBalance = prevVersion.get_roleBalance(); // balanceOf(this._OWNER);

        for (uint256 i = 0; i < ownerBalance; i++) {
            // READ TOKEN ID
            uint256 token_Id = prevVersion.get_tokenOfOwnerByIndex(_OWNER, i); //  tokenOfOwnerByIndex(address owner, uint256 index) → uint256 tokenId

            // READ URI
            string memory token_Uri = prevVersion.get_tokenURI(token_Id); // tokenURI(uint256 tokenId) → string

            // CREATE FROM URI + ID
            create(_OWNER, token_Id, token_Uri); //  function create( address to, uint256 tokenId, string memory uri) -> (bool)

            bool transfered = _exists(token_Id);

            // _exists(uint256 tokenId) → bool
            if (transfered) {
                prevVersion.set_burnToken(token_Id);
            }
        }

        return true;
    }

    // PHOENIX LOGIC //
    // PHOENIX LOGIC //
    // PHOENIX LOGIC //
    // PHOENIX LOGIC //
    // PHOENIX LOGIC //

    /**
     * @dev Logic for Phoenix Upgrade.
     * @param prevVersionAddress - the current / previous version contract address.
     * @return bool
     */
    function createUpgrade(address prevVersionAddress)
        public
        whenNotPaused
        returns (bool)
    {
        // set reference hook to previous version // DONE
        this.set_previousVersion(prevVersionAddress);

        // set previous version reference hook to this version // DONE
        prevVersion.set_nextVersion(address(this));

        // set upgrader role for previous version // DONE
        prevVersion.set_upgraderRole(address(this));

        // pause the previous version contract // DONE
        prevVersion.set_pauseVersion();

        return true;
    }

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
}
