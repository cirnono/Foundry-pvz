// packages
const { MongoClient } = require("mongodb");
const fs = require("fs");
const { create } = require("ipfs-http-client");
const ipfs = create({ url: "/ip4/127.0.0.1/tcp/5001" });
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
  const filePath = await outputToFile(attributes);
  // upload to IPFS & obtain link
  const URI = uploadFileToIPFS(filePath);
  return URI;
}

function outputToFile(attributes) {
  const name = simpleHash(attributes);
  const attributesJson = JSON.stringify(attributes, null, 2);
  const dirPath = `./mintedNFT`;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // Create directory if it doesn't exist
  }
  const filePath = `./mintedNFT/Plant_${name}_Attributes.json`;
  fs.writeFileSync(filePath, attributesJson, "utf8");
  console.log(`Attributes written to ${filePath}`);
  return filePath;
}

async function uploadFileToIPFS(filePath) {
  let metadataURI = "";
  try {
    const fileContent = fs.readFileSync(filePath);
    const result = await ipfs.add(fileContent);
    console.log("文件上传成功！");
    console.log("文件的 CID（内容标识符）是：", result.path);
    console.log("您可以通过以下链接访问该文件：");
    metadataURI = `http://localhost:8080/ipfs/${result.path}`;
    console.log(metadataURI);
    console.log(`https://ipfs.io/ipfs/${result.path}`);
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
