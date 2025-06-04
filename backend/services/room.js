const rooms = {};

/**
 * Récupère tous les joueurs dans une room donnée.
 * @param {string} room - ID de la room.
 * @returns {Array} - Liste des joueurs.
 */
function getPlayersInRoom(room) {
  return rooms[room] ? Object.values(rooms[room].players) : [];
}

/**
 * Récupère l'objet game associé à une room.
 * @param {string} room - ID de la room.
 * @returns {Object|undefined} - Le jeu associé à la room, ou undefined.
 */
function getGame(room) {
  return rooms[room]?.game;
}

/**
 * Trouve la room à partir d'un socketId.
 * @param {string} socketId - ID du socket.
 * @returns {string|undefined} - ID de la room, ou undefined.
 */
function getRoom(socketId) {
  return Object.keys(rooms).find(
    room => rooms[room]?.players?.[socketId]
  );
}

/**
 * Supprime une room (et arrête le jeu si existant).
 * @param {string} room - ID de la room.
 */
function removeRoom(room) {
  if (rooms[room]) {
    rooms[room].game?.stop();
    delete rooms[room];
  }
}

/**
 * Définit si un joueur est en vie ou non.
 * @param {string} socketId - ID du joueur.
 * @param {boolean} isAlive - État de vie.
 * @returns {boolean} - True si succès, False sinon.
 */
function setAlive(socketId, isAlive) {
  const room = getRoom(socketId);
  if (room && rooms[room]) {
    const player = rooms[room].players[socketId];
    if (player) {
      player.isAlive = isAlive;
      return true;
    }
  }
  return false;
}

function removePlayer(socketId) {
  const room = getRoom(socketId);
  if (!room || !rooms[room] || !rooms[room].players[socketId]) return false;

  delete rooms[room].players[socketId];
  if (Object.keys(rooms[room].players).length === 0) {
    removeRoom(room);
  }

  return true;
}


module.exports = {
  rooms,
  getPlayersInRoom,
  getGame,
  getRoom,
  removeRoom,
  setAlive,
  removePlayer
};
