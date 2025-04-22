import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Header from './components/header';
import Footer from './components/footer';

function App() {
	const navigate = useNavigate();

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


	return (
		<>
			<Header />
			<main className='main-content'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path="/:room/:name" element={<Game />} />
					<Route path='/dashboard' element={<div>A faire</div>} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;