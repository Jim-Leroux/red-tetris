import React from 'react';
import { useSelector } from 'react-redux';

export default function GameHUD() {
	const me = useSelector(state => state.session.me);
	const room = useSelector(state => state.session.room);
	const isSolo = useSelector(state => state.session.isSolo);
	const players = useSelector(state => state.session.players || {});
	const soloStats = useSelector(state => state.soloStats);
	const multiStats = useSelector(state => state.multiplayerStats);

	const score = isSolo ? soloStats.score : multiStats.score;

	return (
		<div className="game-hud">
			<div><span>👤</span> {me}</div>
			<div><span>🏷️</span> {room}</div>
			<div><span>🎮</span> {isSolo ? "Solo" : "Multijoueur"}</div>
			<div><span>👥</span> {Object.keys(players).length}</div>
			<div><span>🧮</span> Score: {score}</div>
		</div>
	);
}