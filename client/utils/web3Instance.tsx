import { toWei, EtherUnits } from "web3-utils";
import { Web3, Contract, ContractAbi } from "web3";
import dotenv from "dotenv";

import eventEmitter from "./eventEmitter";

// constant
const CHAIN_ID = 31337; // to be made auto select chain
const NETWORKS: { [key: number]: string | undefined } = {
  31337: process.env.ANVIL_RPC_URL,
  11155111: process.env.SEPOLIA_RPC_URL,
};

let web3: Web3;

// initialise web3 instance
if (NETWORKS[CHAIN_ID]) {
  web3 = new Web3(new Web3.providers.HttpProvider(NETWORKS[CHAIN_ID]));
} else {
  console.log("You are not on a valid chain");
}

// Function to connect wallet
async function connectWallet(walletAddress: string): Promise<void> {
  const PRIVATE_KEY = process.env.ANVIL_PRIVATE_KEY!;
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  console.log("🟢 Web3 initialized with default account:", account.address);
}

//
export function toEther(quantity: string, unit: EtherUnits | number): string {
  return toWei(quantity, unit);
}

//view
export async function getChainId(): Promise<bigint> {
  return web3.eth.getChainId();
}

export function getUserAddress(): string {
  return web3.eth.defaultAccount!;
}

export async function getUserBalance(): Promise<bigint> {
  return web3.eth.getBalance(getUserAddress());
}

export async function getNonce(): Promise<bigint> {
  return web3.eth.getTransactionCount(getUserAddress());
}

// Function to get contract instance
export function getContract(
  contractABI: any,
  contractAddress: string
): Contract<ContractAbi> {
  return new web3.eth.Contract(contractABI, contractAddress);
}
