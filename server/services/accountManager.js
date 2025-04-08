const fs = require("fs");
const { connectDB, closeDB } = require("../utils/utils.js");

async function updateUserTokens(walletAddress, tokens) {
  console.log("Account Manager - Looking for user detail");
  try {
    const db = await connectDB();
    const collection = db.collection("userData");
    let user = await collection.findOne({ walletAddress: walletAddress });

    if (!user) {
      console.log("Account Manager - Please connect wallet");
      throw new Error("Account Manager - Cannot find user");
    }

    const result = await collection.updateOne(
      { walletAddress: walletAddress },
      { $set: { tokens: tokens } }
    );
    if (result.modifiedCount === 0) {
      console.log("Account Manager - user's tokens is not updated");
    } else {
      console.log("Account Manager - user's tokens is updated");
    }
  } catch (err) {
    console.error(
      "Account Manager - Error happened updating user's token",
      err
    );
  }
}

async function getOrAddUserByAddress(walletAddress) {
  console.log("Account Manager - Looking for user detail");
  try {
    const db = await connectDB();
    const collection = db.collection("userData");
    let user = await collection.findOne({ walletAddress: walletAddress });

    if (!user) {
      user = {
        walletAddress: walletAddress,
        tokens: [],
      };
      await collection.insertOne(user);
      console.log("Account Manager - New user created");
    }
    console.log(`Account Manager - user found: ${user.walletAddress}`);
    return user;
  } catch (err) {
    console.error("Account Manager - Error happened searching the user", err);
  }
}

async function closeMongoDB() {
  await closeDB();
}

module.exports = {
  getOrAddUserByAddress,
  updateUserTokens,
  closeMongoDB,
};
