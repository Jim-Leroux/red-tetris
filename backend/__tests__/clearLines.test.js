const { clearLines, ROWS, COLS } = require("../game/grid");


describe('clearLines', () => {
  test('supprime lignes pleines et conserve lignes vides', () => {
    const fullLine = Array(COLS).fill({ name: 'T' });
    const grid = Array(ROWS - 2).fill().map(() => Array(COLS).fill(0));
    grid.push(fullLine);
    grid.push(fullLine);

    const { newGrid, linesCleared } = clearLines(grid);
    expect(linesCleared).toBe(2);
    expect(newGrid.length).toBe(ROWS);
    expect(newGrid[ROWS - 1]).toEqual(expect.arrayContaining([0]));
  });

  test('ne supprime pas les lignes contenant 9', () => {
    const penalty = Array(COLS).fill(9);
    const grid = Array(ROWS - 1).fill().map(() => Array(COLS).fill(0));
    grid.push(penalty);

    const { linesCleared, newGrid } = clearLines(grid);
    expect(linesCleared).toBe(0);
    expect(newGrid[ROWS - 1]).toEqual(penalty);
  });
});
