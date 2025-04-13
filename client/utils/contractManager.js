const { Web3 } = require("web3");
require("dotenv").config();

// related files
const {
  getPlantFactoryConfig,
  plantNFTFactoryABI,
} = require("../config/plantFactoryConfig.js");
const {
  getRandomNumberGeneratorConfig,
  randomNumberGeneratorABI,
} = require("../config/randomNumberGeneratorConfig.js");
const eventEmitter = require("./eventEmitter.js");

// constant
const MINT_FEE = Web3.utils.toWei("0.1", "ether");
const CHAIN_ID = 31337; // to be made auto select chain
const NETWORKS = {
  31337: process.env.ANVIL_RPC_URL,
  11155111: process.env.SEPOLIA_RPC_URL,
};
// initialise web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORKS[CHAIN_ID]));

// initialise contract instance
const plantNFTFactory = getPlantNFTFactory();
const randomNumberGenerator = getRandomNumberGenerator();

async function connectWallet(walletAddress) {
  const PRIVATE_KEY = process.env.ANVIL_PRIVATE_KEY;
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  console.log("🟢 Web3 initialized with default account:", account.address);
}

async function mintPlant(metadataURI, plantType) {
  console.log("Using account:", web3.eth.defaultAccount);
  const balance = await web3.eth.getBalance(web3.eth.defaultAccount);
  console.log("Account Balance:", balance);
  console.log(
    "ContractManager - mintPlant - using plantNFTFactory:",
    plantNFTFactory._address
  );

  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);

  try {
    const receipt = await plantNFTFactory.methods
      .mintPlant(web3.eth.defaultAccount, metadataURI, plantType)
      .send({
        from: web3.eth.defaultAccount,
        value: MINT_FEE,
        nonce: nonce,
        gas: 2000000,
      });

    const tokenId = receipt.events.PlantMinted.returnValues.tokenId.toString();
    return tokenId;
  } catch (error) {
    console.error("Contract Manager - ❌ Minting failed:", error);
  }
}

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

// internal
function getPlantNFTFactory() {
  const config = getPlantFactoryConfig();
  const contractABI = plantNFTFactoryABI;
  const contractAddress = config[CHAIN_ID].contractAddress;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log(`PlantFactoryConfig - contractAddress: ${contract._address}`);
  return contract;
}

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

//view
function getPlantNFTFactoryAddress() {
  return plantNFTFactory._address;
}

function getUserAddress() {
  return web3.eth.defaultAccount;
}

module.exports = {
  getPlantNFTFactoryAddress,
  mintPlant,
  requestRandomNumber,
  getUserAddress,
};
