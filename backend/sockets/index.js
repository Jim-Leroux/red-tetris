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
	// donc j'ai modifier pour etre bien racort avec le front peut-etre a ameliorer !
	socket.on('joinRoom', ({ username, mode, room }, callback) => {
		if (!username, !mode)
			return callback(false, null, null, null);
		if (!room) {
			room = crypto.randomUUID().split('-')[0];
		}
		socket.join(room);
		const ishost = addPlayerToRoom(socket.id, username, room);
		console.log(`${username} joined room ${room}`);
		const playersInRoom = getPlayersInRoom(room);
		io.to(room).emit('updatePlayer', {username: username, socketId: socket.id});
		callback({ success: true, isHost: ishost, room: room, players: playersInRoom});
  });
// peut-etre voir pour les setting si on les inclu dans le multi voir avec les bonnus
	socket.on('updateSettings', ({ room, settings }) => {
		setRoomSettings(room, settings);
		console.log(`🎛 Settings updated for room ${room}:`, settings);
		// On peut renvoyer les settings à tout le monde dans la room si besoin
		io.to(room).emit('settingsUpdated', getRoomSettings(room));
	});

	socket.on('startGame', ({ room }) => {
		startGame(io, room);
		io.to(room).emit('gameStarted');
	});

	socket.on('moveLeft', ({ room }) => {
		const game = getGame(room);
		game?.move('left');
	});

	socket.on('moveRight', ({ room }) => {
		const game = getGame(room);
		game?.move('right');
	});

	socket.on('rotate', ({ room }) => {
		const game = getGame(room);
		game?.rotatePiece();
	});

	socket.on('softDrop', ({ room }) => {
		const game = getGame(room);
		game?.softDrop();
	});

	socket.on('hardDrop', ({ room }) => {
		const game = getGame(room);
		game?.hardDrop();
	});

	socket.on('disconnect', () => {
		const room = removePlayer(socket.id);
		console.log(`❌ ${socket.id} disconnected from room ${room}`);

		if (room) {
			io.to(room).emit('updatePlayers', getPlayersInRoom(room));
		}
	});
};
