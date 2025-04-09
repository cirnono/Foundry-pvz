require("dotenv").config();

const plantFeatures = require("../config/plantFeatures.js");
const { prompt, uploadAttributesToIPFS } = require("../utils/utils.js");
const {
  getPlantNFTFactoryAddress,
  mintPlant,
  requestRandomNumber,
} = require("../utils/contractManager.js");
const eventEmitter = require("../utils/eventEmitter");

async function tradeNFT() {
  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

async function mintNFT() {
  console.log("Contract found at: ", getPlantNFTFactoryAddress());
  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  // request random number from randomNumberGenerator and generate attributes
  const plantSkeleton = plantFeatures[plantType];
  requestRandomNumber(plantSkeleton.length);
  const attributes = await attributeGenerationListener(plantSkeleton);
  const metadataURI = await uploadAttributesToIPFS(attributes);
  // mint
  const tokenIndex = await mintPlant(metadataURI, plantType);

  return tokenIndex;
}

async function attributeGenerationListener(plantSkeleton) {
  // on receive event
  // generate attributes from ranNum
  let attributes = [];
  eventEmitter.on("Random nums received", (requestId, randNums) => {
    console.log("Received random numebrs:", requestId, randNums);
    console.log(
      `manageNFT attributeGenerationListener - plantSkeleton: ${plantSkeleton}`
    );
    // ranNums.forEach((ranNum) => {

    // attributes.push(ranNum * (max - min + 1) + min);
    // console.log(`  ${attribute}: ${value}`);
    // console.log(plantSkeleton.message);
    // });
  });
  return attributes;
}

module.exports = { mintNFT, tradeNFT };
