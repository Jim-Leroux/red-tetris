const {
	addPlayerToRoom,
	removePlayer,
	getPlayersInRoom,
	setRoomSettings,
	getRoomSettings,
	startGame,
	getGame
  } = require('../services/Game');
  const crypto = require('crypto');

  module.exports = (io, socket) => {
	// ─── JOIN ROOM ────────────────────────────────────────────────────────────────
	socket.on('joinRoom', ({ username, mode, room }, callback) => {
	  if (!username || !mode) {
		return callback({ success: false });
	  }
	  if (!room) {
		room = crypto.randomUUID().split('-')[0];
	  }
	  socket.join(room);

	  const isHost = addPlayerToRoom(socket.id, username, room);
	  console.log(`${username} joined room ${room}`);

	  const playersInRoom = getPlayersInRoom(room);
	  // On envoie la liste complète des joueurs
	  io.to(room).emit('updatePlayers', playersInRoom);

	  callback({
		success: true,
		isHost,
		room,
		players: playersInRoom
	  });
	});

	// ─── UPDATE SETTINGS ─────────────────────────────────────────────────────────
	socket.on('updateSettings', ({ room, settings }) => {
	  setRoomSettings(room, settings);
	//   console.log(`🎛 Settings updated for room ${room}:`, settings);
	  io.to(room).emit('settingsUpdated', getRoomSettings(room));
	});

	// ─── START GAME ───────────────────────────────────────────────────────────────
	socket.on('startGame', ({ room }) => {
	  startGame(io, room);
	  io.to(room).emit('gameStarted');
	});

	// ─── PLAYER ACTIONS ───────────────────────────────────────────────────────────
	socket.on('moveLeft', ({ room }) => {
	  const game = getGame(room);
	  game?.move('left', socket.id);
	});

	socket.on('moveRight', ({ room }) => {
	  const game = getGame(room);
	  game?.move('right', socket.id);
	});

	socket.on('rotate', ({ room }) => {
	  const game = getGame(room);
	  game?.rotate(socket.id);
	});

	socket.on('softDrop', ({ room }) => {
	  const game = getGame(room);
	  game?.softDrop(socket.id);
	});

	socket.on('hardDrop', ({ room }) => {
	  const game = getGame(room);
	  game?.hardDrop(socket.id);
	});

	// ─── DISCONNECT ────────────────────────────────────────────────────────────────
	socket.on('disconnect', () => {
    const room = removePlayer(socket.id);
    if (room) {
        const players = getPlayersInRoom(room);

        if (players.length === 1) {
        const winner = players[0];

        // Arrêter la partie si elle existe
        const game = getGame(room);
        if (game) {
            game.stop();
        }

        // Annoncer la fin de la partie avec le gagnant
        io.to(winner.socketId).emit('gameEnded');

        // (Optionnel) nettoyer la room si tu veux
        // delete rooms[room];
        } else {
        // Sinon, juste mettre à jour la liste des joueurs restants
        io.to(room).emit('updatePlayers', players);
        }
    }
    });

  };
