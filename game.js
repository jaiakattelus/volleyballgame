const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 800;
canvas.height = 400;

// Players
const player1 = { x: 100, y: 300, width: 20, height: 50, dy: 0, onGround: true };
const player2 = { x: 680, y: 300, width: 20, height: 50, dy: 0, onGround: true };
const gravity = 0.5;
const jumpPower = -10;

// Ball
const ball = { x: 400, y: 200, radius: 10, dx: 4, dy: 4 };

// Key states
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Game loop
function update() {
    // Apply gravity
    [player1, player2].forEach(player => {
        if (!player.onGround) {
            player.dy += gravity;
        }
        player.y += player.dy;
        if (player.y >= 300) {
            player.y = 300;
            player.dy = 0;
            player.onGround = true;
        }
    });

    // Player 1 controls (W to jump, A & D to move)
    if (keys["KeyA"]) player1.x -= 5;
    if (keys["KeyD"]) player1.x += 5;
    if (keys["KeyW"] && player1.onGround) {
        player1.dy = jumpPower;
        player1.onGround = false;
    }

    // Player 2 controls (Arrow keys)
    if (keys["ArrowLeft"]) player2.x -= 5;
    if (keys["ArrowRight"]) player2.x += 5;
    if (keys["ArrowUp"] && player2.onGround) {
        player2.dy = jumpPower;
        player2.onGround = false;
    }

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.dy += gravity; // Apply gravity to ball

    // Ball collision with walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with players
    [player1, player2].forEach(player => {
        if (
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width &&
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height
        ) {
            ball.dy = -8;
            ball.dx *= -1;
        }
    });

    // Ball touching the ground (reset position)
    if (ball.y + ball.radius > canvas.height) {
        ball.x = 400;
        ball.y = 200;
        ball.dy = -5;
    }

    draw();
    requestAnimationFrame(update);
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players
    ctx.fillStyle = "blue";
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillStyle = "red";
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw ball
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

update();
