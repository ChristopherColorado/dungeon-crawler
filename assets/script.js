const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Load images
const playerImg = new Image();
playerImg.src = "./assets/icons/hero.png"; // Replace with the actual path to your player image
const treasureImg = new Image();
treasureImg.src = "./assets/icons/treasure.png"; // Replace with the actual path to your treasure image
const enemyImg = new Image();
enemyImg.src = "./assets/icons/enemy.png"; // Replace with the actual path to your enemy image

// Game variables
const tileSize = 40;
const mapWidth = canvas.width / tileSize;
const mapHeight = canvas.height / tileSize;
let player = { x: 1, y: 1, direction: "right", health: 3 };
let treasure = { x: mapWidth - 2, y: mapHeight - 2 };
let enemies = [];
let swordActive = false;
let sword = { x: -1, y: -1, active: false };

// Create enemies
function createEnemies() {
  enemies = [];
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.floor(Math.random() * (mapWidth - 2)) + 1,
      y: Math.floor(Math.random() * (mapHeight - 2)) + 1,
      hit: false,
      hitTime: 0,
    });
  }
}

// Initialize enemies
createEnemies();

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

// Update health display
function updateHealth() {
  document.getElementById("health").innerText = `Health: ${"❤️".repeat(
    player.health
  )}`;
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
  drawPlayerWithArrow(player.x, player.y, player.direction);

  // Draw sword
  if (sword.active) {
    ctx.fillStyle = "yellow";
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        ctx.fillRect(
          (sword.x + dx) * tileSize,
          (sword.y + dy) * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }

  // Draw treasure
  ctx.drawImage(
    treasureImg,
    treasure.x * tileSize,
    treasure.y * tileSize,
    tileSize,
    tileSize
  );

  // Draw enemies
  for (let enemy of enemies) {
    if (enemy.hit) {
      if (performance.now() - enemy.hitTime < 200) {
        ctx.fillStyle = "white";
        ctx.fillRect(
          enemy.x * tileSize,
          enemy.y * tileSize,
          tileSize,
          tileSize
        );
      } else {
        continue; // Skip drawing hit enemies after flash
      }
    } else {
      ctx.drawImage(
        enemyImg,
        enemy.x * tileSize,
        enemy.y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  requestAnimationFrame(drawGame);
}

function drawPlayerWithArrow(x, y, direction) {
  ctx.drawImage(playerImg, x * tileSize, y * tileSize, tileSize, tileSize);

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
    // Respawn enemies
    createEnemies();
  }

  drawGame();
}

function swingSword() {
  if (sword.active) return;

  sword.active = true;
  setTimeout(() => (sword.active = false), 200);

  sword.x = player.x;
  sword.y = player.y;

  // Check for enemy hits
  for (let enemy of enemies) {
    if (
      Math.abs(enemy.x - sword.x) <= 1 &&
      Math.abs(enemy.y - sword.y) <= 1 &&
      !(enemy.x === sword.x && enemy.y === sword.y)
    ) {
      enemy.hit = true;
      enemy.hitTime = performance.now();
    }
  }

  // Remove enemies after hit
  setTimeout(() => {
    enemies = enemies.filter(
      (enemy) => !(enemy.hit && performance.now() - enemy.hitTime >= 200)
    );
  }, 200);
}

// Enemy movement
function moveEnemies() {
  for (let enemy of enemies) {
    if (enemy.hit) continue;

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newX = enemy.x + direction.x;
    const newY = enemy.y + direction.y;

    if (map[newY][newX] === 0) {
      enemy.x = newX;
      enemy.y = newY;
    }

    // Check for collision with player
    if (enemy.x === player.x && enemy.y === player.y) {
      player.health -= 1;
      updateHealth();
      if (player.health <= 0) {
        alert("Game Over!");
        document.removeEventListener("keydown", movePlayer);
        return;
      }
    }
  }
  setTimeout(moveEnemies, 500);
}

document.addEventListener("keydown", movePlayer);

// Start the game
updateHealth();
draw;
