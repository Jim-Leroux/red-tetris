import { useEffect } from "react";
import { useSelector } from "react-redux";
// import socket from "../utils/socket";

export default function usePenaltyEmitter() {
	const linesCleared = useSelector(state => state.game.linesClearedThisTurn);
	const isSolo = useSelector(state => state.session.isSolo);
	const room = useSelector(state => state.session.room);

	useEffect(() => {
		// Ne rien faire en solo
		if (isSolo) return;

		if (linesCleared >= 2) {
			const penalty = linesCleared - 1;
			socket.emit("send-penalty", { room, count: penalty });
		}
	}, [linesCleared, isSolo, room]);
}