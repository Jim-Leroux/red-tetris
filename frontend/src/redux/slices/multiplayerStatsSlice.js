import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	score: 0,
	lastScore: 0,
	highScore: 0,
	gamesPlayed: 0,
	totalTimePlayed: 0,
	startTime: null
};

const multiplayerStatsSlice = createSlice({
	name: 'multiplayerStats',
	initialState,
	reducers: {
		addMultiplayerPoints(state, action) {
			state.score += action.payload;
		},
		startMultiplayerTimer(state) {
			state.startTime = Date.now();
		},
		stopMultiplayerTimer(state) {
			if (state.startTime) {
				const duration = Date.now() - state.startTime;
				state.totalTimePlayed += duration;
				state.startTime = null;
			}
		},
		registerMultiplayerGameEnd(state) {
			state.lastScore = state.score;
			if (state.score > state.highScore) {
				state.highScore = state.score;
			}
			state.gamesPlayed += 1;
			state.score = 0;
		},
		resetMultiplayerStats(state) {
			state.score = 0;
			state.lastScore = 0;
			state.highScore = 0;
			state.gamesPlayed = 0;
			state.totalTimePlayed = 0;
			state.startTime = null;
		}
	}
});


export const { addMultiplayerPoints, startMultiplayerTimer, stopMultiplayerTimer, registerMultiplayerGameEnd, resetMultiplayerStats } = multiplayerStatsSlice.actions;
export default multiplayerStatsSlice.reducer;