import React from "react"
import { useParams } from "react-router-dom"
import useGameLoop from "../hooks/useGameLoop";
import useKeyboardControls from "../hooks/useKeyboardControls";
import useScoreUpdater from "../hooks/useScoreUpdater";
import TetrisGrid from "../components/game/TetrisGrid";
import SettingsPanel from "../components/game/SettingsPanel";
import useTimer from "../hooks/useTimer";
import useGameEnd from "../hooks/useGameEnd";
import GameOverOverlay from "../components/game/GameOverOverlay";
import GameHUD from "../components/game/GameHUD";
import SpecterPanel from "../components/game/SpecterPanel";
import "./game.css"

export default function Game() {
	useGameLoop();
	useKeyboardControls();
	useScoreUpdater();
	useTimer();
	useGameEnd();

	return (
		<div className="game-container">
			<div className="game-box-horizontal">
				<GameHUD />
				<TetrisGrid />
				<SettingsPanel />
			</div>
			{/* <GameOverOverlay /> */}
			<SpecterPanel />
		</div>
	)

}