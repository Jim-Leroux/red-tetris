import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushPieceToQueue, setActivePiece, setGameOver, setIsStarted, setSetting } from "../redux/slices/gameSlice";
import { addPlayers, applyPenaltyToSpectre, setPlayers, setServerGrid, setSpectre, setWinner } from "../redux/slices/sessionSlice";
import { useSocket } from "../context/WebSocketContext";
import { getNamePiece } from "../logic/tetriminos";


export default function useSocketListeners() {
	const socket = useSocket();
	const dispatch = useDispatch();
	const room = useSelector(state => state.session.room);
	const me = useSelector(state => state.session.me);
	useEffect(() => {
		if (!room) return;

		socket?.on('updatePlayers', (players) => {
			dispatch(setPlayers(players));
		});

		socket?.on('updatePlayer', (player) => {
			// console.log("Player updated", player);
			dispatch(addPlayers(player));
		});

		socket?.on('gameStarted', () => {
			dispatch(setIsStarted(true));
		});


		socket.on('spectersUpdate', (specters) => {
			Object.entries(specters).forEach(([player, spectre]) => {
				if (player == socket.id) return;
				dispatch(setSpectre({ player, spectre }));
			});
		});

		socket.on('piece', (piece) => {
			// console.log("Piece received", piece);
			dispatch(setActivePiece(getNamePiece(piece.name)));
		});

		socket.on('queue', (pieces) => {
			// console.log("Queue received", pieces);
			pieces.forEach(piece => {
				dispatch(pushPieceToQueue(getNamePiece(piece.name)));
			});
		})

		socket.on('addQueue', (piece) => {
			// console.log("Piece added to queue", piece);
			dispatch(pushPieceToQueue(getNamePiece(piece.name)));
		}	);

		 socket.on('penalty', ({ count, holes }) => {
			console.log("Penalty received", count, holes);
			const username = me
			if (!username) return;
			console.log("Penalty received", count, holes, "for", username);
			dispatch(applyPenaltyToSpectre({ username, count: count, holes }));
		});
		socket.on('serverGrid', (grid) => {
			dispatch(setServerGrid(grid));
		});

		socket.on('gameEnded', () => {
			dispatch(setGameOver(true));
			dispatch(setWinner(true));
		})
		socket.on('gameOver', ()=> {
			dispatch(setGameOver(true));
			dispatch(setWinner(false));
		})

		return () => {
			socket.off("updatePlayers");
			socket.off("updatePlayer");
			socket.off("gameStarted");
			socket.off("spectersUpdate");
			socket.off("piece");
			socket.off("queue");
			socket.off("addQueue");
			socket.off("penalty");
			socket.off("serverGrid");
			socket.off("gameEnded");
			socket.off("gameOver");
		};
	}, [dispatch, room]);
}
