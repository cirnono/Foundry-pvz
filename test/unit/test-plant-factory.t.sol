// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployPlantNFTFactory} from "script/DeployPlantNFTFactory.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {PlantNFTFactory} from "../../src/PlantNFTFactory.sol";

contract PlantNFTFactoryTest is Test {
    event PlantMinted(uint256 indexed tokenId, string metadataURI);
    event PlantTraded(
        uint256 indexed tokenId,
        address indexed prevOwner,
        address indexed newOwner
    );

    PlantNFTFactory public plantNFTFactory;
    HelperConfig public helperConfig;

    address public PLAYER = makeAddr("player");
    address public OTHER = makeAddr("other");
    uint256 public constant STARTING_PLAYER_BALANCE = 100 ether;

    uint256 mintFee;
    address vrfCoordinator;
    bytes32 gasLane;
    uint32 callbackGasLimit;
    uint256 subscriptionId;

    function setUp() public {
        DeployPlantNFTFactory deployer = new DeployPlantNFTFactory();
        (plantNFTFactory, helperConfig) = deployer.deployPlantNFTFactory();

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        mintFee = config.mintFee;
        vrfCoordinator = config.vrfCoordinator;
        gasLane = config.gasLane;
        callbackGasLimit = config.callbackGasLimit;
        subscriptionId = config.subscriptionId;

        vm.deal(PLAYER, STARTING_PLAYER_BALANCE);
        vm.deal(OTHER, STARTING_PLAYER_BALANCE);
    }

    function testPlantStartingStatus() public view {
        assert(plantNFTFactory.getNumOfNFTMinted() == 0);
    }

    function testPlantMintWhenYouDontPayEnough() public {
        vm.expectRevert(
            PlantNFTFactory.PlantNFTFactory_insufficientFee.selector
        );
        plantNFTFactory.mintPlant(PLAYER, "");
    }

    function testPlantMintOne() public {
        // Arrange
        // Act
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );
        // Assert
        assert(plantNFTFactory.ownerOf(tokenId) == PLAYER);
        assert(plantNFTFactory.getNumOfNFTMinted() == 1);
        assert(
            keccak256(abi.encodePacked(plantNFTFactory.tokenURI(tokenId))) ==
                keccak256(abi.encodePacked("hhtp://a"))
        );
    }

    function testPlantMintEmitEvent() public {
        vm.expectEmit(true, false, false, true, address(plantNFTFactory));
        emit PlantMinted(1, "hhtp://a");
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );
    }

    function testPlantTransferByNonOwner() public {
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );

        vm.expectRevert("You are not the owner of this NFT");
        plantNFTFactory.tradePlant(tokenId, OTHER, PLAYER);
    }

    function testPlantTradeEmitEvent() public {
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );

        vm.expectEmit(true, true, true, false, address(plantNFTFactory));
        emit PlantTraded(tokenId, PLAYER, OTHER);
        plantNFTFactory.tradePlant(tokenId, PLAYER, OTHER);
        console.log(tokenId);
    }
}
