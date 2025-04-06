const Web3 = require("web3");
// const gameCore = require("./gameCore.js");
const manageNFT = require("../engine/manageNFT.js");
const {
  getOrAddUserByAddress,
  updateUserTokens,
} = require("./accountManager.js");
const { prompt } = require("../utils/utils.js");
require("dotenv").config();

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
async function connectWallet() {
  // to be done in front end
  // const user = Web3.eth.accounts.create();
  // const userWalletAddress = user.address;
  // const userPrivateKey = user.privateKey;
  const userWalletAddress = "0x393dB59f5d4212620a1227906415253bdb9F516F";

  console.log("Connecting wallet...");
  getOrAddUserByAddress(userWalletAddress).then((user) => {
    console.log(`Wallet connected: ${userWalletAddress}`);
  });

  return userWalletAddress;
}

async function mintNFT(walletAddress) {
  // get wallet address
  console.log("Enter minting page");
  let tokens = await getOrAddUserByAddress(walletAddress).tokens;
  console.log(`currently own tokens: ${tokens}`);
  const tokenId = await manageNFT.mintNFT(walletAddress);
  console.log(tokenId);
  tokens.push(tokenId.toString());
  updateUserTokens(walletAddress, tokens);
}

function tradeNFT(fromWalletAddress) {
  let from = getOrAddUserByAddress(fromWalletAddress);
  let fromTokens = from.tokens;
  let to = getOrAddUserByAddress(toWalletAddress); // get from user by prompt
  let toTokens = to.tokens;

  let tokenId = 1; // get from user by prompt

  manageNFT.tradeNFT(tokenId, from, to); // should get a message indicating successful or not
  // update the token arrays
  toTokens.push(tokenId);
  let index = fromTokens.indexOf(tokenId);
  fromTokens.splice(index, 1);
  // update user file
  updateUserTokens(fromWalletAddress, fromTokens);
  updateUserTokens(toWalletAddress, toTokens);
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
  let walletIsConnected = false; // frontend,windows.ethereum
  let walletAddress = "not connected";
  if (!walletIsConnected) {
    walletAddress = await connectWallet();
  }
  console.log("You are currently on the local anvil chain");
  console.log("Please select from the following options: ");
  console.log("1. PlayGame");
  console.log("2. MintNFT");
  console.log("3. TradeNFT");
  console.log("4. Exit");
  const selection = await prompt("Enter the number index to select...");

  if (selection == "1") {
    startGame();
  } else if (selection == "2") {
    mintNFT(walletAddress);
  } else if (selection == "3") {
    tradeNFT(walletAddress);
  }
}
