import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";
import { addGarbageLines } from "../redux/slices/gameSlice";
import { setSpectre } from "../redux/slices/sessionSlice";

export default function useSocketListeners() {
	const dispatch = useDispatch();
	const room = useSelector(state => state.session.room);

	useEffect(() => {
		if (!room) return;

		socket.on("receive-penalty", ({ count }) => {
			dispatch(addGarbageLines(count));
		});

		socket.on("specter-update", ({ player, spectre }) => {
			dispatch(setSpectre({ player, spectre }));
		});

		// Tu peux ajouter d’autres socket.on ici...

		return () => {
			socket.off("receive-penalty");
			socket.off("specter-update");
			// Pense à nettoyer les autres aussi
		};
	}, [dispatch, room]);
}
