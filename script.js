const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 10, y: 10 }];
let direction = 'right';  // Initialize direction to 'right'
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;
let isPaused = false; // Flag to track if the game is paused

// Movement keys
const directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

document.addEventListener('keydown', (event) => {
    if (directionMap[event.key] && event.key !== getOppositeDirection(direction)) {
        direction = event.key; // Update direction based on keypress
    }
});

// Touch controls
document.getElementById("up").addEventListener("click", () => changeDirection('ArrowUp'));
document.getElementById("down").addEventListener("click", () => changeDirection('ArrowDown'));
document.getElementById("left").addEventListener("click", () => changeDirection('ArrowLeft'));
document.getElementById("right").addEventListener("click", () => changeDirection('ArrowRight'));

function changeDirection(newDirection) {
    if (!isPaused && newDirection !== getOppositeDirection(direction)) {
        direction = newDirection;
    }
}

function getOppositeDirection(direction) {
    if (direction === 'ArrowUp') return 'ArrowDown';
    if (direction === 'ArrowDown') return 'ArrowUp';
    if (direction === 'ArrowLeft') return 'ArrowRight';
    return 'ArrowLeft';
}

function updateGame() {
    const head = { ...snake[0] };
    head.x += directionMap[direction].x;
    head.y += directionMap[direction].y;

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        document.getElementById("score").innerText = `Score: ${score}`;
    } else {
        snake.pop();  // Remove last segment of snake
    }

    // Check if snake collides with walls or itself
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        alert("Game Over! Try Again.");
        return;
    }

    snake.unshift(head); // Add new head at the beginning
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake with a border
    snake.forEach(segment => {
        ctx.fillStyle = '#b3dfee'; // Snake color
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20); // Draw the square

        // Add a border around each snake segment
        ctx.strokeStyle = '#000000'; // Dark green border color
        ctx.lineWidth = 2; // Border thickness
        ctx.strokeRect(segment.x * 20, segment.y * 20, 20, 20); // Draw the border
    });

    // Draw food
    ctx.fillStyle = '#ff6347'; // Food color
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    // Add border around food (optional)
    ctx.strokeStyle = '#8b0000'; // Dark red border color
    ctx.lineWidth = 2; // Border thickness
    ctx.strokeRect(food.x * 20, food.y * 20, 20, 20); // Draw the border around food
}


function generateFood() {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    return { x, y };
}


function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'ArrowRight'; // Start moving to the right
    score = 0;
    food = generateFood();
    document.getElementById("score").innerText = `Score: ${score}`;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 200);
    isPaused = false;
    document.getElementById("pause").innerText = "Pause"; 
}
function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(updateGame, 200); // Restart the game loop
        document.getElementById("pause").innerText = "Pause"; // Change button text to 'Pause'
    } else {
        clearInterval(gameInterval); // Stop the game loop
        document.getElementById("pause").innerText = "Resume"; // Change button text to 'Resume'
    }
    isPaused = !isPaused; // Toggle the pause state
}
// Start the game
restartGame();
