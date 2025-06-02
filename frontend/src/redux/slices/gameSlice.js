import { createSlice } from "@reduxjs/toolkit";
import getRandomPiece from "../../logic/tetriminos";
import { hasCollision } from "../../logic/collision";
import fixPieceToGrid from "../../logic/fixation";
import clearCompletedLines from "../../logic/lineUtils";

const initialState = {
	grid: Array(20).fill(Array(10).fill(0)),
	activePiece: getRandomPiece(),
	pieceQueue: [],
	isStarted: false,
	settings: {
		progressiveSpeed: false,
		fastGravity: false,
		invisiblePieces: false,
		reverseControls: false,
		chaosMode: false
	},
	totalLinesCleared: 0,
	linesClearedThisTurn: 0,
	invisibleTick: 0,
	isGameOver: false,
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setGrid(state, action) {
			state.grid = action.payload;
		},
		setActivePiece(state, action) {
			state.activePiece = action.payload;
		},
		pushPieceToQueue(state, action) {
			state.pieceQueue.push(action.payload);
		},
		setIsStarted(state, action) {
			state.isStarted = action.payload;
		},
		setSetting(state, action) {
			const { name, value } = action.payload;
			state.settings[name] = value;
		},
		setGameOver(state, action) {
			state.isGameOver = action.payload;
		},
		moveDown(state) {
			const { shape, position } = state.activePiece;
			const newPosition = { x: position.x, y: position.y + 1 };

			if (!hasCollision(state.grid, shape, newPosition)) {
				state.activePiece.position.y += 1;
				state.invisibleTick += 1;

				if (state.settings.chaosMode && Math.random() < 0.1) {
					const random =  getRandomPiece();
					state.activePiece.name = random.name;
					state.activePiece.shape = random.shape;
					state.activePiece.option = random.option;
				}
			} else {
				state.grid = fixPieceToGrid(state.grid, shape, position, state.activePiece);
				const result = clearCompletedLines(state.grid);
				state.grid = result.grid;
				state.totalLinesCleared += result.linesCleared;
				state.linesClearedThisTurn = result.linesCleared;
				const newPiece = state.pieceQueue.length > 0 ? state.pieceQueue.shift() : getRandomPiece();
				state.invisibleTick = 0;
				if (hasCollision(state.grid, newPiece.shape, newPiece.position)) {
					state.isGameOver = true;
				} else {
					state.activePiece = newPiece;
				}
			}
		},
		moveLeft(state) {
			const { shape, position } = state.activePiece;
			const newPosition = { x: position.x - 1, y: position.y };
			if (!hasCollision(state.grid, shape, newPosition)) {
				state.activePiece.position.x -= 1;
			}
		},
		moveRight(state) {
			const { shape, position } = state.activePiece;
			const newPosition = { x: position.x + 1, y: position.y };
			if (!hasCollision(state.grid, shape, newPosition)) {
				state.activePiece.position.x += 1;
			}
		},
		softDrop(state) {
			const { shape, position } = state.activePiece;
			const newPosition = { x: position.x, y: position.y + 1 };
			if (!hasCollision(state.grid, shape, newPosition)) {
				state.activePiece.position.y += 1;
			}
		},
		rotate(state) {
			const { shape, position } = state.activePiece;
			const rotatedShape = shape[0].map((_, i) =>
				shape.map(row => row[i]).reverse()
			);
			const newPosition = { ...position };
			if (!hasCollision(state.grid, rotatedShape, newPosition)) {
				state.activePiece.shape = rotatedShape;
			}
		},
		hardDrop(state) {
			const { shape, position } = state.activePiece;
			let newY = position.y;

			while (!hasCollision(state.grid, shape, { x: position.x, y: newY + 1 }))
				newY++;
			state.activePiece.position.y = newY;
			state.grid = fixPieceToGrid(state.grid, shape, { x: position.x, y: newY }, state.activePiece);
			const result = clearCompletedLines(state.grid);
			state.grid = result.grid;
			state.totalLinesCleared += result.linesCleared;
			state.linesClearedThisTurn = result.linesCleared;
			const newPiece = state.pieceQueue.length > 0 ? state.pieceQueue.shift() : getRandomPiece();
			state.invisibleTick = 0;
			if (hasCollision(state.grid, newPiece.shape, newPiece.position)) {
				state.isGameOver = true;
			} else {
				state.activePiece = newPiece;
			}
		},
		resetGame(state) {
			state.grid = Array(20).fill().map(() => Array(10).fill(0));
			state.activePiece = getRandomPiece();
			state.totalLinesCleared = 0;
			state.linesClearedThisTurn = 0;
			state.invisibleTick = 0;
			state.isGameOver = false;
			state.isStarted = false;
		},
		addGarbageLines(state, action) {
			const numberOfLines = action.payload;
			console.log(`Adding ${numberOfLines} garbage lines`);
			const newGrid = state.grid.slice(numberOfLines); // supprime du haut

			for (let i = 0; i < numberOfLines; i++) {
				const row = Array(10).fill(1); // ligne pleine
				const hole = Math.floor(Math.random() * 10);
				row[hole] = 0;
				newGrid.push(row);
			}

			state.grid = newGrid;
		}


	},
});

export const { setGrid, setActivePiece, setIsStarted, setSetting, setGameOver, moveDown, moveLeft, moveRight, softDrop, rotate, hardDrop, resetGame, addGarbageLines, pushPieceToQueue } = gameSlice.actions;
export default gameSlice.reducer;