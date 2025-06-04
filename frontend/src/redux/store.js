import { configureStore } from "@reduxjs/toolkit";
import gameReducer from './slices/gameSlice';
import soloStatsReducer from './slices/soloStatsSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
	reducer: {
		game: gameReducer,
		session: sessionReducer,
		soloStats: soloStatsReducer,
	},
});

export default store;