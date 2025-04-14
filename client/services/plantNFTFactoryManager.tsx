// dependencies
import dotenv from "dotenv";

// files
import {
  getUserAddress,
  getUserBalance,
  toEther,
  getNonce,
  getContract,
  getChainId,
} from "../utils/web3Instance";
import plantFeatures from "../config/plantFeatures";
import { uploadAttributesToIPFS } from "../utils/utils";
import {
  getPlantFactoryConfig,
  plantNFTFactoryABI,
} from "../config/plantFactoryConfig.js";

import {} from "../utils/web3Instance";
import eventEmitter from "../utils/eventEmitter";

// load environemnt variables
dotenv.config();

// constants
const MINT_FEE = toEther("0.1", "ether");

// contract instance
const plantNFTFactory = getPlantNFTFactory();

function getPlantNFTFactory() {
  const config = getPlantFactoryConfig();
  const contractABI = plantNFTFactoryABI;
  const contractAddress = config[getChainId()].contractAddress;
  const contract = getContract(contractABI, contractAddress);
  console.log(`PlantFactoryConfig - contractAddress: ${contract}`);
  return contract;
}

// 定义函数参数的类型
export async function mintNFT(
  walletAddress: string,
  plantType: string
): Promise<string> {
  console.log("Contract found at: ", getPlantNFTFactoryAddress());

  if (!plantFeatures[plantType]) {
    throw new Error("Invalid plant type!");
  }

  // // request for random number
  // await requestRandomNumber(
  //   Object.keys(plantFeatures[plantType]['attributes']).length
  // );
  // const attributes = await attributeGenerationListener(plantSkeleton);
  const attributes = await temporaryGenerator(plantFeatures, plantType); // 测试用
  // const metadataURI = await uploadAttributesToIPFS(attributes);
  const metadataURI =
    "https://ipfs.io/ipfs/QmVpnsgaZ8gwn9Uf2CEgpphFqBgTYv6fbYrbu71325zbrx"; // 测试用
  // mint

  console.log("Using account:", walletAddress);
  const balance = await getUserBalance();
  console.log("Account Balance:", balance);
  try {
    const receipt = await plantNFTFactory.methods
      .mintPlant(walletAddress, metadataURI, plantType)
      .send({
        from: walletAddress,
        value: MINT_FEE,
        gas: "2000000",
      });

    const tokenId = receipt.events.PlantMinted.returnValues.tokenId.toString();
    return tokenId;
  } catch (error) {
    console.error("Contract Manager - ❌ Minting failed:", error);
  }

  return tokenId;
}

// 临时生成器函数，生成属性
async function temporaryGenerator(
  plantFeatures: Record<string, any>,
  plantType: string
): Promise<Record<string, string>> {
  const plantSkeleton = plantFeatures[plantType];
  let attributes: Record<string, string> = { PlantType: plantType };
  // 接收事件
  // 根据随机数生成属性
  const requestId = 1;
  const randNums = [Math.random(), Math.random(), Math.random()];
  console.log("Received random numbers:", requestId, randNums);

  const attributeNames = Object.keys(plantSkeleton["attributes"]);
  // 示例：根据随机数和植物骨架生成属性
  randNums.forEach((ranNum, index) => {
    const attributeName = attributeNames[index];
    const { min, max } = plantSkeleton["attributes"][attributeName];

    const attributeValue = ranNum * (max - min + 1) + min;
    attributes[attributeName] = attributeValue.toFixed(2);
    console.log(`  ${attributeName}: ${attributeValue.toFixed(2)}`);
  });
  console.log(plantSkeleton.message);
  return attributes;
}

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

// 定义函数参数的类型
async function tradeNFT(
  tokenId: string,
  from: string,
  to: string
): Promise<void> {
  try {
    const tx = await plantNFTFactory.tradePlant(tokenId, from, to);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (error) {
    console.error("❌ Trading failed:", error);
  }
}

// 属性生成监听器函数
async function attributeGenerationListener(
  plantSkeleton: Record<string, any>
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let attributes: string[] = [];
    // 接收事件
    eventEmitter.on(
      "Random nums received",
      (requestId: number, randNums: number[]) => {
        console.log("Received random numbers:", requestId, randNums);
        console.log(
          `manageNFT attributeGenerationListener - plantSkeleton: ${JSON.stringify(
            plantSkeleton
          )}`
        );

        const attributeNames = Object.keys(plantSkeleton["attributes"]);
        console.log(plantSkeleton["message"]);
        // 示例：根据随机数和植物骨架生成属性
        randNums.forEach((ranNum, index) => {
          const attributeName = attributeNames[index];
          const { min, max } = plantSkeleton["attributes"][attributeName];

          const attributeValue = ranNum * (max - min + 1) + min;
          const attribute = `${attributeName}: ${attributeValue.toFixed(2)}`;
          attributes.push(attribute);

          console.log(`  ${attributeName}: ${attributeValue.toFixed(2)}`);
        });

        resolve(attributes);
      }
    );
  });
}

// view
export function getPlantNFTFactoryAddress() {
  return plantNFTFactory;
}

export function getAvailablePlants() {
  return Object.keys(plantFeatures).join(", ");
}
