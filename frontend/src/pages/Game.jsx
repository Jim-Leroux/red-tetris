import {useState } from "react"
import useGameLoop from "../hooks/useGameLoop";
import useKeyboardControls from "../hooks/useKeyboardControls";
import useScoreUpdater from "../hooks/useScoreUpdater";
import TetrisGrid from "../components/game/TetrisGrid";
import useGameEnd from "../hooks/useGameEnd";
import GameOverOverlay from "../components/game/GameOverOverlay";
import GameHUD from "../components/game/GameHUD";
import SpecterPanel from "../components/game/SpecterPanel";
import { useSelector } from "react-redux";
import "./game.css"
import WaitingOverlay from "../components/game/WaitingOverlay";
import useSocketListeners from "../hooks/useSocketListeners";


export default function Game() {
	const isStarted = useSelector((state) => state.game.isStarted);
	const [waitingToStart, setWaitingToStart] = useState(true);

	useGameLoop();
	useKeyboardControls();
	useScoreUpdater();
	useGameEnd();
	useSocketListeners();

	if (!isStarted && waitingToStart) {
		return (<WaitingOverlay setWaitingToStart={setWaitingToStart} />);
	}

	return (
		<div className="game-container">
			<div className="game-box-horizontal">
				<GameHUD />
				<TetrisGrid />
				<SpecterPanel />
			</div>
			<GameOverOverlay />

		</div>
	)

}