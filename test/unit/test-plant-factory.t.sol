// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployPlantFactory} from "script/DeployPlantFactory.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {PlantNFTFactory} from "../../src/PlantNFTFactory.sol";

contract PlantNFTFactoryTest is Test {
    event PlantMinted(uint256 indexed tokenId, string metadataURI);
    event PlantTraded(uint256 tokenId, address prevOwner, address newOwner);

    PlantNFTFactory public plantNFTFactory;
    HelperConfig public helperConfig;

    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_PLAYER_BALANCE = 100 ether;

    uint256 mintFee;
    address vrfCoordinator;
    bytes32 gasLane;
    uint32 callbackGasLimit;
    uint256 subscriptionId;

    function setUp() public {
        DeployPlantFactory deployer = new DeployPlantFactory();
        (plantNFTFactory, helperConfig) = deployer.deployPlantNFTFactory();

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        mintFee = config.mintFee;
        vrfCoordinator = config.vrfCoordinator;
        gasLane = config.gasLane;
        callbackGasLimit = config.callbackGasLimit;
        subscriptionId = config.subscriptionId;

        vm.deal(PLAYER, STARTING_PLAYER_BALANCE);
    }

    function testPlantStartingStatus() public view {
        assert(plantNFTFactory.getNumOfNFTMinted() == 0);
    }

    function testPlantMintWhenYouDontPayEnough() public {
        vm.prank(PLAYER);

        vm.expectRevert(
            PlantNFTFactory.PlantNFTFactory_insufficientFee.selector
        );
        plantNFTFactory.mintPlant(PLAYER, "");
    }

    function testPlantMintOne() public {
        // Arrange
        vm.prank(PLAYER);
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
        vm.prank(PLAYER);
        vm.expectEmit(true, false, false, true, address(plantNFTFactory));
        emit PlantMinted(1, "hhtp://a");
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );
    }

    function testPlantTransferByNonOwner() public {
        vm.prank(PLAYER);
        uint256 tokenId = plantNFTFactory.mintPlant{value: mintFee}(
            PLAYER,
            "hhtp://a"
        );
    }
    // TODO: test all functions from the contracts
    // TODO: use next.js to build a simple front end
    // TODO: quickly learn golang and rust
}
