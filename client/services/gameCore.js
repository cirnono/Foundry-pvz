require("dotenv").config();
const { prompt } = require("../utils/utils");

const GRID_ROWS = 5;
const GRID_COLS = 8;
let sunlight = 100;
let gameBoard = Array.from({ length: GRID_ROWS }, () =>
  Array(GRID_COLS).fill(".")
);
let plantsOnBoard = {};
let zombies = [];
let turn = 1;

/**
 * This function is the game core, the game is run by rounds
 * Every round, the following is performed
 * 1. Print out the board and relevant information (Sunlight amount, health of plants and zombies)
 * 2. Ask user for an action, currently the action would be indicating a plantNFT to be placed at a position
 * 3. Check the validity of the coordinate and the validity of the NFT (ensure it exist and is owned by this acount)
 * 4. Deploy the plantNFT
 * 5. Spawn zombies if condition met (certain round passed)
 * 6. Process plant actions and update board accordingly
 * 7. Process zombie actions and update borad accoridngly
 * 8. Check if game ended
 * 9. End turn
 */
async function runGame() {
  console.log("\n🌿 Welcome to PvZ Blockchain Edition! 🌿\n");

  while (true) {
    console.clear();
    printBoard();
    const choice = printGetOptions();

    if (choice === "1") {
      await deployPlant(pvzContract);
    }

    if (turn % 5 === 0) spawnZombie();
    processPlants();
    processZombies();

    turn++;
  }
}

async function deployPlant(contract) {
  //
  console.log("Available plants: Sunflower, Peashooter");
  const plantType = await prompt("Enter plant type: ");
  const row = parseInt(await prompt("Enter row (0-4): "), 10);
  const col = parseInt(await prompt("Enter column (0-7): "), 10);

  if (
    row < 0 ||
    row >= GRID_ROWS ||
    col < 0 ||
    col >= GRID_COLS ||
    gameBoard[row][col] !== "."
  ) {
    console.log("Invalid position!");
    return;
  }

  const plantData = {
    Sunflower: { hp: 50, cost: 50, produceRate: 3, attack: 0 },
    Peashooter: { hp: 100, cost: 100, produceRate: 0, attack: 30 },
  };

  if (!plantData[plantType]) {
    console.log("Invalid plant type!");
    return;
  }

  if (sunlight < plantData[plantType].cost) {
    console.log("Not enough sunlight!");
    return;
  }

  sunlight -= plantData[plantType].cost;
  gameBoard[row][col] = plantType[0];
  plantsOnBoard[`${row},${col}`] = { ...plantData[plantType] };
}

// print user's options and get user's choice
async function printGetOptions() {
  console.log("\n📜 Options:");
  console.log("1. Deploy a plant");
  console.log("2. Skip turn");

  return await prompt("Select an option: ");
}

// print out the current game board
function printBoard() {
  console.log("\nCurrent Board:");
  gameBoard.forEach((row) => console.log(row.join(" ")));
  console.log(`\n🌞 Sunlight: ${sunlight}`);
  // 打印所有植物和僵尸的血量
}

function processPlants() {
  Object.keys(plantsOnBoard).forEach((pos) => {
    const [row, col] = pos.split(",").map(Number);
    const plant = plantsOnBoard[pos];
    // 阳光生产逻辑不对
    if (plant.produceRate > 0) {
      sunlight += 100;
    }
    // 攻击逻辑
  });
}

function spawnZombie() {
  const row = Math.floor(Math.random() * GRID_ROWS);
  zombies.push({ row, col: GRID_COLS - 1, hp: 100 });
}

function processZombies() {
  zombies.forEach((zombie, index) => {
    const nextCol = zombie.col - 1;
    if (nextCol >= 0 && gameBoard[zombie.row][nextCol] !== ".") {
      const plantKey = `${zombie.row},${nextCol}`;
      if (plantsOnBoard[plantKey]) {
        plantsOnBoard[plantKey].hp -= 20;
        if (plantsOnBoard[plantKey].hp <= 0) {
          delete plantsOnBoard[plantKey];
          gameBoard[zombie.row][nextCol] = ".";
        }
      }
    } else {
      zombies[index].col = nextCol;
    }
  });
}
