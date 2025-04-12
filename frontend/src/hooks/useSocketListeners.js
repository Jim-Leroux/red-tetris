import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGarbageLines, setIsStarted } from "../redux/slices/gameSlice";
import { setPlayers, setSpectre } from "../redux/slices/sessionSlice";
import { useSocket } from "../context/WebSocketContext";

export default function useSocketListeners() {
	const socket = useSocket();
	const dispatch = useDispatch();
	const room = useSelector(state => state.session.room);

	useEffect(() => {
		if (!room) return;

		socket?.on('updatePlayers', (players) => {
			dispatch(setPlayers(players));
		});

		socket?.on('gameStarted', () => {
			dispatch(setIsStarted(true));
		});

		// socket.on("receive-penalty", ({ count }) => {
		// 	dispatch(addGarbageLines(count));
		// });

		// socket.on("specter-update", ({ player, spectre }) => {
		// 	dispatch(setSpectre({ player, spectre }));
		// });

		// Tu peux ajouter d’autres socket.on ici...

		return () => {
			// socket.off("receive-penalty");
			// socket.off("specter-update");
			// Pense à nettoyer les autres aussi
		};
	}, [dispatch, room]);
}
