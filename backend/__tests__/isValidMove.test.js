const { isValidMove } = require("../game/grid");

describe('isValidMove', () => {
  const emptyGrid = Array.from({ length: 20 }, () => Array(10).fill(0));
  const piece = { shape: [[1, 1], [1, 1]] };

  test('mouvement valide au centre', () => {
    expect(isValidMove(emptyGrid, piece, 4, 4)).toBe(true);
  });

  test('mouvement invalide en bas de grille', () => {
    expect(isValidMove(emptyGrid, piece, 0, 19)).toBe(false);
  });

  test('mouvement invalide à gauche de la grille', () => {
    expect(isValidMove(emptyGrid, piece, -1, 5)).toBe(false);
  });

  test('mouvement invalide avec obstacle', () => {
    const grid = JSON.parse(JSON.stringify(emptyGrid));
    grid[4][4] = { name: 'T' };
    expect(isValidMove(grid, piece, 3, 3)).toBe(false);
  });

  test('mouvement invalide bord droit', () => {
    expect(isValidMove(emptyGrid, piece, 8, 0)).toBe(false);
  });
});
