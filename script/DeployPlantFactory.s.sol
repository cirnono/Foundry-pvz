// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import "../src/PlantFactory.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";

contract DeployPlantFactory is Script {
    function run() external returns (PlantFactory) {
        return deployPlantFactory();
    }

    function deployPlantFactory() public returns (PlantFactory, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        
        vm.startBroadcast();
        PlantFactory plantFactory = new PlantFactory(config.mintFee);
        vm.stopBroadcast();
        return (plantFactory, config);
    }
}


async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const PATH = "./utils/contractAddress.js"
    // let ethUsdPriceFeedAddress
    // if (chainId == 31337) {
    //     const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    //     ethUsdPriceFeedAddress = ethUsdAggregator.address
    // } else {
    //     ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    // }
    log("----------------------------------------------------")
    log("Deploying PvZNFT and waiting for confirmations...")
    const PvZNFT = await deploy("PvZNFT", {
        from: deployer,
        args: [],
        log: false,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`PvZNFT deployed at ${PvZNFT.address}`)

    const formattedData = `module.exports = {\n\taddress: ${JSON.stringify(
        PvZNFT.address,
        null,
        2
    )}\n}`

    try {
        fs.writeFileSync(PATH, formattedData, "utf8")
    } catch (error) {
        console.error("Error writing to file:", error)
    }

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(PvZNFT.target, [])
    }
}

module.exports.tags = ["all", "PvZNFT"]
