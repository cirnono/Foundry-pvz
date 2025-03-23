// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployPlantFactory} from "script/DeployPlantFactory.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {PlantNFTFactory} from "../../src/PlantNFTFactory.sol";

contract PlantNFTFactoryTest is Test {
    PlantNFTFactory public plantNFTFactory;
    HelperConfig public helperConfig;

    address public PLAYER = makeAddr("player");
    uint256 public constant BALANCE = 100 ether;

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
    }

    function testPlantStartingStatus() public view {
        assert(plantNFTFactory.getNumOfNFTMinted() == 0);
    }
}
