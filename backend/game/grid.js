const ROWS = 20;
const COLS = 10;

/**
 * Crée une grille vide de taille ROWS x COLS
 */
function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

/**
 * Vérifie si le déplacement d'une pièce est valide sur la grille
 * @param {number[][]} grid
 * @param {object} piece
 * @param {number} posX
 * @param {number} posY
 * @returns {boolean}
 */
function isValidMove(grid, piece, posX, posY) {
  if (!piece || !piece.shape) return false;
  const shape = piece.shape;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = posY + y;
        const newX = posX + x;

        if (
          newY < 0 ||
          newY >= ROWS ||
          newX < 0 ||
          newX >= COLS ||

          (typeof grid[newY][newX] === 'object' || grid[newY][newX] === 9)
        ) {
          return false;
        }
      }
    }
  }

  return true;
}


/**
 * Fusionne une pièce dans la grille et retourne la nouvelle grille
 * @param {number[][]} grid
 * @param {object} piece
 * @param {number} posX
 * @param {number} posY
 * @returns {number[][]}
 */
function mergePiece(grid, piece, posX, posY) {
  const newGrid = grid.map(row => row.slice());
  const { shape, name } = piece;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const targetY = posY + y;
        const targetX = posX + x;
        if (
          targetY >= 0 && targetY < newGrid.length &&
          targetX >= 0 && targetX < newGrid[0].length
        ) {
          const targetCell = newGrid[targetY][targetX];
          if (targetCell === 0) {
            newGrid[targetY][targetX] = { name };
          }
        }
      }
    }
  }

  return newGrid;
}


/**
 * Supprime les lignes complètes et retourne la nouvelle grille et le nombre de lignes effacées
 * @param {number[][]} grid
 * @returns {{ newGrid: number[][], linesCleared: number }}
 */
function clearLines(grid) {
  const filtered = grid.filter(row => {
    return row.includes(0) || row.includes(9);
  });

  const linesCleared = ROWS - filtered.length;
  while (filtered.length < ROWS) {
    filtered.unshift(Array(COLS).fill(0));
  }
  return { newGrid: filtered, linesCleared };
}


/**
 * Calcule le spectre (hauteur) de chaque colonne dans la grille
 * @param {number[][]} grid
 * @returns {number[]}
 */
function calculateSpectre(grid) {
  const spectre = [];
  for (let x = 0; x < COLS; x++) {
    let y = 0;
    while (y < ROWS && grid[y][x] === 0) {
      y++;
    }
    spectre.push(y === ROWS ? -1 : y);
  }
  return spectre;
}

function addPenaltyLines(grid, count) {
  const newGrid = grid.slice(count); 
  const holes = [];

  for (let i = 0; i < count; i++) {
    const row = Array(COLS).fill(9);
    const hole = Math.floor(Math.random() * COLS);
    row[hole] = 0;
    holes.push(hole);
    newGrid.push(row);
  }

  // ✅ Si jamais on a trop coupé, on complète avec des lignes vides
  while (newGrid.length < ROWS) {
    newGrid.unshift(Array(COLS).fill(0));
  }

  console.log("Adding penalty lines with holes at columns:", holes);
  return {
    grid: newGrid,
    holes
  };
}






module.exports = {
  createGrid,
  isValidMove,
  mergePiece,
  clearLines,
  calculateSpectre,
  addPenaltyLines,
  ROWS,
  COLS
};
