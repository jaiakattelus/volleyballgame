// === GLOBAL VARIABLES ===

// Ball properties
let ball;

// Player properties
let playerLeft, playerRight;

// Court properties
let groundLevel;
let pointScored = false;
let leftScore = 0;
let rightScore = 0;
let gameOver = false;

// Constants
const paddleWidth = 20;
const paddleHeight = 60;
const playerSpeed = 5;
const jumpStrength = 15;
const gravity = 1;
const ballSpeed = 5;
const maxScore = 5;

// Setup game
function setup() {
  createCanvas(800, 400);
  groundLevel = height - 50;

  ball = {
    x: width/2,
    y: groundLevel - 100,
    radius: 12,
    dx: random([-ballSpeed, ballSpeed]),
    dy: -ballSpeed
  };

  playerLeft = createPlayer(100, "Team A", 1);
  playerRight = createPlayer(width - 140, "Team B", 2);
}

// Create a player object
function createPlayer(x, team, number) {
  return {
    x: x,
    y: groundLevel - paddleHeight,
    dy: 0,
    isJumping: false,
    team: team,
    number: number,
    logoColor: team === "Team A" ? color(255, 100, 100) : color(100, 100, 255)
  };
}

// Main game loop
function draw() {
  background(0, 100, 200); // Sky
  
  drawBackground(); // Draw crowd and court
  
  if (gameOver) {
    showVictoryScreen();
    return;
  }

  movePlayers();
  moveBall();
  
  drawNet();
  drawBall();
  drawPlayer(playerLeft);
  drawPlayer(playerRight);
  
  displayScore();
}

// === FUNCTIONS ===

// Draw background with court, crowd, benches
function drawBackground() {
  // Crowd
  for (let y = 20; y < 100; y += 10) {
    for (let x = 0; x < width; x += 10) {
      let bounce = 0;
      if (pointScored) bounce = random(-2, 2);
      fill(random(150, 255), random(150, 255), random(150, 255));
      rect(x, y + bounce, 8, 8);
    }
  }
  
  // Stage divider
  fill(50);
  rect(0, 100, width, 20);
  
  // Court
  fill(150, 220, 255); // Left half
  rect(50, groundLevel - 200, width/2 - 50, 200);
  
  fill(150, 255, 150); // Right half
  rect(width/2, groundLevel - 200, width/2 - 50, 200);
  
  // Outer boundary
  stroke(255);
  strokeWeight(3);
  noFill();
  rect(50, groundLevel - 200, width - 100, 200);
  
  // Net line
  line(width/2, groundLevel, width/2, groundLevel - 200);
  
  // 10-foot (attack) lines
  let attackLineOffset = (width - 100) / 6;
  line(width/2 - attackLineOffset, groundLevel, width/2 - attackLineOffset, groundLevel - 200);
  line(width/2 + attackLineOffset, groundLevel, width/2 + attackLineOffset, groundLevel - 200);
  noStroke();
  
  // Benches
  fill(100);
  rect(70, groundLevel - 250, 60, 30);
  rect(width - 130, groundLevel - 250, 60, 30);
  
  // Referee stand
  fill(220);
  rect(width/2 - 10, groundLevel - 250, 20, 50);
}

// Draw net
function drawNet() {
  stroke(255);
  strokeWeight(4);
  line(width/2, groundLevel - 200, width/2, groundLevel);
  noStroke();
}

// Draw ball
function drawBall() {
  fill(255);
  ellipse(ball.x, ball.y, ball.radius * 2);
  
  stroke(200);
  strokeWeight(2);
  line(ball.x, ball.y - ball.radius, ball.x, ball.y + ball.radius);
  line(ball.x - ball.radius, ball.y, ball.x + ball.radius, ball.y);
  noStroke();
}

// Draw a player
function drawPlayer(player) {
  // Body
  fill(player.logoColor);
  rect(player.x, player.y, paddleWidth, paddleHeight, 5);
  
  // Face
  fill(255, 224, 189);
  rect(player.x + 2, player.y - 20, 16, 16, 5);
  
  // Eyes
  fill(0);
  ellipse(player.x + 6, player.y - 14, 2, 2);
  ellipse(player.x + 14, player.y - 14, 2, 2);
  
  // Jersey number
  fill(0);
  textAlign(CENTER);
  textSize(10);
  text(player.number, player.x + paddleWidth/2, player.y + paddleHeight/2);
}

// Move players
function movePlayers() {
  // Apply gravity
  [playerLeft, playerRight].forEach(player => {
    if (player.isJumping) {
      player.dy += gravity;
      player.y += player.dy;
      if (player.y >= groundLevel - paddleHeight) {
        player.y = groundLevel - paddleHeight;
        player.isJumping = false;
        player.dy = 0;
      }
    }
  });
}

// Move ball and handle collisions
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  ball.dy += 0.5; // Gravity
  
  // Bounce off floor
  if (ball.y + ball.radius > groundLevel) {
    ball.y = groundLevel - ball.radius;
    ball.dy *= -0.8;
  }
  
  // Bounce off walls
  if (ball.x - ball.radius < 50 || ball.x + ball.radius > width - 50) {
    ball.dx *= -1;
  }
  
  // Ball touches net
  if (abs(ball.x - width/2) < 5 && ball.y > groundLevel - 200) {
    ball.dx *= -1;
  }
  
  // Collide with players
  [playerLeft, playerRight].forEach(player => {
    if (ball.x > player.x && ball.x < player.x + paddleWidth && ball.y + ball.radius > player.y && ball.y - ball.radius < player.y + paddleHeight) {
      ball.dy = -ballSpeed;
      ball.dx = player === playerLeft ? ballSpeed : -ballSpeed;
    }
  });
  
  // Scoring
  if (ball.x < 0) {
    rightScore++;
    resetPoint();
  } else if (ball.x > width) {
    leftScore++;
    resetPoint();
  }
  
  if (leftScore >= maxScore || rightScore >= maxScore) {
    gameOver = true;
  }
}

// Reset after point
function resetPoint() {
  pointScored = true;
  setTimeout(() => { pointScored = false; }, 500);
  ball.x = width/2;
  ball.y = groundLevel - 100;
  ball.dx = random([-ballSpeed, ballSpeed]);
  ball.dy = -ballSpeed;
}

// Display scores
function displayScore() {
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(leftScore, width/4, 50);
  text(rightScore, 3*width/4, 50);
}

// Victory screen
function showVictoryScreen() {
  background(0, 200, 100);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("Game Over", width/2, height/2 - 20);
  textSize(24);
  if (leftScore > rightScore) {
    text("Left Player Wins!", width/2, height/2 + 20);
  } else {
    text("Right Player Wins!", width/2, height/2 + 20);
  }
}
