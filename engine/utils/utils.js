async function getRandomNumber() {
  const randomNumberGeneratorConfig = "utils/randomNumberGeneratorConfig.json";
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

function getPlantNFTFactory() {
  const web3 = new Web3(plantFactoryConfig.config["local"].providerUrl); // chain address - should be different depending on the chain
  const contractABI = plantFactoryConfig.plantNFTFactoryABI; // should be placed in another file
  const contractAddress = plantFactoryConfig.config["local"].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}

function getRandomNumberGenerator() {
  const web3 = new Web3(plantFactoryConfig.config["local"].providerUrl); // chain address - should be different depending on the chain
  const contractABI = plantFactoryConfig.plantNFTFactoryABI; // should be placed in another file
  const contractAddress = plantFactoryConfig.config["local"].contractAddress; // should be read from another file
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
}

module.exports = {
  prompt,
  getRandomNumber,
  getPlantNFTFactory,
  getRandomNumberGenerator,
};
