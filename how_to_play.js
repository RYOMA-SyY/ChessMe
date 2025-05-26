// JavaScript for interactive piece movement demonstrations on the How to Play page

document.addEventListener('DOMContentLoaded', () => {
    const demoBoards = document.querySelectorAll('.small-board');

    // Pieces mapping (from script.js)
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    // Adapted getValidMoves function for a given board size and piece position
    function getDemoValidMoves(boardState, pieceType, row, col, boardSize) {
        const moves = [];
        const isWhite = pieceType === pieceType.toUpperCase();
        const piece = pieceType.toLowerCase();

        // Helper to check if a square is on the board
        const isOnBoard = (r, c) => r >= 0 && r < boardSize && c >= 0 && c < boardSize;

        // Helper to check if a square is empty or has an opponent's piece
        const isEmptyOrOpponent = (r, c, isWhite) => {
            const targetPiece = boardState[r][c];
            if (!targetPiece) return true; // Empty square
            if (isWhite && targetPiece === targetPiece.toLowerCase()) return true; // White attacking black
            if (!isWhite && targetPiece === targetPiece.toUpperCase()) return true; // Black attacking white
            return false; // Same color piece
        };

        switch (piece) {
            case 'p': // Pawn (simplified for demo board)
                 // Forward move
                 const forwardRow = row + (isWhite ? -1 : 1);
                 if (isOnBoard(forwardRow, col) && !boardState[forwardRow][col]) {
                     moves.push({ row: forwardRow, col: col });
                 }
                 // Diagonal captures
                 const captureLeftCol = col - 1;
                 const captureRightCol = col + 1;
                 if (isOnBoard(forwardRow, captureLeftCol) && boardState[forwardRow][captureLeftCol] && isEmptyOrOpponent(forwardRow, captureLeftCol, isWhite)) {
                     moves.push({ row: forwardRow, col: captureLeftCol });
                 }
                 if (isOnBoard(forwardRow, captureRightCol) && boardState[forwardRow][captureRightCol] && isEmptyOrOpponent(forwardRow, captureRightCol, isWhite)) {
                     moves.push({ row: forwardRow, col: captureRightCol });
                 }
                 // Note: En passant and double move on first move are complex and omitted for this simplified demo.
                 break; 

            case 'n': // Knight
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isOnBoard(newRow, newCol) && isEmptyOrOpponent(newRow, newCol, isWhite)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                });
                break;

            case 'b': // Bishop
                const bishopDeltas = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                bishopDeltas.forEach(([dr, dc]) => {
                    let rr = row + dr, cc = col + dc;
                    while (isOnBoard(rr, cc)) {
                        const target = boardState[rr][cc];   
                        if (!target) {
                            moves.push({ row: rr, col: cc });
                        } else if (isEmptyOrOpponent(rr, cc, isWhite)) {
                            moves.push({ row: rr, col: cc });
                            break; // Stop after capturing a piece
                        } else {
                            break; // Blocked by own piece
                        }
                        rr += dr; cc += dc;
                    } 
                });
                break;

            case 'r': // Rook
                const rookDeltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                rookDeltas.forEach(([dr, dc]) => {
                    let rr = row + dr, cc = col + dc;
                    while (isOnBoard(rr, cc)) {
                        const target = boardState[rr][cc];
                        if (!target) {
                            moves.push({ row: rr, col: cc });
                        } else if (isEmptyOrOpponent(rr, cc, isWhite)) {
                            moves.push({ row: rr, col: cc });
                            break; // Stop after capturing a piece
                        } else {
                            break; // Blocked by own piece
                        }
                        rr += dr; cc += dc;
                    }
                });
                break;

            case 'q': // Queen
                const queenDeltas = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
                queenDeltas.forEach(([dr, dc]) => {
                    let rr = row + dr, cc = col + dc;
                    while (isOnBoard(rr, cc)) {
                        const target = boardState[rr][cc];
                        if (!target) {
                            moves.push({ row: rr, col: cc });
                        } else if (isEmptyOrOpponent(rr, cc, isWhite)) {
                            moves.push({ row: rr, col: cc });
                            break; // Stop after capturing a piece
                        } else {
                            break; // Blocked by own piece
                        }
                        rr += dr; cc += dc;
                    }
                });
                break;

            case 'k': // King
                const kingDeltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                kingDeltas.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isOnBoard(newRow, newCol) && isEmptyOrOpponent(newRow, newCol, isWhite)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                });
                break;
        }

        return moves;
    }

    // Render each small board
    demoBoards.forEach(boardElement => {
        const pieceType = boardElement.dataset.piece; // 'p', 'n', 'b', 'r', 'q', 'k'
        const BOARD_SIZE = 4; // All demo boards are 4x4
        // const isWhitePiece = pieceType === pieceType.toUpperCase(); // Assume input is lowercase piece type for now
        let currentlySelectedPiece = null; // Track selected piece for this board

        // Set the board label
        boardElement.setAttribute('data-label', `Click ${pieces[pieceType.toLowerCase()]} to see moves`);

        // Initialize a small board state (4x4 empty board)
        const boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(''));

        // Place the demonstration piece in a strategic position
        let pieceRow, pieceCol;
        switch (pieceType.toLowerCase()) {
            case 'p': pieceRow = 2; pieceCol = 1; break; // Pawn
            case 'n': pieceRow = 1; pieceCol = 1; break; // Knight
            case 'b': pieceRow = 1; pieceCol = 1; break; // Bishop
            case 'r': pieceRow = 1; pieceCol = 1; break; // Rook
            case 'q': pieceRow = 1; pieceCol = 1; break; // Queen
            case 'k': pieceRow = 1; pieceCol = 1; break; // King
            default: pieceRow = 1; pieceCol = 1; // Default position
        }
         // Place the piece (always black for demo for now)
        boardState[pieceRow][pieceCol] = pieceType.toLowerCase();

        // Function to clear all highlights on this board
        const clearHighlights = () => {
            boardElement.querySelectorAll('.square').forEach(s => s.classList.remove('highlight'));
        };

        // Create and append squares to the board element
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = r;
                square.dataset.col = c;

                const piece = boardState[r][c];
                if (piece) {
                    square.textContent = pieces[piece];
                    square.classList.add('black-piece'); // Assuming black pieces for demo
                     // Add click listener to the piece square
                     square.addEventListener('click', () => {
                         if (currentlySelectedPiece) {
                            // If a piece is already selected, clear highlights
                            clearHighlights();
                            currentlySelectedPiece = null; // Deselect the piece
                         } else {
                            // If no piece is selected, show valid moves
                            const validMoves = getDemoValidMoves(boardState, pieceType.toLowerCase(), pieceRow, pieceCol, BOARD_SIZE);
                            validMoves.forEach(move => {
                                const targetSquare = boardElement.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
                                if (targetSquare) {
                                    targetSquare.classList.add('highlight');
                                }
                            });
                            currentlySelectedPiece = { row: pieceRow, col: pieceCol }; // Select the current piece
                         }
                    });
                }

                boardElement.appendChild(square);
            }
        }
    });
}); 