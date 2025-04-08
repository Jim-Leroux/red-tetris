module.exports = function(io, socket) {
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      console.log(`${username} joined room ${room}`);
      socket.to(room).emit('playerJoined', { username });
    });
  
    socket.on('startGame', ({ room }) => {
      console.log(`Game started in room ${room}`);
      io.to(room).emit('gameStarted');
    });
  
    socket.on('disconnect', () => {
      console.log(`❌ ${socket.id} disconnected`);
    });
  };
  