const initSocketHandlers = require("../sockets/index");
const { rooms } = require("../services/room");
const { addPlayerToRoom, startGame } = require("../services/Game");
const { getPlayersInRoom, getGame, setAlive, removePlayer, removeRoom, getRoom } = require("../services/room");

jest.mock("../services/Game");
jest.mock("../services/room");

describe("WebSocket socket handlers", () => {
  let io, socket, roomEmit;

  beforeEach(() => {
    roomEmit = jest.fn();
    io = {
      to: jest.fn(() => ({
        emit: roomEmit
      }))
    };

    socket = {
      id: "socket123",
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      on: jest.fn((event, handler) => {
        socket._events[event] = handler;
      }),
      _events: {}
    };

    rooms["roomX"] = {
      players: {},
      isStart: false,
    };

    getPlayersInRoom.mockReturnValue([{ username: "Alice", isAlive: true }]);
    getRoom.mockReturnValue("roomX");
    getGame.mockReturnValue({
      move: jest.fn(),
      rotate: jest.fn(),
      softDrop: jest.fn(),
      hardDrop: jest.fn(),
      stop: jest.fn()
    });
    setAlive.mockReturnValue(true);
    removePlayer.mockReturnValue(true);
    removeRoom.mockImplementation(room => delete rooms[room]);

    initSocketHandlers(io, socket);
  });

  test("joinRoom works correctly", () => {
    addPlayerToRoom.mockReturnValue(true);

    const callback = jest.fn();
    socket._events["joinRoom"]({ username: "Alice", mode: "solo", room: "roomX" }, callback);

    expect(socket.join).toHaveBeenCalledWith("roomX");
    expect(addPlayerToRoom).toHaveBeenCalledWith("socket123", "Alice", "roomX");
    expect(io.to).toHaveBeenCalledWith("roomX");
    expect(roomEmit).toHaveBeenCalledWith("updatePlayers", [{ username: "Alice", isAlive: true }]);
    expect(callback).toHaveBeenCalledWith({
      success: true,
      isHost: true,
      room: "roomX",
      players: [{ username: "Alice", isAlive: true }]
    });
  });

  test("startGame emits gameStarted", () => {
    socket._events["startGame"]({ room: "roomX" });
    expect(startGame).toHaveBeenCalledWith(io, "roomX");
    expect(roomEmit).toHaveBeenCalledWith("gameStarted");
  });

  test("moveLeft calls game.move", () => {
    socket._events["moveLeft"]({ room: "roomX" });
    expect(getGame("roomX").move).toHaveBeenCalledWith("left", "socket123");
  });

  test("rotate calls game.rotate", () => {
    socket._events["rotate"]({ room: "roomX" });
    expect(getGame("roomX").rotate).toHaveBeenCalledWith("socket123");
  });

  test("softDrop calls game.softDrop", () => {
    socket._events["softDrop"]({ room: "roomX" });
    expect(getGame("roomX").softDrop).toHaveBeenCalledWith("socket123");
  });

  test("hardDrop calls game.hardDrop", () => {
    socket._events["hardDrop"]({ room: "roomX" });
    expect(getGame("roomX").hardDrop).toHaveBeenCalledWith("socket123");
  });

  test("leave removes player and emits update", () => {
    rooms["roomX"].players[socket.id] = { isAlive: true };

    socket._events["leave"]();

    expect(removePlayer).toHaveBeenCalledWith("socket123");
    expect(socket.leave).toHaveBeenCalledWith("roomX");
    expect(roomEmit).toHaveBeenCalledWith("updatePlayers", [{ username: "Alice", isAlive: true }]);
  });

  test("disconnect with 1 player ends game", () => {
    getPlayersInRoom.mockReturnValueOnce([{ username: "Alice", isAlive: true }]);

    socket._events["disconnect"]();

    expect(setAlive).toHaveBeenCalledWith("socket123", false);
    expect(getGame("roomX").stop).toHaveBeenCalled();
    expect(roomEmit).toHaveBeenCalledWith("gameEnded", { winner: "Alice" });
  });

  test("disconnect with 0 players removes room", () => {
    getPlayersInRoom.mockReturnValueOnce([]);
    socket._events["disconnect"]();
    expect(removeRoom).toHaveBeenCalledWith("roomX");
  });

  test("disconnect with multiple players emits update", () => {
    getPlayersInRoom.mockReturnValueOnce([
      { username: "A", isAlive: true },
      { username: "B", isAlive: true }
    ]);
    socket._events["disconnect"]();
    expect(roomEmit).toHaveBeenCalledWith("updatePlayers", [
      { username: "A", isAlive: true },
      { username: "B", isAlive: true }
    ]);
  });
});