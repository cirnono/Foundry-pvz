// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error PlantFactory_insufficientFee();

/**
 * @title A PvZ NFT generator
 * @author Jack Chen
 * @notice This contract is for creating NFTs that can be used in a PvZ game
 */
contract PvZNFT is ERC721URIStorage {
    uint256 private s_nextTokenId;
    uint256 private immutable i_mintFee;
    mapping(uint256 => Plant) private plantData; // NFT ID -> 植物属性

    struct Plant {
        string plantType; // 记录植物类型，如 "Sunflower"、"Peashooter"
        uint256 hp;
        uint256 produceRate;
        uint256 attack;
    }

    // 事件定义
    event PlantMinted(
        uint256 tokenId,
        string plantType,
        uint256 hp,
        uint256 produceRate,
        uint256 attack
    );

    event PlantTraded(uint256 tokenId, address prevOwner, address newOwner);

    modifier sufficientFee() {
        if (msg.value <= i_mintFee) {
            revert PlantFactory_insufficientFee();
        }
    }

    constructor(uint256 mintFee) ERC721("PvZPlants", "PVZP") {
        s_nextTokenId = 1;
        i_mintFee = mintFee;
    }

    function mintPlant(
        address player,
        string memory plantType,
        uint256 hp,
        uint256 produceRate,
        uint256 attack,
        string memory metadataURI
    ) public payable sufficientFee returns (uint256) {
        uint256 newTokenId = s_nextTokenId;
        s_nextTokenId++;

        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        plantData[newTokenId] = Plant(plantType, hp, produceRate, attack);
        // 在 mintPlant 中触发事件
        emit PlantMinted(
            newTokenId,
            plantData[newTokenId].plantType,
            plantData[newTokenId].hp,
            plantData[newTokenId].produceRate,
            plantData[newTokenId].attack
        );
        return (newTokenId);
    }

    function tradePlant(
        uint256 tokenId,
        address prevOwner,
        address newOwner
    ) public {
        // transfer ownership from prevOwner to newOwner
        // maybe carried out payment as well?
        // emit event to be traced by front end
    }

    /**
     * View/Pure functions
     */

    function getPlant(
        uint256 tokenId
    ) public view returns (string memory, uint256, uint256, uint256) {
        Plant memory plant = plantData[tokenId];
        return (plant.plantType, plant.hp, plant.produceRate, plant.attack);
    }
}
