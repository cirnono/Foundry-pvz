// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import {Script} from "../lib/forge-std/src/Script.sol";

import {Script} from "forge-std/Script.sol";
import "../src/PlantNFTFactory.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "./Interactions.s.sol";

contract DeployPlantNFTFactory is Script {
    function run() external returns (PlantNFTFactory, HelperConfig) {
        return deployPlantNFTFactory();
    }

    function deployPlantNFTFactory()
        public
        returns (PlantNFTFactory, HelperConfig)
    {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        vm.startBroadcast();
        PlantNFTFactory plantNFTFactory = new PlantNFTFactory(config.mintFee);
        vm.stopBroadcast();

        return (plantNFTFactory, helperConfig);
    }
}
