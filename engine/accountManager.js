const fs = require("fs");
const { connectDB, closeDB } = require("./utils/utils.js");

async function updateUserTokens(walletAddress, tokens) {
  console.log("Looking for user detail");
  try {
    const db = await connectDB();
    const collection = db.collection("userData");
    let user = await collection.findOne({ walletAddress: walletAddress });

    if (!user) {
      console.log("Please connect wallet");
      throw new Error("Cannot find user");
    }

    const result = await collection.updateOne(
      { walletAddress: walletAddress },
      { $set: { tokens: tokens } }
    );
    if (result.modifiedCount === 0) {
      console.log("user's tokens is not updated");
    } else {
      console.log("user's tokens is updated");
    }
  } catch (err) {
    console.error("Error happened", err);
  } finally {
    await closeDB();
  }
}

async function getOrAddUserByAddress(walletAddress) {
  console.log("Looking for user detail");
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
      console.log("New user created");
    }
    console.log(`user found: ${user}`);
    return user;
  } catch (err) {
    console.error("Error happened", err);
  } finally {
    await closeDB();
  }
}

module.exports = {
  getOrAddUserByAddress,
  updateUserTokens,
};
