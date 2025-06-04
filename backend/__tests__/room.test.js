const {
  rooms,
  getPlayersInRoom,
  getGame,
  getRoom,
  removeRoom,
  setAlive,
  removePlayer
} = require("../services/room");

describe("room service functions", () => {

  beforeEach(() => {
    // Reset rooms object before each test
    for (const key in rooms) delete rooms[key];
  });

  test("getPlayersInRoom returns players if room exists", () => {
    rooms["room1"] = {
      players: {
        a: { username: "Alice" },
        b: { username: "Bob" }
      }
    };
    const players = getPlayersInRoom("room1");
    expect(players).toHaveLength(2);
  });

  test("getGame returns game if present", () => {
    const game = { isRunning: true };
    rooms["room2"] = { game };
    expect(getGame("room2")).toBe(game);
  });

  test("getRoom returns room by socketId", () => {
    rooms["roomX"] = {
      players: {
        "sock123": { username: "Zed" }
      }
    };
    expect(getRoom("sock123")).toBe("roomX");
  });

  test("removeRoom stops game and deletes room", () => {
    const stopMock = jest.fn();
    rooms["toRemove"] = {
      game: { stop: stopMock },
      players: {}
    };
    removeRoom("toRemove");
    expect(stopMock).toHaveBeenCalled();
    expect(rooms["toRemove"]).toBeUndefined();
  });

  test("setAlive updates player state", () => {
    rooms["aliveRoom"] = {
      players: {
        "socketABC": { isAlive: true }
      }
    };
    expect(setAlive("socketABC", false)).toBe(true);
    expect(rooms["aliveRoom"].players["socketABC"].isAlive).toBe(false);
  });

  test("setAlive returns false on unknown player", () => {
    expect(setAlive("ghost", false)).toBe(false);
  });

  test("removePlayer deletes player and keeps room if others remain", () => {
    rooms["rm"] = {
      players: {
        s1: { name: "A" },
        s2: { name: "B" }
      }
    };
    expect(removePlayer("s1")).toBe(true);
    expect(rooms["rm"].players.s1).toBeUndefined();
    expect(rooms["rm"]).toBeDefined();
  });

  test("removePlayer deletes entire room if empty", () => {
    rooms["solo"] = {
      players: {
        s1: { name: "Solo" }
      }
    };
    expect(removePlayer("s1")).toBe(true);
    expect(rooms["solo"]).toBeUndefined();
  });

  test("removePlayer returns false on invalid socket", () => {
    expect(removePlayer("unknown")).toBe(false);
  });

});
