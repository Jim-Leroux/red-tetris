const Game = require('../game/games');

const Piece = require('../game/piece');
const Player = require('./player');
const { rooms} = require('./room');


function addPlayerToRoom(socketId, username, room) {
  let isHost = false;
  if (!rooms[room]) {
    isHost = true;
    rooms[room] = {
      players: {},
      sequence: [],
      settings: {},
      pieceQueue: [],
      game: null,
      isStart: false,
    };
  }

  rooms[room].players[socketId] = new Player(socketId, username);

  return isHost;
}




function startGame(io, room) {
  const roomObj = rooms[room];
  if (!roomObj) return;


  roomObj.sequence = Array.from({ length: 100 }, () => Piece.getRandomPiece());
  const firstPiece = roomObj.sequence[0];


  Object.values(roomObj.players).forEach(player => {
    player.assignFirstPiece(firstPiece);
  });

  io.to(room).emit('piece', firstPiece);
  io.to(room).emit('queue', roomObj.sequence.slice(1, 6));


  const game = new Game(io, room, roomObj.players, roomObj.sequence);
  roomObj.game = game;
  game.start();
}



module.exports = {
  addPlayerToRoom,
  startGame,
};
