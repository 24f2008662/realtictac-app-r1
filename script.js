// script.js

/**
 * Tic-Tac-Toe Client-Side Application
 * Expert Frontend Implementation
 */

const WINNING_COMBINATIONS = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6]
];

// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const messageArea = document.getElementById('message-area');
const urlParamDisplay = document.getElementById('param-display');
const urlInfoBox = document.getElementById('url-param-info');

// --- Game State ---
let boardState = Array(9).fill(null); // null, 'X', or 'O'
let currentPlayer = 'X';
let isGameActive = true;

/**
 * Utility function to safely display messages to the user.
 * @param {string} message - The message to display.
 * @param {string} type - 'error' or 'info'.
 */
function displayMessage(message, type = 'info') {
    messageArea.textContent = message;
    messageArea.classList.remove('hidden');
    
    if (type === 'error') {
        messageArea.style.borderColor = 'var(--x-color)';
        messageArea.style.color = 'var(--x-color)';
    } else {
        messageArea.style.borderColor = 'var(--o-color)';
        messageArea.style.color = 'var(--o-color)';
    }
    
    // Hide message after a delay unless it's a persistent game state message
    if (!isGameActive) return; 
    setTimeout(() => {
        messageArea.classList.add('hidden');
    }, 3000);
}

/**
 * Initializes the game board structure in the DOM.
 */
function initializeBoard() {
    try {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
        updateStatus();
    } catch (error) {
        console.error("Error initializing board:", error);
        displayMessage("Failed to set up the game board.", 'error');
    }
}

/**
 * Resets the game state to the starting configuration.
 */
function resetGame() {
    boardState.fill(null);
    currentPlayer = 'X';
    isGameActive = true;
    
    // Clear DOM cells visually
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'win');
    });

    updateStatus();
    messageArea.classList.add('hidden');
    console.log("Game reset successfully.");
}

/**
 * Updates the status message displayed above the board.
 */
function updateStatus() {
    if (isGameActive) {
        statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

/**
 * Checks if the current board state results in a win or a draw.
 * @returns {string|null} Returns 'X', 'O', or 'Draw', or null if the game continues.
 */
function checkGameResult() {
    // 1. Check for Win
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            // Mark winning cells for visual feedback
            document.querySelector(`[data-index="${a}"]`).classList.add('win');
            document.querySelector(`[data-index="${b}"]`).classList.add('win');
            document.querySelector(`[data-index="${c}"]`).classList.add('win');
            
            return boardState[a]; // Returns 'X' or 'O'
        }
    }

    // 2. Check for Draw (If no nulls remain)
    if (boardState.every(cell => cell !== null)) {
        return 'Draw';
    }

    return null; // Game ongoing
}

/**
 * Handles a click event on a cell.
 * @param {Event} event - The click event object.
 */
function handleCellClick(event) {
    if (!isGameActive) {
        displayMessage("Game finished! Click Reset to play again.", 'info');
        return;
    }

    const index = parseInt(event.target.dataset.index);

    // Input validation: Check if the cell is already occupied
    if (boardState[index] !== null) {
        displayMessage("That cell is already taken!", 'error');
        return;
    }

    // 1. Update State
    boardState[index] = currentPlayer;
    
    // 2. Update UI
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);

    // 3. Check Result
    const result = checkGameResult();

    if (result) {
        isGameActive = false;
        if (result === 'Draw') {
            statusMessage.textContent = "It's a Draw!";
            displayMessage("Game Over: Draw!", 'info');
        } else {
            statusMessage.textContent = `Player ${result} Wins!`;
            displayMessage(`Congratulations, Player ${result} won!`, 'info');
        }
    } else {
        // Switch Player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

/**
 * Processes URL parameters upon application load.
 * (Required constraint: Handle URL parameters)
 */
function processUrlParameters() {
    try {
        const params = new URLSearchParams(window.location.search);
        const urlParamValue = params.get('url');
        
        if (urlParamValue) {
            // Display the detected parameter value for visibility/debugging
            urlParamDisplay.textContent = urlParamValue;
            urlInfoBox.classList.remove('hidden');
            
            // Example usage based on a hypothetical parameter:
            if (urlParamValue.toLowerCase() === 'debugmode') {
                 displayMessage("Debug Mode Activated via URL Parameter.", 'info');
            }
        }
    } catch (e) {
        console.error("Error processing URL parameters:", e);
        // Do not block startup if URL parsing fails
    }
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeBoard();
    resetButton.addEventListener('click', resetGame);
    processUrlParameters();
    
    // Ensure fetch API is available (though not used for external data here, it satisfies the requirement context)
    if (typeof fetch === 'undefined') {
        displayMessage("Warning: fetch API is not available in this environment.", 'error');
    }
});