const { getPlantContract } = require("./plantFactoryConfig");
const Web3 = require("web3");
const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

const dbName = "MyPvZ";
const client = new MongoClient(process.env.MONGO_URI);
let dbInstance = null;

async function getRandomNumberInRange(max, min) {
  return getRandomNumber() * (max - min + 1) + min;
}

async function getRandomNumber() {
  const randomNumberGenerator = getRandomNumberGenerator();

  try {
    const tx = await randomNumberGenerator.makeRandomNumberRequest();
    const receipt = await tx.wait();
    console.log(receipt);
    // const requestId = receipt.events[0].args.tokenId.toString();
  } catch (error) {
    console.error("❌ Resting random number failed:", error);
  }

  // define mint event
  const randomNumberGenerated = receipt.events.find(
    (event) => event.event === "randomNumberGenerated"
  );

  // an example of how event can be used
  if (randomNumberGenerated) {
    const { requestId, randNums } = randomNumberGenerated.args;
    return randNums;
  }
  return [];
}

async function prompt(question) {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    readline.question(question, (ans) => {
      readline.close();
      resolve(ans);
    })
  );
}

async function getPlantNFTFactory() {
  const local_anvil = 31337;
  const contract = await getPlantContract(local_anvil);
  console.log("returing back to mintNFT");
  return contract;
}

function getRandomNumberGenerator() {
  const randomNumberGeneratorConfig = "randomNumberGeneratorConfig.json";
  const web3 = new Web3(
    randomNumberGeneratorConfig.config["local"].providerUrl
  ); // chain address - should be different depending on the chain
  const contractABI =
    randomNumberGeneratorConfig.randomNumberGeneratorConfigABI; // should be placed in another file
  const contractAddress =
    randomNumberGeneratorConfig.config["local"].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}

async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    await client.connect();
    console.log("成功连接到数据库");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("连接数据库失败", err);
    throw err;
  }
}

function closeDB() {
  return client.close();
}

module.exports = {
  prompt,
  getRandomNumberInRange,
  getRandomNumber,
  getPlantNFTFactory,
  getRandomNumberGenerator,
  connectDB,
  closeDB,
};
