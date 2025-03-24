// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import "../src/PlantNFTFactory.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {CreateSubscription} from "script/Interactions.s.sol";

contract DeployPlantFactory is Script {
    function run() external {
        PlantNFTFactory plantNFTFactory;
        HelperConfig helperConfig;

        (plantNFTFactory, helperConfig) = deployPlantNFTFactory();
    }

    function deployPlantNFTFactory()
        public
        returns (PlantNFTFactory, HelperConfig)
    {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        if (config.subscriptionId == 0) {
            // create susbscription
            CreateSubscription createSubscription = new CreateSubscription();
            (config.subscriptionId, config.vrfCoordinator) = createSubscription
                .createSubscription(config.vrfCoordinator);
        }

        vm.startBroadcast();
        PlantNFTFactory plantNFTFactory = new PlantNFTFactory(config.mintFee);
        vm.stopBroadcast();
        return (plantNFTFactory, helperConfig);
    }
}
