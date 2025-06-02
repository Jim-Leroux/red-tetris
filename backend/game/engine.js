
const { isValidMove, mergePiece, clearLines, addPenaltyLines } = require('./grid');
const { rotate, getRandomPiece } = require('./tetriminos');

/**
 * Crée et gère le cycle de vie du jeu pour une room multijoueur.
 * @param {object} io - Instance Socket.IO
 * @param {string} room - Identifiant de la room
 * @param {object} players - Map des joueurs dans la room ({ socketId: playerState })
 * @param {Array} sequence - Séquence partagée de pièces à distribuer
 */
function createGame(io, room, players, sequence) {
  let interval = null;

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
					players[otherId].grid, holes = addPenaltyLines(players[otherId].grid, linesCleared - 1);
					io.to(otherId).emit('penalty', {
					count: linesCleared,
					holes: holes
				});
			}
		}
	}

		// Déterminer l'index de la prochaine pièce
		player.pieceIndex = (player.pieceIndex ?? 0) + 1;

		// Étendre la séquence si besoin
		if (sequence.length <= player.pieceIndex + 5) {
		  const extraPieces = Array.from({ length: 50 }, () => getRandomPiece());
		  sequence.push(...extraPieces);
		}

		// Récupérer la prochaine pièce
		const piece = JSON.parse(JSON.stringify(sequence[player.pieceIndex]));
		player.currentPiece = piece;
		player.pieceX = 3;
		player.pieceY = 0;

		if (!isValidMove(player.grid, piece, 3, 0)) {
		  player.isAlive = false;
		  io.to(socketId).emit('gameOver');
		  console.log("Game Over for player", player.username);
		  continue;
		}

		io.to(socketId).emit('addQueue', sequence[player.pieceIndex + 5]);
	  }

	  // Spectre
	  specters[socketId] = {
		username: player.username,
		name: player.currentPiece?.name,
		shape: player.currentPiece?.shape,
		position: { x: player.pieceX, y: player.pieceY },
		grid: player.grid,
	  };
	}

	io.to(room).emit('spectersUpdate', specters);

	const alive = Object.values(players).some(p => p.isAlive);
	if (!alive) {
	  clearInterval(interval);
	  io.to(room).emit('allPlayersGameOver');
	}
  }


  function start() {
    interval = setInterval(tick, 500);
  }

  function stop() {
    clearInterval(interval);
  }

  /**
   * Déplacement horizontal de la pièce pour un joueur
   * @param {'left'|'right'} dir
   * @param {string} socketId
   */
  function move(dir, socketId) {
    const player = players[socketId];
    if (!player) return;
    const offsetX = dir === 'left' ? -1 : 1;
    if (isValidMove(player.grid, player.currentPiece, player.pieceX + offsetX, player.pieceY)) {
      player.pieceX += offsetX;
    }
  }

  /**
   * Rotation de la pièce pour un joueur
   * @param {string} socketId
   */
  function rotatePiece(socketId) {
    const player = players[socketId];
	console.log("Rotating piece for player", player.username);
    if (!player) return;
    const rotatedShape = rotate(player.currentPiece.shape);
	const rotatedPiece = {
  ...player.currentPiece,
  shape: rotatedShape
};
    if (isValidMove(player.grid, rotatedPiece, player.pieceX, player.pieceY)) {
      player.currentPiece.shape = rotatedShape;
    }
  }

  /**
   * Descente rapide d'un joueur
   * @param {string} socketId
   */
  function softDrop(socketId) {
    const player = players[socketId];
    if (!player) return;
    if (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
      player.pieceY++;
    }
  }

  /**
   * Chute instantanée d'un joueur
   * @param {string} socketId
   */
  function hardDrop(socketId) {
    const player = players[socketId];
    if (!player) return;
    while (isValidMove(player.grid, player.currentPiece, player.pieceX, player.pieceY + 1)) {
      player.pieceY++;
    }
    // Fusionner et passer à la prochaine pièce immédiatement
    tick();
  }

  return {
    start,
    stop,
    move,
    rotate: rotatePiece,
    softDrop,
    hardDrop
  };
}

module.exports = { createGame };
