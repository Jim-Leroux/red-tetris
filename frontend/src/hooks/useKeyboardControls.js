import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hardDrop, moveLeft, moveRight, rotate, softDrop } from '../redux/slices/gameSlice';

export default function useKeyboardControls() {
	const dispatch = useDispatch();
	const reverse = useSelector((state) => state.game.settings.reverseControls);

	useEffect(() => {
		const handleKeyDown = (e) => {
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					dispatch(reverse ? moveRight() : moveLeft());
					break;
				case 'ArrowRight':
					e.preventDefault();
					dispatch(reverse ? moveLeft() : moveRight());
					break;
				case 'ArrowDown':
					e.preventDefault();
					dispatch(softDrop());
					break;
				case 'ArrowUp':
					e.preventDefault();
					dispatch(rotate());
					break;
				case ' ':
					e.preventDefault();
					dispatch(hardDrop());
					break;
				default:
					 break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [dispatch, reverse])
}