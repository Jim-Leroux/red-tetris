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
  // j'ai rajouter ca ci desous je te laise regarde c'est juste pour cree une room name
  socket.on('createRoom', ({ username, mode }, callback) => {
    const room = crypto.randomUUID().split('-')[0];
    callback(room);
  });

  socket.on('joinRoom', ({ username, room }, callback) => {
    socket.join(room);
    addPlayerToRoom(socket.id, username, room);

    console.log(`${username} joined room ${room}`);
    
    const playersInRoom = getPlayersInRoom(room);

    callback(true, playersInRoom);
  });

  socket.on('updateSettings', ({ room, settings }, callback) => {
    setRoomSettings(room, settings);
    console.log(`🎛 Settings updated for room ${room}:`, settings);
  
    // On peut renvoyer les settings à tout le monde dans la room si besoin
    io.to(room).emit('settingsUpdated', getRoomSettings(room));
  
    callback(true);
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
