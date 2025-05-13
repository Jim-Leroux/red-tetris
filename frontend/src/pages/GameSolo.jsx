import React, { use, useEffect, useState } from "react"
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
import { pushPieceToQueue, setIsStarted } from "../redux/slices/gameSlice";
import getRandomPiece from "../logic/tetriminos";

export default function GameSolo() {
	const isStarted = useSelector((state) => state.game.isStarted);
	const pieceQueue = useSelector((state) => state.game.pieceQueue);
	const dispatch = useDispatch();

	useGameLoop();
	useKeyboardControls();
	useScoreUpdater();
	useTimer();
	useGameEnd();

	useEffect(() => {
		if (!isStarted) {
			dispatch(setIsStarted(true));
		}
	}, [isStarted, dispatch]);

	useEffect(() => {
		if (pieceQueue.length === 0) {
			const initialPieces = Array.from({ length: 5 }, () => getRandomPiece());
			initialPieces.forEach(piece => dispatch(pushPieceToQueue(piece)));
		}
	}, []);


	useEffect(() => {
		if (pieceQueue.length < 5) {
			const nextPiece = getRandomPiece();
			dispatch(pushPieceToQueue(nextPiece));
		}
	}, [pieceQueue, dispatch]);

	return (<div className="game-container">
				<div className="game-box-horizontal">
					<GameHUD />
					<TetrisGrid />
				</div>
				<GameOverOverlay />
			</div>);
}