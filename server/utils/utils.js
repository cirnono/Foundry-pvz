// packages
const Web3 = require("web3");
const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

// related files
const { getPlantContract } = require("../config/plantFactoryConfig");
const {
  getRandomNumberGeneratorContract,
} = require("../config/randomNumberGeneratorConfig");

// readline management
const rl = require("readline");
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) =>
    readline.question(question, (ans) => {
      resolve(ans);
    })
  );
}

function closePrompt() {
  readline.close();
}

// database initialisation
const dbName = "MyPvZ";
const client = new MongoClient(process.env.MONGO_URI);
let dbInstance = null;

async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    await client.connect();
    console.log("utils - Connected to database");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("utils - Fail to connect to database", err);
    throw err;
  }
}

function closeDB() {
  return client.close();
}

// manage random numebrs
async function getRandomNumberInRange(max, min, walletAddress) {
  return (await getRandomNumber(walletAddress)) * (max - min + 1) + min;
}

async function getRandomNumber(walletAddress) {
  const randomNumberGenerator = getRandomNumberGenerator();

  try {
    const receipt = await randomNumberGenerator.methods
      .makeRandomNumberRequest(1)
      .send({ from: walletAddress });

    console.log(receipt);
    const event = receipt.events.randomNumberGenerated;
    if (event) {
      const requestId = event.returnValues.requestId;
      const randNums = event.returnValues.randNums;
      console.log("🎲 Random result:", randNums);
      return randNums;
    }
  } catch (error) {
    console.error("utils - ❌ Requesting random number failed:", error);
  }
  return [];
}

// retrive contracts
function getPlantNFTFactory() {
  const local_anvil = 31337;
  const contract = getPlantContract(local_anvil);
  return contract;
}

async function getRandomNumberGenerator() {
  const local_anvil = 31337;
  const contract = await getRandomNumberGeneratorContract(local_anvil);
  return contract;
}

module.exports = {
  prompt,
  getRandomNumberInRange,
  getRandomNumber,
  getPlantNFTFactory,
  getRandomNumberGenerator,
  connectDB,
  closeDB,
  closePrompt,
};
