const fs = require("fs");
const readline = require("readline");
const Web3 = require("web3");
const ethers = require("ethers");
require("dotenv").config();
const accountManager = "accountManager.js";
const gameCore = "gameCore.js";
const manageNFT = "manageNFT.js";
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
  const contract = getContract();
  console.log("Game loop developing...");
}

/**
 * Account functions that is used to mint or trade NFT
 *      1. connect wallet to identify user (generate or retrieve user file)
 *      2. mint NFT
 *      3. trade NFT
 */
async function connectWallet() {
  // check existing package to get the walletaddress
  const userWalletAddress = "";
  if (!accountManager.getUserByAddress(userWalletAddress)) {
    accountManager.addUser(userWalletAddress, []);
  }

  return userWalletAddress;
}

async function mintNFT(walletAddress) {
  // get wallet address
  let tokens = accountManager.getUserByAddress(walletAddress).ownedNFT;

  // get what user want to mint - need to update
  console.log("Available plants: ", Object.keys(plantFeatures).join(", "));
  const plantType = await prompt("Enter plant type: ");
  if (!plantFeatures[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  const tokenId = manageNFT.mintNFT(walletAddress, plantType);
  tokens.push(tokenId.toString());
  accountManager.updateUserTokens(walletAddress, tokens);
}

function tradeNFT(fromWalletAddress) {
  let from = accountManager.getUserByAddress(fromWalletAddress);
  let fromTokens = from.tokens;
  let to = accountManager.getUserByAddress(toWalletAddress); // get from user by prompt
  let toTokens = to.tokens;
  let tokenId = 1; // get from user by prompt

  manageNFT.tradeNFT(tokenId, from, to); // should get a message indicating successful or not
  // manipulate the token arrays
  accountManager.updateUserTokens(fromWalletAddress, fromTokens);
  accountManager.updateUserTokens(toWalletAddress, toTokens);
  // update user file
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
  let walletIsConnected = false;

  if (selection == "1") {
    gamePage();
  } else if (selection == "2") {
    accountPage(walletIsConnected);
  }
}

async function gamePage() {
  startGame();
}

async function accountPage(walletIsConnected) {
  let walletAddress;
  if (!walletIsConnected) {
    walletAddress = connectWallet();
  }
  console.log("Please select from the following options: ");
  console.log("1. MintNFT");
  console.log("2. TradeNFT");
  console.log("3. Exit");
  const selection = await prompt("Enter the number index to select...");

  if (selection == "1") {
    mintNFT(walletAddress);
  } else if (selection == "2") {
    tradeNFT(walletAddress);
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
