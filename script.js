let origBoard;
let gameCompleted;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys()); // Assign up to 0-9 to all the squares
    gameCompleted = false;
    for(let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener("click", turnClick, false);
    }
}

function turnClick(square) {
    /* origBoard[square.target.id] will usually start as a number 0-9, since we declared it like that in
    startGame(), when a player or AI clicks the square, then it changes to a string ('O' or 'X'), this checks
    if its still a number, if it is, then the player hasn't clicked it, if the player clicked it, then it would
    be a string ('O' or 'X'), hence it would be false. So if it hasn't been clicked, then it will pass as a number */
    if(typeof origBoard[square.target.id] === 'number') {
       turn(square.target.id, huPlayer);
       if(!checkTie() && gameCompleted === false) turn(bestSpot(), aiPlayer); 
    }
    
}

function turn(squareId, player) {
    origBoard[squareId] = player; // Sets player to the clicked square
    document.getElementById(squareId).innerText = player; // Puts the player text (O or X) to that square
    let gameWon = checkWin(origBoard, player); // Check if the game has been won if they got 3 in a row
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin (board, player) {
    // Basically checks the origBoard to get all the players squares that were chosen
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;

    // Go through every element in the winCombo's array
    for (let [index, win] of winCombos.entries()) {
        /* This basically checks every winning combo array in winCombo's, it loops through them all.
        Then it goes into that current array (EX: [0,1,2] it goes through 0, then 1, then 2). Then it
        goes and checks if each value is in the "plays" array, if it is, then player has won */
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player === huPlayer ? "blue" : "red";
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose!");
}

function emptySquares() {
    return origBoard.filter(s => typeof s === 'number');
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    gameCompleted = true;
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0 && gameCompleted === false) {
        for(let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for( let i = 0; i < moves.length; i++) {
            if ( moves[i].score > bestScore ) {
                bestScore = moves[i].score;
                bestMove = i;
            }      
        }
    } else {
        let bestScore = 10000;
        for( let i = 0; i < moves.length; i++) {
            if ( moves[i].score < bestScore ) {
                bestScore = moves[i].score;
                bestMove = i;
            }      
        }
    }
    return moves[bestMove];
}