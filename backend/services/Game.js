const { createGame } = require('../game/engine');

const rooms = {};

function addPlayerToRoom(socketId, username, room) {
	let isHost = false;
  if (!rooms[room]) {
	isHost = true;
    rooms[room] = {
      players: {},
      game: null,
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

      // Supprimer room si vide
      if (Object.keys(rooms[room].players).length === 0) {
        if (rooms[room].game) rooms[room].game.stop();
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
  if (!rooms[room]) return;

  rooms[room].game = createGame(io, room);
  rooms[room].game.start();
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
  setRoomSettings,
  getRoomSettings,
  startGame,
  getGame
};
