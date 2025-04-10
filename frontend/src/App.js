import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Header from './components/header';
import Footer from './components/footer';

function App() {
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