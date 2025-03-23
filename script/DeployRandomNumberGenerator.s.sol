// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import "../src/RandomNumberGenerator.sol";

contract DeployPlantFactory is Script {
    address vrfCoordinator;
    bytes32 gasLane;
    uint256 subscriptionId;
    uint32 callbackGasLimit;

    function deployPlantFactory() public returns (RandomNumberGenerator) {
        vm.startBroadcast();
        RandomNumberGenerator plantFactory = new RandomNumberGenerator(
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit
        );
        vm.stopBroadcast();
        return plantFactory;
    }

    function run() external returns (RandomNumberGenerator) {
        return deployPlantFactory();
    }
}
