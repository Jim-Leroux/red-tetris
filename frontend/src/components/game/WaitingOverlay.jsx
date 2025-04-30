import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useSocket } from "../../context/WebSocketContext";
import SettingsPanel from "./SettingsPanel";

export default function WaitingOverlay({ setWaitingToStart }) {
	const socket = useSocket();
	const isHost = useSelector((state) => state.session.isHost);
	const room = useSelector((state) => state.session.room);
	const players = useSelector((state) => state.session.players || []);
	const settings = useSelector((state) => state.game.settings);
	const settingsRef = useRef(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && isHost) {
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
	}, [isHost]);

	return (
		<div className="overlay-start">
			<div className="overlay-content">
				<h2>Joueurs connectés :</h2>
				<ul>
					{players.map((p, i) => (
						<li key={i}>{p.username || `Joueur ${i + 1}`}</li>
					))}
				</ul>
				{isHost ? (
					<>
						<SettingsPanel />
						<p>Appuie sur <strong>Entrée</strong> pour lancer la partie</p>
					</>
				) : (
					<p>En attente que l’hôte lance la partie...</p>
				)}
			</div>
		</div>
	);
}
