// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title A PvZ NFT generator
 * @author Jack Chen
 * @notice This contract is for creating NFTs that can be used in a PvZ game
 */
contract PlantNFTFactory is ERC721URIStorage {
    error PlantNFTFactory_insufficientFee();

    uint256 private s_nextTokenId;
    uint256 private immutable i_mintFee;

    event PlantMinted(uint256 indexed tokenId, string metadataURI);
    event PlantTraded(
        uint256 indexed tokenId,
        address indexed prevOwner,
        address indexed newOwner
    );

    modifier sufficientFee() {
        if (msg.value < i_mintFee) {
            revert PlantNFTFactory_insufficientFee();
        }
        _;
    }

    constructor(uint256 mintFee) ERC721("PvZPlants", "PVZP") {
        s_nextTokenId = 1;
        i_mintFee = mintFee;
    }

    function mintPlant(
        address player,
        string memory metadataURI
    ) public payable sufficientFee returns (uint256) {
        uint256 newTokenId = s_nextTokenId;
        s_nextTokenId++;

        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        // 在 mintPlant 中触发事件
        emit PlantMinted(newTokenId, metadataURI);
        return (newTokenId);
        // the rest is executed in fulfillRandomWords
    }

    function tradePlant(
        uint256 tokenId,
        address prevOwner,
        address newOwner
    ) public {
        // transfer ownership from prevOwner to newOwner
        require(
            ownerOf(tokenId) == prevOwner,
            "You are not the owner of this NFT"
        );
        // emit event to be traced by front end
        _safeTransfer(prevOwner, newOwner, tokenId, "");
        emit PlantTraded(tokenId, prevOwner, newOwner);
    }

    /**
     * Internal Functions
     */

    /**
     * View/Pure functions
     */

    // function tokenURI(
    //     uint256 tokenId
    // ) public view override returns (string memory) {
    //     return (_tokenURIs[tokenId]);
    // }

    function getNumOfNFTMinted() external view returns (uint256) {
        return s_nextTokenId - 1;
    }
}
