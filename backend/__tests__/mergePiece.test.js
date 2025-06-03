const { createGrid, mergePiece } = require("../game/grid");


describe('mergePiece', () => {
  test('ajoute correctement une pièce simple', () => {
    const grid = createGrid();
    const piece = { name: 'I', shape: [[1, 1, 1, 1]] };
    const newGrid = mergePiece(grid, piece, 3, 0);

    for (let i = 3; i < 7; i++) {
      expect(newGrid[0][i]).toEqual({ name: 'I' });
    }
  });

  test('ignore les cellules hors grille', () => {
    const grid = createGrid();
    const piece = { name: 'I', shape: [[1, 1]] };
    const newGrid = mergePiece(grid, piece, 9, 0); // cell[0][10] out of bounds
    expect(newGrid[0][9]).toEqual({ name: 'I' });
    expect(newGrid[0][10]).toBeUndefined(); // pas écrasé
  });
});
