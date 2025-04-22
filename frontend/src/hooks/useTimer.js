import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSoloTimer,stopSoloTimer } from '../redux/slices/soloStatsSlice';
import { startMultiplayerTimer, stopMultiplayerTimer } from '../redux/slices/multiplayerStatsSlice';

export default function useTimer() {
	const dispatch = useDispatch();
	const isSolo = useSelector((state) => state.session.isSolo);

	useEffect(() => {
		if (isSolo)
			dispatch(startSoloTimer());
		else
			dispatch(startMultiplayerTimer());

		return () => {
			if (isSolo)
				dispatch(stopSoloTimer());
			else
				dispatch(stopMultiplayerTimer());
		};
	}, [dispatch, isSolo])
}