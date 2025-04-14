// dependencies
import dotenv from "dotenv";
import Web3 from "web3";

// files
import plantFeatures from "../config/plantFeatures";
import { prompt, uploadAttributesToIPFS } from "../utils/utils";
const {
  getRandomNumberGeneratorConfig,
  randomNumberGeneratorABI,
} = require("../config/randomNumberGeneratorConfig.js");

import {
  getPlantNFTFactoryAddress,
  mintPlant,
  requestRandomNumber,
} from "../utils/web3Instance";
import eventEmitter from "../utils/eventEmitter";

// 加载环境变量
dotenv.config();

// constants
const MINT_FEE = Web3.utils.toWei("0.1", "ether");
const CHAIN_ID = 31337; // to be made auto select chain
const NETWORKS = {
  31337: process.env.ANVIL_RPC_URL,
  11155111: process.env.SEPOLIA_RPC_URL,
};

const randomNumberGenerator = getRandomNumberGenerator();

// manage random numebrs
async function requestRandomNumber(numOfRandNums) {
  console.log("Using account:", web3.eth.defaultAccount);

  const balance = await web3.eth.getBalance(web3.eth.defaultAccount);
  console.log("Account Balance:", balance);
  console.log(
    "ContractManager - requestRandomNumber - using randomNumberGenerator:",
    randomNumberGenerator._address
  );
  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
  try {
    const receipt = await randomNumberGenerator.methods
      .makeRandomNumberRequest(numOfRandNums)
      .send({ from: web3.eth.defaultAccount, nonce: nonce, gas: 500000 });
    console.log(
      "Contract Manager - requestRandomNumber - Random number requested",
      receipt
    );
  } catch (error) {
    console.error(
      "Contract Manager - ❌ Requesting random number failed:",
      error
    );
  }
}

// event listener
randomNumberGenerator.events.randomNumberGenerated(
  { fromBlock: "latest" },
  (error, event) => {
    if (error) {
      console.error("Error occured in PlantMinted Event Listner: ", error);
    } else {
      const requestId = event.returnValues.requestId;
      const randNums = event.returnValues.randNums;
      eventEmitter.emit("Random nums received", requestId, randNums);
    }
  }
);

function getRandomNumberGenerator() {
  const config = getRandomNumberGeneratorConfig();
  const contractABI = randomNumberGeneratorABI;
  const contractAddress = config[CHAIN_ID].contractAddress;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log(
    `RandomNumberGeneratorConfig - contractAddress: ${contract._address}`
  );
  return contract;
}
