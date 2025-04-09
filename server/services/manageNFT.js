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
  requestRandomNumber(Object.keys(plantSkeleton["attributes"]).length);
  const attributes = await attributeGenerationListener(plantSkeleton);
  const metadataURI = await uploadAttributesToIPFS(attributes);
  // mint
  const tokenId = await mintPlant(metadataURI, plantType);

  return tokenId;
}

async function attributeGenerationListener(plantSkeleton) {
  return new Promise((resolve, reject) => {
    let attributes = [];
    // on receive event
    // generate attributes from ranNum
    eventEmitter.on("Random nums received", (requestId, randNums) => {
      console.log("Received random numbers:", requestId, randNums);
      console.log(
        `manageNFT attributeGenerationListener - plantSkeleton: ${plantSkeleton}`
      );

      const attributeNames = Object.keys(plantSkeleton["attributes"]);
      console.log(plantSkeleton["message"]);
      // Example: generate attributes based on the random numbers and plant skeleton
      randNums.forEach((ranNum, index) => {
        const attributeName = attributeNames[index];
        const { min, max } = plantSkeleton["attributes"][attributeNames];

        const attributeValue = ranNum * (max - min + 1) + min;
        const attribute = `${attributeName}: ${attributeValue.toFixed(2)}`;
        attributes.push(attribute);

        console.log(`  ${attributeName}: ${attributeValue.toFixed(2)}`);
      });

      resolve(attributes);
    });
  });
}

module.exports = { mintNFT, tradeNFT };
