import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSoloPoints } from '../redux/slices/soloStatsSlice';
import getScoreForLines from '../logic/scoreUtils';

export default function useScoreUpdater() {
	const dispatch = useDispatch();
	const linesCleared = useSelector(state => state.game.linesClearedThisTurn);
	const isSolo = useSelector(state => state.session.isSolo);

	useEffect(() => {
		if (linesCleared > 0) {
			const points = getScoreForLines(linesCleared);
			if (isSolo) 
				dispatch(addSoloPoints(points));

		}
	}, [linesCleared, isSolo, dispatch]);
}
