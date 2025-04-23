const PIECES = {
	I: [
		[[1, 1, 1, 1]],
		[[1], [1], [1], [1]],
	],
	O: [
		[[1, 1],
		 [1, 1]]
	],
	T: [
		[[0, 1, 0],
		 [1, 1, 1]],
		[[1, 0],
		 [1, 1],
		 [1, 0]],
		[[1, 1, 1],
		 [0, 1, 0]],
		[[0, 1],
		 [1, 1],
		 [0, 1]],
	],
	L: [
		[[1, 0],
		 [1, 0],
		 [1, 1]],
		[[1, 1, 1],
		 [1, 0, 0]],
		[[1, 1],
		 [0, 1],
		 [0, 1]],
		[[0, 0, 1],
		 [1, 1, 1]],
	],
	J: [
		[[0, 1],
		 [0, 1],
		 [1, 1]],
		[[1, 0, 0],
		 [1, 1, 1]],
		[[1, 1],
		 [1, 0],
		 [1, 0]],
		[[1, 1, 1],
		 [0, 0, 1]],
	],
	S: [
		[[0, 1, 1],
		 [1, 1, 0]],
		[[1, 0],
		 [1, 1],
		 [0, 1]],
	],
	Z: [
		[[1, 1, 0],
		 [0, 1, 1]],
		[[0, 1],
		 [1, 1],
		 [1, 0]],
	],
	};

	const pieceTypes = Object.keys(PIECES);

function getRandomPiece() {
	const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
	const rotations = PIECES[type];
	return {
		type,
		rotationIndex: 0,
		shape: rotations[0],
		rotations
	};
}

function rotate(piece) {
	const nextIndex = (piece.rotationIndex + 1) % piece.rotations.length;
	return {
		...piece,
		rotationIndex: nextIndex,
		shape: piece.rotations[nextIndex]
	};
}

module.exports = {
	getRandomPiece,
	rotate,
	PIECES
};
