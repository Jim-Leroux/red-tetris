import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startTimer as startSoloTimer, stopTimer as stopSoloTimer } from '../redux/slices/soloStatsSlice';
import { startTimer as startMultiTimer, stopTimer as stopMultiTimer } from '../redux/slices/multiplayerStatsSlice';

export default function useTimer() {
	const dispatch = useDispatch();
	const isSolo = useSelector((state) => state.session.isSolo);

	useEffect(() => {
		if (isSolo)
			dispatch(startSoloTimer());
		else
			dispatch(startMultiTimer());

		return () => {
			if (isSolo)
				dispatch(stopSoloTimer());
			else
				dispatch(stopMultiTimer());
		};
	}, [dispatch, isSolo])
}