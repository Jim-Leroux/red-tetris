const TETRIMINOS = {
	I: {
		shape: [[1, 1, 1, 1]],
	},
	O: {
		shape: [
			[1, 1],
			[1, 1]
		],
	},
	T: {
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		],
	},
	S: {
		shape: [
			[0, 1, 1],
			[1, 1, 0]
		],
	},
	Z: {
		shape: [
			[1, 1, 0],
			[0, 1, 1]
		],
	},
	J: {
		shape: [
			[1, 0, 0],
			[1, 1, 1]
		],
	},
	L: {
		shape: [
			[0, 0, 1],
			[1, 1, 1]
		],
	}
};

/**
 * Retourne une pièce à partir de son nom
 */
function getNamePiece(name) {
	return (
		{	name,
			shape: TETRIMINOS[name].shape,
			position: { x: 3, y: 0},
		});
}

/**
 * Rotation horaire d'une matrice 2D (pièce)
 */
function rotate(shape) {
	return shape[0].map((_, i) =>
		shape.map(row => row[i]).reverse()
	);
}

/**
 * Retourne une pièce aléatoire
 */
function getRandomPiece() {
	const keys = Object.keys(TETRIMINOS);
	const name = keys[Math.floor(Math.random() *keys.length)]
	return getNamePiece(name);
}

module.exports = {
	TETRIMINOS,
	getNamePiece,
	rotate,
	getRandomPiece
};

