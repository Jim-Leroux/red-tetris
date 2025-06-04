const { createGrid } = require("../game/grid");

class Player {
	constructor(socketId, username) {
		this.socketId = socketId;
		this.username = username;
		this.grid = createGrid();
		this.currentPiece = null; // 👈 Important : pas de pièce avant le démarrage
		this.pieceX = 3;
		this.pieceY = 0;
		this.pieceIndex = 0;
		this.isAlive = true;
	}

	assignFirstPiece(piece) {
		this.currentPiece = JSON.parse(JSON.stringify(piece));
		this.pieceX = 3;
		this.pieceY = 0;
		this.pieceIndex = 0;
	}

}

module.exports = Player;
