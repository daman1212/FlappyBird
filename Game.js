let score = 0; // Initialize score
let isGameStarted = false; // Flag to indicate if the game has started

// Variables for bird movement and gravity
const bird = document.querySelector('.bird'); // Reference to the bird image
let birdTopPosition = window.innerHeight / 2; // Initial position of the bird (middle of the screen)
let gravity = 0.4; // Gravity that pulls the bird down
let birdSpeed = 0; // Speed at which the bird is falling or rising
let isGameOver = false; // Flag to indicate if the game is over

// Elements for score and start button
const scoreElement = document.querySelector('.score');
const startButton = document.querySelector('.start-btn');

// Function to start the game
function startGame() {
    isGameStarted = true;
    score = 0;
    scoreElement.textContent = "Score: 0"; // Reset score at the beginning
    startButton.style.display = 'none'; // Hide start button when game begins
    isGameOver = false;
    birdTopPosition = window.innerHeight / 2;
    birdSpeed = 0;

    // Remove any existing pillars from previous games
    document.querySelectorAll('.pillar-container').forEach(pillar => pillar.remove());

    createPillar(); // Start generating new pillars
    gameLoop(); // Start the game loop for bird movement
}

// Update score when bird passes a pillar
function updateScore(pillarContainer) {
    const birdPosition = bird.getBoundingClientRect().left;
    const pillarPosition = pillarContainer.getBoundingClientRect().left;

    // Check if bird has passed the pillar and increase the score
    if (pillarPosition < birdPosition && !pillarContainer.passed) {
        score++; // Increment score
        scoreElement.textContent = `Score: ${score}`; // Update score display
        pillarContainer.passed = true; // Mark this pillar as passed
    }
}

// Function to create pillars
function createPillar() {
    if (isGameOver || !isGameStarted) return; // Only create pillars if the game is running

    const container = document.querySelector('.container');
    const pillarContainer = document.createElement('div');
    pillarContainer.classList.add('pillar-container');

    const topPillar = document.createElement('div');
    topPillar.classList.add('pillar', 'top-pillar');
    const bottomPillar = document.createElement('div');
    bottomPillar.classList.add('pillar', 'bottom-pillar');

    const gapSize = 260;
    const maxGapPosition = container.offsetHeight - gapSize - topPillar.offsetHeight;
    const randomGapPosition = Math.random() * maxGapPosition;

    topPillar.style.height = `${randomGapPosition}px`;
    bottomPillar.style.height = `${container.offsetHeight - randomGapPosition - gapSize}px`;

    pillarContainer.appendChild(topPillar);
    pillarContainer.appendChild(bottomPillar);
    container.appendChild(pillarContainer);

    const pillarMovement = setInterval(() => {
        if (isGameOver) {
            clearInterval(pillarMovement);
            return;
        }

        if (isGameStarted) {
            updateScore(pillarContainer); // Update score as bird passes the pillar
        }

        const pillarPosition = pillarContainer.getBoundingClientRect().left;

        if (pillarPosition < -130) {
            pillarContainer.remove();
        }
    }, 16);

    setTimeout(createPillar, 2000); // Generate a new pillar every 2 seconds
}

// Bird movement and gravity (game loop)
function gameLoop() {
    if (isGameOver || !isGameStarted) return; // Only run the loop if the game is started

    birdSpeed += gravity; // Apply gravity to the bird speed
    birdTopPosition += birdSpeed; // Update bird's position based on speed
    bird.style.top = `${birdTopPosition}px`; // Move the bird on the screen

    // Prevent bird from going out of bounds (top or bottom)
    if (birdTopPosition <= 0 || birdTopPosition >= window.innerHeight) {
        gameOver(); // Trigger game over if the bird leaves the screen
    }

    // Check if the bird collides with any pillars
    document.querySelectorAll('.pillar-container').forEach(pillar => {
        if (checkCollision(pillar)) {
            gameOver(); // Trigger game over if the bird hits a pillar
        }
    });

    requestAnimationFrame(gameLoop); // Keep the loop running
}

// Flap the bird when space is pressed
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && isGameStarted) {
        birdSpeed = -8; // Bird flaps upwards when space is pressed
    }
});

// Check for bird-pillar collision
function checkCollision(pillar) {
    const birdRect = bird.getBoundingClientRect();
    const topPillarRect = pillar.children[0].getBoundingClientRect();
    const bottomPillarRect = pillar.children[1].getBoundingClientRect();

    // Check if the bird collides with the top or bottom pillar
    return (
        birdRect.left < topPillarRect.right &&
        birdRect.right > topPillarRect.left &&
        (birdRect.top < topPillarRect.bottom || birdRect.bottom > bottomPillarRect.top)
    );
}

// End the game if collision occurs
function gameOver() {
    isGameOver = true; // Stop the game
    document.querySelectorAll('.pillar-container').forEach(pillar => pillar.remove()); // Remove all pillars
    alert('Game Over!'); // Display game over message
    startButton.style.display = 'block'; // Show start button again after game over
}

// Start button listener
startButton.addEventListener('click', startGame);
