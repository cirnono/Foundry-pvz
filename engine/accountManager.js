const fs = require("fs");
const crypto = require("crypto");
const readline = require("readline");
const { ripemd160 } = require("ethers/lib/utils");

const USERS_FILE = "./user.json"; // 用户数据存储的文件

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

// not functionable currently
function login(username, password) {
  const user = getUser(username);
  if (!user) {
    console.log("User not found!");
    return false;
  }

  const { passwordSalt, passwordHash } = user;
  if (verifyPassword(passwordSalt, passwordHash, password)) {
    console.log(`Login successful! Wallet address: ${user.walletAddress}`);
    return user;
  } else {
    console.log("Incorrect password!");
    return false;
  }
}

// not functionable currently
async function register() {
  return new Promise((resolve, reject) => {
    rl.question("Enter username: ", (username) => {
      if (getUser(username)) {
        console.log("Username already exists!");
        rl.close();
        resolve();
      } else {
        rl.question("Enter password: ", (password) => {
          rl.question("Enter wallet address: ", (walletAddress) => {
            rl.question("Enter private key: ", (privateKey) => {
              addUser(username, password, walletAddress, privateKey, []);
              console.log("User registered successfully!");
              const user = login(username, password);
              resolve(user);
            });
          });
        });
      }
    });
  });
}

// not functionable currently
async function loginUser() {
  return new Promise((resolve, reject) => {
    rl.question("Enter username: ", (username) => {
      rl.question("Enter password: ", (password) => {
        const user = login(username, password);
        resolve(user);
      });
    });
  });
}

// not functionable currently
async function accountPrompt() {
  return new Promise((resolve, reject) => {
    rl.question("Are you a new user? (yes/no): ", (answer) => {
      if (answer.toLowerCase() === "yes") {
        register().then((user) => {
          rl.close();
          resolve(user);
        }); // 只有注册完成后才继续
      } else {
        loginUser()
          .then((user) => {
            rl.close();
            resolve(user);
          })
          .catch(reject); // 只有登录完成后才继续
      }
    });
  });
}

module.exports = {
  getUserByAddress,
  updateUserTokens,
  getUsers,
};
