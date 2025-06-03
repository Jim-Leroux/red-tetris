const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const socketHandlers = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log(`✅ ${socket.id} connected`);
  socketHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

