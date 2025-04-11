import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	score: 0,
	lastScore: parseInt(localStorage.getItem('lastScore')) || 0,
	highScore: parseInt(localStorage.getItem('highScore')) || 0,
	gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
	totalTimePlayed: parseInt(localStorage.getItem('totalTimePlayed')) || 0,
	startTime: null,
}

const soloStatsSlice = createSlice({
	name: 'solo',
	initialState,
	reducers: {
		startTimer(state) {
			state.startTime = Date.now();
		},
		stopTimer(state) {
			if (state.startTime) {
			  const duration = Date.now() - state.startTime;
			  state.totalTimePlayed += duration;
			  localStorage.setItem('totalTimePlayed', state.totalTimePlayed);
			  state.startTime = null;
			}
		},
		addPoints(state, action) {
			state.score += action.payload
		},
		registerGameEnd(state) {
			state.lastScore = state.score;
			if (state.score > state.highScore) {
				state.highScore = state.score;
				localStorage.setItem('highScore', state.highScore);
			}
			localStorage.setItem('lastScore', state.lastScore);
			state.gamesPlayed += 1;
			localStorage.setItem('gamesPlayed', state.gamesPlayed);
			const duration = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
			state.totalTimePlayed += duration;
			localStorage.setItem('totalTimePlayed', state.totalTimePlayed);
			state.score = 0;
			state.startTime = null;
		},
		resetSolo(state) {
			state.score = 0;
			state.lastScore = parseInt(localStorage.getItem('lastScore')) || 0;
			state.highScore = parseInt(localStorage.getItem('highScore')) || 0;
			state.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
			state.totalTimePlayed = parseInt(localStorage.getItem('totalTimePlayed')) || 0;
			state.startTime = null;
		},
		resetStats(state) {
			state.score = 0;
			state.lastScore = 0;
			state.highScore = 0;
			state.gamesPlayed = 0;
			state.totalTimePlayed = 0;
			localStorage.clear();
		},
	},
})

export const { startTimer, stopTimer, addPoints, registerGameEnd, resetSolo, resetStats } = soloStatsSlice.actions;

export default soloStatsSlice.reducer;