const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const undoButton = document.getElementById('undo');
const promotionModal = document.getElementById('promotionModal');
const promotionChoices = promotionModal.querySelectorAll('.promotion-piece');
const homeButton = document.getElementById('homeButton');

let boardState;
let selectedPiece = null;
let validMoves = [];
let currentPlayer = 'white';
let boardHistory = []; // Array to store board states and player turns
let promotingPawn = null; // To store the position of the pawn being promoted

// Unicode mapping for pieces
const pieces = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Theme handling
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
}

// Sound effects
const moveSound = document.getElementById('moveSound');
const captureSound = document.getElementById('captureSound');
const checkSound = document.getElementById('checkSound');
const volumeControl = document.getElementById('volumeControl');

// Add error handling for audio loading
function handleAudioError(audioElement, soundName) {
  audioElement.addEventListener('error', (e) => {
    console.error(`Error loading ${soundName}:`, e);
  });
  
  audioElement.addEventListener('canplaythrough', () => {
    console.log(`${soundName} loaded successfully`);
  });
}

// Initialize error handling for all sounds
handleAudioError(moveSound, 'move sound');
handleAudioError(captureSound, 'capture sound');
handleAudioError(checkSound, 'check sound');

// Set initial volume
moveSound.volume = volumeControl.value;
captureSound.volume = volumeControl.value;
checkSound.volume = volumeControl.value;

// Update volume when slider changes
volumeControl.addEventListener('input', (e) => {
  const volume = e.target.value;
  moveSound.volume = volume;
  captureSound.volume = volume;
  checkSound.volume = volume;
});

// Function to play move sound with error handling
function playMoveSound(isCapture = false) {
  try {
    if (isCapture) {
      if (captureSound.readyState >= 2) { // HAVE_CURRENT_DATA
        captureSound.currentTime = 0;
        captureSound.play().catch(error => {
          console.error('Error playing capture sound:', error);
        });
      } else {
        console.warn('Capture sound not ready to play');
      }
    } else {
      if (moveSound.readyState >= 2) { // HAVE_CURRENT_DATA
        moveSound.currentTime = 0;
        moveSound.play().catch(error => {
          console.error('Error playing move sound:', error);
        });
      } else {
        console.warn('Move sound not ready to play');
      }
    }
  } catch (error) {
    console.error('Error in playMoveSound:', error);
  }
}

// Function to play check sound with error handling
function playCheckSound() {
  try {
    if (checkSound.readyState >= 2) { // HAVE_CURRENT_DATA
      checkSound.currentTime = 0;
      checkSound.play().catch(error => {
        console.error('Error playing check sound:', error);
      });
    } else {
      console.warn('Check sound not ready to play');
    }
  } catch (error) {
    console.error('Error in playCheckSound:', error);
  }
}

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
  boardHistory = []; // Clear history on new game
  promotingPawn = null; // Reset promoting pawn
  saveState(); // Save initial state
}

// Save the current board state and player turn
function saveState() {
    boardHistory.push({
        board: cloneBoard(boardState),
        player: currentPlayer
    });
}

// Undo the last move
function undoMove() {
    // Need at least one state before the current one to undo
    if (boardHistory.length > 1) {
        boardHistory.pop(); // Remove current state
        const previousState = boardHistory[boardHistory.length - 1];
        boardState = cloneBoard(previousState.board);
        currentPlayer = previousState.player;
        selectedPiece = null;
        validMoves = [];
        // Update status based on the reverted state's player
        statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
        render();
    } else if (boardHistory.length === 1) {
        // If only initial state exists, reset the board to initial state
        initBoard();
        render();
    }
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
      if (piece) {
          square.textContent = pieces[piece];
          // Add class based on piece color
          if (piece === piece.toUpperCase()) {
              square.classList.add('white-piece');
          } else {
              square.classList.add('black-piece');
          }
      }
      if (selectedPiece && selectedPiece.row === r && selectedPiece.col === c) {
        square.classList.add('selected');
      }
      if (isValid) {
        square.classList.add('valid-move');
        // highlight capture moves differently    
        const target = boardState[r][c];
        const isCapture = target && (
          (currentPlayer === 'white' && target !== target.toUpperCase()) || // Capture opponent's black piece
          (currentPlayer === 'black' && target !== target.toLowerCase())  // Capture opponent's white piece
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
        if (nc>=0&&nc<8 && boardState[nr][nc] && ((isWhite&&boardState[nr][nc]!==boardState[nr][nc].toUpperCase())||(!isWhite&&boardState[nr][nc]!==boardState[nr][nc].toLowerCase()))) moves.push({row:nr,col:nc});
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
  // If a pawn is being promoted, ignore other clicks
  if (promotingPawn) return;

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
    } else {
        // Clicked on an empty square or opponent's piece, deselect
        selectedPiece = null;
        validMoves = [];
    }
  } else {
    // move or deselect
    if (validMoves.some(m=>m.row===row&&m.col===col)) {
      // Check if this is a capture move
      const isCapture = boardState[row][col] !== '';
      
      // Move piece
      const movedPiece = boardState[selectedPiece.row][selectedPiece.col];
      boardState[row][col] = movedPiece;
      boardState[selectedPiece.row][selectedPiece.col] = '';
      
      // Play appropriate sound
      playMoveSound(isCapture);

      // Check for pawn promotion
      if (movedPiece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
          promotingPawn = {row, col}; // Store promotion square
          showPromotionModal(currentPlayer); // Show the modal
          // Do not proceed with player switch, status update, saveState, or render yet
      } else {
          // If no promotion, continue game flow
          currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
          saveState();
          updateStatus();
          render();
      }

      // Check if the move puts the opponent in check
      if (isInCheck(currentPlayer)) {
        playCheckSound();
      }

    } else {
        // Clicked on an invalid square, deselect
        selectedPiece = null;
        validMoves = [];
        render(); // Re-render to remove highlights
        return; // Stop further execution if move is invalid
    }
    selectedPiece = null;
    validMoves = [];
    // If not promoting, render was called above. If promoting, it will be called after selection.
    if (!promotingPawn) {
        render();
    }
  }
  // If promoting, render is handled after selection.
  if (!promotingPawn) {
      render();
  }
}

// Show the promotion modal
function showPromotionModal(playerColor) {
    promotionModal.classList.add('show-modal');
    // Update piece symbols in modal based on player color
    promotionChoices.forEach(button => {
        const pieceType = button.dataset.piece;
        button.textContent = pieces[playerColor === 'white' ? pieceType.toUpperCase() : pieceType.toLowerCase()];
    });
}

// Handle promotion piece selection
promotionChoices.forEach(button => {
    button.addEventListener('click', () => {
        const selectedPieceType = button.dataset.piece;
        const promotedPiece = currentPlayer === 'white' ? selectedPieceType.toUpperCase() : selectedPieceType.toLowerCase();
        
        // Update the board with the promoted piece
        boardState[promotingPawn.row][promotingPawn.col] = promotedPiece;
        
        // Reset promoting pawn and hide modal
        promotingPawn = null;
        promotionModal.classList.remove('show-modal');
        
        // Continue game flow
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white'; // Switch player
        saveState(); // Save state after promotion
        updateStatus(); // Update status
        render(); // Render the board
    });
});

// Update the status message based on current game state
function updateStatus() {
    if (isInCheck(currentPlayer)) {
        if (!hasAnyLegalMoves(currentPlayer)) {
            statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in Checkmate`;
        } else {
            statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} in Check`;
        }
    } else {
        if (!hasAnyLegalMoves(currentPlayer)) {
            statusElement.textContent = 'Stalemate';
        } else {
            statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
        }
    }
}

resetButton.addEventListener('click', () => {
  initBoard();
  render();
});

undoButton.addEventListener('click', undoMove);

// Add event listener for the Home button
homeButton.addEventListener('click', () => {
    window.location.href = 'home.html';
});

// Initialize game
initBoard()
render();

document.addEventListener('DOMContentLoaded', () => {
    // Play button click handler
    const playButton = document.querySelector('.play-button');
    if (playButton) { // Check if playButton exists (only on home.html)
        playButton.addEventListener('click', () => {
            // Add loading animation
            playButton.innerHTML = 'Loading...';
            playButton.style.opacity = '0.7';
            
            // Simulate loading and redirect to game page
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        });
    }

    // Add hover effect to rules (only on home.html)
    const rules = document.querySelectorAll('.rule');
    if (rules.length > 0) { // Check if rules exist
        rules.forEach(rule => {
            rule.addEventListener('mouseenter', () => {
                rule.style.transform = 'translateY(-5px)';
            });
            
            rule.addEventListener('mouseleave', () => {
                rule.style.transform = 'translateY(0)';
            });
        });
    }

    // Add subtle animation to title (only on home.html)
    const title = document.querySelector('.title');
    if (title) { // Check if title exists
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            title.style.transition = 'opacity 1s ease, transform 1s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 500);
    }
}); 

      