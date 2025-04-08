require("dotenv").config();
const fs = require("fs");
const { Web3 } = require("web3");

const deploymentInformationLocal =
  "../../contract/broadcast/DeployRandomNumberGenerator.s.sol/31337/run-latest.json";
// const deploymentInformationSepolia = require("broadcast/DeployPlantNFTFactory.s.sol/11155111/run-latest.json");

function getConfig() {
  // index 0: VRF mock, index 1: LinkToken Mock, index 2: conrtact deployment
  const contractAddress = getContractAddressFromDeploymentFile(
    deploymentInformationLocal,
    4
  );
  return {
    31337: {
      providerUrl: process.env.ANVIL_RPC_URL,
      contractAddress:
        contractAddress || "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    },
    11155111: {
      providerUrl: process.env.SEPOLIA_RPC_URL,
      contractAddress: "0xYourRinkebyContractAddress",
    },
  };
}
function getRandomNumberGeneratorContract(chainId) {
  const config = getConfig();
  const web3 = new Web3(config[chainId].providerUrl); // chain address - should be different depending on the chain
  const contractABI = randomNumberGeneratorABI; // should be placed in another file
  const contractAddress = config[chainId].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log(
    `RandomNumberGeneratorConfig - contractAddress: ${contractAddress}`
  );
  return contract;
}

function getContractAddressFromDeploymentFile(deploymentFilePath, location) {
  console.log("RandomNumberGeneratorConfig - Reading file...");
  let contractAddress;
  fs.readFile(deploymentFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("RandomNumberGeneratorConfig - fail reading file:", err);
      return;
    } else {
      console.log("RandomNumberGeneratorConfig - Analysing file...");
      const jsonData = JSON.parse(data);
      contractAddress = jsonData.transactions[location].contractAddress;
      console.log(
        "RandomNumberGeneratorConfig - Contract Address:",
        contractAddress
      );
    }
  });
  return contractAddress;
}

const randomNumberGeneratorABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "vrfCoordinator",
        type: "address",
        internalType: "address",
      },
      { name: "gasLane", type: "bytes32", internalType: "bytes32" },
      {
        name: "subscriptionId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "callbackGasLimit",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rawFulfillRandomWords",
    inputs: [
      { name: "requestId", type: "uint256", internalType: "uint256" },
      {
        name: "randomWords",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "s_vrfCoordinator",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IVRFCoordinatorV2Plus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setCoordinator",
    inputs: [
      {
        name: "_vrfCoordinator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "to", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CoordinatorSet",
    inputs: [
      {
        name: "vrfCoordinator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferRequested",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "randomNumberGenerated",
    inputs: [
      {
        name: "",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OnlyCoordinatorCanFulfill",
    inputs: [
      { name: "have", type: "address", internalType: "address" },
      { name: "want", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "OnlyOwnerOrCoordinator",
    inputs: [
      { name: "have", type: "address", internalType: "address" },
      { name: "owner", type: "address", internalType: "address" },
      { name: "coordinator", type: "address", internalType: "address" },
    ],
  },
  { type: "error", name: "ZeroAddress", inputs: [] },
];

module.exports = { getRandomNumberGeneratorContract };
