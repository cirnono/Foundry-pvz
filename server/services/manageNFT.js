const Web3 = require("web3");
const plantFeatures = require("../config/plantFeatures.js");
const {
  prompt,
  getPlantNFTFactory,
  getRandomNumberInRange,
} = require("../utils/utils.js");
require("dotenv").config();

const MINT_FEE = Web3.utils.toWei("0.1", "ether");
// initialisation
let plantType;
console.log("Searching for contract detail...");
const plantNFTFactory = await getPlantNFTFactory();
console.log("Contract found at: ", plantNFTFactory.address);

async function tradeNFT() {
  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

async function mintNFT(walletAddress) {
  console.log("Minting new plant for wallet address: ", walletAddress);
  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  // request random number from randomNumberGenerator and generate attributes
  let attributes = generateAttributes(plantType);
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

  return tokenId;
}

async function generateAttributes(plantType) {
  const plant = plantFeatures[plantType];
  console.log(`${plantType}:`);
  Object.keys(plant.attributes).forEach((attribute) => {
    const { min, max } = plant.attributes[attribute];
    const value = getRandomNumberInRange(min, max);
    console.log(`  ${attribute}: ${value}`);
  });
  console.log(plant.message);
}

// event listener
plantNFTFactory.events.PlantMinted(
  {
    fromBlock: "latest",
  },
  (error, event) => {
    if (error) {
      console.error("Error occured in PlantMinted Event Listner: ", error);
    } else {
      message = plantFeatures[plantType].message;
      message += ` ID: ${event.returnValues.tokenId}`;
      message += event.returnValues.metadataURI;
      console.log(message);
    }
  }
);

module.exports = { mintNFT, tradeNFT };
