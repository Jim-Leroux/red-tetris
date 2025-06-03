import gameReducer, {
  setGrid,
  setActivePiece,
  pushPieceToQueue,
  setIsStarted,
  setSetting,
  setGameOver,
  moveLeft,
  moveRight,
  rotate,
  resetGame
} from "../redux/slices/gameSlice";

jest.mock("../logic/tetriminos", () => ({
  __esModule: true,
  default: () => ({ name: "T", shape: [[1]], position: { x: 0, y: 0 } })
}));

jest.mock("../logic/collision", () => ({
  hasCollision: () => false
}));

jest.mock("../logic/fixation", () => () => []);
jest.mock("../logic/lineUtils", () => () => ({ grid: [], linesCleared: 0 }));

describe("gameSlice reducer", () => {
  let initialState;

  beforeEach(() => {
    initialState = gameReducer(undefined, { type: "@@INIT" });
  });

  it("met à jour la grille avec setGrid", () => {
    const newGrid = Array(20).fill().map(() => Array(10).fill(1));
    const state = gameReducer(initialState, setGrid(newGrid));
    expect(state.grid).toEqual(newGrid);
  });

  it("met à jour la pièce active avec setActivePiece", () => {
    const piece = { name: "L", shape: [[1]], position: { x: 3, y: 0 } };
    const state = gameReducer(initialState, setActivePiece(piece));
    expect(state.activePiece).toEqual(piece);
  });

  it("ajoute une pièce à la queue", () => {
    const piece = { name: "O", shape: [[1]], position: { x: 0, y: 0 } };
    const state = gameReducer(initialState, pushPieceToQueue(piece));
    expect(state.pieceQueue).toContainEqual(piece);
  });

  it("change le statut de démarrage", () => {
    const state = gameReducer(initialState, setIsStarted(true));
    expect(state.isStarted).toBe(true);
  });

  it("modifie un paramètre dans settings", () => {
    const state = gameReducer(initialState, setSetting({ name: "chaosMode", value: true }));
    expect(state.settings.chaosMode).toBe(true);
  });

  it("effectue un déplacement vers la droite", () => {
    const state = gameReducer(initialState, moveRight());
    expect(state.activePiece.position.x).toBe(1);
  });

  it("effectue un déplacement vers la gauche", () => {
    const middle = gameReducer(initialState, moveRight());
    const state = gameReducer(middle, moveLeft());
    expect(state.activePiece.position.x).toBe(0);
  });

  it("fait une rotation", () => {
    const state = gameReducer(initialState, rotate());
    expect(state.activePiece.shape).toEqual([[1]]);
  });

  it("met le jeu en game over", () => {
    const state = gameReducer(initialState, setGameOver(true));
    expect(state.isGameOver).toBe(true);
  });

  it("reset le jeu", () => {
    const state = gameReducer(initialState, resetGame());
    expect(state.grid.length).toBe(20);
    expect(state.grid[0].length).toBe(10);
    expect(state.isStarted).toBe(false);
    expect(state.isGameOver).toBe(false);
  });
});
