import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerSoloGameEnd } from '../redux/slices/soloStatsSlice';

export default function useGameEnd() {
	const dispatch = useDispatch();
	const isGameOver = useSelector((state) => state.game.isGameOver);
	const isSolo = useSelector((state) => state.session.isSolo);


	useEffect(() => {
		if (isGameOver) {
			if (isSolo) {
				dispatch(registerSoloGameEnd());
			}
		}
	}, [isGameOver, isSolo, dispatch]);
}