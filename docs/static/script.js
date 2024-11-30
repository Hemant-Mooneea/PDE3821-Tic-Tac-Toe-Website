let currentPlayer = '';
let robotSymbol = '';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Show the player choice section
const showPlayerChoice = (mode) => {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('player-choice').classList.add('active');
};

// Directly start the game for calibration
const startGameDirect = () => {
    currentPlayer = 'X';
    robotSymbol = 'O';
    document.getElementById('menu').classList.remove('active');
    document.getElementById('game-board').classList.add('active');
    initializeGrid();
};

// Set the player and start the game
const setPlayer = (player) => {
    currentPlayer = player;
    robotSymbol = player === 'X' ? 'O' : 'X';
    document.getElementById('human-symbol').textContent = currentPlayer;
    document.getElementById('robot-symbol').textContent = robotSymbol;
    document.getElementById('player-choice').classList.remove('active');
    document.getElementById('game-board').classList.add('active');
    initializeGrid();
};

// Initialize the game grid
const initializeGrid = () => {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.getElementById('winner').textContent = '';
    document.getElementById('restart-container').style.display = 'none'; // Hide restart button at start
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => markCell(cell, i));
        grid.appendChild(cell);
    }
};

// Handle marking a cell
const markCell = (cell, index) => {
    if (!cell.textContent && !gameOver) {
        cell.textContent = currentPlayer;
        gameState[index] = currentPlayer;
        if (checkWin()) {
            handleWin();
        } else if (checkDraw()) {
            handleDraw();
        } else {
            togglePlayer();
        }
    }
};

// Toggle between players
const togglePlayer = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

// Check for a win
const checkWin = () => {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            markWinningCells(combination);
            gameOver = true;
            return true;
        }
    }
    return false;
};

// Check for a draw
const checkDraw = () => {
    return gameState.every((cell) => cell !== '') && !gameOver;
};

// Mark the winning cells
const markWinningCells = (combination) => {
    const cells = document.querySelectorAll('.cell');
    combination.forEach((index) => {
        cells[index].classList.add('winning');
    });
};

// Handle a win
const handleWin = () => {
    document.getElementById('winner').textContent = `Player ${currentPlayer} wins!`;
    document.getElementById('restart-container').style.display = 'block'; // Show restart button
};

// Handle a draw
const handleDraw = () => {
    document.getElementById('winner').textContent = "It's a draw!";
    document.getElementById('restart-container').style.display = 'block'; // Show restart button
};

// Restart the game
const restartGame = () => {
    window.location.reload();
};
