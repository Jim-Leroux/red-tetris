import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hardDrop, moveLeft, moveRight, rotate, softDrop } from '../redux/slices/gameSlice';
import { useSocket } from "../context/WebSocketContext";

export default function useKeyboardControls() {
	const socket = useSocket();
	const dispatch = useDispatch();
	const room = useSelector((state) => state.session.room);
	const isSolo = useSelector((state) => state.session.isSolo);
	const reverse = useSelector((state) => state.game.settings.reverseControls);

	useEffect(() => {
		const handleKeyDown = (e) => {
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					if (!isSolo) socket?.emit('moveLeft', { room }); else dispatch(reverse ? moveRight() : moveLeft());
					break;
				case 'ArrowRight':
					e.preventDefault();
					if (!isSolo) socket?.emit('moveRight', { room }); else dispatch(reverse ? moveLeft() : moveRight());
					break;
				case 'ArrowDown':
					e.preventDefault();
					if (!isSolo) socket?.emit('softDrop', { room }); else dispatch(softDrop());
					break;
				case 'ArrowUp':
					e.preventDefault();
					if (!isSolo) socket?.emit('rotate', { room }); else dispatch(rotate());
					break;
				case ' ':
					e.preventDefault();
					if (!isSolo) socket?.emit('hardDrop', { room }); else dispatch(hardDrop());
					break;
				default:
					break;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [dispatch, reverse, isSolo, room, socket]);
}