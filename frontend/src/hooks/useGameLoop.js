import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveDown } from "../redux/slices/gameSlice";

export default function useGameLoop(defaultInterval = 500) {
	const settings = useSelector((state) => state.game.settings);
	const lines = useSelector((state) => state.game.totalLinesCleared || 0);
	const dispatch = useDispatch();

	const getInterval = () => {
		if (settings.progressiveSpeed)
			return (Math.max(100, defaultInterval - lines * 10));
		else if (settings.fastGravity)
			return (100);
		return (defaultInterval);
	}

	useEffect(() => {
		const interval = getInterval();
		console.log("Interval:", interval);
		const id = setInterval(() => {
			dispatch(moveDown());
		}, interval);
		return () => clearInterval(id);
	}, [dispatch, settings, lines]);
}