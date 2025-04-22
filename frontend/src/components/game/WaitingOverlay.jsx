import { useDispatch, useSelector } from "react-redux";
import { setIsStarted } from "../../redux/slices/gameSlice";
import { useEffect, useRef } from "react";
import { useSocket } from "../../context/WebSocketContext";
import SettingsPanel from "./SettingsPanel";

export default function WaitingOverlay({ setWaitingToStart }) {
	const socket = useSocket();
	const isSolo = useSelector((state) => state.session.isSolo);
	const isHost = useSelector((state) => state.session.isHost);
	const room = useSelector((state) => state.session.room);
	const players = useSelector((state) => state.session.players || []);
	const settings = useSelector((state) => state.game.settings);
	const settingsRef = useRef(settings);
	const dispatch = useDispatch();       

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !isSolo && isHost) {
			socket.emit("startGame", { room });
			socket.emit("updateSettings", { room, settings: settingsRef.current });
			setWaitingToStart(false);
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isHost, isSolo]);

	const handleSoloStart = () => {
		dispatch(setIsStarted(true));
		setWaitingToStart(false);
	}

	return (
		<div className="overlay-start">
			<div className="overlay-content">
				{!isSolo && (
					<>
						<h2>Joueurs connectés :</h2>
						<ul>
							{players.map((p, i) => (
								<li key={i}>{p.username || `Joueur ${i + 1}`}</li>
							))}
						</ul>
					</>
				)}
				{!isSolo && isHost && (
					<>
					<SettingsPanel />
					<p>Appuie sur <strong>Entrée</strong> pour lancer la partie</p></>
				)}
				{!isSolo && !isHost && (
					<p>En attente que l’hôte lance la partie...</p>
				)}
				{isSolo && isHost && (
					<>
					<SettingsPanel />
					<button onClick={handleSoloStart}>Commencer la partie solo</button></>
				)}
			</div>
		</div>
	);
}