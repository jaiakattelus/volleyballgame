// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: 3
};

// Paddle properties
const paddleHeight = 80, paddleWidth = 10;
let leftPaddle = { x: 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let rightPaddle = { x: canvas.width - 30, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
const paddleSpeed = 5;

// Function to draw the volleyball net
function drawNet() {
    ctx.fillStyle = "white";
    const netWidth = 4;
    ctx.fillRect(canvas.width / 2 - netWidth / 2, 0, netWidth, canvas.height);
}

// Function to draw the paddles
function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// Function to move paddles
function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Prevent paddles from moving out of bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

// Function to update the game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    drawNet(); // Draw the net
    drawPaddle(leftPaddle); // Draw left paddle
    drawPaddle(rightPaddle); // Draw right paddle
    drawBall(); // Draw the ball

    movePaddles(); // Update paddle movement

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < leftPaddle.x + paddleWidth && ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) ||
        (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight)
    ) {
        ball.dx *= -1; // Reverse ball direction
    }

    // Ball reset if out of bounds
    if (ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx *= -1;
    }

    requestAnimationFrame(update); // Animate the game
}

// Event listeners for paddle movement
document.addEventListener("keydown", (event) => {
    if (event.key === "w") leftPaddle.dy = -paddleSpeed; // Move left paddle up
    if (event.key === "s") leftPaddle.dy = paddleSpeed; // Move left paddle down
    if (event.key === "ArrowUp") rightPaddle.dy = -paddleSpeed; // Move right paddle up
    if (event.key === "ArrowDown") rightPaddle.dy = paddleSpeed; // Move right paddle down
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "s") leftPaddle.dy = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") rightPaddle.dy = 0;
});

// Start the game loop
update();