import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGarbageLines, pushPieceToQueue, setActivePiece, setIsStarted, setSetting } from "../redux/slices/gameSlice";
import { addPiece, addPlayers, setPlayers, setSpectre } from "../redux/slices/sessionSlice";
import { useSocket } from "../context/WebSocketContext";
import { getNamePiece, TETRIMINOS } from "../logic/tetriminos";

export default function useSocketListeners() {
	const socket = useSocket();
	const dispatch = useDispatch();
	const room = useSelector(state => state.session.room);

	useEffect(() => {
		if (!room) return;

		socket?.on('updatePlayers', (players) => {
			dispatch(setPlayers(players));
		});

		socket?.on('updatePlayer', (player) => {
			console.log("Player updated", player);
			dispatch(addPlayers(player));
		});

		socket?.on('gameStarted', () => {
			dispatch(setIsStarted(true));
		});

		socket?.on('settingsUpdated',  (settings => {
			if (!settings || typeof settings !== 'object') return;
			// console.log("Settings updated", settings);
			Object.entries(settings).forEach(([key, value]) => {
				dispatch(setSetting({ name: key, value }));
			});
			}
		))

		socket.on('spectersUpdate', (specters) => {
			// console.log("Specters updated", specters);
			Object.entries(specters).forEach(([player, spectre]) => {
				if (player == socket.id) return;
				// console.log("Specter for player", player, spectre);
				dispatch(setSpectre({ player, spectre }));
			});
		});

		socket.on("nextPiece", (piece) => {
			console.log("Next piece received", piece);
			dispatch(pushPieceToQueue(getNamePiece(piece.type)));
		});

		socket.on('piece', (piece) => {
			console.log("Piece received", piece);
			dispatch(setActivePiece(getNamePiece(piece.type)));
		});

		// socket.on("receive-penalty", ({ count }) => {
		// 	dispatch(addGarbageLines(count));
		// });

		// socket.on("specter-update", ({ player, spectre }) => {
		// 	dispatch(setSpectre({ player, spectre }));
		// });

		// Tu peux ajouter d’autres socket.on ici...

		return () => {
			socket.off("updatePlayers");
			socket.off("updatePlayer");
			socket.off("gameStarted");
			socket.off("settingsUpdated");
			// socket.off("receive-penalty");
			// socket.off("specter-update");
			// Pense à nettoyer les autres aussi
		};
	}, [dispatch, room]);
}
