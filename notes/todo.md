🧾 Prompt:

Create a fully functional, two-player chess game playable in a web browser using only vanilla HTML, CSS, and JavaScript. The game should support cursor-based interaction: players click on a piece to select it, and then click on a destination square to move it. The project must not use any external libraries or frameworks.

🔹 Requirements:
Board Setup:

Render a standard 8x8 chessboard using HTML and CSS.

Each square should alternate in color and be clearly distinguishable.

Display all pieces in their standard starting positions.

Piece Representation:

Use Unicode characters or styled HTML elements to visually represent each piece.

Pieces must be identifiable by color (white or black) and type (pawn, knight, bishop, rook, queen, king).

User Interaction (Cursor-based):

On first click: select a piece and highlight it along with all valid moves.

On second click: attempt to move the piece to the clicked square.

If move is valid: execute move, update the board state, and switch turns.

If move is invalid: deselect the piece or provide visual feedback.

Game Logic:

Implement movement rules for each piece type, including capturing.

Enforce turn-based play: white starts, then alternate.

Validate legal moves (e.g., pawns can't move backward, bishops only move diagonally, etc.).

Prevent illegal moves such as capturing your own pieces or moving into check.

Visual Feedback:

Highlight the selected piece.

Highlight all valid destination squares.

Indicate the current player's turn.

Game State Management:

Track and update the board state using JavaScript data structures.

Handle captures and piece replacement.

Include basic detection for check, checkmate, and stalemate.

Controls:

Add a reset or "New Game" button to restart the match.

Display game status (e.g., "White's Turn", "Black in Check", "Checkmate").

🔹 Landing Page Requirements:

Design a chess-themed landing page with the following elements:

Visual Design:
- Create a sophisticated, chess-inspired color scheme using dark and light squares as the base
- Implement a responsive layout that works well on both desktop and mobile devices
- Use chess-themed decorative elements (e.g., chess pieces as design accents)
- Include subtle animations for interactive elements

Main Components:
- Large, eye-catching title with chess-themed typography
- Prominent "Play Now" button with hover effects
- Optional "How to Play" section with basic rules
- Chess-themed background pattern or subtle animation

Interactive Elements:
- Animated chess pieces or board elements in the background
- Hover effects on all interactive elements
- Smooth transitions between pages
- Optional chess piece movement animation in the background

Additional Features:
- Simple navigation menu
- Optional dark/light theme toggle
- Responsive design that maintains chess theme across all screen sizes
- Loading animation with chess pieces when transitioning to the game

Technical Requirements:
- Use only vanilla HTML, CSS, and JavaScript
- Ensure fast loading times
- Implement smooth transitions between landing page and game
- Maintain consistent chess theme throughout

