import { useSelector } from 'react-redux';

export default function GameHUD() {
	const me = useSelector(state => state.session.me);
	const room = useSelector(state => state.session.room);
	const isSolo = useSelector(state => state.session.isSolo);
	const players = useSelector(state => state.session.players || {});
	const soloStats = useSelector(state => state.soloStats);
	const pieceQueue = useSelector(state => state.game.pieceQueue);
	const score = soloStats.score;
	const lastScore = soloStats.lastScore;
	const highScore = soloStats.highScore;
	const gamesPlayed = soloStats.gamesPlayed;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<div className="game-piece">
			<div className="game-piece-label">Prochaines pièces</div>
			{pieceQueue.slice(0, 5).map((piece, index) => {
				const { shape, option } = piece;
				return (
					<div key={index} className="game-piece-preview">
						{shape.map((row, rowIndex) => {
							return (
								<div key={rowIndex} className="game-piece-row">
									{row.map((cell, cellIndex) => (
										<div
											key={cellIndex}
											className={`game-piece-cell`}
											style={{
												backgroundColor: cell ? option?.color  : 'transparent',
												boxShadow: cell ? option?.boxShadow : 'none',
											}}
										></div>
									))}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
		<div className="game-hud">
			<div><span>👤</span> {me}</div>
			{!isSolo && (<div><span>🏷️</span> {room}</div>)}
			<div><span>🎮</span> {isSolo ? "Solo" : "Multijoueur"}</div>
			{isSolo && (<div><span>👥</span> {Object.keys(players).length}</div>)}
			{isSolo && (<div><span></span>  highScore: {highScore}</div>)}
			{isSolo && (<div> <span></span> lastScore: {lastScore}</div>)}
			{isSolo && (<div><span>🧮</span> Score: {score}</div>)}
			{isSolo && (<div><span>⏱️</span> partie joue: {gamesPlayed}</div>)}

		</div>
		</div>

	);
}