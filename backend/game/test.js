const { createGrid, addPenaltyLines } = require('./grid');

const baseGrid = createGrid();
const { grid: resultGrid, holes } = addPenaltyLines(baseGrid, 3);

console.log("Taille finale de la grille:", resultGrid.length); // Doit être 20
console.table(resultGrid.map(row => row.map(cell => (cell === 9 ? 'X' : cell))));
