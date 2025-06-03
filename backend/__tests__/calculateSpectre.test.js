const { createGrid, calculateSpectre } = require('../game/grid');

describe('calculateSpectre', () => {
  test('retourne -1 pour colonnes vides', () => {
    const grid = createGrid();
    const spectre = calculateSpectre(grid);
    expect(spectre).toHaveLength(10);
    expect(spectre.every(val => val === -1)).toBe(true);
  });

  test('détecte la première cellule non vide', () => {
    const grid = createGrid();
    grid[5][3] = { name: 'T' };
    const spectre = calculateSpectre(grid);
    expect(spectre[3]).toBe(5);
  });
});
