const Player = require('../services/player');
const Piece = require('../game/piece');

describe('Player', () => {
	test('constructor initializes player correctly', () => {
		const player = new Player('id123', 'Alice');
		expect(player.socketId).toBe('id123');
		expect(player.username).toBe('Alice');
		expect(player.isAlive).toBe(true);
		expect(player.grid).toHaveLength(20);
		expect(player.grid[0]).toHaveLength(10);
	});

	test('assigning piece updates player state manually', () => {
		const player = new Player('id', 'Charlie');
		const piece = Piece.getNamePiece('L');
		player.currentPiece = piece;
		player.pieceX = 5;
		player.pieceY = 2;
		expect(player.currentPiece.name).toBe('L');
		expect(player.pieceX).toBe(5);
		expect(player.pieceY).toBe(2);
	});

	test('assignFirstPiece sets piece and resets position/index', () => {
		const player = new Player('id999', 'Eve');
		const piece = {
			name: 'T',
			shape: [[1, 1, 1], [0, 1, 0]],
			option: { color: 'purple' }
		};

		player.assignFirstPiece(piece);

		expect(player.currentPiece).toEqual(piece);
		expect(player.pieceX).toBe(3);
		expect(player.pieceY).toBe(0);
		expect(player.pieceIndex).toBe(0);
	});
});
