export const TETRIMINOS = {
	I: {
		shape: [[1, 1, 1, 1]],
		option: {
			color: '#00ffff',
			boxShadow: '0 0 10px #00ffff',
		},
	},
	O: {
		shape: [
			[1, 1],
			[1, 1]
		],
		option: {
			color: '#ffff00',
			boxShadow: '0 0 10px #ffff00',
		},
	},
	T: {
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		],
		option: {
			color: '#a020f0',
			boxShadow: '0 0 10px #a020f0',
		},
	},
	S: {
		shape: [
			[0, 1, 1],
			[1, 1, 0]
		],
		option: {
			color: '#00ff00',
			boxShadow: '0 0 10px #00ff00',
		},
	},
	Z: {
		shape: [
			[1, 1, 0],
			[0, 1, 1]
		],
		option: {
			color: '#ff0000',
			boxShadow: '0 0 10px #ff0000',
		},
	},
	J: {
		shape: [
			[1, 0, 0],
			[1, 1, 1]
		],
		option: {
			color: '#0000ff',
			boxShadow: '0 0 10px #0000ff',
		},
	},
	L: {
		shape: [
			[0, 0, 1],
			[1, 1, 1]
		],
		option: {
			color: '#ffa500',
			boxShadow: '0 0 10px #ffa500',
		},
	}
};

export default function getRandomPiece() {
	const keys = Object.keys(TETRIMINOS);
	const name = keys[Math.floor(Math.random() *keys.length)]
	return (
		{	name,
			shape: TETRIMINOS[name].shape,
			position: { x: 3, y: 0},
			option: TETRIMINOS[name].option,
		});
}