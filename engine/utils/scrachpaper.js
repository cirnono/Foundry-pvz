require("dotenv").config();
const fs = require("fs");
const { getContractAddress } = require("./utils");

const deploymentInformationLocal =
  "broadcast/DeployPlantNFTFactory.s.sol/31337/run-latest.json";
// const deploymentInformationSepolia = require("broadcast/DeployPlantNFTFactory.s.sol/11155111/run-latest.json");

const localContractAddress = "";

const config = {
  local: {
    providerUrl: "http://localhost:8545",
    // index 0: VRF mock, index 1: LinkToken Mock, index 2: conrtact deployment
    contractAddress: getContractAddress(deploymentInformationLocal, 2),
  },
  sepolia: {
    providerUrl: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    contractAddress: "0xYourRinkebyContractAddress",
  },
  mainnet: {
    providerUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    contractAddress: "0xYourMainnetContractAddress",
  },
};
