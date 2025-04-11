import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerGameEnd as endSolo } from '../redux/slices/soloStatsSlice';
import { registerGameEnd as endMulti } from '../redux/slices/multiplayerStatsSlice';

export default function useGameEnd() {
	const dispatch = useDispatch();
	const isGameOver = useSelector((state) => state.game.isGameOver);
	const isSolo = useSelector((state) => state.session.isSolo);


	useEffect(() => {
		if (isGameOver) {
			if (isSolo) {
				dispatch(endSolo());
			} else {
				dispatch(endMulti());
			}
		}
	}, [isGameOver, isSolo, dispatch]);
}