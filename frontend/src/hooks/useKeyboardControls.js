import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hardDrop, moveLeft, moveRight, rotate, softDrop } from '../redux/slices/gameSlice';
import { useSocket } from "../context/WebSocketContext";

export default function useKeyboardControls() {
	const socket = useSocket();
	const dispatch = useDispatch();
	const room = useSelector((state) => state.session.room);
	const reverse = useSelector((state) => state.game.settings.reverseControls);

	useEffect(() => {
		const handleKeyDown = (e) => {
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					dispatch(reverse ? moveRight() : moveLeft());
					socket?.emit(reverse ? 'moveRight' : 'moveLeft', { room });
					break;
				case 'ArrowRight':
					e.preventDefault();
					dispatch(reverse ? moveLeft() : moveRight());
					socket?.emit(reverse ? 'moveLeft' : 'moveRight', { room });
					break;
				case 'ArrowDown':
					e.preventDefault();
					dispatch(softDrop());
					socket?.emit('softDrop', { room });
					break;
				case 'ArrowUp':
					e.preventDefault();
					dispatch(rotate());
					socket?.emit('rotate', { room });
					break;
				case ' ':
					e.preventDefault();
					dispatch(hardDrop());
					socket?.emit('hardDrop', { room });
					break;
				default:
					 break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [dispatch, reverse])
}