require("dotenv").config();
const fs = require("fs");
const deploymentInformationLocal =
  "broadcast/DeployPlantNFTFactory.s.sol/31337/run-latest.json";
const { config, getPlantContract } = require("./plantFactoryConfig");
const { prompt } = require("./utils");

async function main() {
  const ans = await prompt("0");
  secondLevel();
}
async function secondLevel() {
  const ans1 = await prompt("1");
  const ans2 = await prompt("2");
  console.log(ans1, ans2);
}

main();
