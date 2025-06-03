import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	room: null,
	me: null,
	isHost: false,
	isSolo: false,
	players: [],
	spectres: {},
	serverGrid: null,
};

const sessionSlice =  createSlice({
	name: 'session',
	initialState,
	reducers: {
		setRoom(state, action){
			state.room = action.payload
		},
		setServerGrid(state, action) {
			state.serverGrid = action.payload;
		},

		setMe(state, action) {
			state.me = action.payload;
		},
		setIsHost(state, action) {
			state.isHost = action.payload;
		},
		setIsSolo(state, action) {
			state.isSolo = action.payload;
		},
		setPlayers(state, action) {
			state.players = action.payload;
		},
		addPlayers(state, action) {
			state.players.push(action.payload);
		},
		setSpectre(state, action) {
			const { player, spectre } = action.payload;
			state.spectres[player] = spectre;
		},
		removeSpectre(state, action) {
			delete state.spectres[action.payload];
		},
		resetSession(state) {
			state.room = null;
			state.me = null;
			state.isHost = false;
			state.isSolo = false;
			state.players = [];
			state.spectres = {};
		},
		applyPenaltyToSpectre(state, action) {
			const { username, count, holes } = action.payload;

			const spectre = state.spectres[username];
			if (!spectre || !spectre.grid) return;

			const newGrid = spectre.grid.slice();

			for (let i = 0; i < count; i++) {
				const row = Array(10).fill(9);
				const hole = holes[i];
				if (hole >= 0 && hole < 10) {
					row[hole] = 0;
				}
				newGrid.shift();
				newGrid.push(row);
			}

			spectre.grid = newGrid;
		}

	},
})

export const { setRoom, setServerGrid, setMe, setIsHost, setIsSolo, setPlayers, addPlayers, setSpectre, removeSpectre, resetSession, applyPenaltyToSpectre } = sessionSlice.actions;
export default sessionSlice.reducer;