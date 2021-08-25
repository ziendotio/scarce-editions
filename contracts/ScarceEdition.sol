// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

pragma experimental ABIEncoderV2;

// https://forum.openzeppelin.com/t/multiple-inheritance-in-openzeppelin-contracts-upgradeable/5118
import "@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";
import "hardhat/console.sol";

contract ScarceEdition is ERC721PresetMinterPauserAutoId {
    uint256 constant maxBatch = 40;
    address public UPGRADER_ROLE;
    address private _OWNER;
    address private _OPERATOR;
    uint256[] private tokensIDs;
    ScarceEdition public prevVersion;
    ScarceEdition public nextVersion;

    // constructor(string name, string symbol, string baseURI)
    /**
     * @dev {ERC721} token, including:
     *
     *  - ability for holders to burn (destroy) their tokens
     *  - a minter role that allows for token minting (creation)
     *  - a pauser role that allows to stop all token transfers
     *  - token ID and URI autogeneration
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
        if (
            (msg.sender != _OWNER) &&
            (msg.sender != _OPERATOR) &&
            (msg.sender != address(this))
        ) {
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
        console.log(
            "CONTRACT CALL create token for:  %s with token id: %s and token uri: %s",
            to,
            tokenId,
            uri
        );

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

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    /**
     * @dev function to retrieve contract owner.
     * Requirements:
     * @return address
     */

    function get_owner() public view returns (address) {
        console.log("CONTRACT CALL get_owner: owner = ", _OWNER);
        return _OWNER;
    }

    /**
     * @dev function to retrieve contract operator.
     * Requirements:
     * @return address
     */

    function get_operator() public view returns (address) {
        console.log("CONTRACT CALL get_operator: operator = ", _OPERATOR);
        return _OPERATOR;
    }

    /**
     * @dev function to set contract upgrade role
     * @param upgradeAddress The address of the new upgrade contract version
     * @return bool
     */
    function set_upgrader(address upgradeAddress) public returns (bool) {
        UPGRADER_ROLE = upgradeAddress;
        console.log(
            "CONTRACT CALL set_upgradeRole: UPGRADER_ROLE = ",
            UPGRADER_ROLE
        );
        return true;
    }

    /**
     * @dev function to get contract upgrade role
     * @return address
     */
    function get_upgrader() public view returns (address) {
        // hasRole(bytes32 role, address account) → bool
        console.log(
            "CONTRACT CALL get_upgradeRole: UPGRADER_ROLE = ",
            UPGRADER_ROLE
        );
        return UPGRADER_ROLE;
    }

    /**
     * @dev function to set contract reference to previous version.
     * @param previousAddress The address of the previous contract version
     * @return bool
     */
    function set_previousVersion(address previousAddress)
        public
        returns (bool)
    {
        prevVersion = ScarceEdition(previousAddress);
        // console.log(
        //     "CONTRACT CALL set_previousVersion: prevVersion is %s ",
        //     prevVersion
        // );
        return true;
    }

    /**
     * @dev function to get contract reference of previous version.
     * @return ScarceEdtion address
     */
    function get_previousVersion() public view returns (ScarceEdition) {
        // console.log(
        //     "CONTRACT CALL get_previousVersion: prevVersion = %s ",
        //     prevVersion
        // );
        return prevVersion;
    }

    /**
     * @dev function to set contract reference to upgrade version.
     * @param upgradeAddress The address of the new upgrade contract version
     * @return bool
     */
    function set_nextVersion(address upgradeAddress) external returns (bool) {
        nextVersion = ScarceEdition(upgradeAddress);
        // console.log(
        //     "CONTRACT CALL set_nextVersion: nextVersion = %s ",
        //     nextVersion
        // );
        return true;
    }

    /**
     * @dev function to get contract reference of next version.
     * @return ScarceEdtion address
     */
    function get_nextVersion() public view returns (ScarceEdition) {
        // console.log(
        //     "CONTRACT CALL get_nextVersion: nextVersion = %s ",
        //     nextVersion
        // );
        return nextVersion;
    }

    /**
     * @dev function to pause contract version.
     * Requirements:
     * - the CONTRACT caller must have the `PAUSER_ROLE`. (defaults to owner)
     * @return bool
     */
    function set_pauseVersion() public returns (bool) {
        _pause();
        return true;
    }

    /**
     * @dev function to unpause contract version.
     * Requirements:
     * - the CONTRACT caller must have the `PAUSER_ROLE`. (defaults to owner)
     * @return bool
     */
    function set_unpauseVersion() public returns (bool) {
        _unpause();
        return true;
    }

    /**
     * @dev function to get contract pause status.
     * @return bool
     */
    function get_pauseVersion() public view returns (bool) {
        return paused();
    }

    // /**
    //  * @dev function to set approval for tokens management.
    //  * Requirements:
    //  * @return bool
    //  */
    // function set_approval(address upgrader) public returns (bool) {
    //     console.log("CONTRACT CALL set_approval with: ", upgrader);
    //     // grantRole(bytes32 role, address account)
    //     // setOperator(upgrader);
    //     // setApprovalForAll(upgrader, bool true);
    //     // approve(address to, uint256 tokenId)
    //     return true;
    // }

    /**
     * @dev function to get contract total supply
     * Requirements:
     * @return uint256
     */
    function get_Supply() public view returns (uint256) {
        console.log("CONTRACT CALL get_Supply: totalSupply = ", totalSupply());
        return totalSupply();
    }

    /**
     * @dev function to returns the number of tokens that a particular user owns.
     * Requirements:
     * @return uint256
     */
    function get_roleBalance(address roleAddress)
        public
        view
        returns (uint256)
    {
        console.log(
            "CONTRACT CALL get_roleBalance: role = ",
            roleAddress,
            " balance = ",
            balanceOf(roleAddress)
        );
        // uint256 tokenAmount = balanceOf(roleAddress);
        // return tokenAmount;
        return balanceOf(roleAddress);
    }

    /**
     * @dev function to get token ID given a user role and index.
     * @param role - role of the user
     * @param index - specific index in range of role's balance
     * @return uint256
     */
    function get_tokenOfOwnerByIndex(address role, uint256 index)
        public
        view
        returns (uint256)
    {
        console.log(
            "CONTRACT CALL tokenID per index : %s",
            tokenOfOwnerByIndex(role, index)
        );
        return tokenOfOwnerByIndex(role, index);
    }

    /**
     * @dev function to get Token URI given a tokenID
     * @param token_id - the id of the token for which uri is fetched
     * Requirements:
     * @return string uid
     */
    function get_tokenURI(uint256 token_id)
        public
        view
        returns (string memory)
    {
        console.log(
            "CONTRACT CALL get_tokenURI for : ",
            token_id,
            "is: ",
            tokenURI(token_id)
        );
        return tokenURI(token_id);
    }

    /**
     * @dev function to burn a Token given it's Token ID
     * @param token_id - the id of the token to burn
     * Requirements:
     * @return bool
     */
    function set_burnToken(uint256 token_id) public returns (bool) {
        _burn(token_id);
        console.log("CONTRACT CALL burning tokenID: %s", token_id);
        return true;
    }

    /**
     * @dev function to burn Contract if no NTFs are left
     * Requirements: The contract cannot hold NFT(s)
     * @return bool
     */
    function set_burnContract() public onlyOwner returns (bool) {
        // pass control to another smart contract.
        // replace with nextVersion as owner once allowed
        require(
            totalSupply() == 0,
            "Operation aborted: the contract still holds NFTs"
        );
        address payable addr = payable(_OWNER);
        selfdestruct(addr);
        return true;
    }

    /**
     * @dev function to get contract burn status
     * @param version - the contract address
     * Requirements:
     * @return bool
     */
    function get_burnContract(address version) public view returns (bool) {
        // This is not foolproof, it can be subverted by a constructor call, due to the fact that while the constructor is running, EXTCODESIZE for that address returns 0.
        uint256 size;
        assembly {
            size := extcodesize(version)
        }
        return size > 0;
    }

    /**
     * @dev function to set approval for tokens management.
     * Requirements:
     * @return bool
     */
    function reproduceTokenState() public returns (bool) {
        uint256 totalNTF = prevVersion.get_Supply();
        address prevOwner = prevVersion.get_owner();
        uint256 ownerBalance = prevVersion.get_roleBalance(prevOwner);

        for (uint256 i = 0; i < ownerBalance; i++) {
            uint256 token_Id = prevVersion.get_tokenOfOwnerByIndex(_OWNER, i); //  tokenOfOwnerByIndex(address owner, uint256 index) → uint256 tokenId
            string memory token_Uri = prevVersion.get_tokenURI(token_Id); // tokenURI(uint256 tokenId) → string
            this.create(_OWNER, token_Id, token_Uri); //  function create( address to, uint256 tokenId, string memory uri) -> (bool)
            tokensIDs.push(token_Id);
        }

        for (uint256 j = 0; j < tokensIDs.length; j++) {
            if (_exists(tokensIDs[j])) {
                prevVersion.set_burnToken(tokensIDs[j]);
            }
        }

        return true;
    }

    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //

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
        // set reference hook to previous version
        this.set_previousVersion(prevVersionAddress);

        // set previous version reference hook to this version
        prevVersion.set_nextVersion(address(this));

        // set upgrader role for previous version
        prevVersion.set_upgrader(address(this));

        // reproduce prevVersion state
        this.reproduceTokenState();

        // pause the previous version contract
        prevVersion.set_pauseVersion();

        // destroy contract if no NFTs remaining
        // prevVersion.set_burnContract();

        return true;
    }

    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //
    // PHOENIX ***************************************************************** //

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // UPGRADE FUNCTIONALITY --->>> Research Upgradability #30
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------
}
