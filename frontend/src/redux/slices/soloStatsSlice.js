import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	score: 0,
	lastScore: parseInt(localStorage.getItem('lastScore')) || 0,
	highScore: parseInt(localStorage.getItem('highScore')) || 0,
	gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
}

const soloStatsSlice = createSlice({
	name: 'solo',
	initialState,
	reducers: {
		addSoloPoints(state, action) {
			state.score += action.payload
		},
		registerSoloGameEnd(state) {
			state.lastScore = state.score;
			if (state.score > state.highScore) {
				state.highScore = state.score;
				localStorage.setItem('highScore', state.highScore);
			}
			localStorage.setItem('lastScore', state.lastScore);
			state.gamesPlayed += 1;
			localStorage.setItem('gamesPlayed', state.gamesPlayed);
			state.score = 0;
		},
		resetSolo(state) {
			state.score = 0;
			state.lastScore = parseInt(localStorage.getItem('lastScore')) || 0;
			state.highScore = parseInt(localStorage.getItem('highScore')) || 0;
			state.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;

		},
		resetSoloStats(state) {
			state.score = 0;
			state.lastScore = 0;
			state.highScore = 0;
			state.gamesPlayed = 0;
			localStorage.clear();
		},
	},
})

export const { addSoloPoints, registerSoloGameEnd, resetSolo, resetSoloStats } = soloStatsSlice.actions;

export default soloStatsSlice.reducer;