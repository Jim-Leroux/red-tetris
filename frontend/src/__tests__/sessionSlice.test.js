import sessionReducer, {
  setRoom,
  setServerGrid,
  setMe,
  setIsHost,
  setIsSolo,
  setPlayers,
  addPlayers,
  setSpectre,
  removeSpectre,
  resetSession,
  applyPenaltyToSpectre
} from "../redux/slices/sessionSlice";

describe("sessionSlice reducer", () => {
  let initialState;

  beforeEach(() => {
    initialState = sessionReducer(undefined, { type: "@@INIT" });
  });

  it("met à jour le nom de la room", () => {
    const state = sessionReducer(initialState, setRoom("Room42"));
    expect(state.room).toBe("Room42");
  });

  it("définit le joueur courant", () => {
    const state = sessionReducer(initialState, setMe("JoueurX"));
    expect(state.me).toBe("JoueurX");
  });

  it("définit si l'utilisateur est l'hôte", () => {
    const state = sessionReducer(initialState, setIsHost(true));
    expect(state.isHost).toBe(true);
  });

  it("définit si l'utilisateur est en solo", () => {
    const state = sessionReducer(initialState, setIsSolo(true));
    expect(state.isSolo).toBe(true);
  });

  it("met à jour la liste complète des joueurs", () => {
    const state = sessionReducer(initialState, setPlayers(["A", "B"]));
    expect(state.players).toEqual(["A", "B"]);
  });

  it("ajoute un joueur", () => {
    const state = sessionReducer(initialState, addPlayers("Z"));
    expect(state.players).toContain("Z");
  });

  it("met à jour un spectre", () => {
    const payload = { player: "Alice", spectre: { grid: [[0]] } };
    const state = sessionReducer(initialState, setSpectre(payload));
    expect(state.spectres["Alice"]).toEqual({ grid: [[0]] });
  });

  it("retire un spectre", () => {
    const withSpectres = {
      ...initialState,
      spectres: { Bob: { grid: [[0]] } }
    };
    const state = sessionReducer(withSpectres, removeSpectre("Bob"));
    expect(state.spectres["Bob"]).toBeUndefined();
  });

  it("reset la session", () => {
    const modified = {
      ...initialState,
      room: "X",
      me: "Y",
      isHost: true,
      players: ["A"],
      spectres: { A: { grid: [[0]] } }
    };
    const state = sessionReducer(modified, resetSession());
    expect(state.room).toBeNull();
    expect(state.me).toBeNull();
    expect(state.isHost).toBe(false);
    expect(state.players).toEqual([]);
    expect(state.spectres).toEqual({});
  });

  it("applique une pénalité au spectre", () => {
    const startGrid = Array(20).fill(Array(10).fill(0));
    const withSpectre = {
      ...initialState,
      spectres: { Player1: { grid: [...startGrid] } }
    };

    const action = {
      username: "Player1",
      count: 2,
      holes: [3, 5]
    };

    const state = sessionReducer(withSpectre, applyPenaltyToSpectre(action));
    expect(state.spectres["Player1"].grid).toHaveLength(20);
    const lastLine = state.spectres["Player1"].grid[19];
    expect(lastLine.filter(cell => cell === 0).length).toBe(1); // un trou
  });
});
