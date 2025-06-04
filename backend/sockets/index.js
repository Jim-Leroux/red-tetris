const {
	addPlayerToRoom,
	startGame,
  } = require('../services/Game');


  const crypto = require('crypto');
const { getPlayersInRoom, setAlive, getRoom, getGame, removePlayer, removeRoom, rooms } = require('../services/room');

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


	// ─── LEAVE ROOM ───────────────────────────────────────────────────────────────
	socket.on('leave', () => {
		console.log(`📡 Socket ${socket.id} requested to leave`);
	const room = getRoom(socket.id);

	  if (room && rooms[room].isStart === false) {

		removePlayer(socket.id);
		socket.leave(room);

		const players = getPlayersInRoom(room);

		if (players.length === 0) {
		  console.log(`❌ No players left in room ${room}, removing room`);
		  io.to(room).emit('gameEnded', { winner: null });
		  // Remove the room if no players left
		  removeRoom(room);
		} else {
		  io.to(room).emit('updatePlayers', players);
		}
	  } else {
		console.log(`⚠️ No room found for socket ${socket.id}`);
	  }
	});
	// ─── DISCONNECT ────────────────────────────────────────────────────────────────
	socket.on('disconnect', () => {
	console.log(`📡 Socket ${socket.id} disconnected`);
	const room = getRoom(socket.id);

	if (!room) {
		console.log(`❌ No room found for socket ${socket.id}`);
		return;
	}
	setAlive(socket.id, false);
	let players = getPlayersInRoom(room);
	players = players.filter(p => p.isAlive);

	if (players.length === 1) {
		const winner = players[0];

		const game = getGame(room);
		if (game) {
			game.stop();
		} else {
			console.log(`⚠️ No active game found for room ${room}`);
		}

		io.to(room).emit('gameEnded', { winner: winner.username });

	} else
	if (players.length === 0) {
		console.log(`❌ No players left in room ${room}, removing room`);
		removeRoom(room);
	} else {
		io.to(room).emit('updatePlayers', players);
	}
});

}