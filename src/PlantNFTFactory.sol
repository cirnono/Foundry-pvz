// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error PlantNFTFactory_insufficientFee();

/**
 * @title A PvZ NFT generator
 * @author Jack Chen
 * @notice This contract is for creating NFTs that can be used in a PvZ game
 */
contract PlantNFTFactory is ERC721URIStorage {
    uint256 private s_nextTokenId;

    uint256 private immutable i_mintFee;

    mapping(uint256 => string) private s_tokenIdToPlantData; // NFT ID -> 植物属性

    event PlantMinted(uint256 tokenId, string metadataURI);
    event PlantTraded(uint256 tokenId, address prevOwner, address newOwner);

    modifier sufficientFee() {
        if (msg.value <= i_mintFee) {
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

        s_tokenIdToPlantData[newTokenId] = metadataURI;
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

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return (s_tokenIdToPlantData[tokenId]);
    }

    function getNumOfNFTMinted() external view returns (uint256) {
        return s_nextTokenId - 1;
    }
}
