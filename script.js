let currentPlayer = '';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;


const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal \
    [2, 4, 6], // Diagonal /
];

const setPlayer = (player) => {
    currentPlayer = player;
    robotSymbol = player === 'X' ? 'O' : 'X'; // Assign robotSymbol based on the player's choice

    // Update the symbols in the header
    document.getElementById('human-symbol').textContent = currentPlayer;
    document.getElementById('robot-symbol').textContent = robotSymbol;

    // Hide the player choice section
    document.getElementById('player-choice').style.display = 'none';

    // Show the game board
    document.getElementById('game-board').style.display = 'block';

    // Initialize the game grid
    initializeGrid();
};

const initializeGrid = () => {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.getElementById('winner').textContent = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => markCell(cell, i));
        grid.appendChild(cell);
    }
};

const markCell = (cell, index) => {
    if (!cell.textContent && !gameOver) {
        cell.textContent = currentPlayer;
        gameState[index] = currentPlayer;
        cell.classList.add('used');
        if (checkWin()) {
            handleWin();
        } else {
            togglePlayer();
        }
    }
};

const togglePlayer = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const checkWin = () => {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            markWinningCells(combination);
            gameOver = true;
            return true;
        }
    }
    return false;
};

const markWinningCells = (combination) => {
    const cells = document.querySelectorAll('.cell');
    combination.forEach((index) => {
        cells[index].classList.add('winning');
    });
};

const displayWinner = () => {
    document.getElementById('winner').textContent = `Player ${currentPlayer} wins!`;
};

const handleWin = () => {
    document.getElementById('winner').textContent = `Player ${currentPlayer} wins!`;
    setTimeout(() => {
        const restart = confirm(`Player ${currentPlayer} wins! Do you want to restart the game?`);
        if (restart) {
            // Refresh the page to restart the game
            window.location.reload();
        } else {
            // Close the window
            window.close();
        }
    }, 1000); // 5-second delay
};
