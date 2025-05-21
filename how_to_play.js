// JavaScript for interactive piece movement demonstrations on the How to Play page

document.addEventListener('DOMContentLoaded', () => {
    const demoBoards = document.querySelectorAll('.small-board');

    // Simplified piece movement logic (only for demonstration)
    function getDemoMoves(pieceType, row, col) {
        const moves = [];
        // For demonstration, we'll just show a few potential moves around a central piece
        // This is NOT the full, accurate chess movement logic.

        switch (pieceType) {
            case 'p': // Pawn
                // Show potential forward and capture moves from a central position
                moves.push({ r: row - 1, c: col }); // Forward
                moves.push({ r: row - 1, c: col - 1 }); // Diagonal capture left
                moves.push({ r: row - 1, c: col + 1 }); // Diagonal capture right
                // Also show initial two-square move
                if (row === 6) moves.push({ r: row - 2, c: col });
                break;
            case 'n': // Knight
                // Show all 8 possible L-shaped moves
                [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
                    moves.push({ r: row + dr, c: col + dc });
                });
                break;
            case 'b': // Bishop
                // Show moves along all 4 diagonals from a central position
                for (let i = 1; i < 8; i++) {
                    moves.push({ r: row + i, c: col + i });
                    moves.push({ r: row + i, c: col - i });
                    moves.push({ r: row - i, c: col + i });
                    moves.push({ r: row - i, c: col - i });
                }
                break;
            case 'r': // Rook
                // Show moves horizontally and vertically from a central position
                for (let i = 1; i < 8; i++) {
                    moves.push({ r: row + i, c: col });
                    moves.push({ r: row - i, c: col });
                    moves.push({ r: row, c: col + i });
                    moves.push({ r: row, c: col - i });
                }
                break;
            case 'q': // Queen
                // Show moves in all 8 directions from a central position
                 for (let i = 1; i < 8; i++) {
                    moves.push({ r: row + i, c: col + i });
                    moves.push({ r: row + i, c: col - i });
                    moves.push({ r: row - i, c: col + i });
                    moves.push({ r: row - i, c: col - i });
                    moves.push({ r: row + i, c: col });
                    moves.push({ r: row - i, c: col });
                    moves.push({ r: row, c: col + i });
                    moves.push({ r: row, c: col - i });
                }
                break;
            case 'k': // King
                 // Show moves one square in any direction
                 for(let dr = -1; dr <= 1; dr++) {
                    for(let dc = -1; dc <= 1; dc++) {
                        if (dr !== 0 || dc !== 0) {
                            moves.push({ r: row + dr, c: col + dc });
                        }
                    }
                }
                break;
        }

        // Filter out moves that are off the board
        return moves.filter(move => move.r >= 0 && move.r < 8 && move.c >= 0 && move.c < 8);
    }

    // Pieces mapping (reuse from script.js, simplified for demonstration)
    const pieces = {
        'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
    };

    // Render each small board
    demoBoards.forEach(boardElement => {
        const pieceType = boardElement.dataset.piece;
        // Place the piece in the center for demonstration (adjust as needed)
        const pieceRow = 3; 
        const pieceCol = 3;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = r;
                square.dataset.col = c;

                // Place the demonstration piece
                if (r === pieceRow && c === pieceCol) {
                     square.textContent = pieces[pieceType.toLowerCase()]; // Use lowercase for black pieces on demo boards
                     square.classList.add('black-piece'); // Style as black piece for visibility
                     // Add click listener to the piece square
                     square.addEventListener('click', () => {
                        // Remove previous highlights
                        boardElement.querySelectorAll('.square').forEach(s => s.classList.remove('highlight'));
                        // Get and highlight valid moves
                        const validMoves = getDemoMoves(pieceType, pieceRow, pieceCol);
                        validMoves.forEach(move => {
                            const targetSquare = boardElement.querySelector(`[data-row="${move.r}"][data-col="${move.c}"]`);
                            if (targetSquare) {
                                targetSquare.classList.add('highlight');
                            }
                        });
                    });
                }

                boardElement.appendChild(square);
            }
        }
    });
}); 