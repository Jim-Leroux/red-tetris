import React, { use, useState } from "react"
import useGameLoop from "../hooks/useGameLoop";
import useKeyboardControls from "../hooks/useKeyboardControls";
import useScoreUpdater from "../hooks/useScoreUpdater";
import TetrisGrid from "../components/game/TetrisGrid";
import useTimer from "../hooks/useTimer";
import useGameEnd from "../hooks/useGameEnd";
import GameOverOverlay from "../components/game/GameOverOverlay";
import GameHUD from "../components/game/GameHUD";
import { useDispatch, useSelector } from "react-redux";
import "./game.css"
import { setIsStarted } from "../redux/slices/gameSlice";

export default function GameSolo() {
	const isStarted = useSelector((state) => state.game.isStarted);
	const dispatch = useDispatch();

	useGameLoop();
	useKeyboardControls();
	useScoreUpdater();
	useTimer();
	useGameEnd();

	if (!isStarted)
		dispatch(setIsStarted(true));

	return (<div className="game-container">
				<div className="game-box-horizontal">
					<GameHUD />
					<TetrisGrid />
				</div>
				<GameOverOverlay />
			</div>);
}