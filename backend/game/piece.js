class Piece {
	static TETRIMINOS = {
		I: { shape: [[1, 1, 1, 1]] },
		O: { shape: [[1, 1], [1, 1]] },
		T: { shape: [[0, 1, 0], [1, 1, 1]] },
		S: { shape: [[0, 1, 1], [1, 1, 0]] },
		Z: { shape: [[1, 1, 0], [0, 1, 1]] },
		J: { shape: [[1, 0, 0], [1, 1, 1]] },
		L: { shape: [[0, 0, 1], [1, 1, 1]] },
	};

	static getNamePiece(name) {
		const piece = Piece.TETRIMINOS[name];
		if (!piece) throw new Error(`Unknown piece name: ${name}`);
		return {
			name,
			shape: piece.shape,
			position: { x: 3, y: 0 },
		};
	}

	static rotate(shape) {
		return shape[0].map((_, i) =>
			shape.map(row => row[i]).reverse()
		);
	}

	static getRandomPiece() {
		const keys = Object.keys(Piece.TETRIMINOS);
		const name = keys[Math.floor(Math.random() * keys.length)];
		return Piece.getNamePiece(name);
	}
}

module.exports = Piece;
