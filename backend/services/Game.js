const { createGame } = require('../game/engine');
const { createGrid } = require('../game/grid');
const { getRandomPiece } = require('/shared/tetriminos');

const rooms = {};

function addPlayerToRoom(socketId, username, room) {
  let isHost = false;
  if (!rooms[room]) {
    isHost = true;
    rooms[room] = {
      players: {},
      sequence: [],
      settings: {},
	  pieceQueue: [],
      game: null,
    };
  }

  rooms[room].players[socketId] = {
    username,
    socketId,
    grid: createGrid(),
    currentPiece: null,
    pieceX: 3,
    pieceY: 0,
	isAlive: true,
	pieceIndex: 0,
  };

  return isHost;
}

function removePlayer(socketId) {
  for (const room in rooms) {
    if (rooms[room].players[socketId]) {
      const playerCount = Object.keys(rooms[room].players).length;
      delete rooms[room].players[socketId];

      if (playerCount === 1) {
        rooms[room].game?.stop();
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

function startGame(io, room) {
  const roomObj = rooms[room];
  if (!roomObj) return;

  // Générer une séquence partagée de pièces
  roomObj.sequence = Array.from({ length: 100 }, () => getRandomPiece());
  const firstPiece = roomObj.sequence[0];
	Object.values(roomObj.players).forEach(player => {
	  player.currentPiece = firstPiece;
	  player.pieceX = 3;
	  player.pieceY = 0;
	  player.pieceIndex = 0; // ← on commence tous à 0
	});
	io.to(room).emit('piece', firstPiece);

  // Créer et démarrer le moteur de jeu
  const game = createGame(io, room, roomObj.players, roomObj.sequence);
  roomObj.game = game;
  game.start();
}

function getGame(room) {
  return rooms[room]?.game;
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
  startGame,
  getGame,
  setRoomSettings,
  getRoomSettings
};
