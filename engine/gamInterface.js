const fs = require("fs");
const readline = require("readline");
const Web3 = require("web3");
require("dotenv").config();
const accountManager = "accountManager.js";
const gameCore = "gameCore.js";
const manageNFT = "manageNFT.js";
const USERS_FILE = "utils/user.json";
const plantFactoryConfig = "utils/plantFactoryConfig.json";
const randomNumberGeneratorConfig = "utils/randomNumberGeneratorConfig.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Play function that is used to start the game.
 *      1. Check and pass the nft owned
 *      2. Start the game loop
 *      3. check termination
 */

function startGame() {
  // get contract
  // get user info
  // pass to gameCore.startGame
  // listen to termination of game - e.g. user click terminate
  console.log("Game loop developing...");
}

/**
 * Account functions that is used to mint or trade NFT
 *      1. connect wallet to identify user (generate or retrieve user file)
 *      2. mint NFT
 *      3. trade NFT
 */
function connectWallet() {
  // check existing package
}

async function mintNFT() {
  // get contract
  const contract = getContract();
  // check userinfo

  // ask to login or register
  // get wallet address
  // pass to manageNFT.mintNFT()
  console.log("Please log in or sign up");
  const userInfo = await accountPrompt();
  const user = await ethers.getSigner(userInfo.walletAddress);
  console.log(user);
  console.log("------------------------------------------");

  // get contract
  const PvZNFT = await ethers.getContractAt("PvZNFT", contract.address);
  console.log(`Got contract PvZNFT at ${PvZNFT.address}`);

  // get what user want to mint
  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  const plantType = await prompt("Enter plant type: ");

  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }
}

function tradeNFT() {
  // get contract
  // check userinfo
  // get target address
  // pass to manageNFT.tradeNFT()
}

/**
 * Internal helper functions
 */
function getContract() {
  const web3 = new Web3(plantFactoryConfig.config["local"].providerUrl); // chain address - should be different depending on the chain
  const contractABI = plantFactoryConfig.plantNFTFactoryABI; // should be placed in another file
  const contractAddress = plantFactoryConfig.config["local"].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}

/**
 * Menu functions
 */
mainPage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function mainPage() {
  console.log("You are currently on the local anvil chain");
  console.log("Please select from the following options: ");
  console.log("1. PlayGame");
  console.log("2. Account");
  console.log("3. Exit");
  const selection = await prompt("Enter the number index to select...");

  if (selection == "1") {
    gamePage();
  } else if (selection == "2") {
    accountPage();
  }
}

async function gamePage() {
  startGame();
}

async function accountPage() {
  if (!walletIsConnected) {
    connectWallet();
  }
  console.log("Please select from the following options: ");
  console.log("1. MintNFT");
  console.log("2. TradeNFT");
  console.log("3. Exit");
  const selection = await prompt("Enter the number index to select...");

  if (selection == "1") {
    mintNFT();
  } else if (selection == "2") {
    tradeNFT();
  }
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
