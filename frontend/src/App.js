import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Header from './components/header';
import Footer from './components/footer';
import GameSolo from './pages/GameSolo';
import { useSocket } from './context/WebSocketContext';
import { useDispatch } from 'react-redux';
import { resetSession } from './redux/slices/sessionSlice';
import { setpieceQueue } from './redux/slices/gameSlice';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const socket = useSocket(); // Assuming socket is globally available
	const dispatch = useDispatch();

	useEffect(() => {
		const wasReloaded = sessionStorage.getItem('reloaded') === 'true';
		if (wasReloaded) {
			sessionStorage.removeItem('reloaded');
			navigate('/');
		}
		const markReload = () => {
			sessionStorage.setItem('reloaded', 'true');
		};
		window.addEventListener('beforeunload', markReload);
		return () => {
			window.removeEventListener('beforeunload', markReload);
		};
	}, []);
	useEffect(() => {
			if (!socket) return;
			if (location.pathname === "/") {
				socket.emit("leave");
				dispatch(resetSession())
				dispatch(setpieceQueue([]));
			}
	}, [location.pathname, socket]);

	return (
		<>
			<Header />
			<main className='main-content'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/:name' element={<GameSolo />} />
					<Route path="/:room/:name" element={<Game />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;