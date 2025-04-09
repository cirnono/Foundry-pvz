// packages
const { MongoClient } = require("mongodb");
const fs = require("fs");
const { create } = require("ipfs-http-client");
const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });
const crypto = require("crypto");

require("dotenv").config();

// readline management
const rl = require("readline");
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) =>
    readline.question(question, (ans) => {
      resolve(ans);
    })
  );
}

function closePrompt() {
  readline.close();
}

// database initialisation
const dbName = "MyPvZ";
const client = new MongoClient(process.env.MONGO_URI);
let dbInstance = null;

async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    await client.connect();
    console.log("utils - Connected to database");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("utils - Fail to connect to database", err);
    throw err;
  }
}

function closeDB() {
  return client.close();
}

function simpleHash(data) {
  const hash = crypto.createHash("sha256");
  if (Array.isArray(data)) {
    data = data.join("");
  }
  data += Date.now().toString();
  hash.update(data);
  return hash.digest("hex");
}

async function uploadAttributesToIPFS(attributes) {
  // output to files
  const filePath = outputToFile(attributes);
  // upload to IPFS & obtain link
  const URI = uploadFileToIPFS(filePath);
  return URI;
}

function outputToFile(attributes) {
  const name = simpleHash(attributes);
  const attributesJson = JSON.stringify(attributes, null, 2);
  const filePath = `../mintedNFT/Plant_${name}_Attributes.json`;
  fs.writeFileSync(filePath, attributesJson, "utf8");
  console.log(`Attributes written to ${filePath}`);
  return filePath;
}

async function uploadFileToIPFS(filePath) {
  try {
    const file = fs.readFileSync(filePath);
    const added = await ipfs.add(file);
    const metadataURI = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(`File uploaded to IPFS with URI: ${metadataURI}`);
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
  } finally {
    return metadataURI;
  }
}

module.exports = {
  prompt,
  connectDB,
  closeDB,
  closePrompt,
  uploadFileToIPFS,
  outputToFile,
  uploadAttributesToIPFS,
};
