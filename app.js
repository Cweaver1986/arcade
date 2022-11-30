// add values that persist between games
let state = {scores: [0, 0], players: ['', '']};

// only reset state related to individual games
const resetState = () => {
  state.board = [
    null, null, null,
    null, null, null,
    null, null, null
  ];
  state.winner = null;
  state.draw = null;
  state.getCurrentPlayer = () => state.players[state.currentPlayerIdx];
  state.currentPlayerIdx = 0;
};

const marks = ['X', 'O'];
const boardSectionChecks = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

// *************** DOM SELECTORS ***************
const scoreElem = document.querySelector('#score');
const boardElem = document.querySelector('#board');
const playerTurnElem = document.querySelector('#player-turn');

const renderScore = () => {
  scoreElem.innerHTML = `
  <div>${state.players[0]} : ${state.scores[0]}</div>
  <div>${state.players[1]} : ${state.scores[1]}</div>
  `;
};

// *************** GAME LOGIC HELPER FUNCTIONS ***************
const checkBoard = () => {
  checkDraw();
  for (let i = 0; i < boardSectionChecks.length; i++) {

    const comb = boardSectionChecks[i];
    
    // create a temporary array with values from our board sections
    const section = [
        state.board[comb[0]],
        state.board[comb[1]],
        state.board[comb[2]]
    ].join(''); // and join them to make a string of their values
    // checks array for match
    if (section === 'XXX' || section ==='OOO') {
        //assigns a winner
        state.winner = state.getCurrentPlayer()
        //updates score
        state.scores[state.currentPlayerIdx]++
        break
    } 
  }
};

const checkDraw = () => {
  //creates copy of current board and joins the values
  const drawArray = [...state.board].join('');
  //if .length equals 9, all squares have been filled resulting in draw
  if (drawArray.length === 9){
    state.draw = 'draw'
  }
}

const changePlayer = () => {
  checkBoard()
  //assigns player turn based on absolute value of current index - 1
  state.currentPlayerIdx = Math.abs(state.currentPlayerIdx - 1);
}

// *************** DOM MANIPULATION FUNCTIONS ***************
const renderBoard = () => {
  // make sure the board is clear.
  boardElem.innerHTML = ''; //not ideal
  // iterate through the state.board
  for (let i = 0; i < state.board.length; i++) {
    const squareValue = state.board[i];
    // create elements
    const square = document.createElement('div');
    square.classList.add('cell');
    square.dataset.index = i;

    square.innerText = squareValue

    // append them to the parent element
    boardElem.appendChild(square);
  }
};

const renderPlayer = () => {
  let text;
  // have text to display current player
  // conditionally render players
  // if there are no players we want to display an input
  if (!state.players[0] || !state.players[1]) {
    text = `
    <input name="player1" placeholder="Enter Player 1">
    <input name="player2" placeholder="Enter Player 2">
    <button class="start">Start Game</button>
    `;
  } else {
    // if we do have players
    // if draw is determined
    if (state.draw) {
      text = `Match is a draw!`
      // if win is determined
    } else if 
      (state.winner) {
      text = `<span class='player'>${state.winner} has won!</span>`;
      // if neither win or draw is determined
    } else {
      text = `It's currently <span class='player'>${state.getCurrentPlayer()}</span>'s turn.`;
    }
  }
  playerTurnElem.innerHTML = text;
// renders reset button if either win or draw is determined
  if (state.winner || state.draw) {
    const resetButton = document.createElement('button');
    resetButton.innerHTML = `Play Again!`;
    resetButton.classList.add('restart');
    playerTurnElem.appendChild(resetButton);
  }
};

const render = () => {
  renderScore();
  renderBoard();
  renderPlayer();
};

// *************** HAPPENS ON EVERY CLICK ***************
const takeTurn = (index) => {
  if (!state.players[0] || !state.players[1]) return;
  const squareValue = state.board[index];

  // Already been marked
  if (squareValue) return;

  state.board[index] = marks[state.currentPlayerIdx]
  render();
  changePlayer();
};

// *************** EVENT LISTENERS ***************
boardElem.addEventListener('click', (event) => {
  if (event.target.className !== 'cell') return;

  const squareIdx = event.target.dataset.index;
  checkBoard();
  takeTurn(squareIdx);
  render();
});

playerTurnElem.addEventListener('click', (event) => {
  if (event.target.className === 'restart') {
    resetState();
    render();
  } else if (event.target.className === 'start') {
    // get the input of player1
    const player1Input = document.querySelector('input[name=player1]');
    // get the value from the input
    const player1Value = player1Input.value;
    state.players[0] = player1Value;
    //  Do the same thing for player2
    const player2Input = document.querySelector('input[name=player2]');
    // get the value from the input
    const player2Value = player2Input.value;
    state.players[1] = player2Value;
    render();
  }
});

resetState();
render();