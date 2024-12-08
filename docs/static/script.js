let currentPlayer = '';
let robotSymbol = '';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let gameMode = ''; // Track the selected mode: 'normal' or 'random'
let randomEventProbability = 0.1; // Start with a 10% chance

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
    gameMode = mode;
    document.getElementById('menu').classList.remove('active');
    document.getElementById('player-choice').classList.add('active');
    document.getElementById('clear-button').style.display = 'none'; // Hide the clear button    
};

const startGameDirect = () => {
    currentPlayer = 'X';
    robotSymbol = 'O';
    document.getElementById('menu').classList.remove('active');
    document.getElementById('game-board').classList.add('active');
    document.getElementById('clear-container').style.display = 'block'; // Show the clear button
    initializeGrid();
};

const clearGrid = () => {
    // Clear the gameState array
    gameState = ['', '', '', '', '', '', '', '', ''];

    // Clear the DOM cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.textContent = '';
    });

    console.log('Grid cleared');
};

async function setPlayerSever(currentPlayer) {
    await fetch("http://192.168.1.11:5000/shape", 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            shape: currentPlayer
         }),
    });
}
// Set the player and start the game
const setPlayer = async (player) => {
    currentPlayer = 'X'; // Ensure X always starts
    robotSymbol = 'O'; // Robot will always be O
    await setPlayerSever(player);
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

async function setCellServer(last_played)
{
    console.log("Hi")
    await fetch("http://127.0.0.1:5000/last-played", 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            last_played: last_played
        }),
    });
    
}
const markCell = async (cell, index) => {
    if (!cell.textContent && !gameOver) {
        // Step 1: Mark the cell for the current player
        cell.textContent = currentPlayer;
        gameState[index] = currentPlayer;

        await setCellServer(currentPlayer);

        // Step 2: Check for win or draw conditions
        if(gameMode=='normal' || gameMode=='random'){
            if (checkWin()) 
            {
                handleWin();
                return; // Exit if the game is over
            }
        }
        if (checkDraw())
        {
                handleDraw();
                return; // Exit if the game is over
        }
    
        
        // Step 3: Handle random event
        if (gameMode == 'random'){
            document.getElementById('probability-container').innerHTML = `Event Probability: ${randomEventProbability.toFixed(1)}`;
            if (Math.random() < randomEventProbability) {
                triggerRandomEvent(); // Perform the random event
                console.log(`Random event occurred at ${randomEventProbability}`);
                randomEventProbability = 0.1; // Reset probability after event 
            } else {
                console.log(`Before incrementing, Probability is ${randomEventProbability}`)
                randomEventProbability += 0.1; // Increment probability
                console.log(`No random event. Probability increased to ${randomEventProbability}`);
            }
        }
        // Step 4: Toggle the player
        togglePlayer();
    }
};




const togglePlayer = () => {
    if (!gameOver) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatusMessage(`It's ${currentPlayer}'s turn!`);
    }
};

const updateStatusMessage = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message; // Update the status message
};

const updateRandomEventMessage = (message) => {
    const randomEventElement = document.getElementById('random-event');
    randomEventElement.textContent = message; // Update the random event message
};

// Trigger a random event (either swapRandomMark or clearHalfBoard)
const triggerRandomEvent = () => {
    const randomEvents = [
        { name: 'Swap Random Mark', action: swapRandomMark },
        { name: 'Swap All Mark', action: swapAllMarks },
        { name: 'Clear Row', action: clearRow },
        { name: 'Clear Column', action: clearColumn },
        { name: 'Clear Diagonal', action: clearDiagonal },
        { name: 'Move Grid (up)', action: () => moveGrid('up') },
        { name: 'Move Grid (down)', action: () => moveGrid('down') },
        { name: 'Move Grid (left)', action: () => moveGrid('left') },
        { name: 'Move Grid (right)', action: () => moveGrid('right') },
    ];

    // Choose a random event from the list
    const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];

    // Log and execute the selected event
    console.log(`Random event: ${randomEvent.name} triggered`);
    randomEvent.action();

    // Update random event message
    updateRandomEventMessage(`Random Event: ${randomEvent.name}`);
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
    updateStatusMessage(`Game Over`);
    updateRandomEventMessage(''); // Clear any random event messages
    gameOver = true; // Set game over
    document.getElementById('restart-container').style.display = 'block'; // Show restart button
};

// Handle a draw
const handleDraw = () => {
    document.getElementById('winner').textContent = "It's a draw!";
    updateStatusMessage(`Game Over`);
    updateRandomEventMessage(''); // Clear any random event messages
    document.getElementById('restart-container').style.display = 'block'; // Show restart button
};

// Restart the game
const restartGame = () => {
    window.location.reload();
};

// ---------random event functions-------- //

const swapAllMarks = () => {
    gameState.forEach((cell, index) => {
        if (cell === 'X') {
            gameState[index] = 'O'; // Swap X to O
        } else if (cell === 'O') {
            gameState[index] = 'X'; // Swap O to X
        }

        // Update the corresponding cell in the DOM
        const cellElement = document.querySelector(`.cell[data-index='${index}']`);
        if (cellElement) {
            cellElement.textContent = gameState[index]; // Reflect the new mark
        }
    });

    console.log('Swapped all X to O and all O to X');
};


// Swap a random X or O on the board
const swapRandomMark = () => {
    const markedCells = []; // Array to store the indices of marked cells
    gameState.forEach((cell, index) => {
        if (cell === 'X' || cell === 'O') {
            markedCells.push(index); // Add marked cell index to the array
        }
    });

    if (markedCells.length > 0) {
        const randomIndex = markedCells[Math.floor(Math.random() * markedCells.length)];
        const newMark = gameState[randomIndex] === 'X' ? 'O' : 'X'; // Swap the mark
        gameState[randomIndex] = newMark; // Update the game state
        const cellElement = document.querySelector(`.cell[data-index='${randomIndex}']`);
        cellElement.textContent = newMark; // Update the cell display
    }
};

const clearRow = () => {
    const rows = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
    ];

    // Shuffle the rows array to randomize selection
    const shuffledRows = rows.sort(() => Math.random() - 0.5);

    // Choose the first row from the shuffled array
    const randomRow = shuffledRows[0];

    // Clear all cells in the chosen row
    randomRow.forEach((index) => {
        gameState[index] = ''; // Clear the mark in the game state
        const cellElement = document.querySelector(`.cell[data-index='${index}']`);
        if (cellElement) {
            cellElement.textContent = ''; // Clear the cell display
        }
    });

    console.log('Cleared a random row:', randomRow);
};


const clearColumn = () => {
    const columns = [
        [0, 3, 6], // Column 1
        [1, 4, 7], // Column 2
        [2, 5, 8], // Column 3
    ];

    // Shuffle the columns array to randomize selection
    const shuffledColumns = columns.sort(() => Math.random() - 0.5);

    // Choose the first column from the shuffled array
    const randomColumn = shuffledColumns[0];

    // Clear all cells in the chosen column
    randomColumn.forEach((index) => {
        gameState[index] = ''; // Clear the mark in the game state
        const cellElement = document.querySelector(`.cell[data-index='${index}']`);
        if (cellElement) {
            cellElement.textContent = ''; // Clear the cell display
        }
    });

    console.log('Cleared a random column:', randomColumn);
};

const clearDiagonal = () => {
    const diagonals = [
        [0, 4, 8], // Primary Diagonal
        [2, 4, 6], // Secondary Diagonal
    ];

    // Shuffle the diagonals array to randomize selection
    const shuffledDiagonals = diagonals.sort(() => Math.random() - 0.5);

    // Choose the first diagonal from the shuffled array
    const randomDiagonal = shuffledDiagonals[0];

    // Clear all cells in the chosen diagonal
    randomDiagonal.forEach((index) => {
        gameState[index] = ''; // Clear the mark in the game state
        const cellElement = document.querySelector(`.cell[data-index='${index}']`);
        if (cellElement) {
            cellElement.textContent = ''; // Clear the cell display
        }
    });

    console.log('Cleared a random diagonal:', randomDiagonal);
};

const moveGrid = (direction) => {
    // Convert the 1D gameState into a 2D grid for easier manipulation
    let grid = [
        [gameState[0], gameState[1], gameState[2]],
        [gameState[3], gameState[4], gameState[5]],
        [gameState[6], gameState[7], gameState[8]],
    ];

    if (direction === 'up') {
        // Move rows up
        const topRow = grid.shift(); // Remove the top row
        grid.push(topRow); // Add it to the bottom
    } else if (direction === 'down') {
        // Move rows down
        const bottomRow = grid.pop(); // Remove the bottom row
        grid.unshift(bottomRow); // Add it to the top
    } else if (direction === 'left') {
        // Move columns left
        grid = grid.map(row => {
            const first = row.shift(); // Remove the first column element
            row.push(first); // Add it to the end
            return row;
        });
    } else if (direction === 'right') {
        // Move columns right
        grid = grid.map(row => {
            const last = row.pop(); // Remove the last column element
            row.unshift(last); // Add it to the beginning
            return row;
        });
    }

    // Flatten the 2D grid back into the 1D gameState array
    gameState = grid.flat();

    // Update the DOM to reflect the new gameState
    gameState.forEach((value, index) => {
        const cellElement = document.querySelector(`.cell[data-index='${index}']`);
        if (cellElement) {
            cellElement.textContent = value; // Update the cell display
        }
    });

    console.log(`Grid moved ${direction}`);
};

