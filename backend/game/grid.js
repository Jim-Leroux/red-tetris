const ROWS = 20;
const COLS = 10;

function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function isValidMove(grid, piece, posX, posY) {
  const shape = piece.shape;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = posY + y;
        const newX = posX + x;
        if (
          newY >= ROWS || newX < 0 || newX >= COLS ||
          (newY >= 0 && grid[newY][newX] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function mergePiece(grid, piece, posX, posY) {
  const newGrid = grid.map(row => row.slice());
  const shape = piece.shape;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        newGrid[posY + y][posX + x] = 1;
      }
    }
  }

  return newGrid;
}

function clearLines(grid) {
  const newGrid = grid.filter(row => row.some(cell => cell === 0));
  const linesCleared = ROWS - newGrid.length;
  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(0));
  }
  return { newGrid, linesCleared };
}

module.exports = {
  createGrid,
  isValidMove,
  mergePiece,
  clearLines,
  ROWS,
  COLS
};
