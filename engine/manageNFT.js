const plantFeatures = require("../utils/plantFeatures.js");
const contract = require("../utils/contractAddress.js");
const plantFactoryConfig = "utils/plantFactoryConfig.json";
const {
  prompt,
  getRandomNumber,
  getPlantNFTFactory,
} = require("utils/utils.js");
require("dotenv").config();

const MINT_FEE = web3.utils.toWei("0.1", "ether");
const NUM_OF_RANDOM_ATTRIBUTES = 2;

async function tradeNFT() {
  const plantNFTFactory = getPlantNFTFactory();

  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

async function mintNFT(walletAddress) {
  const plantNFTFactory = getPlantNFTFactory();
  console.log("Contract found at: ", contract.address);
  console.log("Minting new plant for wallet address: ", walletAddress);

  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  const plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  // request random number from randomNumberGenerator
  const randomNumbers = getRandomNumber(NUM_OF_RANDOM_ATTRIBUTES);
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

module.exports = { mintNFT, tradeNFT };
