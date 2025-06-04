const { createGrid, addPenaltyLines, ROWS, COLS } = require('../game/grid');

describe('addPenaltyLines', () => {
  test('ajoute des lignes de pénalité avec trous aléatoires', () => {
    const grid = createGrid();
    const { grid: newGrid, holes } = addPenaltyLines(grid, 3);

    expect(newGrid.length).toBe(ROWS);
    for (let i = ROWS - 3; i < ROWS; i++) {
      const row = newGrid[i];
      const zeros = row.filter(cell => cell === 0);
      expect(zeros.length).toBe(1); // un trou
      expect(row.every(cell => cell === 9 || cell === 0)).toBe(true);
    }

    expect(holes).toHaveLength(3);
  });
});
