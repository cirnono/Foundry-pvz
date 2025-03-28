const fs = require("fs");
const { ethers, getNamedAccounts } = require("hardhat");
const plantFeatures = require("../utils/plantFeatures.js");
const contract = require("../utils/contractAddress.js");
const { accountPrompt } = require("./user-manager.js");
require("dotenv").config();
const USERS_FILE = "./user.json";

const MINT_FEE = ethers.utils.parseEther("0.1");

async function tradeNFT() {
  const plantNFTFactory = getPlantNFTFactory();

  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);

    const receipt = await tx.wait();
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

async function mintNFT(walletAddress, plantType) {
  const plantNFTFactory = getPlantNFTFactory();

  console.log("Contract found at: ", contract.address);
  console.log("Minting new plant for wallet address: ", walletAddress);

  // request random number from randomNumberGenerator
  // generate attributes
  let attributes = {};
  let message = plantFeatures[plantType].message;
  // output to files
  // upload to IPFS
  // obtain link
  const metadataURI = plantFeatures[plantType].metadataURI;
  // mint
  try {
    const tx = await plantNFTFactory.mintPlant(user.address, metadataURI, {
      value: MINT_FEE,
      gasLimit: 500000,
    });

    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    // print success message and relevant properties
    message += ` ID: ${tokenId}`;
    for (const [key, value] of Object.entries(attributes)) {
      message += `, ${key}: ${value}`;
    }
    console.log(message);

    // define mint event
    const plantEvent = receipt.events.find(
      (event) => event.event === "PlantMinted"
    );

    // an example of how event can be used
    if (plantEvent) {
      const { tokenId, plantType, hp, produceRate, attack } = plantEvent.args;

      console.log("我是植物:");
      console.log(`Token ID: ${tokenId}`);
      console.log(`Plant Type: ${plantType}`);
      console.log(`HP: ${hp}`);
      console.log(`Produce Rate: ${produceRate}`);
      console.log(`Attack: ${attack}`);
    }
  } catch (error) {
    console.error("❌ Minting failed:", error);
  }
}

function getPlantNFTFactory() {
  const web3 = new Web3(plantFactoryConfig.config["local"].providerUrl); // chain address - should be different depending on the chain
  const contractABI = plantFactoryConfig.plantNFTFactoryABI; // should be placed in another file
  const contractAddress = plantFactoryConfig.config["local"].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}

module.exports = { mintNFT, tradeNFT };
