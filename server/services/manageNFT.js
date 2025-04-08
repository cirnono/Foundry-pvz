const Web3 = require("web3");
const plantFeatures = require("../config/plantFeatures.js");
const {
  prompt,
  getPlantNFTFactory,
  getRandomNumberInRange,
} = require("../utils/utils.js");
require("dotenv").config();

const MINT_FEE = Web3.utils.toWei("0.1", "ether");
const plantNFTFactory = getPlantNFTFactory();

async function tradeNFT() {
  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

async function mintNFT(walletAddress) {
  console.log("Searching for contract detail...");
  console.log("Contract found at: ", plantNFTFactory._address);
  console.log("Minting new plant for wallet address: ", walletAddress);
  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  // readline.question("Enter plant type: ", (type) => {
  //   plantType = type;
  // });
  plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  // request random number from randomNumberGenerator and generate attributes
  let attributes = generateAttributes(plantType, walletAddress);
  // output to files
  // upload to IPFS
  // obtain link
  const metadataURI = "";

  // mint
  try {
    const receipt = await plantNFTFactory.methods
      .mintPlant(walletAddress, metadataURI, plantType)
      .send({
        from: walletAddress,
        value: MINT_FEE,
        gas: 500000,
      });

    const tokenId = receipt.events.PlantMinted.returnValues.tokenId.toString();
    return tokenId;
  } catch (error) {
    console.error("❌ Minting failed:", error);
  }
}

async function generateAttributes(plantType, walletAddress) {
  const plant = plantFeatures[plantType];

  for (const attribute of Object.keys(plant.attributes)) {
    const { min, max } = plant.attributes[attribute];
    const value = await getRandomNumberInRange(min, max, walletAddress)[0];
    console.log(`  ${attribute}: ${value}`);
  }
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
      const plantType = event.returnValues.type;
      message = plantFeatures[plantType].message;
      message += ` ID: ${event.returnValues.tokenId}`;
      message += event.returnValues.metadataURI;
      console.log(message);
    }
  }
);

module.exports = { mintNFT, tradeNFT };
