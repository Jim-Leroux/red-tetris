import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoints as addSoloPoints } from '../redux/slices/soloStatsSlice';
import { addPoints as addMultiPoints } from '../redux/slices/multiplayerStatsSlice';
import getScoreForLines from '../logic/scoreUtils';

export default function useScoreUpdater() {
	const dispatch = useDispatch();
	const linesCleared = useSelector(state => state.game.linesClearedThisTurn);
	const isSolo = useSelector(state => state.session.isSolo);

	useEffect(() => {
		if (linesCleared > 0) {
			const points = getScoreForLines(linesCleared);
			if (isSolo) {
				dispatch(addSoloPoints(points));
			} else {
				dispatch(addMultiPoints(points));
			}
		}
	}, [linesCleared, isSolo, dispatch]);
}
