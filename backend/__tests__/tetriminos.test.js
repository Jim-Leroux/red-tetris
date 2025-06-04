const {
  TETRIMINOS,
  getNamePiece,
  rotate,
  getRandomPiece
} = require('../logic/tetriminos');

describe('TETRIMINOS structure', () => {
  test('chaque pièce doit avoir une forme définie', () => {
    const keys = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    keys.forEach(key => {
      expect(TETRIMINOS[key]).toBeDefined();
      expect(Array.isArray(TETRIMINOS[key].shape)).toBe(true);
    });
  });
});

describe('getNamePiece', () => {
  test('retourne une pièce avec les bonnes propriétés', () => {
    const piece = getNamePiece('T');
    expect(piece.name).toBe('T');
    expect(piece.shape).toEqual(TETRIMINOS['T'].shape);
    expect(piece.position).toEqual({ x: 3, y: 0 });
  });

  test('lance une erreur si la pièce est inconnue', () => {
    expect(() => getNamePiece('X')).toThrow(); // ou à adapter si tu ne throws pas
  });
});

describe('rotate', () => {
  test('rotation de la pièce I', () => {
    const shape = [[1, 1, 1, 1]];
    const expected = [[1], [1], [1], [1]];
    expect(rotate(shape)).toEqual(expected);
  });

  test('rotation de la pièce O ne change rien', () => {
    const shape = [
      [1, 1],
      [1, 1]
    ];
    expect(rotate(shape)).toEqual(shape);
  });

  test('rotation 2x donne une rotation à 180°', () => {
    const shape = [
      [0, 1, 0],
      [1, 1, 1]
    ];
    const rot1 = rotate(shape);
    const rot2 = rotate(rot1);
    expect(rot2).not.toEqual(shape);
  });
});

describe('getRandomPiece', () => {
  test('retourne une pièce valide', () => {
    const piece = getRandomPiece();
    expect(piece).toHaveProperty('name');
    expect(piece).toHaveProperty('shape');
    expect(piece).toHaveProperty('position');
    expect(Object.keys(TETRIMINOS)).toContain(piece.name);
  });

  test('plusieurs appels retournent des pièces différentes', () => {
    const pieces = new Set();
    for (let i = 0; i < 10; i++) {
      pieces.add(getRandomPiece().name);
    }
    expect(pieces.size).toBeGreaterThan(1); // normalement, on a plus d’une forme
  });
});
