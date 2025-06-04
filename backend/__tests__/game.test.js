jest.mock('../services/room', () => {
	const rooms = {
		'test-room': {
			isStart: false,
			players: {},
			sequence: [],
			game: null,
			settings: {},
			pieceQueue: []
		}
	};
	return {
		rooms,
		removeRoom: jest.fn()
	};
});

const Game = require("../game/games");
const Piece = require("../game/piece");

jest.useFakeTimers();

function createMockPlayer(socketId, username = 'Player') {
	return {
		socketId,
		username,
		isAlive: true,
		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		currentPiece: Piece.getRandomPiece(),
		pieceX: 3,
		pieceY: 0,
		pieceIndex: 0
	};
}

function createMockIO() {
	return {
		to: jest.fn(() => ({
			emit: jest.fn()
		}))
	};
}

describe('Game class', () => {
	let io, room, players, sequence, game;

	beforeEach(() => {
		io = createMockIO();
		room = 'test-room';
		players = {
			'socket1': createMockPlayer('socket1', 'Alice'),
			'socket2': createMockPlayer('socket2', 'Bob')
		};
		sequence = Array.from({ length: 100 }, () => Piece.getRandomPiece());
		game = new Game(io, room, players, sequence);
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	test('starts the game and sets isRunning to true', () => {
		game.start();
		expect(game.isRunning).toBe(true);
	});

	test('stops the game and clears the interval', () => {
		game.start();
		game.stop();
		expect(game.isRunning).toBe(false);
		expect(game.interval).toBe(null);
	});

	test('move() updates pieceX on valid move', () => {
		const initialX = players['socket1'].pieceX;
		game.move('left', 'socket1');
		expect(players['socket1'].pieceX).toBe(initialX - 1);
	});

	test('rotate() changes the piece shape if valid', () => {
		const p = players['socket1'];
		p.currentPiece = {
			name: 'L',
			shape: [
				[1, 0],
				[1, 0],
				[1, 1]
			],
			option: {}
		};
		const before = JSON.stringify(p.currentPiece.shape);
		game.rotate('socket1');
		const after = JSON.stringify(p.currentPiece.shape);
		expect(after).not.toEqual(before);
	});

	test('hardDrop() places piece immediately', () => {
		const p = players['socket1'];
		p.grid[19][3] = { name: 'block', option: {} };

		p.currentPiece = {
			name: 'I',
			shape: [[1, 1, 1, 1]],
			option: {}
		};
		p.pieceX = 3;
		p.pieceY = 0;

		const oldGrid = JSON.stringify(p.grid);
		game.hardDrop('socket1');
		const newGrid = JSON.stringify(p.grid);
		expect(newGrid).not.toEqual(oldGrid);
	});

	test('tick() kills player if no room for new piece', () => {
		const p = players['socket1'];

		// Blocage total en haut (4 lignes)
		p.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
		for (let y = 0; y < 4; y++) {
			p.grid[y] = Array(10).fill({ name: 'block', option: {} });
		}

		// Forcer fixation en bas
		p.currentPiece = {
			name: 'I',
			shape: [[1]],
			option: {}
		};
		p.pieceX = 0;
		p.pieceY = 19;

		game.tick();

		expect(p.isAlive).toBe(true);
	});



	test('tick() announces winner when one player left', () => {
		const p1 = players['socket1'];
		const p2 = players['socket2'];

		p2.isAlive = false;

		// Mock de `emit`
		const emitMock = jest.fn();
		io.to = jest.fn(() => ({ emit: emitMock }));

		game.tick();

		expect(emitMock).toHaveBeenCalledWith('gameEnded', { winner: p1.username });
	});

});
