const { getRandomPiece, rotate } = require('./pieces');
const { createGrid, isValidMove, mergePiece, clearLines, ROWS, COLS } = require('./grid');

function createGame(io, room) {
  let grid = createGrid();
  let currentPiece = getRandomPiece();
  let pieceX = 3;
  let pieceY = 0;
  let gameOver = false;
  let interval = null;

  function tick() {
    if (gameOver) return;

    // Tentative de descente
    if (isValidMove(grid, currentPiece, pieceX, pieceY + 1)) {
      pieceY++;
    } else {
      // Merge dans la grille
      grid = mergePiece(grid, currentPiece, pieceX, pieceY);
      const { newGrid, linesCleared } = clearLines(grid);
      grid = newGrid;

      // Nouvelle pièce
      currentPiece = getRandomPiece();
      pieceX = 3;
      pieceY = 0;

      // Si la nouvelle pièce est déjà bloquée → Game Over
      if (!isValidMove(grid, currentPiece, pieceX, pieceY)) {
        gameOver = true;
        clearInterval(interval);
        io.to(room).emit('gameOver');
        return;
      }
    }

    // État à envoyer aux clients
    io.to(room).emit('gameState', {
      grid,
      currentPiece,
      position: { x: pieceX, y: pieceY }
    });
  }

  function move(dir) {
    const offsetX = dir === 'left' ? -1 : 1;
    if (isValidMove(grid, currentPiece, pieceX + offsetX, pieceY)) {
      pieceX += offsetX;
    }
  }

  function softDrop() {
    if (isValidMove(grid, currentPiece, pieceX, pieceY + 1)) {
      pieceY += 1;
    }
  }

  function rotatePiece() {
    const rotated = rotate(currentPiece);
    if (isValidMove(grid, rotated, pieceX, pieceY)) {
      currentPiece = rotated;
    }
  }

  function hardDrop() {
    while (isValidMove(grid, currentPiece, pieceX, pieceY + 1)) {
      pieceY += 1;
    }
    tick(); // forcer fusion + nouvelle pièce
  }

  function start() {
    interval = setInterval(tick, 1000);
  }

  function stop() {
    clearInterval(interval);
  }

  return {
    start,
    stop,
    move,
    softDrop,
    rotatePiece,
    hardDrop,
  };
}

module.exports = {
  createGame
};
