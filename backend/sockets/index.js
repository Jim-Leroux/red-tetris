const {
	addPlayerToRoom,
	removePlayer,
	getPlayersInRoom,
	startGame,
	getGame
} = require('../services/Game');
const crypto = require('crypto');
module.exports = (io, socket) => {
	// j'ai rajouter ca ci desous je te laise regarde c'est juste pour cree une room name
	socket.on('createRoom', ({ username, mode }, callback) => {
		const room = crypto.randomUUID().split('-')[0];
	callback(room);
	});
	// rerturn dans le joinRoom en callback si est le host de la partie true a bien rejoin est autre information
	socket.on('joinRoom', ({ username, room }, success) => {
		socket.join(room);
		addPlayerToRoom(socket.id, username, room);

		console.log(`${username} joined room ${room}`);
		io.to(room).emit('updatePlayers', getPlayersInRoom(room));
		success(true);
	});

	socket.on('joinRoom2', ({ username, mode, roomName }, callback) => {
		const room = roomName || crypto.randomUUID().split('-')[0];
		console.log(room);
		socket.join(room);
		let isHost = addPlayerToRoom(socket.id, username, room);
		console.log(`${username} joined room ${room}`);
		io.to(room).emit('updatePlayers', getPlayersInRoom(room));

		callback({isHost, room});
	})

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
