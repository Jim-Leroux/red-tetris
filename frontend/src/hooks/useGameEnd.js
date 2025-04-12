import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerSoloGameEnd } from '../redux/slices/soloStatsSlice';
import { registerMultiplayerGameEnd } from '../redux/slices/multiplayerStatsSlice';

export default function useGameEnd() {
	const dispatch = useDispatch();
	const isGameOver = useSelector((state) => state.game.isGameOver);
	const isSolo = useSelector((state) => state.session.isSolo);


	useEffect(() => {
		if (isGameOver) {
			if (isSolo) {
				dispatch(registerSoloGameEnd());
			} else {
				dispatch(registerMultiplayerGameEnd());
			}
		}
	}, [isGameOver, isSolo, dispatch]);
}