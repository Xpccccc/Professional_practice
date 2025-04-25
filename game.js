const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.5;
let gameSpeed = 5;
let score = 0;
let isGameOver = false;

// 主角
const player = {
  x: 50,
  y: 0,
  width: 40,
  height: 40,
  color: "#3498db",
  dy: 0,
  jumpForce: -10,
  isJumping: false,
  grounded: false,
};

// 地面
const ground = {
  x: 0,
  y: canvas.height - 40,
  width: canvas.width,
  height: 40,
  color: "#2ecc71",
};

// 障碍物数组
let obstacles = [];

function createObstacle() {
  const size = 30 + Math.random() * 20;
  obstacles.push({
    x: canvas.width,
    y: ground.y - size,
    width: size,
    height: size,
    color: "#e74c3c",
  });
}

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function jump() {
  if (player.grounded) {
    player.dy = player.jumpForce;
    player.grounded = false;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
document.addEventListener("mousedown", jump);

function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新主角
  player.dy += gravity;
  player.y += player.dy;

  // 碰地
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // 绘制地面 & 主角
  drawRect(ground);
  drawRect(player);

  // 更新 & 绘制障碍物
  obstacles.forEach((obs, index) => {
    obs.x -= gameSpeed;
    drawRect(obs);

    // 碰撞检测
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver();
    }

    // 移除超出画面的障碍物
    if (obs.x + obs.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // 生成障碍物（每60帧一次）
  if (Math.floor(Math.random() * 60) === 1) {
    createObstacle();
  }

  // 显示得分
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

function gameOver() {
  isGameOver = true;
  ctx.fillStyle = "#000";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}

update();
