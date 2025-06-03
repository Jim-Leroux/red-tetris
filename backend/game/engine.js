const { isValidMove, mergePiece, clearLines, addPenaltyLines } = require('./grid');
const { rotate, getRandomPiece } = require('./tetriminos');
const { removeRoom, removePlayer } = require('../services/Game.js')
/**
 * Dessine une pièce dans une copie de la grille sans modifier l'original.
 */
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

function createGame(io, room, players, sequence) {
	let interval = null;
	let isRunning = false;

	function tick() {
		const specters = {};

		for (const socketId in players) {
			const player = players[socketId];
			if (!player.isAlive) continue;

			const { grid, currentPiece, pieceX, pieceY } = player;
			if (!currentPiece || !currentPiece.shape) continue;

			// Mouvement automatique
			if (isValidMove(grid, currentPiece, pieceX, pieceY + 1)) {
				player.pieceY++;
			} else {
				// Fixer la pièce
				player.grid = mergePiece(grid, currentPiece, pieceX, pieceY);
				const { newGrid, linesCleared } = clearLines(player.grid);
				player.grid = newGrid;

				if (linesCleared >= 1) {
					for (const otherId in players) {
						if (otherId !== socketId && players[otherId].isAlive) {
							const { grid: updatedGrid, holes } = addPenaltyLines(players[otherId].grid, linesCleared);
							players[otherId].grid = updatedGrid;

							const displayGrid = renderPieceInGrid(
								updatedGrid,
								players[otherId].currentPiece.shape,
								{ x: players[otherId].pieceX, y: players[otherId].pieceY },
								players[otherId].currentPiece.name,
								players[otherId].currentPiece.option
							);
							io.to(otherId).emit('serverGrid', displayGrid);
							io.to(otherId).emit('penalty', {
								count: linesCleared,
								holes
							});
						}
					}
				}


				// Nouvelle pièce
				player.pieceIndex = (player.pieceIndex ?? 0) + 1;
				if (sequence.length <= player.pieceIndex + 5) {
					const extra = Array.from({ length: 50 }, () => getRandomPiece());
					sequence.push(...extra);
				}
				const piece = JSON.parse(JSON.stringify(sequence[player.pieceIndex]));
				player.currentPiece = piece;
				player.pieceX = 3;
				player.pieceY = 0;

				if (!isValidMove(player.grid, piece, 3, 0)) {
					player.isAlive = false;
					io.to(socketId).emit('gameOver');
					continue;
				}

				io.to(socketId).emit('addQueue', sequence[player.pieceIndex + 5]);
			}

			// Envoi de la grille avec pièce affichée
			const displayGrid = renderPieceInGrid(
				player.grid,
				player.currentPiece.shape,
				{ x: player.pieceX, y: player.pieceY },
				player.currentPiece.name,
				player.currentPiece.option
			);
			io.to(socketId).emit('serverGrid', displayGrid);

			// Spectre
			specters[socketId] = {
				username: player.username,
				name: player.currentPiece?.name,
				shape: player.currentPiece?.shape,
				position: { x: player.pieceX, y: player.pieceY },
				grid: player.grid
			};
		}

		io.to(room).emit('spectersUpdate', specters);

		if (!Object.values(players).some(p => p.isAlive)) {
			clearInterval(interval);
			removeRoom(room)
		}
	}

	function start() {
		if (!isRunning) {
		interval = setInterval(tick, 500);
		isRunning = true;
		}
	}

	function stop() {
		clearInterval(interval);
		interval = null;
		isRunning = false;
	}

	function move(dir, socketId) {
		const player = players[socketId];
		if (!player) return;

		const offsetX = dir === 'left' ? -1 : 1;
		if (isValidMove(player.grid, player.currentPiece, player.pieceX + offsetX, player.pieceY)) {
			player.pieceX += offsetX;

			const displayGrid = renderPieceInGrid(
				player.grid,
				player.currentPiece.shape,
				{ x: player.pieceX, y: player.pieceY },
				player.currentPiece.name,
				player.currentPiece.option
			);
			io.to(socketId).emit('serverGrid', displayGrid);
		}
	}

	function rotatePiece(socketId) {
		const player = players[socketId];
		if (!player) return;

		const rotatedShape = rotate(player.currentPiece.shape);
		const rotatedPiece = { ...player.currentPiece, shape: rotatedShape };

		if (isValidMove(player.grid, rotatedPiece, player.pieceX, player.pieceY)) {
			player.currentPiece.shape = rotatedShape;

			const displayGrid = renderPieceInGrid(
				player.grid,
				player.currentPiece.shape,
				{ x: player.pieceX, y: player.pieceY },
				player.currentPiece.name,
				player.currentPiece.option
			);
			io.to(socketId).emit('serverGrid', displayGrid);
		}
	}

	function softDrop(socketId) {
		const player = players[socketId];
		if (!player) return;

		if (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
			player.pieceY++;

			const displayGrid = renderPieceInGrid(
				player.grid,
				player.currentPiece.shape,
				{ x: player.pieceX, y: player.pieceY },
				player.currentPiece.name,
				player.currentPiece.option
			);
			io.to(socketId).emit('serverGrid', displayGrid);
		}
	}

	function hardDrop(socketId) {
		const player = players[socketId];
		if (!player) return;

		while (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
			player.pieceY++;
		}

		// Tick va gérer la fusion + nouvelle pièce + serverGrid
		tick();
	}

	return {
		start,
		stop,
		move,
		rotate: rotatePiece,
		softDrop,
		hardDrop,
		get isRunning() { return isRunning; }
	};
}

module.exports = { createGame };
