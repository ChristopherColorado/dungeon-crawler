const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game variables
const tileSize = 40;
const mapWidth = canvas.width / tileSize;
const mapHeight = canvas.height / tileSize;
let player = { x: 1, y: 1, color: "blue", direction: "right" };
let treasure = { x: mapWidth - 2, y: mapHeight - 2, color: "gold" };
let enemies = [];
let swordActive = false;

// Create enemies
for (let i = 0; i < 5; i++) {
  enemies.push({
    x: Math.floor(Math.random() * (mapWidth - 2)) + 1,
    y: Math.floor(Math.random() * (mapHeight - 2)) + 1,
    color: "red",
  });
}

// Map
const map = [];
for (let y = 0; y < mapHeight; y++) {
  const row = [];
  for (let x = 0; x < mapWidth; x++) {
    if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) {
      row.push(1); // Wall
    } else {
      row.push(0); // Empty space
    }
  }
  map.push(row);
}

// Draw the game
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "gray";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  // Draw player with arrow
  drawPlayerWithArrow(player.x, player.y, player.color, player.direction);

  // Draw treasure
  ctx.fillStyle = treasure.color;
  ctx.fillRect(
    treasure.x * tileSize,
    treasure.y * tileSize,
    tileSize,
    tileSize
  );

  // Draw enemies
  for (let enemy of enemies) {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
  }
}

function drawPlayerWithArrow(x, y, color, direction) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

  ctx.fillStyle = "white";
  ctx.beginPath();
  switch (direction) {
    case "up":
      ctx.moveTo(x * tileSize + tileSize / 2, y * tileSize + 10);
      ctx.lineTo(x * tileSize + 10, y * tileSize + tileSize - 10);
      ctx.lineTo(x * tileSize + tileSize - 10, y * tileSize + tileSize - 10);
      break;
    case "down":
      ctx.moveTo(x * tileSize + 10, y * tileSize + 10);
      ctx.lineTo(x * tileSize + tileSize - 10, y * tileSize + 10);
      ctx.lineTo(x * tileSize + tileSize / 2, y * tileSize + tileSize - 10);
      break;
    case "left":
      ctx.moveTo(x * tileSize + 10, y * tileSize + tileSize / 2);
      ctx.lineTo(x * tileSize + tileSize - 10, y * tileSize + 10);
      ctx.lineTo(x * tileSize + tileSize - 10, y * tileSize + tileSize - 10);
      break;
    case "right":
      ctx.moveTo(x * tileSize + tileSize - 10, y * tileSize + tileSize / 2);
      ctx.lineTo(x * tileSize + 10, y * tileSize + 10);
      ctx.lineTo(x * tileSize + 10, y * tileSize + tileSize - 10);
      break;
  }
  ctx.closePath();
  ctx.fill();
}

// Move the player
function movePlayer(event) {
  let newX = player.x;
  let newY = player.y;

  switch (event.key) {
    case "ArrowUp":
      newY -= 1;
      player.direction = "up";
      break;
    case "ArrowDown":
      newY += 1;
      player.direction = "down";
      break;
    case "ArrowLeft":
      newX -= 1;
      player.direction = "left";
      break;
    case "ArrowRight":
      newX += 1;
      player.direction = "right";
      break;
    case " ":
      swingSword();
      return;
  }

  // Check for collisions
  if (map[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
  }

  // Check for treasure
  if (player.x === treasure.x && player.y === treasure.y) {
    alert("You found the treasure!");
    // Reset player position
    player.x = 1;
    player.y = 1;
    // Move treasure to a new position
    treasure.x = Math.floor(Math.random() * (mapWidth - 2)) + 1;
    treasure.y = Math.floor(Math.random() * (mapHeight - 2)) + 1;
  }

  drawGame();
}

function swingSword() {
  if (swordActive) return;

  swordActive = true;
  setTimeout(() => (swordActive = false), 200);

  let swordX = player.x;
  let swordY = player.y;

  switch (player.direction) {
    case "up":
      swordY -= 1;
      break;
    case "down":
      swordY += 1;
      break;
    case "left":
      swordX -= 1;
      break;
    case "right":
      swordX += 1;
      break;
  }

  enemies = enemies.filter(
    (enemy) => !(enemy.x === swordX && enemy.y === swordY)
  );
}

document.addEventListener("keydown", movePlayer);

// Start the game
drawGame();
