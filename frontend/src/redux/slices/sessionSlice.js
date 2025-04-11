import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	room: null,
	me: null,
	isHost: false,
	isSolo: true,
	players: [],
	spectres: {} 
};

const sessionSlice =  createSlice({
	name: 'session',
	initialState,
	reducers: {
		setRoom(state, action){
			state.room = action.payload
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
			state.isSolo = true;
			state.players = [];
			state.spectres = {};
		}
	},
})

export const { setRoom, setMe, setIsHost, setIsSolo, setPlayers, setSpectre, removeSpectre, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;