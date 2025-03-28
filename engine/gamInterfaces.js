const fs = require("fs");
const crypto = require("crypto");
const readline = require("readline");
const Web3 = require("web3");
const USERS_FILE = "utils/user.json"; // 用户数据存储的文件

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

function mintNFT() {
  // get contract
  // check userinfo
  // ask to login or register
  // get wallet address
  // pass to mintNFT.mintNFT()
}

function tradeNFT() {
  // get contract
  // check userinfo
  // get target address
  // pass to contract.tradeNFT()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  let selection = mainMenu();
  if (selection == "1") {
    startGame();
  } else if (selection == "2") {
    if (!walletIsConnected) {
      connectWallet();
    }
    selection = accountMenu();
    if (selection == "1") {
      mintNFT();
    } else if (selection == "2") {
      tradeNFT();
    }
  }
}

async function mainMenu() {
  console.log("Please select from the following options: ");
  console.log("1. PlayGame");
  console.log("2. Account");
  console.log("3. Exit");
  const selection = await prompt("Enter the number index to select...");
  return selection;
}

async function accountMenu() {
  console.log("Please select from the following options: ");
  console.log("1. MintNFT");
  console.log("2. TradeNFT");
  console.log("3. Exit");
  const selection = await prompt("Enter the number index to select...");
  return selection;
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

function getContract() {
  const web3 = new Web3(""); // contract address
  const contractABI = []; // should be placed in another file
  const contractAddress = ""; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}
