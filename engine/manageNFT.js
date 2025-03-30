const Web3 = require("web3");
const plantFeatures = require("./utils/plantFeatures.js");
const {
  prompt,
  getPlantNFTFactory,
  getRandomNumberInRange,
} = require("./utils/utils.js");
require("dotenv").config();

const MINT_FEE = Web3.utils.toWei("0.1", "ether");

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
  console.log("Searching for contract detail...");
  const plantNFTFactory = getPlantNFTFactory();
  console.log("Contract found at: ", plantNFTFactory.address);
  console.log("Minting new plant for wallet address: ", walletAddress);

  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  const plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  // request random number from randomNumberGenerator and generate attributes
  let attributes = generateAttributes(plantType);
  let message = plantFeatures[plantType].message;
  // output to files
  // upload to IPFS
  // obtain link
  const metadataURI = "";

  // mint
  try {
    const tx = await plantNFTFactory.mintPlant(user.address, metadataURI, {
      value: MINT_FEE,
      gasLimit: 500000,
    });
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();
  } catch (error) {
    console.error("❌ Minting failed:", error);
  }

  // define mint event
  const plantEvent = receipt.events.find(
    (event) => event.event === "PlantMinted"
  );

  // an example of how event can be used
  if (plantEvent) {
    // print success message and relevant properties
    message += ` ID: ${tokenId}`;
    for (const [key, value] of Object.entries(attributes)) {
      message += `, ${key}: ${value}`;
    }
    console.log(message);
  }
}

function generateAttributes(plantType) {
  const plant = plantFeatures[plantType];
  console.log(`${plantType}:`);
  Object.keys(plant.attributes).forEach((attribute) => {
    const { min, max } = plant.attributes[attribute];
    const value = getRandomNumberInRange(min, max);
    console.log(`  ${attribute}: ${value}`);
  });
  console.log(plant.message);
}

module.exports = { mintNFT, tradeNFT };
