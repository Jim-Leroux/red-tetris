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
					dispatch(reverse ? moveRight() : moveLeft());
					if (!isSolo) socket?.emit('moveLeft', { room });
					break;
				case 'ArrowRight':
					e.preventDefault();
					dispatch(reverse ? moveLeft() : moveRight());
					if (!isSolo) socket?.emit('moveRight', { room });
					break;
				case 'ArrowDown':
					e.preventDefault();
					dispatch(softDrop());
					if (!isSolo) socket?.emit('softDrop', { room });
					break;
				case 'ArrowUp':
					e.preventDefault();
					dispatch(rotate());
					if (!isSolo) socket?.emit('rotate', { room });
					break;
				case ' ':
					e.preventDefault();
					dispatch(hardDrop());
					if (!isSolo) socket?.emit('hardDrop', { room });
					break;
				default:
					break;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [dispatch, reverse, isSolo, room, socket]);
}