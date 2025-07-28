document.addEventListener('DOMContentLoaded', () => {

    const statusDisplay = document.querySelector('#game-status');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.querySelector('#reset-button');
  
    const endGameScreen = document.querySelector('#end-game-screen');
    const endGameText = document.querySelector('#end-game-text');
    const playAgainButton = document.querySelector('#play-again-button');

    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]  
    ];

    const turnMessages = [
        "Your move, Player {PLAYER}!",
        "Make your mark, {PLAYER}!",
        "It's {PLAYER}'s turn to shine!",
        "Player {PLAYER}, the board awaits.",
        "Unleash your move, {PLAYER}!"
    ];

    // --- Messages ---
    const winningMessage = () => `${currentPlayer} Wins! 🎉`;
    const drawMessage = () => `It's a Draw! 🤝`;

    function updateTurnMessage() {
        if (!gameActive) return;
        const randomIndex = Math.floor(Math.random() * turnMessages.length);
        const message = turnMessages[randomIndex].replace('{PLAYER}', currentPlayer);
        statusDisplay.textContent = message;
    }
    
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            statusDisplay.textContent = ""; 
            endGameText.textContent = winningMessage();
            endGameScreen.classList.add('show');
            winningLine.forEach(index => cells[index].classList.add('win'));
            return;
        }

        const roundDraw = !gameState.includes("");
        if (roundDraw) {
            gameActive = false;
            statusDisplay.textContent = ""; 
            endGameText.textContent = drawMessage();
            endGameScreen.classList.add('show');
            return;
        }

        handlePlayerChange();
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnMessage();
    }

    function handleResetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });

        endGameScreen.classList.remove('show'); 
        updateTurnMessage(); 
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleResetGame);
    playAgainButton.addEventListener('click', handleResetGame); 

    updateTurnMessage();
});