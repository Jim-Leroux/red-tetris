const {
  addPlayerToRoom,
  removePlayer,
  getPlayersInRoom,
  startGame,
  getGame
} = require('../services/gameService');

module.exports = (io, socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    addPlayerToRoom(socket.id, username, room);

    console.log(`${username} joined room ${room}`);
    io.to(room).emit('updatePlayers', getPlayersInRoom(room));
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
