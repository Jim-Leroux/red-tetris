const Piece = require('../game/piece');

describe('Piece', () => {
	test('getNamePiece returns correct piece', () => {
		const piece = Piece.getNamePiece('T');
		expect(piece.name).toBe('T');
		expect(piece.shape).toEqual([[0, 1, 0], [1, 1, 1]]);
		expect(piece.position).toEqual({ x: 3, y: 0 });
	});

	test('getNamePiece throws on invalid name', () => {
		expect(() => Piece.getNamePiece('INVALID')).toThrow('Unknown piece name');
	});

	test('rotate rotates matrix clockwise', () => {
		const shape = [
			[1, 0],
			[1, 1]
		];
		const rotated = Piece.rotate(shape);
		expect(rotated).toEqual([
			[1, 1],
			[1, 0]
		]);
	});

	test('getRandomPiece returns valid piece', () => {
		const piece = Piece.getRandomPiece();
		expect(piece).toHaveProperty('name');
		expect(piece).toHaveProperty('shape');
		expect(piece.position).toEqual({ x: 3, y: 0 });
	});
});
