const {
	addPlayerToRoom,
	removePlayer,
	getPlayersInRoom,
	startGame,
	getGame,
	getRoom,
	setAlive
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
	console.log(`📡 Socket ${socket.id} disconnected`);

	const room = getRoom(socket.id);
	console.log(`🏠 Room found for socket ${socket.id}: ${room}`);

	setAlive(socket.id, false);
	console.log(`🧍‍♂️ Set alive to false for ${socket.id}`);

	if (!room) {
		console.log(`❌ No room found for socket ${socket.id}`);
		return;
	}

	let players = getPlayersInRoom(room);
	console.log(`👥 Players in room before filter:`, players);

	players = players.filter(p => p.alive);
	console.log(`✅ Alive players in room ${room}:`, players.map(p => p.username));

	if (players.length === 1) {
		const winner = players[0];
		console.log(`🏆 Winner detected: ${winner.username}`);

		const game = getGame(room);
		if (game) {
			console.log(`🛑 Stopping game for room ${room}`);
			game.stop();
		} else {
			console.log(`⚠️ No active game found for room ${room}`);
		}

		io.to(room).emit('gameEnded', { winner: winner.username });
		console.log(`📣 Emitted gameEnded to room ${room}`);
	} else {
		console.log(`🔄 More than 1 player remaining, updating players list`);
		io.to(room).emit('updatePlayers', players);
	}
});

}