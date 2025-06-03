// testGame.js
const assert = require('assert');
const Game = require('./path/to/Game.js'); // adapte le chemin

// Mock minimaliste de io avec spy sur emit
const emittedEvents = [];
const io = {
  to: (room) => ({
    emit: (event, data) => {
      emittedEvents.push({ room, event, data });
    }
  })
};

function resetEmittedEvents() {
  emittedEvents.length = 0;
}

function testAddPlayerToRoom() {
  const isHost1 = Game.addPlayerToRoom('socket1', 'Alice', 'room1');
  assert.strictEqual(isHost1, true, 'Premier joueur dans une room doit être host');

  const isHost2 = Game.addPlayerToRoom('socket2', 'Bob', 'room1');
  assert.strictEqual(isHost2, false, 'Deuxième joueur ne doit pas être host');

  const players = Game.getPlayersInRoom('room1');
  assert.strictEqual(players.length, 2, 'Il doit y avoir 2 joueurs dans room1');
  assert(players.some(p => p.username === 'Alice'), 'Alice doit être dans la room');
  assert(players.some(p => p.username === 'Bob'), 'Bob doit être dans la room');

  console.log('testAddPlayerToRoom passed');
}

function testRemovePlayer() {
  Game.addPlayerToRoom('socket3', 'Charlie', 'room2');
  Game.addPlayerToRoom('socket4', 'David', 'room2');

  const room = Game.removePlayer('socket3');
  assert.strictEqual(room, 'room2', 'removePlayer doit retourner le nom de la room');

  let players = Game.getPlayersInRoom('room2');
  assert.strictEqual(players.length, 1, 'Un seul joueur doit rester');

  // Supprime dernier joueur => la room doit être supprimée
  Game.removePlayer('socket4');
  players = Game.getPlayersInRoom('room2');
  assert.strictEqual(players.length, 0, 'La room doit être supprimée');

  console.log('testRemovePlayer passed');
}

function testStartGame() {
  // On crée une room avec joueurs
  Game.addPlayerToRoom('socket10', 'Eve', 'room3');
  Game.addPlayerToRoom('socket11', 'Frank', 'room3');

  resetEmittedEvents();

  Game.startGame(io, 'room3');

  // Vérifie qu'on a émis la première pièce et la queue
  const pieceEvent = emittedEvents.find(e => e.event === 'piece' && e.room === 'room3');
  assert(pieceEvent, 'L’événement "piece" doit être émis');

  const queueEvent = emittedEvents.find(e => e.event === 'queue' && e.room === 'room3');
  assert(queueEvent, 'L’événement "queue" doit être émis');

  const players = Game.getPlayersInRoom('room3');
  for (const player of players) {
    assert(player.currentPiece, 'Chaque joueur doit avoir une currentPiece définie');
    assert.strictEqual(player.pieceX, 3);
    assert.strictEqual(player.pieceY, 0);
    assert.strictEqual(player.pieceIndex, 0);
  }

  console.log('testStartGame passed');
}

function testSetAndGetRoomSettings() {
  Game.addPlayerToRoom('socket20', 'Gina', 'room4');
  Game.setRoomSettings('room4', { speed: 5, mode: 'classic' });
  const settings = Game.getRoomSettings('room4');
  assert.deepStrictEqual(settings, { speed: 5, mode: 'classic' }, 'Les settings doivent être correctement sauvegardés');

  console.log('testSetAndGetRoomSettings passed');
}

function testRemoveRoom() {
  Game.addPlayerToRoom('socket30', 'Harry', 'room5');
  Game.startGame(io, 'room5');

  Game.removeRoom('room5');

  const players = Game.getPlayersInRoom('room5');
  assert.strictEqual(players.length, 0, 'La room doit être supprimée');

  console.log('testRemoveRoom passed');
}

// Lancer tous les tests
function runTests() {
  testAddPlayerToRoom();
  testRemovePlayer();
  testStartGame();
  testSetAndGetRoomSettings();
  testRemoveRoom();
  console.log('All tests passed!');
}

runTests();
