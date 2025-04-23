const { createGame } = require('../game/engine');
const { getSpecterData } = require('../game/grid');

const rooms = {};
// correction ici tu cree une instance game par room au lieux de joueur
function addPlayerToRoom(socketId, username, room) {
	let isHost = false;
  if (!rooms[room]) {
	isHost = true;
    rooms[room] = {
      players: {},
      game: {},
    };
  }

  rooms[room].players[socketId] = {
    username,
    socketId,
  };
  return isHost;
}
function removePlayer(socketId) {
	for (const room in rooms) {
	  if (rooms[room].players[socketId]) {
		delete rooms[room].players[socketId];

		// Supprimer la partie individuelle du joueur
		if (rooms[room].game?.[socketId]) {
		  rooms[room].game[socketId].stop?.();
		  delete rooms[room].game[socketId];
		}

		// Supprimer la room si vide
		if (Object.keys(rooms[room].players).length === 0) {
		  // Stopper toutes les games restantes
		  if (rooms[room].game) {
			Object.values(rooms[room].game).forEach(game => game.stop?.());
		  }
		  // Stopper l'interval global s'il existe
		  if (rooms[room].interval) {
			clearInterval(rooms[room].interval);
		  }

		  delete rooms[room];
		}

		return room;
	  }
	}
	return null;
  }


function getPlayersInRoom(room) {
  return rooms[room] ? Object.values(rooms[room].players) : [];
}


// correction ici tu cree une instance game par room au lieux de joueur
const { getRandomPiece } = require('../game/pieces');

function startGame(io, room) {
	if (!rooms[room]) return;

	// Créer une queue partagée
	rooms[room].pieceQueue = Array.from({ length: 500 }, () => getRandomPiece());

	// Créer une game par joueur
	for (const socketId in rooms[room].players) {
		const game = createGame(io, room);
		rooms[room].game[socketId] = game;

		// ⚠️ Ne PAS appeler setNextPiece, c’est le front qui gère les pièces maintenant

		// ✅ Envoyer la première pièce par socket
		const nextPiece = rooms[room].pieceQueue.shift();
		if (nextPiece) {
			io.to(room).emit("piece", nextPiece);
		}
	}

	// Démarrage du tick global (spectres, scores, etc.)
	rooms[room].interval = setInterval(() => {
		tickAllGames(io, room);
	}, 1000);
}


function tickAllGames(io, room) {
	const games = rooms[room]?.game;
	const queue = rooms[room]?.pieceQueue;

	if (!games || !queue) return;

	// Tick chaque joueur avec même pièce
	for (const [socketId, game] of Object.entries(games)) {
		if (!game.getGameOver()) {
			const nextPiece = rooms[room].pieceQueue.shift();
			if (nextPiece) {
				io.to(socketId).emit("nextPiece", nextPiece);
			}
		}
	}


	// Construire et envoyer les spectres
	const spectersByPlayer = {};
	for (const [socketId, game] of Object.entries(games)) {
		spectersByPlayer[socketId] = game.getSpecterState();
	}

	for (const [socketId, game] of Object.entries(games)) {
		const others = {};
		for (const [otherId, specter] of Object.entries(spectersByPlayer)) {
			if (otherId !== socketId) {
				others[otherId] = specter;
			}
		}
		io.to(socketId).emit("spectersUpdate", others);
	}
}




function getGame(room) {
	return rooms[room]?.game;
  }

  function getPlayerGame(room, socketId) {
	return rooms[room]?.game?.[socketId] || null;
  }

function setRoomSettings(room, settings) {
  if (rooms[room]) {
    rooms[room].settings = settings;
  }
}

function getRoomSettings(room) {
  return rooms[room]?.settings || {};
}

module.exports = {
  addPlayerToRoom,
  removePlayer,
  getPlayersInRoom,
  setRoomSettings,
  getRoomSettings,
  startGame,
  getGame,
  getPlayerGame
};
