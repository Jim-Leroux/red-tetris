const { createGrid } = require("../game/grid");


describe('createGrid', () => {
  test('crée une grille vide de taille ROWS x COLS', () => {
    const grid = createGrid();
    expect(grid.length).toBe(ROWS);
    grid.forEach(row => {
      expect(row.length).toBe(COLS);
      expect(row.every(cell => cell === 0)).toBe(true);
    });
  });
});
