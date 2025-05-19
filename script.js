const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');

let boardState;
let selectedPiece = null;
let validMoves = [];
let currentPlayer = 'white';

// Unicode mapping for pieces
const pieces = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

function initBoard() {
  boardState = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];
  currentPlayer = 'white';
  statusElement.textContent = "White's Turn";
  selectedPiece = null;
  validMoves = [];
}

function render() {
  boardElement.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isValid = validMoves.some(m=>m.row===r&&m.col===c);
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = r;
      square.dataset.col = c;
      const piece = boardState[r][c];
      if (piece) square.textContent = pieces[piece];
      if (selectedPiece && selectedPiece.row === r && selectedPiece.col === c) {
        square.classList.add('selected');
      }
      if (isValid) {
        square.classList.add('valid-move');
        // highlight capture moves differently
        const target = boardState[r][c];
        const isCapture = target && (
          (currentPlayer === 'white' && target === target.toLowerCase()) ||
          (currentPlayer === 'black' && target === target.toUpperCase())
        );
        if (isCapture) square.classList.add('capture-move');
      }
      square.addEventListener('click', () => onSquareClick(r, c));
      boardElement.appendChild(square);
    }
  }
}

function getValidMoves(r, c) {
  const piece = boardState[r][c];
  const moves = [];
  const dir = piece === piece.toUpperCase() ? -1 : 1; // white uppercase moves up
  const isWhite = piece === piece.toUpperCase();
  switch(piece.toLowerCase()) {
    case 'p':
      // forward
      const nr = r + (isWhite ? -1 : 1);
      if (nr>=0 && nr<8 && !boardState[nr][c]) moves.push({row:nr,col:c});
      // double
      const start = isWhite ? 6 : 1;
      if (r===start && !boardState[nr][c] && !boardState[r+2*(isWhite?-1:1)][c]) moves.push({row:r+2*(isWhite?-1:1),col:c});
      // captures
      for (const dc of [-1,1]) {
        const nc = c+dc;
        if (nc>=0&&nc<8 && boardState[nr][nc] && ((isWhite&&boardState[nr][nc]!==boardState[nr][nc].toUpperCase())||(!isWhite&&boardState[nr][nc]===boardState[nr][nc].toLowerCase()))) moves.push({row:nr,col:nc});
      }
      break;
    case 'n':
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
        const rr=r+dr, cc=c+dc;
        if(rr>=0&&rr<8&&cc>=0&&cc<8) {
          const target=boardState[rr][cc];
          if (!target || ((isWhite&&target!==target.toUpperCase())||(!isWhite&&target!==target.toLowerCase()))) moves.push({row:rr,col:cc});
        }
      });
      break;
    case 'b': case 'r': case 'q':
      const deltas = piece.toLowerCase()==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]
                     : piece.toLowerCase()==='r'?[[1,0],[-1,0],[0,1],[0,-1]]
                     :[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
      deltas.forEach(([dr,dc])=>{
        let rr=r+dr, cc=c+dc;
        while(rr>=0&&rr<8&&cc>=0&&cc<8) {
          const target=boardState[rr][cc];
          if (!target) moves.push({row:rr,col:cc});
          else {
            if ((isWhite&&target!==target.toUpperCase())||(!isWhite&&target!==target.toLowerCase())) moves.push({row:rr,col:cc});
            break;
          }
          rr+=dr; cc+=dc;
        }
      });
      break;
    case 'k':
      for(const dr of [-1,0,1]) for(const dc of [-1,0,1]) if(dr||dc){
        const rr=r+dr, cc=c+dc;
        if(rr>=0&&rr<8&&cc>=0&&cc<8) {
          const target=boardState[rr][cc];
          if (!target||((isWhite&&target!==target.toUpperCase())||(!isWhite&&target!==target.toLowerCase()))) moves.push({row:rr,col:cc});
        }
      }
      break;
  }
  return moves;
}

// Helper functions for check, checkmate, stalemate
function cloneBoard(board) {
  return board.map(r => r.slice());
}

function isInCheck(color) {
  const king = color === 'white' ? 'K' : 'k';
  let kRow, kCol;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (boardState[r][c] === king) {
        kRow = r; kCol = c;
      }
    }
  }
  const opponent = color === 'white' ? 'black' : 'white';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (piece && ((opponent === 'white' && piece === piece.toUpperCase()) || (opponent === 'black' && piece === piece.toLowerCase()))) {
        const moves = getValidMoves(r, c);
        if (moves.some(m => m.row === kRow && m.col === kCol)) return true;
      }
    }
  }
  return false;
}

function hasAnyLegalMoves(color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (piece && ((color === 'white' && piece === piece.toUpperCase()) || (color === 'black' && piece === piece.toLowerCase()))) {
        const moves = getValidMoves(r, c);
        for (const move of moves) {
          const orig = boardState[r][c];
          const dest = boardState[move.row][move.col];
          boardState[move.row][move.col] = orig;
          boardState[r][c] = '';
          const inCheck = isInCheck(color);
          boardState[r][c] = orig;
          boardState[move.row][move.col] = dest;
          if (!inCheck) return true;
        }
      }
    }
  }
  return false;
}

function onSquareClick(row, col) {
  const piece = boardState[row][col];
  if (!selectedPiece) {
    if (piece && ((currentPlayer==='white'&&piece===piece.toUpperCase())||(currentPlayer==='black'&&piece===piece.toLowerCase()))) {
      selectedPiece = {row,col};
      validMoves = getValidMoves(row,col).filter(move => {
        const orig = boardState[row][col];
        const dest = boardState[move.row][move.col];
        boardState[move.row][move.col] = orig;
        boardState[row][col] = '';
        const inCheck = isInCheck(currentPlayer);
        boardState[row][col] = orig;
        boardState[move.row][move.col] = dest;
        return !inCheck;
      });
    }
  } else {
    // move or deselect
    if (validMoves.some(m=>m.row===row&&m.col===col)) {
      boardState[row][col] = boardState[selectedPiece.row][selectedPiece.col];
      boardState[selectedPiece.row][selectedPiece.col] = '';
      // Pawn promotion: auto-queen
      const moved = boardState[row][col];
      if (moved === 'P' && row === 0) boardState[row][col] = 'Q';
      if (moved === 'p' && row === 7) boardState[row][col] = 'q';
      currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
      if (isInCheck(currentPlayer)) {
        if (!hasAnyLegalMoves(currentPlayer)) {
          statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1)} is in Checkmate`;
        } else {
          statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1)} in Check`;
        }
      } else {
        if (!hasAnyLegalMoves(currentPlayer)) {
          statusElement.textContent = 'Stalemate';
        } else {
          statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1)}'s Turn`;
        }
      }
    }
    selectedPiece = null;
    validMoves = [];
  }
  render();
}

resetButton.addEventListener('click', () => {
  initBoard();
  render();
});

// Initialize game
initBoard() 
render(); 

