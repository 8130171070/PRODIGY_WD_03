let board = ['', '', '', '', '', '', '', '', ''];
let userMoves = [];
let machineMoves = [];
let gameActive = true;
let userWins = 0;
let machineWins = 0;
let cells;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function initializeGame() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', userMove);
    boardElement.appendChild(cell);
  }
  cells = document.querySelectorAll('.cell');
  document.getElementById('resetBtn').addEventListener('click', resetGame);
}

function userMove(event) {
  if (!gameActive) return;
  const index = event.target.dataset.index;
  if (board[index] !== '') return;

  makeMove(index, 'O', userMoves);
  if (checkWinner(userMoves, 'O')) return;

  setTimeout(machinePlay, 500);
}

function makeMove(index, mark, moves) {
  moves.push(+index);
  updateCell(index, mark);
  removeOldest(moves, mark);
  if (checkWinner(moves, mark)) {
    displayWinner(mark);
  }
}

function updateCell(index, mark) {
  board[index] = mark;
  cells[index].textContent = mark;
  cells[index].classList.add(mark);
}

function removeOldest(moves, mark) {
  if (moves.length > 3) {
    const oldest = moves.shift();
    board[oldest] = '';
    cells[oldest].textContent = '';
    cells[oldest].classList.remove(mark);
  }
}

function checkWinner(moves, mark) {
  return winPatterns.some(pattern => pattern.every(i => moves.includes(i)));
}

function displayWinner(winner) {
  gameActive = false;
  const winText = winner === 'O' ? 'User Wins!' : 'Machine Wins!';
  const winMessage = document.getElementById('winMessage');
  winMessage.textContent = winText;
  winMessage.classList.add('show');
  updateWinCount(winner);
  setTimeout(() => {
    winMessage.classList.remove('show');
    resetGame();
  }, 2500);
}

function updateWinCount(winner) {
  if (winner === 'O') {
    userWins++;
    document.getElementById('userWins').textContent = userWins;
  } else {
    machineWins++;
    document.getElementById('machineWins').textContent = machineWins;
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  userMoves = [];
  machineMoves = [];
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
}

function machinePlay() {
  if (!gameActive) return;

  const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);

  for (let idx of shuffle(empty)) {
    const testMoves = [...machineMoves, idx];
    if (testMoves.length > 3) testMoves.shift();
    if (canWin(testMoves)) {
      makeMove(idx, 'X', machineMoves);
      return;
    }
  }

  for (let idx of shuffle(empty)) {
    const testMoves = [...userMoves, idx];
    if (testMoves.length > 3) testMoves.shift();
    if (canWin(testMoves)) {
      makeMove(idx, 'X', machineMoves);
      return;
    }
  }

  if (empty.includes(4)) {
    makeMove(4, 'X', machineMoves);
    return;
  }

  const smartOptions = shuffle([0, 2, 6, 8, 1, 3, 5, 7]);
  for (let idx of smartOptions) {
    if (empty.includes(idx)) {
      makeMove(idx, 'X', machineMoves);
      return;
    }
  }

  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  makeMove(randomIndex, 'X', machineMoves);
}

function canWin(moves) {
  return winPatterns.some(pattern => pattern.every(i => moves.includes(i)));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

initializeGame();