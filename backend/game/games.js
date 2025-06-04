const { removeRoom, rooms } = require('../services/room');
const { isValidMove, mergePiece, clearLines, addPenaltyLines } = require('./grid');
const Piece = require('./piece');

function renderPieceInGrid(grid, shape, position, name, option = {}) {
	const newGrid = grid.map(row => [...row]);
	shape.forEach((row, dy) => {
		row.forEach((cell, dx) => {
			if (cell) {
				const y = position.y + dy;
				const x = position.x + dx;
				if (
					y >= 0 && y < newGrid.length &&
					x >= 0 && x < newGrid[0].length &&
					!newGrid[y][x]
				) {
					newGrid[y][x] = { name, option };
				}
			}
		});
	});
	return newGrid;
}

class Game {
	constructor(io, room, players, sequence) {
		this.io = io;
		this.room = room;
		this.players = players;
		this.sequence = sequence;
		this.interval = null;
		this.isRunning = false;
	}

	start() {
		if (!this.isRunning) {
			this.interval = setInterval(() => this.tick(), 500);
			this.isRunning = true;
			rooms[this.room].isStart = true;
		}
	}

	stop() {
		clearInterval(this.interval);
		this.interval = null;
		this.isRunning = false;
	}

	move(dir, socketId) {
		const player = this.players[socketId];
		if (!player) return;

		const offsetX = dir === 'left' ? -1 : 1;
		if (isValidMove(player.grid, player.currentPiece, player.pieceX + offsetX, player.pieceY)) {
			player.pieceX += offsetX;
			this.sendGrid(socketId);
		}
	}

	rotate(socketId) {
		const player = this.players[socketId];
		if (!player) return;

		const rotatedShape = Piece.rotate(player.currentPiece.shape);
		const rotatedPiece = { ...player.currentPiece, shape: rotatedShape };

		if (isValidMove(player.grid, rotatedPiece, player.pieceX, player.pieceY)) {
			player.currentPiece.shape = rotatedShape;
			this.sendGrid(socketId);
		}
	}

	softDrop(socketId) {
		const player = this.players[socketId];
		if (!player) return;

		if (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
			player.pieceY++;
			this.sendGrid(socketId);
		}
	}

	hardDrop(socketId) {
		const player = this.players[socketId];
		if (!player) return;

		while (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
			player.pieceY++;
		}

		this.tick();
	}

	sendGrid(socketId) {
		const player = this.players[socketId];
		const displayGrid = renderPieceInGrid(
			player.grid,
			player.currentPiece.shape,
			{ x: player.pieceX, y: player.pieceY },
			player.currentPiece.name,
			player.currentPiece.option
		);
		this.io.to(socketId).emit('serverGrid', displayGrid);
	}

	tick() {
		const specters = {};

		for (const socketId in this.players) {
			const player = this.players[socketId];
			if (!player.isAlive) continue;

			if (!player.currentPiece?.shape) continue;

			if (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
				player.pieceY++;
			} else {
				player.grid = mergePiece(player.grid, player.currentPiece, player.pieceX, player.pieceY);
				const { newGrid, linesCleared } = clearLines(player.grid);
				player.grid = newGrid;

				if (linesCleared >= 1) {
					for (const otherId in this.players) {
						if (otherId !== socketId && this.players[otherId].isAlive) {
							const { grid: updatedGrid, holes } = addPenaltyLines(this.players[otherId].grid, linesCleared);
							this.players[otherId].grid = updatedGrid;

							const displayGrid = renderPieceInGrid(
								updatedGrid,
								this.players[otherId].currentPiece.shape,
								{ x: this.players[otherId].pieceX, y: this.players[otherId].pieceY },
								this.players[otherId].currentPiece.name,
								this.players[otherId].currentPiece.option
							);
							this.io.to(otherId).emit('serverGrid', displayGrid);
							this.io.to(otherId).emit('penalty', {
								count: linesCleared,
								holes
							});
						}
					}
				}

				player.pieceIndex = (player.pieceIndex ?? 0) + 1;
				if (this.sequence.length <= player.pieceIndex + 5) {
					const extra = Array.from({ length: 50 }, () => Piece.getRandomPiece());
					this.sequence.push(...extra);
				}
				const piece = JSON.parse(JSON.stringify(this.sequence[player.pieceIndex]));
				player.currentPiece = piece;
				player.pieceX = 3;
				player.pieceY = 0;

				if (!isValidMove(player.grid, piece, 3, 0)) {
					player.isAlive = false;
					console.log(`Player ${player.username} (${socketId}) is dead`);
					this.io.to(socketId).emit('gameOver');
					continue;
				}

				this.io.to(socketId).emit('addQueue', this.sequence[player.pieceIndex + 5]);
			}

			this.sendGrid(socketId);

			specters[socketId] = {
				username: player.username,
				name: player.currentPiece?.name,
				shape: player.currentPiece?.shape,
				position: { x: player.pieceX, y: player.pieceY },
				grid: player.grid
			};
		}

		this.io.to(this.room).emit('spectersUpdate', specters);

		const alivePlayers = Object.values(this.players).filter(p => p.isAlive);

		if (alivePlayers.length === 1) {
			const winner = alivePlayers[0];
			console.log(`🎉 Winner is ${winner.username}`);
			this.io.to(winner.socketId).emit('gameEnded', { winner: winner.username });
			this.stop();
			removeRoom(this.room);
			return;
		}

		if (alivePlayers.length === 0) {
			this.stop();
			removeRoom(this.room);
		}
	}
}

module.exports = Game;
