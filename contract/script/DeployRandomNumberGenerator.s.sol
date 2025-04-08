// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {RandomNumberGenerator} from "../src/RandomNumberGenerator.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "./Interactions.s.sol";

contract DeployRandomNumberGenerator is Script {
    function deployRandomNumberGenerator()
        public
        returns (RandomNumberGenerator, HelperConfig)
    {
        HelperConfig helperConfig = new HelperConfig();
        AddConsumer addConsumer = new AddConsumer();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        if (config.subscriptionId == 0) {
            // create susbscription
            CreateSubscription createSubscription = new CreateSubscription();
            (
                config.subscriptionId,
                config.vrfCoordinatorV2_5
            ) = createSubscription.createSubscription(
                config.vrfCoordinatorV2_5,
                config.account
            );
            FundSubscription fundSubscription = new FundSubscription();
            fundSubscription.fundSubscription(
                config.vrfCoordinatorV2_5,
                config.subscriptionId,
                config.link,
                config.account
            );

            helperConfig.setConfig(block.chainid, config);
        }

        vm.startBroadcast();
        RandomNumberGenerator randomNumberGenerator = new RandomNumberGenerator(
            config.vrfCoordinatorV2_5,
            config.gasLane,
            config.subscriptionId,
            config.callbackGasLimit
        );
        vm.stopBroadcast();

        addConsumer.addConsumer(
            address(randomNumberGenerator),
            config.vrfCoordinatorV2_5,
            config.subscriptionId,
            config.account
        );

        return (randomNumberGenerator, helperConfig);
    }

    function run() external returns (RandomNumberGenerator, HelperConfig) {
        return deployRandomNumberGenerator();
    }
}
