const fs = require("fs");
const { prompt } = require("utils/utils.js");

const USERS_FILE = "./user.json"; // 用户数据存储的文件

function updateUserTokens(walletAddress, tokens) {
  const user = getUsers().find((user) => user.walletAddress === walletAddress);
  user.tokens = tokens;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function getUserByAddress(walletAddress) {
  return getUsers().find((user) => user.walletAddress === walletAddress);
}

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

// function used to add new user
// currently privateKey is stored as plain text, this will be inplemented to dock with user's wallet like metamesk
function addUser(walletAddress, ownTokens) {
  const newUser = {
    walletAddress,
    ownTokens,
  };

  let users = getUsers();

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

module.exports = {
  getUserByAddress,
  updateUserTokens,
  getUsers,
};
