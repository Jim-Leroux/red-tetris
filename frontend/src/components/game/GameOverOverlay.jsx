import { useDispatch, useSelector } from "react-redux";
import { resetGame } from "../../redux/slices/gameSlice";
import { resetSolo } from "../../redux/slices/soloStatsSlice";
import { useNavigate } from "react-router-dom";
import { resetSession } from "../../redux/slices/sessionSlice";

export default function GameOverOverlay() {
	const dispatch = useDispatch();
	const isGameOver = useSelector((state) => state.game.isGameOver);
	const isSolo = useSelector((state) => state.session.isSolo);
	const isHost = useSelector((state) => state.session.isHost);
	const isWinner = useSelector((state) => state.session.isWinner);

	const navigate = useNavigate();

	const handleRetry = () => {
		dispatch(resetGame());
		dispatch(resetSolo());
	};

	const handleReturnToLobby = () => {
		navigate('/');
		dispatch(resetSession());
	};

	if (!isGameOver) return null;

	const overlayStyle = {
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
	};

	const textStyle = { color: 'white' };

	return (
		<div style={overlayStyle}>
			<style>
				{`@keyframes fadeIn {
					from { opacity: 0; transform: scale(0.95); }
					to { opacity: 1; transform: scale(1); }
				}`}
			</style>

			<h1 style={{ ...textStyle, fontSize: 48, marginBottom: 20 }}>
				{isSolo || !isWinner ? '💀 Game Over' : '🎉 Vous avez gagné !'}
			</h1>

			{isSolo ? (
				<>
					<button onClick={handleRetry} style={buttonStyle}>Rejouer</button>
					<button onClick={handleReturnToLobby} style={buttonStyle}>Retour au Lobby</button>
				</>
			) : (
				<>
					<p style={{ ...textStyle, marginBottom: 10 }}>
						{isWinner
							? 'Félicitations, vous êtes le dernier survivant !'
							: isHost
								? 'Vous êtes host, mais vous avez été éliminé.'
								: 'Vous êtes éliminé.'}
					</p>
					<button onClick={handleReturnToLobby} style={buttonStyle}>Retour au Lobby</button>
				</>
			)}
		</div>
	);

}

const buttonStyle = {
	fontSize: 18,
	padding: '10px 20px',
	cursor: 'pointer',
	margin: '5px'
};
