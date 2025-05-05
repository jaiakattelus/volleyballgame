let player, opponent, ball;
let net;
let gravity = 0.4;
let jumpForce = -8;
let spikeForce = -12;
let groundLevel;
let playerScore = 0;
let opponentScore = 0;
let playerSpiking = false;
let opponentSpiking = false;
let gameOver = false;
let winner = "";
let serveTossed = false;
let ballServed = false;

function setup() {
  createCanvas(800, 450);
  groundLevel = height - 80;
  
  player = { x: 150, y: groundLevel, w: 20, h: 50, vy: 0, speed: 5, isJumping: false, isBlocking: false };
  opponent = { x: width - 150, y: groundLevel, w: 20, h: 50, vy: 0, speed: 3, isJumping: false, isBlocking: false };
  ball = { x: width/2, y: 100, r: 15, vx: 0, vy: 0 };
  net = { x: width/2 - 5, y: groundLevel - 100, w: 10, h: 100 };
}

function draw() {
  if (gameOver) {
    drawVictoryScreen();
    return;
  }
  
  drawBackground();
  
  // Net
  fill(255);
  rect(net.x, net.y, net.w, net.h);
  
  // Players
  drawPlayer(player, color(0, 0, 255), 1, playerSpiking, player.isBlocking); // Blue
  drawPlayer(opponent, color(255, 50, 50), 2, opponentSpiking, opponent.isBlocking); // Red
  
  // Ball
  drawVolleyball(ball.x, ball.y, ball.r);
  
  handlePlayerMovement();
  handleOpponentAI();
  moveBall();
  
  drawScores();
}

// Draw players in pixel art
function drawPlayer(p, col, number, isSpiking, isBlocking) {
  push();
  translate(p.x, p.y);
  scale(2);
  
  // Headband
  fill(0);
  rect(-4, -14, 8, 2);
  
  // Face
  fill(255, 224, 189);
  rect(-3, -12, 6, 6);
  
  // Eyes
  fill(0);
  rect(-2, -10, 1, 1);
  rect(1, -10, 1, 1);
  
  // Mouth
  rect(-1, -8, 2, 1);
  
  // Jersey
  fill(col);
  rect(-4, -6, 8, 8);
  
  // Jersey number
  fill(255);
  textSize(5);
  textAlign(CENTER, CENTER);
  text(number, 0, -2);
  
  // Logo
  fill(255, 255, 0);
  rect(3, -4, 2, 2);
  
  // Legs
  fill(0);
  rect(-3, 2, 2, 4);
  rect(1, 2, 2, 4);
  
  // Shoes
  fill(255);
  rect(-3, 6, 2, 1);
  rect(1, 6, 2, 1);
  
  // Poses
  if (isSpiking) {
    fill(col);
    rect(6, -6, 3, 6); // Spike arm
  } else if (isBlocking) {
    fill(col);
    rect(-8, -6, 3, 6);
    rect(5, -6, 3, 6);
  }
  
  pop();
}

// Draw better volleyball
function drawVolleyball(x, y, r) {
  push();
  translate(x, y);
  
  fill(255);
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, r*2);
  
  // Stripes
  noFill();
  stroke(0);
  arc(0, 0, r*2, r*2, QUARTER_PI, PI + QUARTER_PI);
  arc(0, 0, r*1.5, r*1.5, -QUARTER_PI, PI - QUARTER_PI);
  line(-r/2, -r/2, r/2, r/2);
  line(r/2, -r/2, -r/2, r/2);
  
  pop();
}

// Background
function drawBackground() {
  background(80, 120, 200);
  
  // Crowd
  for (let y = 20; y < 100; y += 10) {
    for (let x = 0; x < width; x += 10) {
      fill(random(100, 255), random(100, 255), random(100, 255));
      rect(x, y, 8, 8);
    }
  }
  
  fill(50);
  rect(0, 100, width, 20);
  
  fill(100, 255, 100);
  rect(0, groundLevel, width, height - groundLevel);
  
  // Court lines
  stroke(255);
  strokeWeight(2);
  line(0, groundLevel, width, groundLevel);
  line(width/2, groundLevel, width/2, groundLevel - 100);
  noStroke();
}

function handlePlayerMovement() {
  if (keyIsDown(LEFT_ARROW)) player.x -= player.speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  
  player.y += player.vy;
  player.vy += gravity;
  
  if (player.y > groundLevel) {
    player.y = groundLevel;
    player.vy = 0;
    player.isJumping = false;
    playerSpiking = false;
    player.isBlocking = false;
  }
}

function handleOpponentAI() {
  if (ball.x > width/2) {
    if (ball.x < opponent.x) opponent.x -= opponent.speed;
    else opponent.x += opponent.speed;
    
    if (abs(ball.x - opponent.x) < 50 && opponent.y === groundLevel) {
      opponent.vy = jumpForce;
      opponent.isJumping = true;
      
      if (random() < 0.5) opponentSpiking = true;
      else opponent.isBlocking = true;
    }
  }
  
  opponent.y += opponent.vy;
  opponent.vy += gravity;
  
  if (opponent.y > groundLevel) {
    opponent.y = groundLevel;
    opponent.vy = 0;
    opponent.isJumping = false;
    opponentSpiking = false;
    opponent.isBlocking = false;
  }
}

function moveBall() {
  if (ballServed) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
  }

  if (ball.y + ball.r > groundLevel) {
    ball.vy *= -0.7;
    ball.y = groundLevel - ball.r;

    if (ballServed) {
      if (ball.x < width/2) opponentScore++;
      else playerScore++;
      checkGameOver();
      resetBall();
      ballServed = false;
    }
  }

  if (ball.x - ball.r < 0 || ball.x + ball.r > width) {
    ball.vx *= -1;
  }

  if (ball.x + ball.r > net.x && ball.x - ball.r < net.x + net.w && ball.y + ball.r > net.y) {
    ball.vx *= -1;
    ball.x = ball.x < width/2 ? net.x - ball.r : net.x + net.w + ball.r;
  }

  if (ballServed) {
    checkPlayerHit(player, playerSpiking, player.isBlocking);
    checkPlayerHit(opponent, opponentSpiking, opponent.isBlocking);
  }
}

function checkPlayerHit(p, isSpiking, isBlocking) {
  if (ball.x > p.x - p.w/2 && ball.x < p.x + p.w/2 && ball.y + ball.r > p.y - p.h && ball.y - ball.r < p.y) {
    if (isSpiking) {
      ball.vy = spikeForce;
      ball.vx = (ball.x - p.x) * 0.6;
    } else if (isBlocking) {
      ball.vy = jumpForce;
      ball.vx *= -1;
    } else {
      ball.vy = jumpForce;
      ball.vx = (ball.x - p.x) * 0.3;
    }
  }
}

function keyPressed() {
  if (key === ' ' && player.y === groundLevel) {
    player.vy = jumpForce;
    player.isJumping = true;
  }
  if (key === 'd' && player.isJumping) playerSpiking = true;
  if (key === 'x' && player.isJumping) player.isBlocking = true;
  if (key === 's' && !ballServed) {
    ball.x = player.x;
    ball.y = player.y - 60;
    ball.vx = 0;
    ball.vy = 0;
    ballServed = true;
  }
}

function drawScores() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text(playerScore, width/4, 40);
  text(opponentScore, width*3/4, 40);
}

function resetBall() {
  ball.x = width/2;
  ball.y = 100;
  ball.vx = 0;
  ball.vy = 0;
  ballServed = false;
}

function checkGameOver() {
  if (playerScore >= 5) {
    gameOver = true;
    winner = "YOU WIN!";
  } else if (opponentScore >= 5) {
    gameOver = true;
    winner = "YOU LOSE!";
  }
}

function drawVictoryScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text(winner, width/2, height/2 - 20);
  
  textSize(20);
  text("Press R to Restart", width/2, height/2 + 40);
}

function keyTyped() {
  if (key === 'r' && gameOver) {
    playerScore = 0;
    opponentScore = 0;
    gameOver = false;
    winner = "";
    resetBall();
  }
}
