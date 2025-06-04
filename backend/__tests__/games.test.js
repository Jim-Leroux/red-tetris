const { addPlayerToRoom, startGame } = require("../services/Game"); // adapte le chemin
const { rooms } = require("../services/room");
const Player = require("../services/player");
const Game = require("../game/games");
const Piece = require("../game/piece");

jest.mock("../game/games"); // on mocke Game pour ne pas démarrer un vrai tick

describe("games logic", () => {
  beforeEach(() => {
    // Reset l'état global rooms avant chaque test
    for (const key in rooms) delete rooms[key];
    Game.mockClear();
  });

  test("addPlayerToRoom creates a new room and sets host", () => {
    const isHost = addPlayerToRoom("sock1", "Alice", "room1");
    expect(isHost).toBe(true);
    expect(rooms["room1"]).toBeDefined();
    expect(rooms["room1"].players["sock1"]).toBeInstanceOf(Player);
  });

  test("addPlayerToRoom adds to existing room and isHost=false", () => {
    addPlayerToRoom("s1", "Zoe", "r1");
    const isHost = addPlayerToRoom("s2", "Paul", "r1");
    expect(isHost).toBe(false);
    expect(Object.keys(rooms["r1"].players)).toHaveLength(2);
  });

  test("startGame initializes game and emits data", () => {
    // Mock io
    const io = {
      to: jest.fn(() => ({
        emit: jest.fn()
      }))
    };

    addPlayerToRoom("s1", "Bob", "roomX");

    // On espionne la méthode assignFirstPiece
    const spy = jest.spyOn(Player.prototype, "assignFirstPiece");

    startGame(io, "roomX");

    // Assertions
    const roomObj = rooms["roomX"];
    expect(roomObj.sequence).toHaveLength(100);
    expect(roomObj.game).toBeInstanceOf(Game);
    expect(spy).toHaveBeenCalledWith(roomObj.sequence[0]);
    expect(io.to).toHaveBeenCalledWith("roomX");
  });

  test("startGame does nothing if room does not exist", () => {
    const io = { to: jest.fn() };
    startGame(io, "unknownRoom");
    expect(io.to).not.toHaveBeenCalled();
  });
});
