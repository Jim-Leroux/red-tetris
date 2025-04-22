import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetGame } from "../../redux/slices/gameSlice";
import { resetSolo } from "../../redux/slices/soloStatsSlice";
import { useNavigate } from "react-router-dom";


export default function GameOverOverlay() {
	const dispatch = useDispatch();
	const isGameOver = useSelector((state) => state.game.isGameOver);
	const isSolo = useSelector((state) => state.session.isSolo);
	const isHost = useSelector((state) => state.session.isHost);
	const room = useSelector(state => state.session.room);

	const navigate = useNavigate();

	if (!isGameOver) return null;

	const handleRetry = () => {
		dispatch(resetGame());
		dispatch(resetSolo());
	};

	const handleReturnToLobby = () => {
		navigate('/');
		//  socket.emit('leave_room')
	};


	return (
		<div style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0,0,0,0.8)',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 10,
			animation: 'fadeIn 0.6s ease-out'
		}}>
			<h1 style={{ color: 'white', fontSize: 48, marginBottom: 20 }}>💀 Game Over</h1>
			{isSolo ? (
				<>
					<button onClick={handleRetry} style={buttonStyle}>Rejouer</button>
					<button onClick={handleReturnToLobby} style={buttonStyle}>Retour au Lobby</button>
				</>
			) : (
				<>
					<p style={{ color: 'white', marginBottom: 10 }}>
						{isHost ? 'Vous êtes host, mais vous avez été éliminé.' : 'Vous êtes éliminé.'}
					</p>
					<button onClick={handleReturnToLobby} style={buttonStyle}>Retour au Lobby</button>
				</>
			)}
			<style>
				{`@keyframes fadeIn {
					from { opacity: 0; transform: scale(0.95); }
					to { opacity: 1; transform: scale(1); }
				}`}
			</style>
		</div>
	);

}

const buttonStyle = {
	fontSize: 18,
	padding: '10px 20px',
	cursor: 'pointer'
};