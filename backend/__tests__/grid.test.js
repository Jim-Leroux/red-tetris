const {
	createGrid,
	isValidMove,
	mergePiece,
	clearLines,
	addPenaltyLines
} = require('../game/grid');

describe('Grid logic', () => {
	test('createGrid returns empty 20x10 grid', () => {
		const grid = createGrid();
		expect(grid).toHaveLength(20);
		grid.forEach(row => {
			expect(row).toHaveLength(10);
			expect(row.every(c => c === 0)).toBe(true);
		});
	});

	test('isValidMove works correctly', () => {
		const grid = createGrid();
		const piece = { shape: [[1, 1]] };
		expect(isValidMove(grid, piece, 0, 0)).toBe(true);
		expect(isValidMove(grid, piece, 9, 0)).toBe(false);
	});

	test('mergePiece integrates shape into grid', () => {
		const grid = createGrid();
		const piece = { shape: [[1, 1]], name: 'T', option: {} };
		const merged = mergePiece(grid, piece, 0, 0);
		expect(typeof merged[0][0]).toBe('object');
		expect(merged[0][1].name).toBe('T');
	});

	test('clearLines removes filled lines', () => {
		const full = Array(10).fill({ name: 'X', option: {} });
		const grid = [...Array(19).fill(Array(10).fill(0)), full];
		const { newGrid, linesCleared } = clearLines(grid);
		expect(linesCleared).toBe(1);
		expect(newGrid).toHaveLength(20);
	});

	test('addPenaltyLines adds correct structure', () => {
		const grid = createGrid();
		const { grid: updated } = addPenaltyLines(grid, 2);
		const lastTwo = updated.slice(-2);
		lastTwo.forEach(row => {
			expect(row.filter(c => c === 9).length).toBe(9);
			expect(row.includes(0)).toBe(true);
		});
	});
});
